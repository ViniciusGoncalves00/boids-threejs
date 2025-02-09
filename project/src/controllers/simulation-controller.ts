import * as THREE from "three";
import { Boid } from "../boid";
import { SceneManager } from "../managers/scene-manager";
import { IUpgradeable } from "../interfaces/IUpdate";
import { DomainController } from "./domain-controller";
import { SpawnerController } from "./spawner-controller";

export class SimulationController implements IUpgradeable
{
    private _isRunning : boolean;
    private _isPaused : boolean;

    private _boids : Boid[] | null = null;

    private _sceneManager : SceneManager;
    private _domainController : DomainController;
    private _spawnerController : SpawnerController;

    public constructor(sceneManager : SceneManager, domainController: DomainController, spawnerController: SpawnerController) {
        this._sceneManager = sceneManager;
        this._domainController = domainController;
        this._spawnerController = spawnerController;

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

            this._boids = new Array(100)

            for (let index = 0; index < this._boids.length; index++) {
                const boidMesh = new THREE.Mesh(geometry, material);
                const limits = this._spawnerController.GetLimits();
                const size = this._spawnerController.GetSize();
                boidMesh.position.x = Math.random() * size[0] + limits.min[0] / 2;
                boidMesh.position.y = Math.random() * size[1] + limits.min[1] / 2;
                boidMesh.position.z = Math.random() * size[2] + limits.min[2] / 2;
                boidMesh.rotateX(Math.random() * 360 * Math.PI/180)
                boidMesh.rotateY(Math.random() * 360 * Math.PI/180)
                boidMesh.rotateZ(Math.random() * 360 * Math.PI/180)

                this._boids[index] = new Boid(boidMesh, this._domainController.GetLimits());
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