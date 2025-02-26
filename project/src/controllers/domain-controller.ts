import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { SceneObject } from "../base";
import { BaseObject } from "../objects/base-object";
import { ObjectsBuilder } from "../managers/objects-builder";
import { LineBasicMaterial } from "../objects/default-materials";
import { WireframeObject } from "../objects/wireframe-object";

export class DomainController extends SceneObject implements IVisible, IColorful
{
    private _sceneManager : SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;

    private _domain: (WireframeObject | null) = null;

    public constructor(sceneManager : SceneManager)
    {
        super();
        this._interfaces.push("IVisible", "IColorful");
        this._sceneManager = sceneManager;
    }

    public SetColor(r: number, g: number, b: number): void {
        if(this._domain === null) return;

        const color = new THREE.Color(r, g, b);
        const material = new THREE.LineBasicMaterial({ color: color });

        this._domain.Wireframe.material = material;
    }

    public GetColor(): string {
        const default_color = `#ffffff`;
        if (!this._domain || !this._domain || !this._domain.Wireframe.material) {
            return default_color;
        }
        const material = this._domain.Wireframe.material as THREE.LineBasicMaterial;
        return `#${material.color.getHexString()}`;
    }

    public ToggleVisibility(): void {
        if(this._domain === null) return;
        
        this._domain.Wireframe.visible = !this._domain.Wireframe.visible;
    }

    public GetLimits() : {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} {
        return {
            min: {x: this._minX, y: this._minY, z: this._minZ},
            max: {x: this._maxX, y: this._maxY, z: this._maxZ},
        }
    }

    public GetCenter(): {x: number, y: number, z: number} {
        return {x: (this._maxX + this._minX) / 2,
                y: (this._maxY + this._minY) / 2,
                z: (this._maxZ + this._minZ) / 2};
    }

    public GetSize(): {x: number, y: number, z: number} {
        return {x: Math.abs(this._maxX - this._minX),
                y: Math.abs(this._maxY - this._minY),
                z: Math.abs(this._maxZ - this._minZ)};
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number)
    {
        this._minX = minX == undefined ? this._minX : minX;
        this._minY = minY == undefined ? this._minY : minY;
        this._minZ = minZ == undefined ? this._minZ : minZ;
        this._maxX = maxX == undefined ? this._maxX : maxX;
        this._maxY = maxY == undefined ? this._maxY : maxY;
        this._maxZ = maxZ == undefined ? this._maxZ : maxZ;

        this.UpdateDomain()
    }

    private UpdateDomain(): void {
        if(this._domain !== null) {
            this._sceneManager.RemoveObject(this._domain)
        }

        const size = this.GetSize();
        const center = this.GetCenter();

        const objectBuilder = new ObjectsBuilder()
        this._domain = objectBuilder.BuildWireframeCuboid(size.x, size.y, size.z, LineBasicMaterial);
        this._domain.Wireframe.position.set(center.x, center.y, center.z)

        this._sceneManager.AddObject(this._domain);
    }
}