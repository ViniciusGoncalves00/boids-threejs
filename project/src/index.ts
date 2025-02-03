import Alpine from "alpinejs";
import * as THREE from "three";
import "./styles.css";
import { SceneManager } from "./scene-manager";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
  }

export class Program {
    private static _canvas : HTMLCanvasElement | OffscreenCanvas | undefined;
    public static Renderer : THREE.WebGLRenderer;
    public static Camera : THREE.PerspectiveCamera;
    public static CurrentCamera : THREE.PerspectiveCamera;
    public static Scene : THREE.Scene;

    public static SceneManager : SceneManager;
    
    public static Main() : void {
        this.initialize()
    }

    private static initialize() : void {
        document.addEventListener("DOMContentLoaded", () => {
            window.Alpine = Alpine;
            Alpine.start();

            const sceneManager = SceneManager.GetInstance();
            (window as any).sceneManager = sceneManager;
          });

        document.addEventListener("alpine:init", () => {
            Alpine.data("scene", () => ({
                init() {
                    
                }
            }));
        });
    }
}

Program.Main();