import Alpine from "alpinejs";
import * as THREE from "three";
import { RendererManager } from "./managers/renderer-manager";
import { SceneManager } from "./managers/scene-manager";
import { EntityBuilder } from "./builders/entity-builder";
import { MeshStandardMaterial } from "./default-materials";

import { CameraController } from "./controllers/camera-controller";
import { UICameraToolsHandler } from "./handlers/ui-camera-tools-handler";

import { DomainController } from "./controllers/domain-controller";
import { UIDomainHandler } from "./handlers/ui-domain-handler";

import { SpawnerController } from "./controllers/spawner-controller";
import { UISpawnerHandler } from "./handlers/ui-spawner-handler";

import { SimulationController } from "./controllers/simulation-controller";
import { UISimulationHandler } from "./handlers/ui-simulation-handler";

import { UISceneHandler } from "./handlers/ui-scene-handler";

import { BoidsManager } from "./managers/boids-manager";
import { UIBoidsHandler } from "./handlers/ui-boids-tools-handler";

import { SpatialPartitioningController } from "./controllers/spatial-partitioning-controller";
import { UISpatialPartioningHandler } from "./handlers/ui-spatial-partitioning-handler";

import { UIRendererComponentHandler } from "./handlers/ui-renderer-component-handler";

declare global {
    interface Window {
        Alpine: typeof Alpine;
        SceneManager: typeof SceneManager;
        UICameraToolsHandler: typeof UICameraToolsHandler;
        UIDomainHandler: typeof UIDomainHandler;
        UISpawnerHandler: typeof UISpawnerHandler;
        UISimulationHandler: typeof UISimulationHandler;
        UISceneHandler: typeof UISceneHandler;
        UIBoidsHandler: typeof UIBoidsHandler;
        UISpatialPartioningHandler: typeof UISpatialPartioningHandler;
        UIRendererComponentHandler: typeof UIRendererComponentHandler;
    }
  }

export class ProgramManager {
    private static _instance: ProgramManager;

    private _rendererManagers : RendererManager[] = [];
    private _sceneManagers : SceneManager[] = [];
    private _boidsManagers : BoidsManager[] = [];
    private _cameraControllers : CameraController[] = [];
    private _domainController : DomainController[] = [];
    private _spawnerController : SpawnerController[] = [];
    private _simulationController : SimulationController[] = [];
    private _spatialPartitioningController : SpatialPartitioningController[] = [];

    private constructor() {
        document.addEventListener("DOMContentLoaded", () => {
            window.Alpine = Alpine;
            Alpine.start();
          });

        // document.addEventListener("alpine:init", () => {
        //     Alpine.data("scene", () => ({
        //         init() {
                    
        //         }
        //     }));
        // });

        document.addEventListener("alpine:init", () => {
            Alpine.data("scene", () => ({
                init() {
                    
                }
            }));
            Alpine.data("boundingBox", ({ name, onUpdate }) => ({
                minX: 0, minY: 0, minZ: 0,
                maxX: 1, maxY: 1, maxZ: 1,
    
                update() {
                    if (typeof onUpdate === "function") {
                        onUpdate({
                            name,
                            min: { x: this.minX, y: this.minY, z: this.minZ },
                            max: { x: this.maxX, y: this.maxY, z: this.maxZ }
                        });
                    }
                }
            }));
        });

        const canvas : HTMLCanvasElement = document.querySelector("canvas")!;
        
        this._sceneManagers[0] = new SceneManager();
        this._boidsManagers[0] = new BoidsManager();
        this._rendererManagers[0] = new RendererManager(canvas, this._sceneManagers[0].Renderers);

        this._cameraControllers[0] = new CameraController("Perspective", this._rendererManagers[0].GetCanvas());

        this._domainController[0] = new DomainController(this._sceneManagers[0]);
        this._domainController[0].SetLimits(-500, -500, -500, 500, 500, 500);

        this._spatialPartitioningController[0] = new SpatialPartitioningController(this._sceneManagers[0], this._domainController[0]);
        this._spatialPartitioningController[0].SetDivisions(17, 17, 17);

        this._spawnerController[0] = new SpawnerController(this._sceneManagers[0], this._boidsManagers[0], this._spatialPartitioningController[0]);
        this._spawnerController[0].SetLimits(-100, 150, 150, 100, 250, 250);
        
        this._simulationController[0] = new SimulationController(this._sceneManagers[0], this._domainController[0], this._spawnerController[0], this._spatialPartitioningController[0]);

        this._rendererManagers[0].SetCameraController(this._cameraControllers[0]);
        this._rendererManagers[0].SetScene(this._sceneManagers[0].GetScene());
        // this._rendererManagers[0].AddUpdatables(this._simulationController[0]);
        // this._rendererManagers[0].AddUpdatables(this._spatialPartitioningController[0]);

        const objectBuilder = new EntityBuilder();

        const cuboid = objectBuilder.BuildCuboid(200, 600, 200, MeshStandardMaterial);
        cuboid.Object3D.position.set(200, 0, 0)
        this._sceneManagers[0].AddObject(cuboid);

        const cuboid2 = objectBuilder.BuildCuboid(200, 600, 200, MeshStandardMaterial);
        cuboid2.Object3D.position.set(-200, 0, 0)
        this._sceneManagers[0].AddObject(cuboid2);

        const cuboid3 = objectBuilder.BuildCuboid(200, 200, 200, MeshStandardMaterial);
        this._sceneManagers[0].AddObject(cuboid3);
        
        (window.UICameraToolsHandler as any) = new UICameraToolsHandler(this._cameraControllers[0], this._domainController[0]);
        (window.UIDomainHandler as any) = new UIDomainHandler(this._domainController[0]);
        (window.UISpawnerHandler as any) = new UISpawnerHandler(this._spawnerController[0]);
        (window.UISimulationHandler as any) = new UISimulationHandler(this._simulationController[0]);
        (window.UISpatialPartioningHandler as any) = new UISpatialPartioningHandler(this._spatialPartitioningController[0]);
        (window.UIBoidsHandler as any) = new UIBoidsHandler(this._boidsManagers[0]);
        (window.UIRendererComponentHandler as any) = new UIRendererComponentHandler([this._domainController[0], this._spawnerController[0]]);

        Alpine.store("UISceneHandler", new UISceneHandler())
        this._sceneManagers[0].Attach(Alpine.store("UISceneHandler") as UISceneHandler)
    }

    public static GetInstance() : ProgramManager {
        if (!this._instance) {
            this._instance = new ProgramManager();
        }

        return this._instance;
    }
}