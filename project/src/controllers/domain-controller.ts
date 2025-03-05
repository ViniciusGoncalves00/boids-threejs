import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { Entity } from "../entities/entity";
import { RendererComponent } from "../components/renderer-component";

export class DomainController extends Entity {
    private _sceneManager: SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;

    public constructor(sceneManager: SceneManager) {
        super();
        this._object3D = new THREE.Object3D();

        const box = new THREE.BoxGeometry();
        // const edgesGeometry = new THREE.WireframeGeometry(box);
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(box, material);
        this.AddComponent(new RendererComponent(this));

        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        rendererComponent.AddMesh(mesh);
        this._object3D.add(mesh);

        this._sceneManager = sceneManager;
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
            z: (this._maxZ + this._minZ) / 2
        };
    }

    public GetSize(): { width: number, height: number, depth: number } {
        return {
            width: Math.abs(this._maxX - this._minX),
            height: Math.abs(this._maxY - this._minY),
            depth: Math.abs(this._maxZ - this._minZ)
        };
    }

    public SetLimits(minX?: number, minY?: number, minZ?: number, maxX?: number, maxY?: number, maxZ?: number) {
        this._minX = minX == undefined ? this._minX : minX;
        this._minY = minY == undefined ? this._minY : minY;
        this._minZ = minZ == undefined ? this._minZ : minZ;
        this._maxX = maxX == undefined ? this._maxX : maxX;
        this._maxY = maxY == undefined ? this._maxY : maxY;
        this._maxZ = maxZ == undefined ? this._maxZ : maxZ;

        this.UpdateDomain();
    }

    private UpdateDomain(): void {
        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        if (!rendererComponent) return;
    
        this._sceneManager.RemoveObject(this);
    
        const meshes = rendererComponent.GetMeshes();
        if (meshes.length > 0) {
            const firstMesh = meshes[0];
            rendererComponent.RemoveMesh(firstMesh);
            
            if (firstMesh.geometry) firstMesh.geometry.dispose();
            // if (Array.isArray(meshes[0].material)) {
            //     meshes[0].material.forEach(mat => mat.dispose());
            // } else {
            //     meshes[0].material.dispose();
            // }
            
        }
    
        const size = this.GetSize();
        const box = new THREE.BoxGeometry(size.width, size.height, size.depth);
        // const edgesGeometry = new THREE.WireframeGeometry(box);
        const material = new THREE.LineBasicMaterial({
            color: 0xffffff, 
            transparent: true, 
            opacity: 0.1
        });
        const mesh = new THREE.Mesh(box, material);
    
        const center = this.GetCenter();
        mesh.position.set(center.x, center.y, center.z);
    
        rendererComponent.AddMesh(mesh);
        this._sceneManager.AddObject(this);
    }
}
