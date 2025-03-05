import * as THREE from "three";
import { Boid } from "../entities/boid";
import { Entity } from "../entities/entity";

export class SceneManager implements ISubject
{
    private _scene : THREE.Scene;
    private _entities : Entity[] = []
    public get Entities(): Entity[] { return this._entities; }

    private _colliders : Entity[] = []
    public get Colliders(): Entity[] { return this._colliders; }

    private _renderers : Entity[] = []
    public get Renderers(): Entity[] { return this._renderers; }

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
    public GetPopulation(): Boid[] {
        let population: Boid[] = []
        this._entities.forEach(entity => {
            if(entity.constructor.name === "Boid") {
                population.push(entity as Boid)
            }
        })
        return population;
    }

    public CreaturesAlive(): number {
        let population: Entity[] = []
        this._entities.forEach(entity => {
            if(entity.constructor.name === "Boid") {
                population.push(entity)
            }
        })
        return population.length;
    }

    public AddObject(entity: Entity): void {
        this._entities.push(entity);

        if(entity.Components.get("ColliderComponent") !== undefined) {
            this._colliders.push(entity);
        }

        if(entity.Components.get("RendererComponent") !== undefined) {
            this._renderers.push(entity);
        }

        this._scene.add(entity.Object3D)
        this.Notify();
    }
    
    public RemoveObject(entity: Entity): void {
        const index = this._entities.findIndex(obj => obj === entity);
        if (index !== -1) this._entities.splice(index, 1);
            
        if (entity.Components.get("ColliderComponent") !== undefined) {
            const colliderIndex = this._colliders.findIndex(obj => obj === entity);
            if (colliderIndex !== -1) this._colliders.splice(colliderIndex, 1);
        }
    
        if (entity.Components.get("RendererComponent") !== undefined) {
            const rendererIndex = this._renderers.findIndex(obj => obj === entity);
            if (rendererIndex !== -1) this._renderers.splice(rendererIndex, 1);
        }
    
        entity.Object3D.children.forEach(child => {
            this._scene.remove(child);
        });
    
        this._scene.remove(entity.Object3D);
    
        this.Notify();
    }
    
}