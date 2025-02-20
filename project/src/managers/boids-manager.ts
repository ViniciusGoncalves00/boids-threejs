export class BoidsManager
{
    private _avoidance: boolean = true;
    private _alignment: boolean = true;
    private _cohesion: boolean = false;
    private _death: boolean = true;

    public ToggleAvoidance(): void {
        this._avoidance = !this._avoidance;
    }

    public ToggleAlignment(): void {
        this._alignment = !this._alignment;
    }

    public ToggleCohesion(): void {
        this._cohesion = !this._cohesion;
    }

    public ToggleDeath(): void {
        this._death = !this._death;
    }

    public GetAvoidance(): boolean {
        return this._avoidance;
    }

    public GetAlignment(): boolean {
        return this._alignment;
    }

    public GetCohesion(): boolean {
        return this._cohesion;
    }

    public GetDeath(): boolean {
        return this._death;
    }
}