import { DomainController } from "../controllers/domain-controller";

export class UIDomainHandler {
    private _domainController : DomainController;

    public constructor(domainController: DomainController) {
        this._domainController = domainController;
    }

    public ToggleVisibility(): void {
        this._domainController.ToggleVisibility();
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number) : void {
        this._domainController.SetLimits(minX, minY, minZ, maxX, maxY, maxZ);
    }

    public SetDivisions(x?: number, y?: number, z?: number) : void {
        this._domainController.SetDivisions(x, y, z);
    }

    public GetLimits() : {min: [number, number, number], max: [number, number, number]} {
        return this._domainController.GetLimits()
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return this._domainController.GetDivisions()
    }
}