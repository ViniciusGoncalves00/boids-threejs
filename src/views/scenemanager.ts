import * as THREE from "three";

export class SceneManager
{
    private static _instance : SceneManager;
    private _canvas : HTMLCanvasElement | OffscreenCanvas | undefined;
    public Renderer : THREE.WebGLRenderer;
    public Camera : THREE.PerspectiveCamera;
    public Scene : THREE.Scene;

    private constructor() {
        this._canvas = document.querySelector("canvas")!;
        
        this.Renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });
        this.Renderer.setSize(window.innerWidth, window.innerHeight);
    
        this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.Camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
        this.Camera.updateProjectionMatrix();
    
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0.75, 0.75, 0.80);

        this.Update();
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