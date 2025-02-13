import { SimulationController } from "../controllers/simulation-controller";

export class UISimulationHandler {
    private _simulationController: SimulationController

    public constructor(simulationController: SimulationController) {
        this._simulationController = simulationController;
    }

    public Start(): void {
        this._simulationController.Start()
    }

    public Stop(): void {
        this._simulationController.Stop()
    }

    public Pause(): void {
        this._simulationController.Pause()
    }

    public Unpause(): void {
        this._simulationController.Unpause()
    }

    public IsRunning(): boolean {
        return this._simulationController.IsRunning()
    }

    public IsPaused(): boolean {
        return this._simulationController.IsPaused()
    }
}