import Alpine from "alpinejs";
import * as THREE from "three";
import "./styles.css";

declare global {
    interface Window {
        Alpine: typeof Alpine;
    }
  }

export class Program {
    private static _canvas : HTMLCanvasElement | OffscreenCanvas | undefined;
    public static Renderer : THREE.WebGLRenderer;
    public static Camera : THREE.PerspectiveCamera;
    public static CurrentCamera : THREE.PerspectiveCamera;
    public static Scene : THREE.Scene;
    
    public static Main() : void {
        this.initializeListeners()

        this._canvas = document.querySelector("canvas")!;
        
        this.Renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this._canvas });
        this.Renderer.setSize(window.innerWidth, window.innerHeight);
        
        this.Camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.CurrentCamera = this.Camera;
        
        this.Camera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
        this.Camera.updateProjectionMatrix();
        this.Camera.position.z = 5;
            
        this.Scene = new THREE.Scene();
        this.Scene.background = new THREE.Color(0.75, 0.75, 0.80);;
                
        this.temp_setup()
        
        this.Update();
    }

    private static initializeListeners() : void {
        document.addEventListener("DOMContentLoaded", () => {
            window.Alpine = Alpine;
            Alpine.start();
            console.log("alpine start")
          });

        document.addEventListener("alpine:init", () => {
            Alpine.data("scene", () => ({
                init() {
                    
                }
            }));
        });
    }

    private static temp_setup()
    {
        const axesHelper = new THREE.AxesHelper( 10 );
        this.Scene.add( axesHelper );

        window.addEventListener("resize", () => this.resizeRenderer(this.Renderer, this.Camera));

        const color = 0xFFFFFF;
        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this.Scene.add(light);
    }

    private static Update = () =>
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

    private static resizeRenderer(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
        const width = window.innerWidth;
        const height = window.innerHeight;
        renderer.setSize(width, height);
        // camera.aspect = width / height;
        // camera.updateProjectionMatrix();
      }
}

Program.Main();