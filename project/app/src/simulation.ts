import * as THREE from "three";
import { SceneManager } from "./scene-manager";
import { Boid } from "./boid";
import { Domain } from "./domain";

export class Simulation
{
    private static _instance : Simulation;

    private _isRunning : boolean;
    private _isPaused : boolean;

    private _boids : Boid | null = null;

    private constructor() {
        this._isRunning = false;
        this._isPaused = false;
    }

    public static GetInstance(): Simulation
    {
        if(this._instance == null)
        {
            this._instance = new Simulation();
        }

        return this._instance;
    }

    public Start(data: Record<string, any>): void {
        // data =  this.Validate(data);

        this._isRunning = true;

        this.Update()
    }

    private Update = () =>
    {
        
        if(!this._isRunning ) {
            return;
        }

        if(this._boids == null)
        {
            const geometry = new THREE.ConeGeometry();
            geometry.rotateX(90 * Math.PI / 180)
            geometry.scale(2, 2, 5)

            const material = new THREE.MeshStandardMaterial();
            material.color.setRGB(200, 0, 0);

            const boidMesh = new THREE.Mesh(geometry, material);
            boidMesh.rotateX(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateY(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateZ(Math.random() * 360 * Math.PI/180)

            this._boids = new Boid(boidMesh);
            SceneManager.GetInstance().Scene.add(boidMesh);

            const sphereGeometry = new THREE.SphereGeometry();
            const sphereMesh = new THREE.Mesh(sphereGeometry, material);
            sphereMesh.position.z = 20;
            boidMesh.add(sphereMesh)
        }

        requestAnimationFrame(this._boids.Update);
        requestAnimationFrame(this.Update);
    }

    public Stop(): void {
        this._isRunning = false;
        this._isPaused = false;

        if(this._boids === null) {
            return;
        }

        SceneManager.GetInstance().Scene.remove(this._boids.Mesh);
        this._boids = null;
        return;
    }

    public Pause(): void {
        this._isRunning = false;
        this._isPaused = true;
        return;
    }
    
    public Unpause(): void {
        this._isRunning = true;
        this._isPaused = false;
        return;
    }

    public IsRunning() {
        return this._isRunning;
    }

    public IsPaused() {
        return this._isPaused;
    }

    private Validate(data : Record<string, any>): Record<string, any> {
        console.log(data)
        let validated_data: Record<string, any> = {
            id: data.id,

            name: data.name,

            domain_min_x: data.domain_min_x,
            domain_min_y: data.domain_min_y,
            domain_min_z: data.domain_min_z,
            domain_max_x: data.domain_max_x,
            domain_max_y: data.domain_max_y,
            domain_max_z: data.domain_max_z,

            divisions_x: data.divisions_x,
            divisions_y: data.divisions_y,
            divisions_z: data.divisions_z,

            spawn_min_x: data.spawn_min_x,
            spawn_min_y: data.spawn_min_y,
            spawn_min_z: data.spawn_min_z,
            spawn_max_x: data.spawn_max_x,
            spawn_max_y: data.spawn_max_y,
            spawn_max_z: data.spawn_max_z,

            separation: data.separation,
            alignment: data.alignment,
            cohesion: data.cohesion
        };

        return validated_data;
    }
}