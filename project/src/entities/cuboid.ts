import * as THREE from "three";
import { Entity } from "./entity";
import { RendererComponent } from "../components/renderer-component";

export class Cuboid extends Entity
{
    public constructor(width: number, height: number, depth: number, material?: THREE.Material) {
        super();
        const geometry = new THREE.BoxGeometry(width, height, depth);
        material === undefined ? new THREE.Material() : material;
        this.AddComponent(new RendererComponent(this, [new THREE.Mesh(geometry, material)]))
    }
}