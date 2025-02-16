import { Boid } from "../boid";
import { SceneManager } from "../managers/scene-manager";
import { IUpgradeable } from "../interfaces/IUpdate";
import { DomainController } from "./domain-controller";
import { SpawnerController } from "./spawner-controller";

export class SimulationController implements IUpgradeable
{
    private _isRunning : boolean;
    private _isPaused : boolean;

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
        this._isPaused = false;

        this._spawnerController.Spawn(this._domainController.GetLimits(), 2000)
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
            this._sceneManager.RemoveObject(creatures[index].Mesh);
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