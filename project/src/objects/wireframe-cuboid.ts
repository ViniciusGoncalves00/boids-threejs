import * as THREE from "three";
import { WireframeObject } from "./wireframe-object";
import { IStatic } from "../interfaces/IStatic";

export class WireframeCuboid extends WireframeObject implements IStatic {
    public constructor(width: number, height: number, depth: number, material: THREE.LineBasicMaterial) {
        const geometry = new THREE.BoxGeometry(width, height, depth);
        super(geometry, material);
    }
}