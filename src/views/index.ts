import { addCube } from "../models/three-setup";
import { Domain } from "../models/domain";
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
  const domain = new Domain();
  const sceneManager = SceneManager.GetInstance();
  const renderer = sceneManager.Renderer;
  const camera = sceneManager.Camera;
  const scene = sceneManager.Scene;
  
  const cube = addCube(scene);
  
  function animate(): void {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  animate();

  if (localStorage.getItem('theme') === 'custom_light')
  {
      document.documentElement.setAttribute('data-theme', 'custom_light');
  }
  else
  {
      document.documentElement.setAttribute('data-theme', 'custom_dark');
  }
});