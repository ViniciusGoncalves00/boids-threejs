import * as THREE from "three";
import { Cuboid } from "../entities/cuboid";

export class EntityBuilder
{
    public BuildCuboid(width: number, height: number, depth: number, material: THREE.MeshStandardMaterial): Cuboid {
        return new Cuboid(width, height, depth, material)
    }
}