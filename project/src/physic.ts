import * as THREE from "three";

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface Box3 {
    min: Vector3;
    max: Vector3;
}

export class Collision {
    public static PointInsideBounds(position: THREE.Vector3, bounds: THREE.Box3): boolean;
    public static PointInsideBounds(position: Vector3, bounds: Box3): boolean {
        return (
            position.x > bounds.min.x && position.x < bounds.max.x &&
            position.y > bounds.min.y && position.y < bounds.max.y &&
            position.z > bounds.min.z && position.z < bounds.max.z
        );
    }
}