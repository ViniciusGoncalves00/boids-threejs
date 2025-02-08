import * as THREE from "three";

export class RendererManager {
    private _canvas: HTMLCanvasElement;
    private _renderer: THREE.Renderer;
    private _scene: THREE.Scene | null = null;
    private _camera: THREE.Camera | null = null;

    public constructor(canvas: HTMLCanvasElement) {
        this._canvas = canvas;
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
        this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);

        window.addEventListener("resize", () => this.Resize());

        this.Update()
    }

    public SetCanvas(canvas : HTMLCanvasElement) : void {
        this._canvas = canvas;
        this._renderer = new THREE.WebGLRenderer({ canvas: this._canvas, antialias: true });
        this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight);
    }

    public SetScene(scene: THREE.Scene) : void {
        this._scene = scene;
    }

    public SetCamera(camera: THREE.Camera) : void {
        this._camera = camera;
    }

    public GetDom() : HTMLCanvasElement{
        return this._renderer.domElement;
    }

    private Update = () =>
    {        
        requestAnimationFrame(this.Update);

        if(!this._scene || !this._camera) {
            return;
        }

        this._renderer.render(this._scene, this._camera);
    };

    private Resize(): void {
        if(!this._canvas || !this._camera) {
            return;
        }

        this._renderer.setSize(this._canvas.width, this._canvas.height);

        if(this._camera instanceof THREE.PerspectiveCamera) {
            this._camera.aspect = this._canvas.width / this._canvas.height;
            this._camera.updateProjectionMatrix();
        }
    }
}