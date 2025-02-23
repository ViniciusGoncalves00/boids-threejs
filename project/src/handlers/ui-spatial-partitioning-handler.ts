import { SpatialPartioningController } from "../controllers/spatial-partioning-controller";

export class UISpatialPartioningHandler implements IVisible, IColorful {
    private _spatialPartioningController : SpatialPartioningController;

    public constructor(spatialPartioningController: SpatialPartioningController) {
        this._spatialPartioningController = spatialPartioningController;
    }

    public ToggleVisibility(): void {
        this._spatialPartioningController.ToggleVisibility();
    }

    public SetColor(r: number, g: number, b: number): void {
        this._spatialPartioningController.SetColor(r, g, b);
    }
    public GetColor(): string {
        return this._spatialPartioningController.GetColor();
    }

    public SetDivisions(x?: number, y?: number, z?: number) : void {
        this._spatialPartioningController.SetDivisions(x, y, z);
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return this._spatialPartioningController.GetDivisions()
    }
}