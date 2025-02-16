import * as THREE from "three";

export class Collision {
    public static PointInsideBounds(position: THREE.Vector3, bounds: THREE.Box3): boolean {
        if (position.x > bounds.min.x && position.x < bounds.max.x &&
            position.y > bounds.min.y && position.y < bounds.max.y &&
            position.z > bounds.min.z && position.z < bounds.max.z) 
        {
            return true;
        }
        return false;
    }

    public static PointIntersectionBox(pointA: THREE.Vector3, pointB: THREE.Vector3, bounds: THREE.Box3): THREE.Vector3 {
        return new THREE.Vector3(0, 0, 0)
    }
}