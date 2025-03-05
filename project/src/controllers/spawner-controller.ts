import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { Boid } from "../entities/boid";
import { BoidsManager } from "../managers/boids-manager";
import { Entity } from "../entities/entity";
import { RendererComponent } from "../components/renderer-component";
import { SpatialPartitioningController } from "./spatial-partitioning-controller";

export class SpawnerController extends Entity {
    private _sceneManager: SceneManager;
    private _boidsManager: BoidsManager;
    private _spatialPartitioningController: SpatialPartitioningController;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;
    
    private _amount: number = 10;

    public constructor(sceneManager: SceneManager, boidsManager: BoidsManager, spatialPartitioningController: SpatialPartitioningController) {
        super();
        this._sceneManager = sceneManager;
        this._boidsManager = boidsManager;
        this._spatialPartitioningController = spatialPartitioningController;

        this._object3D = new THREE.Object3D();
        
                const box = new THREE.BoxGeometry();
        const edgesGeometry = new THREE.EdgesGeometry(box);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.LineSegments(edgesGeometry, material);
        this.AddComponent(new RendererComponent(this));
        
        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        rendererComponent.Mesh = mesh;
        this._object3D.add(mesh);

        this._sceneManager.AddObject(this);
    }

    public GetLimits(): { min: { x: number, y: number, z: number }, max: { x: number, y: number, z: number } } {
        return {
            min: { x: this._minX, y: this._minY, z: this._minZ },
            max: { x: this._maxX, y: this._maxY, z: this._maxZ },
        };
    }

    public GetCenter(): { x: number, y: number, z: number } {
        return {
            x: (this._maxX + this._minX) / 2,
            y: (this._maxY + this._minY) / 2,
            z: (this._maxZ + this._minZ) / 2,
        };
    }

    public GetSize(): { width: number, height: number, depth: number } {
        return {
            width: Math.abs(this._maxX - this._minX),
            height: Math.abs(this._maxY - this._minY),
            depth: Math.abs(this._maxZ - this._minZ),
        };
    }

    public SetLimits(minX?: number, minY?: number, minZ?: number, maxX?: number, maxY?: number, maxZ?: number) {
        this._minX = minX == undefined ? this._minX : minX;
        this._minY = minY == undefined ? this._minY : minY;
        this._minZ = minZ == undefined ? this._minZ : minZ;
        this._maxX = maxX == undefined ? this._maxX : maxX;
        this._maxY = maxY == undefined ? this._maxY : maxY;
        this._maxZ = maxZ == undefined ? this._maxZ : maxZ;

        this.Update();
    }

    public GetAmount(): number {
        return this._amount;
    }

    public SetAmount(amount: number): void {
        this._amount = amount;
    }

    public Spawn(domainSize: { min: { x: number, y: number, z: number }, max: { x: number, y: number, z: number } }, amount: number = this._amount): void {
        let boids: Boid[] = [];

        const geometry = new THREE.ConeGeometry();
        geometry.rotateX(90 * Math.PI / 180);
        geometry.scale(2, 2, 5);

        const material = new THREE.MeshStandardMaterial();
        material.color.setRGB(200, 0, 0);

        for (let index = 0; index < amount; index++) {
            const boidMesh = new THREE.Mesh(geometry, material);
            
            const limits = this.GetLimits();
            const size = this.GetSize();

            boidMesh.position.x = Math.random() * size.width + limits.min.x;
            boidMesh.position.y = Math.random() * size.height + limits.min.y;
            boidMesh.position.z = Math.random() * size.depth + limits.min.z;
            boidMesh.rotateX(Math.random() * 360 * Math.PI/180);
            boidMesh.rotateY(Math.random() * 360 * Math.PI/180);
            boidMesh.rotateZ(Math.random() * 360 * Math.PI/180);

            const boid = new Boid(this._sceneManager, this._boidsManager, this._spatialPartitioningController, boidMesh, domainSize);
            boids.push(boid);
            this._sceneManager.AddObject(boid);
        }
    }

    private Update(): void {
        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        if (!rendererComponent) return;

        this._sceneManager.RemoveObject(this);

        if (rendererComponent.Mesh) {
            this._object3D.remove(rendererComponent.Mesh);
            if (rendererComponent.Mesh.geometry) rendererComponent.Mesh.geometry.dispose();
            if (rendererComponent.Mesh.material) rendererComponent.Mesh.material.dispose();
        }

        const size = this.GetSize();
        const box = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const edgesGeometry = new THREE.EdgesGeometry(box);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        const mesh = new THREE.LineSegments(edgesGeometry, material);
        
        const center = this.GetCenter();
        mesh.position.set(center.x, center.y, center.z);
        
        this._object3D.add(mesh);
        rendererComponent.Mesh = mesh;

        this._sceneManager.AddObject(this);
    }
}
