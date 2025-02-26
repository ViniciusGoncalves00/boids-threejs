import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { Boid } from "../boid";
import { BoidsManager } from "../managers/boids-manager";
import { SceneObject } from "../base";
import { BaseObject } from "../objects/base-object";
import { ObjectsBuilder } from "../managers/objects-builder";
import { LineBasicMaterial } from "../objects/default-materials";
import { WireframeObject } from "../objects/wireframe-object";

export class SpawnerController extends SceneObject implements IVisible, IColorful
{
    private _sceneManager : SceneManager;
    private _boidsManager : BoidsManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;
    
    private _amount: number = 10;

    public _spawn: (WireframeObject | null) = null;

    public constructor(sceneManager : SceneManager, boidsManager: BoidsManager)
    {
        super();
        this._sceneManager = sceneManager;
        this._boidsManager = boidsManager;
        this._interfaces.push("IVisible", "IColorful");
    }

    public SetColor(r: number, g: number, b: number): void {
        const color = new THREE.Color(r, g, b);
        const material = new THREE.LineBasicMaterial({ color: color });

        if (!this._spawn) {
            return;
        }

        this._spawn.Wireframe.material = material;
    }

    public GetColor(): string {
        const default_color = `#ffffff`;
        if (!this._spawn || !this._spawn.Wireframe.material) {
            return default_color;
        }
        const material = this._spawn.Wireframe.material as THREE.LineBasicMaterial;
        return `#${material.color.getHexString()}`;
    }

    public ToggleVisibility(): void {
        if (this._spawn !== null) {
            this._spawn.Wireframe.visible = !this._spawn.Wireframe.visible;
        }
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

        this.Update()
    }

    public GetAmount(): number {
        return this._amount;
    }

    public SetAmount(amount: number): void {
        this._amount = amount;
    }

    public Spawn(domainSize: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} , amount: number = this._amount): void {
        let boids: Boid[] = []

        const geometry = new THREE.ConeGeometry();
        geometry.rotateX(90 * Math.PI / 180)
        geometry.scale(2, 2, 5)

        const material = new THREE.MeshStandardMaterial();
        material.color.setRGB(200, 0, 0);

        for (let index = 0; index < amount; index++) {
            const boidMesh = new THREE.Mesh(geometry, material);
        
            const sphereGeometry = new THREE.SphereGeometry();
            const sphereMesh = new THREE.Mesh(sphereGeometry, material);
            sphereMesh.position.z = 100;
            // boidMesh.add(sphereMesh)

            const limits = this.GetLimits();
            const size = this.GetSize();

            boidMesh.position.x = Math.random() * size.x + limits.min.x;
            boidMesh.position.y = Math.random() * size.y + limits.min.y;
            boidMesh.position.z = Math.random() * size.z + limits.min.z;
            boidMesh.rotateX(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateY(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateZ(Math.random() * 360 * Math.PI/180)

            const boid = new Boid(this._sceneManager,  this._boidsManager, boidMesh, domainSize);
            boids.push(boid);
        }
        
        this._sceneManager.Populate(boids);
    }

    private Update()
    {
        if(this._spawn !== null){
            this._sceneManager.RemoveObject(this._spawn)
        }

        const size = this.GetSize()
        const center = this.GetCenter()

        const objectBuilder = new ObjectsBuilder()
        this._spawn = objectBuilder.BuildWireframeCuboid(size.x, size.y, size.z, LineBasicMaterial);
        this._spawn.Wireframe.position.set(center.x, center.y, center.z)

        this._sceneManager.AddObject(this._spawn)
    }
}