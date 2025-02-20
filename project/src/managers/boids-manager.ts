export class BoidsManager
{
    private _avoidance: boolean = true;
    private _alignment: boolean = true;
    private _cohesion: boolean = true;
    private _death: boolean = true;

    private _viewDistance : number = 100;
    private _speed : number = 1.2;
    private _rotationSpeed : number = 0.1;
    private separationDistance = 20;
    private alignmentRadius: number = 30

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

    public GetViewDistance(): number {
        return this._viewDistance;
    }

    public GetSpeed(): number {
        return this._speed;
    }

    public GetRotationSpeed(): number {
        return this._rotationSpeed;
    }

    public SetViewDistance(value: number): void {
        this._viewDistance = value;
    }

    public SetSpeed(value: number): void {
        this._speed = value;
    }

    public SetRotationSpeed(value: number): void {
        this._rotationSpeed = value;
    }
}