import * as THREE from "three";
import { Entity } from "./entity";
import { Collision } from "../physics/physic";
import { SceneManager } from "../managers/scene-manager";
import { BoidsManager } from "../managers/boids-manager";
import { SpatialPartitioningController } from "../controllers/spatial-partitioning-controller";
import { RendererComponent } from "../components/renderer-component";

export class Boid extends Entity implements IUpdatable, IGizmos
{
    private _sceneManager : SceneManager;
    private _boidsManager : BoidsManager;
    private _spatialPartitioningController : SpatialPartitioningController;

    public Mesh : THREE.Mesh;

    private _bounds : {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}};
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

    public constructor(sceneManager: SceneManager, boidsManager: BoidsManager, spatialPartitioningController: SpatialPartitioningController, mesh: THREE.Mesh, bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}})
    {
        super();
        this._sceneManager = sceneManager;
        this._boidsManager = boidsManager;
        this._spatialPartitioningController = spatialPartitioningController;

        this.Mesh = mesh;
        this._bounds = bounds;

        this.AddComponent(new RendererComponent(this));

        const rendererComponent = this.GetComponent("RendererComponent") as RendererComponent;
        rendererComponent.Mesh = mesh;
        this._object3D.add(mesh);
        
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
        const end = direction.clone().multiplyScalar(this._boidsManager.GetViewDistance());

        geometry.setFromPoints([start, end]);

        const line = new THREE.Line(geometry, material);
        this.Mesh.add(line);
    })
    }

    public Update(): void {
        let isColliding =
        this.Mesh.position.x < this._bounds.min.x || this.Mesh.position.x > this._bounds.max.x ||
        this.Mesh.position.y < this._bounds.min.y || this.Mesh.position.y > this._bounds.max.y ||
        this.Mesh.position.z < this._bounds.min.z || this.Mesh.position.z > this._bounds.max.z;

        if(isColliding) {
            if(this._boidsManager.GetDeath()) {
                this.Destroy();
            }
        }

        const boxes: THREE.Box3[] = this._sceneManager.Colliders.map(entity => new THREE.Box3().setFromObject(entity.Object3D));
        // const boxes: THREE.Box3[] = this._spatialPartitioningController.GetCloseObjects(this.Mesh.position).map(object => new THREE.Box3().setFromObject((object as THREE.Geometry).Mesh));

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

        this.Move(this._boidsManager.GetSpeed());
    }

    public Destroy(): void {
        this._sceneManager.RemoveObject(this)
    }
    
    private Move(distance: number): void {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
        
        let direction: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
        let needToAvoid: boolean = false;

        if(this._boidsManager.GetAvoidance()) {
            const boxes: THREE.Box3[] = this._sceneManager.Colliders.map(entity => new THREE.Box3().setFromObject(entity.Object3D));
            needToAvoid = this.TryAvoidForwardCollision(this.Mesh, this._boidsManager.GetViewDistance(), boxes, this._bounds);

            if (needToAvoid) {
                direction.add(this.TryAvoidCollision(this.Mesh, this._directions, this._boidsManager.GetViewDistance(), boxes, this._bounds)) 
            } else {
                direction.add(this.Avoid())
            }
        }
        
        if(this._boidsManager.GetAlignment()) {
            direction.add(this.Align(this._boidsManager.GetAlignmentRadius()));
        }
        
        if(this._boidsManager.GetCohesion()) {
            direction.add(this.Cohesion(this._boidsManager.GetCohesionRadius()));
        }
            
        if(direction != new THREE.Vector3(0, 0, 0)) {
            direction.normalize();
            this.Rotate(this.Mesh, direction, this._boidsManager.GetRotationSpeed()); 
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
        bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}},
        collisionRadius: number = 3,
    ): boolean {
        const forward = new THREE.Vector3();
        mesh.getWorldDirection(forward).normalize();

        const forwardPosition = mesh.position.clone().add(forward.clone().multiplyScalar(viewDistance));
        
        const detectionSphere = new THREE.Sphere(forwardPosition, collisionRadius);
    
        let isForwardColliding =
            forwardPosition.x - collisionRadius < bounds.min.x || forwardPosition.x + collisionRadius > bounds.max.x ||
            forwardPosition.y - collisionRadius < bounds.min.y || forwardPosition.y + collisionRadius > bounds.max.y ||
            forwardPosition.z - collisionRadius < bounds.min.z || forwardPosition.z + collisionRadius > bounds.max.z ;
    
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
        bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}}
    ): THREE.Vector3 {
        let bestDirection = new THREE.Vector3();
        let maxDistance = -Infinity;
    
        const localDirections = directions
            .map(dir => dir.clone().applyQuaternion(mesh.quaternion).normalize())
            .sort(() => Math.random() - 0.5);
    
        for (const direction of localDirections) {
            const checkPosition = mesh.position.clone().addScaledVector(direction, viewDistance);
            
            if (!this.IsColliding(checkPosition, boxes, bounds)) {
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

    private IsColliding(position: THREE.Vector3, boxes: THREE.Box3[], bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}}): boolean {
        return (
            position.x < bounds.min.x || position.x > bounds.max.x ||
            position.y < bounds.min.y || position.y > bounds.max.y ||
            position.z < bounds.min.z || position.z > bounds.max.z ||
            boxes.some(box => Collision.PointInsideBounds(position, box))
        );
    }
    
    private Align(alignmentRadius: number): THREE.Vector3 {
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
        const separationDistance = this._boidsManager.GetSeparationDistance();
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
    
    private Cohesion(cohesionRadius: number): THREE.Vector3 {
        const creatures = this._sceneManager.GetPopulation();
        let sumPositions = new THREE.Vector3(0, 0, 0);
        let count = 0;
    
        creatures.forEach(creature => {
            if (creature !== this) {
                const distance = this.Mesh.position.distanceTo(creature.Mesh.position);
                
                if (distance < cohesionRadius) {
                    sumPositions.add(creature.Mesh.position);
                    count++;
                }
            }
        });
    
        if (count > 0) {
            sumPositions.divideScalar(count);
    
            const cohesionVector = new THREE.Vector3().subVectors(sumPositions, this.Mesh.position);
            cohesionVector.normalize();
    
            return cohesionVector;
        } else {
            return new THREE.Vector3(0, 0, 0);
        }
    }
    
}