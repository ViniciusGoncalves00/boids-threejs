import * as THREE from "three";
import { Cuboid } from "../objects/cuboid";
import { WireframeCuboid } from "../objects/wireframe-cuboid";

export class ObjectsBuilder
{
    public BuildCuboid(width: number, height: number, depth: number, material: THREE.Material): Cuboid {
        return new Cuboid(width, height, depth, material)
    }
    
    public BuildWireframeCuboid(width: number, height: number, depth: number, material: THREE.LineBasicMaterial): WireframeCuboid {
        return new WireframeCuboid(width, height, depth, material)
    }
}