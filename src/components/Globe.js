import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const Globe = () => {
  const rendererRef = useRef(null);

  const scene = new THREE.Scene();

  // Sphere initialization
  const geometry = new THREE.SphereGeometry(3, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: '#00ff83',
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // Light
  const light = new THREE.PointLight(0xffffff, 100);
  light.position.set(10, 10, 10);
  scene.add(light);

  // Sizes
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  // Camera
  const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height);
  camera.position.z = 20;
  scene.add(camera);

  // Create OrbitControls and pass the camera and renderer
  useEffect(() => {
    if (!rendererRef.current) {
      const canvas = document.querySelector('.webgl');
      rendererRef.current = new THREE.WebGLRenderer({ canvas });
      rendererRef.current.setSize(sizes.width, sizes.height);

      // Set the pixel ratio here
      rendererRef.current.setPixelRatio(window.devicePixelRatio);
    }

    // Initialize OrbitControls once rendererRef.current is available
    const controls = new OrbitControls(camera, rendererRef.current.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 3;

    const loop = () => {
      // Slow down the orbital control stopping
      controls.update();

      rendererRef.current.render(scene, camera);
      window.requestAnimationFrame(loop);
    };

    // Resizing
    const handleResize = () => {
      sizes.width = window.innerWidth;
      sizes.height = window.innerHeight;

      camera.aspect = sizes.width / sizes.height;
      camera.updateProjectionMatrix();

      rendererRef.current.setSize(sizes.width, sizes.height);
      rendererRef.current.render(scene, camera);
    };

    window.addEventListener('resize', handleResize);

    // Initial render
    rendererRef.current.render(scene, camera);

    loop();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [sizes, scene, camera]);

  return <canvas className="webgl"></canvas>;
};
