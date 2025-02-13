import { SpawnerController } from "../controllers/spawner-controller";
import { IVisible } from "../interfaces/IVisible";

export class UISpawnerHandler {
    private _spawnerController : SpawnerController;

    public constructor(spawnerController: SpawnerController) {
        this._spawnerController = spawnerController;
    }

    public ToggleVisibility(): void {
        this._spawnerController.ToggleVisibility();
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number) : void {
        this._spawnerController.SetLimits(minX, minY, minZ, maxX, maxY, maxZ);
    }

    public GetLimits() : {min: [number, number, number], max: [number, number, number]} {
        return this._spawnerController.GetLimits()
    }
}