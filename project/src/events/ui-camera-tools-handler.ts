import { CameraController } from "../controllers/camera-controller";
import { DomainManager } from "../managers/domain-manager";
import { RendererManager } from "../managers/renderer-manager";

export class UICameraToolsHandler {
    private _cameraController : CameraController;
    private _rendererManager : RendererManager;
    private _domain : DomainManager;

    public constructor(cameraController: CameraController, rendererManager: RendererManager, domain: DomainManager) {
        this._cameraController = cameraController;
        this._rendererManager = rendererManager;
        this._domain = domain;
    }

    public Rotate(angle_degrees: number) : void {
        this._cameraController.Rotate(angle_degrees);
    }

    public ToggleProjection(projection: string) : void {
        this._cameraController.ToggleProjection(projection);
    }

    public ToggleView(view: string) : void {
        let bounds = this._domain.GetLimits();
        bounds = bounds == null ? { min: [-200, -200, -200], max: [200, 200, 200] } : bounds;
        this._cameraController.ToggleView({ width: window.innerWidth, height: window.innerHeight }, view, bounds);
    }
}