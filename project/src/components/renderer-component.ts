import * as THREE from "three";
import { Component } from "./component";
import { Entity } from "../entities/entity";

export class RendererComponent extends Component {
    private _entity: Entity;
    private _meshes: THREE.Mesh[] = [];
    Mesh: any;

    constructor(entity: Entity, meshes: THREE.Mesh[] = []) {
        super();
        this._entity = entity;
        this._meshes = meshes;
        this._meshes.forEach(mesh => this._entity.Object3D.add(mesh));
    }

    public AddMesh(mesh: THREE.Mesh): void {
        this._meshes.push(mesh);
        this._entity.Object3D.add(mesh);
    }

    public RemoveMesh(mesh: THREE.Mesh): void {
        const index = this._meshes.indexOf(mesh);
        if (index !== -1) {
            this._meshes.splice(index, 1);
            this._entity.Object3D.remove(mesh);
        }
    }

    public GetMeshes(): THREE.Mesh[] {
        return this._meshes;
    }

    public SetMaterial(material: THREE.Material): void {
        this._meshes.forEach(mesh => {
            mesh.material = material;
        });
    }

    public SetColor(r: number, g: number, b: number): void {
        const color = new THREE.Color(r, g, b);
        const material = new THREE.LineBasicMaterial({ color });

        this._meshes.forEach(mesh => {
            mesh.material = material;
        });
    }

    public GetHexColor(): string[] {
        return this._meshes.map(mesh => {
            if (mesh.material instanceof THREE.LineBasicMaterial) {
                return `#${mesh.material.color.getHexString()}`;
            }
            return "#ffffff";
        });
    }

    public SetVisibility(visible: boolean): void {
        this._meshes.forEach(mesh => {
            mesh.visible = visible;
        });
    }

    public IsVisible(): boolean {
        return this._meshes.some(mesh => mesh.visible);
    }

    public Destroy(): void {
        this._meshes.forEach(mesh => this._entity.Object3D.remove(mesh));
        this._meshes = [];
    }
}
