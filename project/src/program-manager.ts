import Alpine from "alpinejs";
import { RendererManager } from "./managers/renderer-manager";
import { SceneManager } from "./managers/scene-manager";
import { CameraController } from "./controllers/camera-controller";
import { UICameraToolsHandler } from "./events/ui-camera-tools-handler";
import { DomainController } from "./controllers/domain-controller";
import { UIDomainHandler } from "./events/ui-domain-handler";
import { SpawnerController } from "./controllers/spawner-controller";
import { UISpawnerHandler } from "./events/ui-spawner-handler";

declare global {
    interface Window {
        Alpine: typeof Alpine;
        SceneManager: typeof SceneManager;
        UICameraToolsHandler: typeof UICameraToolsHandler;
        UIDomainHandler: typeof UIDomainHandler;
        UISpawnerHandler: typeof UISpawnerHandler;
    }
  }

export class ProgramManager {
    private static _instance: ProgramManager;

    private _rendererManagers : RendererManager[] = [];
    private _sceneManagers : SceneManager[] = [];
    private _cameraControllers : CameraController[] = [];
    private _domainController : DomainController[] = [];
    private _spawnerController : SpawnerController[] = [];

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
        this._cameraControllers[0] = new CameraController("Perspective", this._rendererManagers[0].GetCanvas());
        this._domainController[0] = new DomainController(this._sceneManagers[0]);
        this._spawnerController[0] = new SpawnerController(this._sceneManagers[0]);
        
        this._rendererManagers[0].SetCameraController(this._cameraControllers[0]);
        this._rendererManagers[0].SetScene(this._sceneManagers[0].GetScene());

        (window.UICameraToolsHandler as any) = new UICameraToolsHandler(this._cameraControllers[0], this._domainController[0]);
        (window.UIDomainHandler as any) = new UIDomainHandler(this._domainController[0]);
        (window.UISpawnerHandler as any) = new UISpawnerHandler(this._spawnerController[0]);
    }

    public static GetInstance() : ProgramManager {
        if (!this._instance) {
            this._instance = new ProgramManager();
        }

        return this._instance;
    }
}