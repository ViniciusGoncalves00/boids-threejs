import * as THREE from "three";
import { Boid } from "../boid";
import { InterfaceHelper } from "../interface-helper";
import { IStatic } from "../interfaces/IStatic";
import { IDynamic } from "../interfaces/IDynamic";
import { BaseObject } from "../objects/base-object";
import { SolidObject } from "../objects/solid-object";
import { WireframeObject } from "../objects/wireframe-object";

export class SceneManager implements ISubject
{
    private _scene : THREE.Scene;
    private _objects : BaseObject[] = []
    public get Objects(): BaseObject[] { return this._objects; }

    private _staticColliders : SolidObject[] = []
    public get StaticColliders(): SolidObject[] { return this._staticColliders; }

    private _dynamicColliders : SolidObject[] = []
    public get DynamicColliders(): SolidObject[] { return this._dynamicColliders; }

    private _creatures : Boid[] = [];

    private _observers: IObserver[] = [];

    public constructor() {
        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0.75, 0.75, 0.80);

        // const grid = new THREE.GridHelper( 100, 100 );
        // this.Scene.add(grid)
        const axesHelper = new THREE.AxesHelper( 10 );
        this._scene.add( axesHelper );

        const color = 0xFFFFFF;

        const intensity = 1;
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set(1000, 4000, 2000);
        light.castShadow = true;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5; 
        light.shadow.camera.far = 50000; 
        
        light.shadow.camera.left = -2000;
        light.shadow.camera.right = 2000;
        light.shadow.camera.top = 2000;
        light.shadow.camera.bottom = -2000;
        
        this._scene.add(light);

        const hemisphereLight = new THREE.HemisphereLight(0xE1EEFF, 0xffffff, 1); 
        this._scene.add(hemisphereLight);
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

    public GetScene() : THREE.Scene {return this._scene; }
    public GetPopulation(): Boid[] { return this._creatures; }

    public AddObject(object : BaseObject): void {
        this._objects.push(object);

        if (InterfaceHelper.ImplementsInterface<ICollider>(object, "ICollider")) {
            if(InterfaceHelper.ImplementsInterface<IStatic>(object, "IStatic")){
                if(object instanceof SolidObject) {
                    this._staticColliders.push(object);
                }
            }
            
            if(InterfaceHelper.ImplementsInterface<IDynamic>(object, "IDynamic")){
                if(object instanceof SolidObject) {
                    this._dynamicColliders.push(object);
                }
            }
        }

        if(object instanceof SolidObject) {
            this._staticColliders.push(object);
        }

        if(object instanceof SolidObject) {
            this._scene.add(object.Mesh);
        }
        else if (object instanceof WireframeObject) {
            this._scene.add(object.Wireframe);
        }
    }
    
    public RemoveObject(object : BaseObject): void {
        this._objects.splice(this._objects.findIndex(obj => obj === object), 1)

        if(object instanceof SolidObject) {
            this._scene.remove(object.Mesh);
        }
        else if (object instanceof WireframeObject) {
            this._scene.remove(object.Wireframe);
        }
    }

    public RemoveCreature(creature : Boid): void {
        this._creatures.splice(this._creatures.findIndex(obj => obj === creature), 1);
        this._scene.remove(creature.Mesh);
        this.Notify();
    }

    public Populate(creatures: Boid[]): void {
        creatures.forEach(creature => {
            this._creatures.push(creature);
            this._scene.add(creature.Mesh);
        });

        this.Notify();
    }

    public CreaturesAlive(): number {
        return this._creatures.length;
    }
}

