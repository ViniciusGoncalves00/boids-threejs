import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { Boid } from "../boid";
import { DomainController } from "./domain-controller";
import { IVisible } from "../interfaces/IVisible";

export class SpawnerController implements IVisible
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
    }

    public ToggleVisibility(): void {
        if (this._spawn !== null) {
            this._spawn.visible = !this._spawn.visible;
        }
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

    public Spawn(domainSize: {min: [number, number, number], max: [number, number, number]} , amount: number): Boid[] {
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

            boidMesh.position.x = Math.random() * size[0] + limits.min[0];
            boidMesh.position.y = Math.random() * size[1] + limits.min[1];
            boidMesh.position.z = Math.random() * size[2] + limits.min[2];
            boidMesh.rotateX(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateY(Math.random() * 360 * Math.PI/180)
            boidMesh.rotateZ(Math.random() * 360 * Math.PI/180)

            const boid = new Boid(boidMesh, domainSize);
            boids.push(boid);

            this._sceneManager.AddObject(boidMesh);
        }

        return boids;
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

        this._sceneManager.AddObject(this._spawn)
    }
}