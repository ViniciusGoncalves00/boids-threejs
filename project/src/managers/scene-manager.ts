import * as THREE from "three";
import { Boid } from "../boid";

export class SceneManager
{
    private _scene : THREE.Scene;
    private _objects : THREE.Object3D[] = []
    private _creatures : Boid[] = [];
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

    public GetPopulation(): Boid[] {
        return this._creatures;
    }

    public AddObject(object : THREE.Object3D) : void {
        this._objects.push(object);
        this._scene.add(object);
    }
    
    public RemoveObject(object : THREE.Object3D) : void {
        this._objects.splice(this._objects.findIndex(obj => obj === object), 1);
        this._scene.remove(object);
    }

    public AddCreature(creature : Boid) : void {
        this._creatures.push(creature);
        this._scene.add(creature.Mesh);
        (window as any).Alpine.store("UISceneHandler").CreaturesAlive += 1;
    }

    public RemoveCreature(creature : Boid) : void {
        this._creatures.splice(this._creatures.findIndex(obj => obj === creature), 1);
        this._scene.remove(creature.Mesh);
        (window as any).Alpine.store("UISceneHandler").CreaturesAlive -= 1;
    }

    public Populate(creatures: Boid[]): void {
        creatures.forEach(creature => {
            this.AddCreature(creature)
        });
    }

    public CreaturesAlive(): number {
        return this._creatures.length;
    }
}