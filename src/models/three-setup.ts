import * as THREE from "three";

// export function createScene(): { scene: THREE.Scene; camera: THREE.Camera; renderer: THREE.WebGLRenderer } {
//   const scene = new THREE.Scene();
//   const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//   const renderer = new THREE.WebGLRenderer();
//   const canvas = renderer.domElement;
//   camera.aspect = canvas.clientWidth / canvas.clientHeight;
//   camera.updateProjectionMatrix();
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   return { scene, camera, renderer };
// }

export function addCube(scene: THREE.Scene): THREE.Mesh {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhysicalMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);
  return cube;
}
