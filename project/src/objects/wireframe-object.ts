import * as THREE from "three";
import { BaseObject } from "./base-object";

export abstract class WireframeObject extends BaseObject {
    private _wireframe: THREE.LineSegments;

    public get Wireframe(): THREE.LineSegments {
        return this._wireframe;
    }

    private set Wireframe(value: THREE.LineSegments) {
        if (!value) {
            throw new Error("Wireframe cannot be null or undefined.");
        }
        this._wireframe = value;
    }

    public constructor(geometry: THREE.BufferGeometry, material: THREE.LineBasicMaterial) {
        super();
        const edges = new THREE.EdgesGeometry(geometry);
        this._wireframe = new THREE.LineSegments(edges, material);
    }
}
