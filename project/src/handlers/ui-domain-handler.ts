import { RendererComponent } from "../components/renderer-component";
import { DomainController } from "../controllers/domain-controller";
import { BoidsManager } from "../managers/boids-manager";

export class UIDomainHandler {
    private _domainController: DomainController;
    private _boidsManager: BoidsManager;

    public constructor(domainController: DomainController, boidsManager: BoidsManager) {
        this._domainController = domainController;
        this._boidsManager = boidsManager;
    }

    // public ToggleVisibility(): void {
    //     const rendererComponent = this._domainController.GetComponent("RendererComponent") as RendererComponent;
    //     if (!rendererComponent) return;
        
    //     rendererComponent.SetVisibility(!rendererComponent.IsVisible());
    // }

    // public SetColor(r: number, g: number, b: number): void {
    //     const rendererComponent = this._domainController.GetComponent("RendererComponent") as RendererComponent;
    //     if (!rendererComponent) return;

    //     rendererComponent.SetColor(r, g, b);
    // }

    // public GetHexColor(): string {
    //     const rendererComponent = this._domainController.GetComponent("RendererComponent") as RendererComponent;
    //     if (!rendererComponent) return "#000000";

    //     return rendererComponent.GetHexColor()[0];
    // }

    public SetLimits(minX?: number, minY?: number, minZ?: number, maxX?: number, maxY?: number, maxZ?: number): void {
        this._domainController.SetLimits(minX, minY, minZ, maxX, maxY, maxZ);
        this._boidsManager.SetBounds(minX, minY, minZ, maxX, maxY, maxZ)
    }

    public GetLimits(): { min: { x: number, y: number, z: number }, max: { x: number, y: number, z: number } } {
        return this._domainController.GetLimits();
    }
}