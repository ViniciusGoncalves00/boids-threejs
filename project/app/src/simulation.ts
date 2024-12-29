export class Simulation
{
    private static _instance : Simulation;

    private _isRunning : boolean;

    private constructor() {
        this._isRunning = false;
    }

    public static GetInstance(): Simulation
    {
        if(this._instance == null)
        {
            this._instance = new Simulation();
        }

        return this._instance;
    }

    public Start(data: Record<string, any>): void {
        data =  this.Validate(data);

        this._isRunning = true;
    }

    public Stop(): void {
        this._isRunning = false;
        return;
    }

    public Pause(): void {
        this._isRunning = false;
        return;
    }
    
    public Unpause(): void {
        this._isRunning = true;
        return;
    }

    public IsRunning() {
        return this._isRunning;
    }

    private Validate(data : Record<string, any>): Record<string, any> {
        let validated_data: Record<string, any> = {
            name: data.name,

            domain_min_x: data.domain_min_x,
            domain_min_y: data.domain_min_y,
            domain_min_z: data.domain_min_z,
            domain_max_x: data.domain_max_x,
            domain_max_y: data.domain_max_y,
            domain_max_z: data.domain_max_z,

            divisions_x: data.divisions_x,
            divisions_y: data.divisions_y,
            divisions_z: data.divisions_z,

            spawn_min_x: data.spawn_min_x,
            spawn_min_y: data.spawn_min_y,
            spawn_min_z: data.spawn_min_z,
            spawn_max_x: data.spawn_max_x,
            spawn_max_y: data.spawn_max_y,
            spawn_max_z: data.spawn_max_z,

            separation: data.separation,
            alignment: data.alignment,
            cohesion: data.cohesion
        };

        return validated_data;
    }
}