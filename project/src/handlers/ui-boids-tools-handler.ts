import { BoidsManager } from "../managers/boids-manager";

export class UIBoidsHandler {
    private _boidsManager : BoidsManager;

    public constructor(boidsManager: BoidsManager) {
        this._boidsManager = boidsManager;
    }

    public ToggleAvoidance(): void {
        this._boidsManager.ToggleAvoidance();
    }

    public ToggleAlignment(): void {
        this._boidsManager.ToggleAlignment();
    }

    public ToggleCohesion(): void {
        this._boidsManager.ToggleCohesion();
    }

    public ToggleDeath(): void {
        this._boidsManager.ToggleDeath();
    }
}