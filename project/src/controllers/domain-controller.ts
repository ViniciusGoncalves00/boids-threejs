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

        const wireframe = this.CreateWireframe(new THREE.BoxGeometry());
        this.AddComponent(new RendererComponent(this));

        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        rendererComponent.Mesh = wireframe;
        this._object3D.add(wireframe);

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

        if (rendererComponent.Mesh) {
            this._object3D.remove(rendererComponent.Mesh);
            if (rendererComponent.Mesh.geometry) rendererComponent.Mesh.geometry.dispose();
            if (rendererComponent.Mesh.material) rendererComponent.Mesh.material.dispose();
        }

        const size = this.GetSize();
        const box = new THREE.BoxGeometry(size.width, size.height, size.depth);
        const newMesh = this.CreateWireframe(box);

        const center = this.GetCenter();
        newMesh.position.set(center.x, center.y, center.z);

        this._object3D.add(newMesh);
        rendererComponent.Mesh = newMesh;

        this._sceneManager.AddObject(this);
    }

    private CreateWireframe(geometry: THREE.BoxGeometry): THREE.LineSegments {
        const wireframeGeometry = new THREE.WireframeGeometry(geometry);
        const material = new THREE.LineBasicMaterial({ color: 0xffffff });
        return new THREE.LineSegments(wireframeGeometry, material);
    }
}
