import * as THREE from "three";
import { CameraController, CameraControllerEventMap } from "../controllers/camera-controller";

export class RendererManager {
    private _canvas: HTMLCanvasElement;
    private _renderer: THREE.Renderer;
    private _scene: THREE.Scene | null = null;
    private _upgradeables: IUpdatable[] = [];
    private _cameraController: CameraController | null = null;

    public constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
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

    public AddUpgradeable(upgradeable: IUpdatable): void {
        this._upgradeables?.push(upgradeable)
    }

    private Update = (): void =>
    {        
        for (let index = 0; index < this._upgradeables.length; index++) {
            this._upgradeables[index].Update();
        }

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