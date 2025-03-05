import { SceneManager } from "../managers/scene-manager";

export class SimulationController implements ISubject
{
    private _observers: IObserver[] = [];

    private _isRunning : boolean;
    private _isPaused : boolean;

    private _sceneManager : SceneManager;

    public constructor(sceneManager : SceneManager) {
        this._sceneManager = sceneManager;

        this._isRunning = false;
        this._isPaused = false;
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

    public Notify(args?: string[]): void {
        for (const observer of this._observers) {
            observer.Update(this, args);
        }
    }

    public Start(): void {
        this._isRunning = true;
        this._isPaused = false;

        this.Notify(["Start"]);
    }

    public Stop(): void {
        this._isRunning = false;
        this._isPaused = false;

        // const creatures = this._sceneManager.GetPopulation()

        // if(creatures === null) {
        //     return;
        // }

        // for (let index = 0; index < creatures.length; index++) {
        //     this._sceneManager.RemoveObject(creatures[index]);
        // }

        this.Notify(["Stop"]);
    }

    public Pause(): void {
        this._isRunning = false;
        this._isPaused = true;
    }
    
    public Unpause(): void {
        this._isRunning = true;
        this._isPaused = false;
    }

    public IsRunning(): boolean {
        return this._isRunning;
    }

    public IsPaused(): boolean {
        return this._isPaused;
    }
}