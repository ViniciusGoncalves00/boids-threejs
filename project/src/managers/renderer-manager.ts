import * as THREE from "three";
import { CameraController } from "../controllers/camera-controller";
import { Entity } from "../entities/entity";

export class RendererManager {
    private _canvas: HTMLCanvasElement;
    private _renderer: THREE.WebGLRenderer;
    private _scene: THREE.Scene | null = null;
    private _entities: Entity[];
    private _cameraController: CameraController | null = null;

    public get Renderer() : THREE.WebGLRenderer {
        return this._renderer;
    }

    public constructor(canvas: HTMLCanvasElement, entities: Entity[]) {
        this._canvas = canvas;
        this._entities = entities;
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this._renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener("resize", () => this.Resize());
        window.addEventListener("DOMContentLoaded", () => this.Resize());

        this.Update()
    }

    public SetCanvas(canvas : HTMLCanvasElement): void {
        this._canvas = canvas;
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
        this._renderer.setSize(window.innerWidth, window.innerHeight);
    }

    public SetScene(scene: THREE.Scene): void {
        this._scene = scene;
    }

    public SetCameraController(cameraController: CameraController): void {
        this._cameraController = cameraController;
    }

    public GetCanvas(): HTMLCanvasElement{
        return this._renderer.domElement;
    }

    private Update = (): void =>
        {
            this._entities.forEach(entity => {
                entity.Components.forEach(
                    component => {
                        if(component.Enabled) component.Update()
                    })
            })
                
    
            if(this._scene !== null && this._cameraController !== null) {
                this._cameraController.Update()
                this._renderer.render(this._scene, this._cameraController.GetCamera());
            }
            
            requestAnimationFrame(this.Update);
        };

    private Resize(): void {
        if(this._canvas === null || this._cameraController === null) {
            return;
        }

        this._renderer.setSize(window.innerWidth, window.innerHeight)
        
        if(this._cameraController instanceof CameraController) {
            const camera = this._cameraController.GetCamera();
            if(camera instanceof THREE.PerspectiveCamera) {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
            }
        }
    }
}