import * as THREE from "three";
import { Boid } from "../boid";
import { SceneManager } from "../managers/scene-manager";
import { IUpgradeable } from "../interfaces/IUpdate";

export class SimulationController implements IUpgradeable
{
    private _isRunning : boolean;
    private _isPaused : boolean;

    private _boids : Boid[] | null = null;

    private _sceneManager : SceneManager;
    private _limits : { min: [number, number, number], max: [number, number, number]};

    public constructor(sceneManager : SceneManager,  limits: { min: [number, number, number], max: [number, number, number]}) {
        this._sceneManager = sceneManager;
        this._limits = limits;

        this._isRunning = false;
        this._isPaused = false;
    }

    public Start(): void {
        this._isRunning = true;

        if(this._boids == null) {
            const geometry = new THREE.ConeGeometry();
            geometry.rotateX(90 * Math.PI / 180)
            geometry.scale(2, 2, 5)

            const material = new THREE.MeshStandardMaterial();
            material.color.setRGB(200, 0, 0);

            this._boids = new Array(3)

            for (let index = 0; index < this._boids.length; index++) {
                const boidMesh = new THREE.Mesh(geometry, material);
                boidMesh.rotateX(Math.random() * 360 * Math.PI/180)
                boidMesh.rotateY(Math.random() * 360 * Math.PI/180)
                boidMesh.rotateZ(Math.random() * 360 * Math.PI/180)

                this._boids[index] = new Boid(boidMesh, this._limits);
                this._sceneManager.AddObject(boidMesh);

                const sphereGeometry = new THREE.SphereGeometry();
                const sphereMesh = new THREE.Mesh(sphereGeometry, material);
                sphereMesh.position.z = 10;
                boidMesh.add(sphereMesh)
            }
        }
    }

    public Update(): void {
        if(!this._isRunning) {
            return;
        }

        if(this._boids !== null) {
            for (let index = 0; index < this._boids.length; index++) {
                this._boids[index].Update()
            }
        }
    }

    public Stop(): void {
        this._isRunning = false;
        this._isPaused = false;

        if(this._boids === null) {
            return;
        }

        for (let index = 0; index < this._boids.length; index++) {
            this._sceneManager.RemoveObject(this._boids[index].Mesh);
        }

        this._boids = null;
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
}