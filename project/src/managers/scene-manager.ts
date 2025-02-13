import * as THREE from "three";

export class SceneManager
{
    private _scene : THREE.Scene;
    private _objects : THREE.Object3D[] = []
    public BOXES: THREE.Object3D[] = []

    public constructor() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0.75, 0.75, 0.80);

        // const grid = new THREE.GridHelper( 100, 100 );
        // this.Scene.add(grid)
        const axesHelper = new THREE.AxesHelper( 10 );
        this._scene.add( axesHelper );

        const color = 0xFFFFFF;

        const intensity = 3;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(-1, 2, 4);
        this._scene.add(light);
    }

    public GetScene() : THREE.Scene {
        return this._scene;
    }

    public GetObjects(): THREE.Object3D[] {
        return this._objects;
    }

    public AddObject(object : THREE.Object3D) : void {
        this._objects.push(object)
        this._scene.add(object)
    }
    
    public AddObjects(objects : THREE.Object3D[]) : void {
        this._scene.add(...objects)
    }
    
    public RemoveObject(object : THREE.Object3D) : void {
        this._objects.splice(this._objects.findIndex(obj => obj === object), 1);
        this._scene.remove(object);
    }

    public RemoveObjects(objects : THREE.Object3D[]) : void {
        this._scene.remove(...objects)
    }
}