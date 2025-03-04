import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { Entity } from "../entities/entity";
import { RendererComponent } from "../components/renderer-component";

export class DomainController extends Entity
{
    private _sceneManager : SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;

    public constructor(sceneManager : SceneManager)
    {
        super();
        this._object3D = new THREE.Object3D();
        const box = new THREE.BoxGeometry()
        const mesh = new THREE.Mesh(box);
        this.AddComponent(new RendererComponent(this, [mesh]))
        
        this._sceneManager = sceneManager;
        this._sceneManager.AddObject(this);
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

    public GetSize(): {width: number, height: number, depth: number} {
        return {width: Math.abs(this._maxX - this._minX),
                height: Math.abs(this._maxY - this._minY),
                depth: Math.abs(this._maxZ - this._minZ)};
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
        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;

        this._sceneManager.RemoveObject(rendererComponent.Entity)

        rendererComponent.Mesh.geometry.dispose();

        const size = this.GetSize();
        rendererComponent.Mesh.geometry = new THREE.BoxGeometry(size.width, size.height, size.depth);
        
        const center = this.GetCenter();
        rendererComponent.Mesh.position.set(center.x, center.y, center.z)
    }
}