import { CameraController } from "../controllers/camera-controller";
import { DomainController } from "../controllers/domain-controller";

export class UICameraToolsHandler {
    private _cameraController : CameraController;
    private _domainController : DomainController;

    public constructor(cameraController: CameraController, domainController: DomainController) {
        this._cameraController = cameraController;
        this._domainController = domainController;
    }

    public Rotate(angle_degrees: number) : void {
        this._cameraController.Rotate(angle_degrees);
    }

    public ToggleProjection(projection: string) : void {
        this._cameraController.ToggleProjection(projection);
    }

    public ToggleView(view: string) : void {
        let bounds = this._domainController.GetLimits();
        bounds = bounds == null ? { min: {x: -200, y: -200, z: -200}, max: {x: 200, y: 200, z: 200} } : bounds;
        this._cameraController.ToggleView({ width: window.innerWidth, height: window.innerHeight }, view, bounds);
    }
}