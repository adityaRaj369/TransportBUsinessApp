import { useEffect } from 'react';
import * as THREE from 'three';

export function useParticleBackground(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0A0A0A, 0.001);
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 100;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const geo = new THREE.BufferGeometry();
    const count = 700;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) pos[i] = (Math.random() - 0.5) * 300;
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const mat = new THREE.PointsMaterial({ size: 0.8, color: 0xD4AF37, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const mesh = new THREE.Points(geo, mat);
    scene.add(mesh);

    let mouseX = 0, mouseY = 0;
    const halfX = container.clientWidth / 2, halfY = container.clientHeight / 2;
    const onMouse = (e) => { mouseX = e.clientX - halfX; mouseY = e.clientY - halfY; };
    document.addEventListener('mousemove', onMouse);

    const clock = new THREE.Clock();
    let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      mesh.rotation.y = t * 0.05;
      mesh.rotation.x = t * 0.02;
      mesh.rotation.y += 0.05 * (mouseX * 0.001 - mesh.rotation.y);
      mesh.rotation.x += 0.05 * (mouseY * 0.001 - mesh.rotation.x);
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      document.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
}

export function useInteractiveGlobe(containerRef) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 2.5;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    group.add(new THREE.Points(
      new THREE.SphereGeometry(1, 64, 64),
      new THREE.PointsMaterial({ color: 0x444444, size: 0.015, transparent: true, opacity: 0.6 })
    ));
    group.add(new THREE.Mesh(
      new THREE.SphereGeometry(0.98, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0x0A0A0A, transparent: true, opacity: 0.8 })
    ));

    const hubs = [
      { lat: 40.71, lng: -74.00 }, { lat: 51.50, lng: -0.12 },
      { lat: 25.20, lng: 55.27 },  { lat: 1.35,  lng: 103.81 },
      { lat: 35.68, lng: 139.69 }, { lat: -33.86, lng: 151.20 },
      { lat: -23.55, lng: -46.63 },{ lat: 19.07, lng: 72.87 },
    ];
    const toVec = (lat, lng, r) => {
      const phi = (90 - lat) * Math.PI / 180, theta = (lng + 180) * Math.PI / 180;
      return new THREE.Vector3(-(r * Math.sin(phi) * Math.cos(theta)), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(theta));
    };
    const hubMeshes = [];
    const hubMat = new THREE.MeshBasicMaterial({ color: 0xD4AF37 });
    const hubGeo = new THREE.SphereGeometry(0.03, 16, 16);
    hubs.forEach(loc => {
      const pos = toVec(loc.lat, loc.lng, 1.01);
      const hub = new THREE.Mesh(hubGeo, hubMat);
      hub.position.copy(pos); group.add(hub); hubMeshes.push(hub);
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.04, 0.06, 32), new THREE.MeshBasicMaterial({ color: 0xD4AF37, side: THREE.DoubleSide, transparent: true, opacity: 0.5 }));
      ring.position.copy(pos); ring.lookAt(new THREE.Vector3(0, 0, 0)); group.add(ring);
    });
    const lineMat = new THREE.LineBasicMaterial({ color: 0xD4AF37, transparent: true, opacity: 0.2 });
    for (let i = 0; i < 6; i++) {
      const s = toVec(hubs[i % hubs.length].lat, hubs[i % hubs.length].lng, 1.0);
      const e = toVec(hubs[(i + 3) % hubs.length].lat, hubs[(i + 3) % hubs.length].lng, 1.0);
      const mid = s.clone().lerp(e, 0.5).normalize().multiplyScalar(1.3);
      const pts = new THREE.QuadraticBezierCurve3(s, mid, e).getPoints(50);
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lineMat));
    }

    let dragging = false, prev = { x: 0, y: 0 };
    const onDown = (e) => { dragging = true; prev = { x: e.offsetX, y: e.offsetY }; };
    const onUp = () => { dragging = false; };
    const onMove = (e) => {
      if (!dragging) return;
      const rect = container.getBoundingClientRect();
      const cur = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      const quat = new THREE.Quaternion().setFromEuler(new THREE.Euler((cur.y - prev.y) * 0.5 * Math.PI / 180, (cur.x - prev.x) * 0.5 * Math.PI / 180, 0, 'XYZ'));
      group.quaternion.multiplyQuaternions(quat, group.quaternion);
      prev = cur;
    };
    container.addEventListener('mousedown', onDown);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mousemove', onMove);

    const clock = new THREE.Clock(); let animId;
    function animate() {
      animId = requestAnimationFrame(animate);
      if (!dragging) group.rotation.y += 0.002;
      const t = clock.getElapsedTime();
      hubMeshes.forEach(h => { const s = 1 + Math.sin(t * 3) * 0.2; h.scale.set(s, s, s); });
      renderer.render(scene, camera);
    }
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousedown', onDown);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
}
