import Alpine from "alpinejs";
import { RendererManager } from "./managers/renderer-manager";
import { SceneManager } from "./managers/scene-manager";
import { CameraController } from "./controllers/camera-controller";
import { UICameraToolsHandler } from "./events/ui-camera-tools-handler";
import { DomainManager } from "./managers/domain-manager";

declare global {
    interface Window {
        Alpine: typeof Alpine;
        SceneManager: typeof SceneManager;
        UICameraToolsHandler: typeof UICameraToolsHandler;
    }
  }

export class ProgramManager {
    private static _instance: ProgramManager;

    private _rendererManagers : RendererManager[] = [];
    private _sceneManagers : SceneManager[] = [];
    private _cameraControllers : CameraController[] = [];
    private _domainManager : DomainManager[] = [];

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
        
        this._rendererManagers[0] = new RendererManager(canvas);
        this._sceneManagers[0] = new SceneManager();
        this._cameraControllers[0] = new CameraController("Perspective", this._rendererManagers[0].GetDom());
        this._domainManager[0] = new DomainManager(this._sceneManagers[0]);

        Alpine.store("SceneManager", this._sceneManagers[0]);
        Alpine.store("CameraController", this._cameraControllers[0]);
        
        this._rendererManagers[0].SetCamera(this._cameraControllers[0].GetCamera());
        this._rendererManagers[0].SetScene(this._sceneManagers[0].GetScene());

        (window.UICameraToolsHandler as any) = new UICameraToolsHandler(this._cameraControllers[0], this._rendererManagers[0], this._domainManager[0]);
    }

    public static GetInstance() : ProgramManager {
        if (!this._instance) {
            this._instance = new ProgramManager();
        }

        return this._instance;
    }
}