import Alpine from "alpinejs";
import * as THREE from "three";
import { RendererManager } from "./managers/renderer-manager";
import { SceneManager } from "./managers/scene-manager";
import { CameraController } from "./controllers/camera-controller";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
  }

export class ProgramManager {
    private static _instance: ProgramManager;

    private _rendererManagers : RendererManager[];
    private _sceneManagers : SceneManager[];
    private _cameraControllers : CameraController[];

    private constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            window.Alpine = Alpine;
            Alpine.start();
          });

        document.addEventListener("alpine:init", () => {
            Alpine.data("scene", () => ({
                init() {
                    
                }
            }));
        });

        const canvas : HTMLCanvasElement = document.querySelector("canvas")!;
        
        this._rendererManagers = []
        this._rendererManagers[0] = new RendererManager(canvas)

        this._sceneManagers = []
        this._sceneManagers[0] = new SceneManager();

        this._cameraControllers = []
        this._cameraControllers[0] = new CameraController("Perspective", this._rendererManagers[0].GetDom());

        this._rendererManagers[0].SetCamera(this._cameraControllers[0].GetCamera())
        this._rendererManagers[0].SetScene(this._sceneManagers[0].GetScene())
    }

    public static GetInstance() : ProgramManager {
        if (!this._instance) {
            this._instance = new ProgramManager();
        }

        return this._instance;
    }
}