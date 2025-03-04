import { RendererComponent } from "../components/renderer-component";
import { SpatialPartitioningController } from "../controllers/spatial-partitioning-controller";

export class UISpatialPartioningHandler implements IVisible, IColorful {
    private _spatialPartioningController : SpatialPartitioningController;

    public constructor(spatialPartioningController: SpatialPartitioningController) {
        this._spatialPartioningController = spatialPartioningController;
    }

    public ToggleVisibility(): void {
        const rendererComponent = this._spatialPartioningController.GetComponent("RendererComponent") as RendererComponent;
        if (!rendererComponent) return;
        
        rendererComponent.SetVisibility(!rendererComponent.IsVisible());
    }

    public SetColor(r: number, g: number, b: number): void {
        const rendererComponent = this._spatialPartioningController.GetComponent("RendererComponent") as RendererComponent;
        rendererComponent.SetColor(r, g, b);
    }
    public GetColor(): string {
        const rendererComponent = this._spatialPartioningController.GetComponent("RendererComponent") as RendererComponent;
        if (!rendererComponent) return "#000000";

        return rendererComponent.GetHexColor()[0];
    }

    public SetDivisions(x?: number, y?: number, z?: number) : void {
        this._spatialPartioningController.SetDivisions(x, y, z);
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return this._spatialPartioningController.GetDivisions()
    }
}