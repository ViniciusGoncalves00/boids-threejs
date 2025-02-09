import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";

export class SpawnerController
{
    private _sceneManager : SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;

    public _spawn: (THREE.LineSegments | null) = null;

    public constructor(sceneManager : SceneManager)
    {
        this._sceneManager = sceneManager;

        this.SetLimits(-10, -10, -10, 10, 10, 10);
    }

    public GetLimits() : {min: [number, number, number], max: [number, number, number]} {
        return {
            min: [this._minX, this._minY, this._minZ],
            max: [this._maxX, this._maxY, this._maxZ],
        }
    }

    public GetCenter() {
        const x = (this._maxX + this._minX) / 2;
        const y = (this._maxY + this._minY) / 2;
        const z = (this._maxZ + this._minZ) / 2;

        return [x, y, z];
    }

    public GetSize() {
        const x = Math.abs(this._maxX - this._minX);
        const y = Math.abs(this._maxY - this._minY);
        const z = Math.abs(this._maxZ - this._minZ);

        return [x, y, z];
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number)
    {
        this._minX = minX == undefined ? this._minX : minX;
        this._minY = minY == undefined ? this._minY : minY;
        this._minZ = minZ == undefined ? this._minZ : minZ;
        this._maxX = maxX == undefined ? this._maxX : maxX;
        this._maxY = maxY == undefined ? this._maxY : maxY;
        this._maxZ = maxZ == undefined ? this._maxZ : maxZ;

        this.Update()
    }

    private Update()
    {
        if(this._spawn !== null){
            this._sceneManager.RemoveObject(this._spawn)
        }

        const size = this.GetSize()
        const center = this.GetCenter()

        const geometry = new THREE.BoxGeometry( size[0], size[1], size[2]);
        const edges = new THREE.EdgesGeometry( geometry );
        const material = new THREE.LineBasicMaterial()
        material.color.setRGB(0, 0, 200);

        this._spawn = new THREE.LineSegments(edges, material)
        this._spawn.position.set(center[0], center[1], center[2])
        console.log(center)
        this._sceneManager.AddObject(this._spawn)
    }
}