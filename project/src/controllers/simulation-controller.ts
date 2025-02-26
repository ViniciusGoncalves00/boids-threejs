import { Boid } from "../boid";
import { SceneManager } from "../managers/scene-manager";
import { BaseObject } from "../objects/base-object";
import { DomainController } from "./domain-controller";
import { SpatialPartioningController } from "./spatial-partioning-controller";
import { SpawnerController } from "./spawner-controller";

export class SimulationController implements IUpdatable
{
    private _isRunning : boolean;
    private _isPaused : boolean;

    private _sceneManager : SceneManager;
    private _domainController : DomainController;
    private _spawnerController : SpawnerController;
    private _spatialPartioningController : SpatialPartioningController;

    public constructor(sceneManager : SceneManager, domainController: DomainController, spawnerController: SpawnerController, spatialPartioningController: SpatialPartioningController) {
        this._sceneManager = sceneManager;
        this._domainController = domainController;
        this._spawnerController = spawnerController;
        this._spatialPartioningController = spatialPartioningController;

        this._isRunning = false;
        this._isPaused = false;
    }

    public Start(): void {
        this._isRunning = true;
        this._isPaused = false;

        this._spatialPartioningController.Populate();
        this._spawnerController.Spawn(this._domainController.GetLimits())
    }

    public Update(): void {
        if(!this._isRunning) {
            return;
        }
        
        const creatures = this._sceneManager.GetPopulation()

        for (let index = 0; index < creatures.length; index++) {
            creatures[index].Update()
        }
    }

    public Stop(): void {
        this._isRunning = false;
        this._isPaused = false;

        const creatures = this._sceneManager.GetPopulation()

        if(creatures === null) {
            return;
        }

        for (let index = 0; index < creatures.length; index++) {
            // this._sceneManager.RemoveObject((creatures[index] as BaseObject));
        }
    }

    public Pause(): void {
        this._isRunning = false;
        this._isPaused = true;
    }
    
    public Unpause(): void {
        this._isRunning = true;
        this._isPaused = false;
    }

    public IsRunning() {
        return this._isRunning;
    }

    public IsPaused() {
        return this._isPaused;
    }
}