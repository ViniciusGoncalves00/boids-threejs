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

    public GetViewDistance(): number {
        return this._boidsManager.GetViewDistance();
    }

    public GetSpeed(): number {
        return this._boidsManager.GetSpeed();
    }

    public GetRotationSpeed(): number {
        return this._boidsManager.GetRotationSpeed();
    }

    public GetSeparationDistance(): number {
        return this._boidsManager.GetSeparationDistance();
    }

    public GetAlignmentRadius(): number {
        return this._boidsManager.GetAlignmentRadius();
    }

    public SetViewDistance(value: number): void {
        this._boidsManager.SetViewDistance(value);
    }

    public SetSpeed(value: number): void {
        this._boidsManager.SetSpeed(value);
    }

    public SetRotationSpeed(value: number): void {
        this._boidsManager.SetRotationSpeed(value);
    }

    public SetSeparationDistance(value: number): void {
        this._boidsManager.SetSeparationDistance(value);
    }

    public SetAlignmentRadius(value: number): void {
        this._boidsManager.SetAlignmentRadius(value);
    }
}