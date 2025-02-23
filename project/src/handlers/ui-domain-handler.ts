import { DomainController } from "../controllers/domain-controller";

export class UIDomainHandler implements IVisible, IColorful {
    private _domainController : DomainController;

    public constructor(domainController: DomainController) {
        this._domainController = domainController;
    }

    public ToggleVisibility(): void {
        this._domainController.ToggleVisibility();
    }

    public SetColor(r: number, g: number, b: number): void {
        this._domainController.SetColor(r, g, b);
    }
    public GetColor(): string {
        return this._domainController.GetColor();
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number) : void {
        this._domainController.SetLimits(minX, minY, minZ, maxX, maxY, maxZ);
    }

    public SetDivisions(x?: number, y?: number, z?: number) : void {
        this._domainController.SetDivisions(x, y, z);
    }

    public GetLimits() : {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} {
        return this._domainController.GetLimits()
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return this._domainController.GetDivisions()
    }
}