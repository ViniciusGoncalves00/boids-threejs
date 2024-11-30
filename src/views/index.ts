import { addCube } from "../models/three-setup";
import { resizeRenderer } from "../models/utils";
import { SceneManager } from "./scenemanager";
import "../templates/styles.css";
import Alpine from "alpinejs";
import "./alpine";

declare global {
  interface Window {
      Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

document.addEventListener("DOMContentLoaded", () => {
  Alpine.start();
  const sceneManager = SceneManager.GetInstance()
  const renderer = sceneManager.Renderer;
  const camera = sceneManager.Camera;
  const scene = sceneManager.Scene;
  
  const cube = addCube(scene);
  camera.position.z = 5;
  
  // function animate(): void {
  //   requestAnimationFrame(animate);
  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;
  //   renderer.render(scene, camera);
  // }
  // animate();
  
  window.addEventListener("resize", () => resizeRenderer(renderer, camera));

  if (localStorage.getItem('theme') === 'custom_light')
  {
      document.documentElement.setAttribute('data-theme', 'custom_light');
  }
  else
  {
      document.documentElement.setAttribute('data-theme', 'custom_dark');
  }
});