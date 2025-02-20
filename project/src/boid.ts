import * as THREE from "three";
import { Collision } from "./physic";
import { SceneManager } from "./managers/scene-manager";
import { BoidsManager } from "./managers/boids-manager";

export class Boid implements IUpdatable, IGizmos
{
    private _sceneManager : SceneManager;
    private _boidsManager : BoidsManager;

    public Mesh : THREE.Mesh;
    public ViewDistance : number = 100;
    public Speed : number = 1.2;
    public AngularSpeed : number = 0.1;

    private _limits : { min: [number, number, number], max: [number, number, number]};
    private _directions = [
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, -1, 0),
        new THREE.Vector3(-1, 0, 0),
        new THREE.Vector3(1, 1, 1).normalize(),
        new THREE.Vector3(1, -1, 1).normalize(),
        new THREE.Vector3(-1, 1, 1).normalize(),
        new THREE.Vector3(-1, -1, 1).normalize(),
    ]

    private _isGizmosVisible: boolean = false;

    public constructor(sceneManager: SceneManager, boidsManager: BoidsManager, mesh: THREE.Mesh, limits: { min: [number, number, number], max: [number, number, number]})
    {
        this._sceneManager = sceneManager;
        this._boidsManager = boidsManager;

        this.Mesh = mesh;
        this._limits = limits;

        if(this._isGizmosVisible) {
            this.ShowGizmos();
        }
        this.Update()
    }

    public SetGizmosVisibility(visible: boolean): void {
        this._isGizmosVisible = visible;
    }

    public ShowGizmos(): void {
        const material = new THREE.LineBasicMaterial({ color: 0xaffaaff });

        this._directions.forEach(direction => {
        const geometry = new THREE.BufferGeometry();
        const start = new THREE.Vector3(0, 0, 0);
        const end = direction.clone().multiplyScalar(this.ViewDistance);

        geometry.setFromPoints([start, end]);

        const line = new THREE.Line(geometry, material);
        this.Mesh.add(line);
    })
    }

    public Update(): void {
        let isColliding =
        this.Mesh.position.x < this._limits.min[0] || this.Mesh.position.x > this._limits.max[0] ||
        this.Mesh.position.y < this._limits.min[1] || this.Mesh.position.y > this._limits.max[1] ||
        this.Mesh.position.z < this._limits.min[2] || this.Mesh.position.z > this._limits.max[2];

        if(isColliding) {
            if(this._boidsManager.GetDeath()) {
                this.Destroy();
            }
        }

        const boxes: THREE.Box3[] = this._sceneManager.BOXES.map(object => new THREE.Box3().setFromObject(object));

        for (const box of boxes) {
            if (Collision.PointInsideBounds(this.Mesh.position, box)) {
                isColliding = true;
                break;
            }
        }

        if(isColliding) {
            if(this._boidsManager.GetDeath()) {
                this.Destroy();
            }
        }

        this.Move(this.Speed);
    }

    public Destroy(): void {
        this._sceneManager.RemoveCreature(this)
    }
    
    private Move(distance: number): void {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
        
        let direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        let needToAvoid: boolean = false;

        if(this._boidsManager.GetAvoidance()) {
            const boxes: THREE.Box3[] = this._sceneManager.BOXES.map(object => new THREE.Box3().setFromObject(object));
            needToAvoid = this.TryAvoidForwardCollision(this.Mesh, this.ViewDistance, boxes, this._limits);

            if (needToAvoid) {
                direction = this.TryAvoidCollision(this.Mesh, this._directions, this.ViewDistance, boxes, this._limits);
            } else {
                direction = this.Avoid();
            }
        }
        
        if(this._boidsManager.GetAlignment() && !needToAvoid) {
            direction = this.Align();
        }
        
        // else if(this._boidsManager.GetCohesion()) {
            //     direction = this.TryAvoidCollision(this.Mesh, this._directions, this.ViewDistance, this._sceneManager.BOXES, this._limits);
            // }
            
        if(direction != new THREE.Vector3(0, 0, 0)) {
            this.Rotate(this.Mesh, direction, this.AngularSpeed); 
        }

        this.Mesh.translateZ(distance);
    }

    private Rotate(mesh: THREE.Mesh, targetDirection: THREE.Vector3, rotationSpeed: number): void {
        const currentDirection = new THREE.Vector3();
        mesh.getWorldDirection(currentDirection);
    
        currentDirection.normalize();
        targetDirection.normalize();
 
        if (currentDirection.angleTo(targetDirection) < 0.01) return;
    
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(currentDirection, targetDirection);
    
        mesh.quaternion.slerp(targetQuaternion.multiply(mesh.quaternion), rotationSpeed);
    }

    private TryAvoidForwardCollision(
        mesh: THREE.Mesh,
        viewDistance: number,
        boxes: THREE.Box3[],
        limits: { min: [number, number, number], max: [number, number, number] },
        collisionRadius: number = 3,
    ): boolean {
        const forward = new THREE.Vector3();
        mesh.getWorldDirection(forward).normalize();

        const forwardPosition = mesh.position.clone().add(forward.clone().multiplyScalar(viewDistance));
        
        const detectionSphere = new THREE.Sphere(forwardPosition, collisionRadius);
    
        let isForwardColliding =
            forwardPosition.x - collisionRadius < limits.min[0] || forwardPosition.x + collisionRadius > limits.max[0] ||
            forwardPosition.y - collisionRadius < limits.min[1] || forwardPosition.y + collisionRadius > limits.max[1] ||
            forwardPosition.z - collisionRadius < limits.min[2] || forwardPosition.z + collisionRadius > limits.max[2];
    
        if (!isForwardColliding) {
            isForwardColliding = boxes.some(box => detectionSphere.intersectsBox(box));
        }
    
        return isForwardColliding;
    }
    
    
    private TryAvoidCollision(
        mesh: THREE.Mesh,
        directions: THREE.Vector3[],
        viewDistance: number,
        boxes: THREE.Box3[],
        limits: { min: [number, number, number], max: [number, number, number] }
    ): THREE.Vector3 {
        let bestDirection = new THREE.Vector3();
        let maxDistance = -Infinity;
    
        const localDirections = directions
            .map(dir => dir.clone().applyQuaternion(mesh.quaternion).normalize())
            .sort(() => Math.random() - 0.5);
    
        for (const direction of localDirections) {
            const checkPosition = mesh.position.clone().addScaledVector(direction, viewDistance);
            
            if (!this.IsColliding(checkPosition, boxes, limits)) {
                return direction;
            }
    
            const distance = mesh.position.distanceTo(checkPosition);
            if (distance > maxDistance) {
                maxDistance = distance;
                bestDirection.copy(direction);
            }
        }
    
        return bestDirection;
    }

    private IsColliding(position: THREE.Vector3, boxes: THREE.Box3[], limits: { min: [number, number, number], max: [number, number, number] }): boolean {
        return (
            position.x < limits.min[0] || position.x > limits.max[0] ||
            position.y < limits.min[1] || position.y > limits.max[1] ||
            position.z < limits.min[2] || position.z > limits.max[2] ||
            boxes.some(box => Collision.PointInsideBounds(position, box))
        );
    }
    
    private Align(alignmentRadius: number = 30): THREE.Vector3 {
        const creatures = this._sceneManager.GetPopulation();
        let totalDirection = new THREE.Vector3(0, 0, 0);
        let count = 0;
    
        creatures.forEach(creature => {
            if (creature !== this) {
                const distance = this.Mesh.position.distanceTo(creature.Mesh.position);
    
                if (distance < alignmentRadius) {
                    const creatureDirection = new THREE.Vector3();
                    creature.Mesh.getWorldDirection(creatureDirection);
                    totalDirection.add(creatureDirection);
                    count++;
                }
            }
        });
    
        if (count > 0) {
            totalDirection.divideScalar(count);
            totalDirection.normalize();
        } else {
            totalDirection.set(0, 0, 0);
        }
    
        return totalDirection;
    }

    private Avoid(): THREE.Vector3 {
        const creatures = this._sceneManager.GetPopulation();
        const separationDistance = 20;
        let totalAvoidance = new THREE.Vector3(0, 0, 0);
        let count = 0;
    
        creatures.forEach(creature => {
            if (creature !== this) {
                const distance = this.Mesh.position.distanceTo(creature.Mesh.position);
                if (distance < separationDistance && distance > 0) {
                    const fleeDirection = new THREE.Vector3().subVectors(this.Mesh.position, creature.Mesh.position);
                    fleeDirection.divideScalar(distance);
                    totalAvoidance.add(fleeDirection);
                    count++;
                }
            }
        });
    
        if (count > 0) {
            totalAvoidance.divideScalar(count);
            totalAvoidance.normalize();
        }
    
        return totalAvoidance;
    }
    
}