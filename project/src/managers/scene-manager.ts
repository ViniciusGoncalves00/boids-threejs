import * as THREE from "three";
import { Boid } from "../boid";

export class SceneManager implements ISubject
{
    private _scene : THREE.Scene;
    private _objects : THREE.Object3D[] = []
    private _creatures : Boid[] = [];
    public BOXES: THREE.Object3D[] = []

    private _observers: IObserver[] = [];

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

    public Attach(observer: IObserver): void {
        const isExist = this._observers.includes(observer);
        if (isExist) {
            return console.log('Subject: Observer has been attached already.');
        }

        this._observers.push(observer);
    }

    public Dettach(observer: IObserver): void {
        const observerIndex = this._observers.indexOf(observer);
        if (observerIndex === -1) {
            return console.log('Subject: Nonexistent observer.');
        }

        this._observers.splice(observerIndex, 1);
    }

    public Notify(): void {
        for (const observer of this._observers) {
            observer.Update(this);
        }
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

    public AddObject(object : THREE.Object3D): void {
        this._objects.push(object);
        this._scene.add(object);
    }
    
    public RemoveObject(object : THREE.Object3D): void {
        this._objects.splice(this._objects.findIndex(obj => obj === object), 1);
        this._scene.remove(object);
    }

    public AddCreature(creature : Boid): void {
        this._creatures.push(creature);
        this._scene.add(creature.Mesh);
        this.Notify();
    }

    public RemoveCreature(creature : Boid): void {
        this._creatures.splice(this._creatures.findIndex(obj => obj === creature), 1);
        this._scene.remove(creature.Mesh);
        this.Notify();
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