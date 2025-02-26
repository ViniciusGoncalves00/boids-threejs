import * as THREE from "three";
import { BaseObject } from "./base-object";

export abstract class SolidObject extends BaseObject {
    private _mesh: THREE.Mesh

    public get Mesh(): THREE.Mesh {
        return this._mesh;
    }

    private set Mesh(value: THREE.Mesh) {
        if (!value) {
            throw new Error("Mesh cannot be null or undefined.");
        }
        this._mesh = value;
    }

    public constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
        super();
        this._mesh = new THREE.Mesh(geometry, material)
        this._mesh.castShadow = true;
        this._mesh.receiveShadow = true;
    }
}