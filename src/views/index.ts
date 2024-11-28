import { createScene, addCube } from "../models/three-setup";
import { resizeRenderer } from "../models/utils";
import Alpine from "alpinejs";
import "./alpine";

const { scene, camera, renderer } = createScene();
document.body.appendChild(renderer.domElement);

const cube = addCube(scene);
camera.position.z = 5;

function animate(): void {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

window.addEventListener("resize", () => resizeRenderer(renderer, camera));
