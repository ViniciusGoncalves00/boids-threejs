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

        this._boids = this._spawnerController.Spawn(this._domainController.GetLimits(), 100)
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