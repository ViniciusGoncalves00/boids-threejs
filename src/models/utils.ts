import * as THREE from "three";

export function resizeRenderer(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();
  }
  