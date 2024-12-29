import * as THREE from "three";
import { resizeRenderer, Grid } from "./utils";
import { CameraController } from "./camera-controller";
import { InputMapping } from "./input-mapping";
import { Simulation } from "./simulation";
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
    public Simulation : Simulation;

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
    
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0.75, 0.75, 0.80);

        this.Simulation = Simulation.GetInstance();
        
        this.temp_setup()

        this.Update();
    }

    private temp_setup()
    {
        // const grid = new THREE.GridHelper( 100, 100 );
        // this.Scene.add(grid)

        window.addEventListener("resize", () => resizeRenderer(this.Renderer, this.Camera));

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
            (window as any).sceneManager = this._instance;
        }

        return this._instance
    }
}