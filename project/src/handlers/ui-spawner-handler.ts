import { SpawnerController } from "../controllers/spawner-controller";

export class UISpawnerHandler {
    private _spawnerController : SpawnerController;

    public constructor(spawnerController: SpawnerController) {
        this._spawnerController = spawnerController;
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number) : void {
        this._spawnerController.SetLimits(minX, minY, minZ, maxX, maxY, maxZ);
    }

    public GetLimits() : {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} {
        return this._spawnerController.GetLimits()
    }

    public GetAmount(): number {
        return this._spawnerController.GetAmount();
    }

    public SetAmount(amount: number): void {
        this._spawnerController.SetAmount(amount);
    }
}