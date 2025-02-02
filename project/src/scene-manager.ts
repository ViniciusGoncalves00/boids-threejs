import * as THREE from "three";
import { CameraController } from "./camera-controller";
import { InputMapping } from "./input-mapping";
import { Domain } from "./domain";

export class SceneManager
{
    private static _instance : SceneManager;
    private _canvas : HTMLCanvasElement | OffscreenCanvas | undefined;
    public Renderer : THREE.WebGLRenderer;
    public Camera : THREE.PerspectiveCamera;
    public CurrentCamera : THREE.PerspectiveCamera;
    public CameraController: CameraController;
    public Scene : THREE.Scene;

    private constructor() {
        this._canvas = document.querySelector("canvas")!;
        
        this.Renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const inputMapping = new InputMapping();
        this.CameraController = new CameraController(this.Camera, this.Renderer.domElement);
        this.CurrentCamera = this.Camera;

        this.Camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
        this.Camera.updateProjectionMatrix();
        this.Camera.position.z = 5;
    
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0.75, 0.75, 0.80);
        
        this.temp_setup()

        this.Update();
    }

    private temp_setup()
    {
        // const grid = new THREE.GridHelper( 100, 100 );
        // this.Scene.add(grid)
        const axesHelper = new THREE.AxesHelper( 10 );
        this.Scene.add( axesHelper );

        window.addEventListener("resize", () => this.resizeRenderer(this.Renderer, this.Camera));

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.Scene.add(light);
    }

    private Update = () =>
    {
        if (this._canvas instanceof HTMLCanvasElement)
        {
            const width = this._canvas.clientWidth;
            const height = this._canvas.clientHeight;
            
            if (this.Camera.aspect !== width / height)
            {
                this.Camera.aspect = width / height;
                this.Camera.updateProjectionMatrix();
                this.Renderer.setSize(width, height, false);
            }
        }
        
        this.CameraController.Update();
        this.Renderer.render(this.Scene, this.Camera);
        requestAnimationFrame(this.Update);
    };

    public static GetInstance(): SceneManager
    {
        if(this._instance == null)
        {
            this._instance = new SceneManager();
        }

        return this._instance
    }

    private resizeRenderer(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        // camera.aspect = width / height;
        // camera.updateProjectionMatrix();
    }
}