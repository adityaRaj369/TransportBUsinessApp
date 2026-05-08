const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { Resend } = require('resend');
require('dotenv').config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_123');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev';

const Product = require('./models/Product');
const Inquiry = require('./models/Inquiry');
const Category = require('./models/Category');
const Setting = require('./models/Setting');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'phoenixeximm_secret_2026';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/phoenixeximm';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// ── Middleware ───────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Multer (image upload) ────────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ── Auth middleware ──────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// ══════════════════════════════════════════════════════════════════
//  ROUTES
// ══════════════════════════════════════════════════════════════════

// ── Health check ─────────────────────────────────────────────────
app.get('/', (req, res) => res.send('PhoenixEximm Backend is running!'));

// ── AUTH ─────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const ADMIN_USER = process.env.ADMIN_USER || 'admin';
  const ADMIN_PASS = process.env.ADMIN_PASS || 'phoenix@123';

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
    return res.json({ token });
  }
  return res.status(401).json({ message: 'Invalid credentials' });
});

// ── PUBLIC: get products ─────────────────────────────────────────
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    const mapped = products.map(p => ({ ...p.toObject(), id: p._id }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: add product ───────────────────────────────────────────
app.post('/api/products', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, features } = req.body;
    const newProduct = new Product({
      name,
      category,
      description,
      features: features ? JSON.parse(features) : [],
      image: req.file ? `/uploads/${req.file.filename}` : '/basmati_rice_premium.png'
    });
    await newProduct.save();
    res.status(201).json({ ...newProduct.toObject(), id: newProduct._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: edit product ──────────────────────────────────────────
app.put('/api/products/:id', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, features } = req.body;
    const updateData = { name, category, description };
    if (features) updateData.features = JSON.parse(features);
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;
    
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Product not found' });
    res.json({ ...updated.toObject(), id: updated._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: delete product ────────────────────────────────────────
app.delete('/api/products/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUBLIC: submit inquiry ───────────────────────────────────────
app.post('/api/inquiry', async (req, res) => {
  try {
    const { name, email, phone, message, product } = req.body;
    const newInquiry = new Inquiry({ name, email, phone, message, product });
    await newInquiry.save();

    if (process.env.RESEND_API_KEY && ADMIN_EMAIL) {
      try {
        await resend.emails.send({
          from: `PhoenixEximm <${FROM_EMAIL}>`,
          to: ADMIN_EMAIL,
          subject: `New Inquiry from ${name}`,
          html: `<p><strong>Name:</strong> ${name}</p>
                 <p><strong>Email:</strong> ${email}</p>
                 <p><strong>Phone:</strong> ${phone}</p>
                 <p><strong>Product:</strong> ${product}</p>
                 <p><strong>Message:</strong></p><p>${message}</p>`
        });

        await resend.emails.send({
          from: `PhoenixEximm <${FROM_EMAIL}>`,
          to: email,
          subject: `Thank you for your inquiry, ${name}!`,
          html: `<p>Hi ${name},</p>
                 <p>Thank you for reaching out to PhoenixEximm regarding <strong>${product}</strong>.</p>
                 <p>We have received your inquiry and our team will get back to you shortly.</p>
                 <br/>
                 <p>Best regards,<br/>PhoenixEximm Team</p>`
        });
      } catch (emailErr) {
        console.error('Error sending emails:', emailErr);
      }
    }

    res.status(200).json({ message: 'Inquiry received successfully. We will get back to you soon!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: get all inquiries ─────────────────────────────────────
app.get('/api/inquiries', authenticateToken, async (req, res) => {
  try {
    const inquiries = await Inquiry.find().sort({ createdAt: -1 });
    const mapped = inquiries.map(i => ({ ...i.toObject(), id: i._id, date: i.createdAt }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: mark inquiry as read ──────────────────────────────────
app.put('/api/inquiries/:id/read', authenticateToken, async (req, res) => {
  try {
    const updated = await Inquiry.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ ...updated.toObject(), id: updated._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: delete inquiry ────────────────────────────────────────
app.delete('/api/inquiries/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Inquiry.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Inquiry not found' });
    res.json({ message: 'Inquiry deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUBLIC: get categories ───────────────────────────────────────
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    const mapped = categories.map(c => ({ ...c.toObject(), id: c._id }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: add category ──────────────────────────────────────────
app.post('/api/categories', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newCategory = new Category({ name, description });
    await newCategory.save();
    res.status(201).json({ ...newCategory.toObject(), id: newCategory._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: edit category ─────────────────────────────────────────
app.put('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const updated = await Category.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    res.json({ ...updated.toObject(), id: updated._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: delete category ───────────────────────────────────────
app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ── PUBLIC: get all settings ─────────────────────────────────────
app.get('/api/settings', async (req, res) => {
  console.log('GET /api/settings hit');
  try {
    const settings = await Setting.find();
    console.log('Settings found:', settings.length);
    const map = {};
    settings.forEach(s => map[s.key] = s.value);
    res.json(map);
  } catch (error) {
    console.error('Settings error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ── ADMIN: update settings ───────────────────────────────────────
app.put('/api/settings', authenticateToken, async (req, res) => {
  try {
    const updates = req.body;
    const promises = Object.entries(updates).map(([key, value]) => 
      Setting.findOneAndUpdate({ key }, { value }, { upsert: true, new: true })
    );
    await Promise.all(promises);
    res.json({ message: 'Settings updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
