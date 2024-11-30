import * as THREE from "three";
import { resizeRenderer, Grid } from "../models/utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export class SceneManager
{
    private static _instance : SceneManager;
    private _canvas : HTMLCanvasElement | OffscreenCanvas | undefined;
    public Renderer : THREE.WebGLRenderer;
    public Camera : THREE.PerspectiveCamera;
    public Scene : THREE.Scene;
    private Controls: OrbitControls;

    private constructor() {
        this._canvas = document.querySelector("canvas")!;
        
        this.Renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });
        this.Renderer.setSize(window.innerWidth, window.innerHeight);

        this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.Controls = new OrbitControls( this.Camera, this.Renderer.domElement );
        this.Controls.enableDamping = true; // Habilita animações suaves
        this.Controls.dampingFactor = 0.05; // Ajusta o nível de suavidade
        this.Controls.minDistance = 1; // Distância mínima da câmera
        this.Controls.maxDistance = 20; // Distância máxima da câmera
        this.Controls.enableZoom = true; // Padrão é true.
        this.Controls.enablePan = true; // Padrão é true.
        this.Controls.update();

        this.Camera.position.x = 5;
        this.Camera.position.y = 5;
        this.Camera.position.z = 5;
        this.Camera.lookAt(0,0,0)
        this.Camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
        this.Camera.updateProjectionMatrix();
    
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0.75, 0.75, 0.80);


        this.temp_setup()

        this.Update();
    }

    private temp_setup()
    {
        const grid = new THREE.GridHelper( 100, 100 );
        this.Scene.add(grid)

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
        
        this.Renderer.render(this.Scene, this.Camera);
        this.Controls.update();
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
}