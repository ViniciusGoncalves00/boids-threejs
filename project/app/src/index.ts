import { Domain } from "./domain";
import { SceneManager } from "./scenemanager";
import "./styles.css";
import Alpine from "alpinejs";
import "./store/Store";

declare global {
  interface Window {
      Alpine: typeof Alpine;
  }
}

window.Alpine = Alpine;

document.addEventListener("DOMContentLoaded", () => {
  Alpine.start();
  const domain = Domain.GetInstance()
  const sceneManager = SceneManager.GetInstance();

  document.documentElement.setAttribute('data-theme', 'custom_light');

  // if (localStorage.getItem('theme') === 'custom_light')
  // {
  //     document.documentElement.setAttribute('data-theme', 'custom_light');
  // }
  // else
  // {
  //     document.documentElement.setAttribute('data-theme', 'custom_dark');
  // }
});