import * as THREE from "three";
import { Collision } from "./physic";
import { SceneManager } from "./managers/scene-manager";

export class Boid implements IUpdatable, IGizmos
{
    private _sceneManager : SceneManager;
    public Mesh : THREE.Mesh;
    public ViewDistance : number = 50;
    public Speed : number = 1.2;
    public AngularSpeed : number = 0.05;

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

    public Avoidance: boolean = true;
    public Alignment: boolean = true;
    public Cohesion: boolean = false;

    private _isGizmosVisible: boolean = true;

    public constructor(sceneManager: SceneManager, mesh: THREE.Mesh, limits: { min: [number, number, number], max: [number, number, number]})
    {
        this._sceneManager = sceneManager;

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
            this.Destroy();
        }

        const boxes: THREE.Box3[] = this._sceneManager.BOXES.map(object => new THREE.Box3().setFromObject(object));

        for (const box of boxes) {
            if (Collision.PointInsideBounds(this.Mesh.position, box)) {
                isColliding = true;
                break;
            }
        }

        if(isColliding) {
            this.Destroy();
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
        let willCollide: boolean = false;

        if(this.Avoidance) {
            const data = this.TryAvoidCollision(this.Mesh, this._directions, this.ViewDistance, this._sceneManager.BOXES, this._limits);
            willCollide = data[0]
            if(willCollide) {
                direction = data[1];
            }
        }
        
        else if(this.Alignment && !willCollide) {
            direction = this.Align();
        }
        
        // else if(this.Cohesion) {
            //     direction = this.TryAvoidCollision(this.Mesh, this._directions, this.ViewDistance, this._sceneManager.BOXES, this._limits);
            // }
            

        this.Rotate(this.Mesh, direction, this.AngularSpeed); 

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
    
    private TryAvoidCollision(
        mesh: THREE.Mesh,
        directions: THREE.Vector3[],
        viewDistance: number,
        objects: THREE.Object3D[],
        limits: { min: [number, number, number], max: [number, number, number] }
    ): [boolean, THREE.Vector3] {
        let thereIsAtLeastOneCollision: boolean = false;
        let bestDirection = new THREE.Vector3();
        let higherDistance = -Infinity;
    
        const forward = new THREE.Vector3();
        mesh.getWorldDirection(forward).normalize();

        const localDirections = directions.map(direction =>
            direction.clone().applyQuaternion(mesh.quaternion).normalize()
        );

        const boxes: THREE.Box3[] = objects.map(object => new THREE.Box3().setFromObject(object));

        const forwardVector = forward.clone().multiplyScalar(viewDistance);
        const forwardPosition = mesh.position.clone().add(forwardVector);
    
        let forwardColliding =
            forwardPosition.x < limits.min[0] || forwardPosition.x > limits.max[0] ||
            forwardPosition.y < limits.min[1] || forwardPosition.y > limits.max[1] ||
            forwardPosition.z < limits.min[2] || forwardPosition.z > limits.max[2];
    
        let willCollide = forwardColliding || boxes.some(box => Collision.PointInsideBounds(forwardPosition, box));
    
        if (!willCollide) {
            return [false, new THREE.Vector3(0, 0, 0)];
        }

        localDirections.forEach(direction => {
            const collisorVector = direction.clone().multiplyScalar(viewDistance);
            const collisorPosition = mesh.position.clone().add(collisorVector);

            let collidingDirection = false;
    
            collidingDirection =
                collisorPosition.x < limits.min[0] || collisorPosition.x > limits.max[0] ||
                collisorPosition.y < limits.min[1] || collisorPosition.y > limits.max[1] ||
                collisorPosition.z < limits.min[2] || collisorPosition.z > limits.max[2];
    
            if (collidingDirection) {
                thereIsAtLeastOneCollision = true;
                const distance = mesh.position.distanceTo(collisorPosition);

                if (distance > higherDistance) {
                    higherDistance = distance;
                    bestDirection = direction;
                }
            }
            else {
                higherDistance = mesh.position.distanceTo(collisorPosition);
                bestDirection = direction;
            }

            for (const box of boxes) {
                if (Collision.PointInsideBounds(collisorPosition, box)) {
                    thereIsAtLeastOneCollision = true;
                    const distance = mesh.position.distanceTo(collisorPosition);
    
                    if (distance > higherDistance) {
                        higherDistance = distance;
                        bestDirection = direction;
                    }
                }
            }
        });

        return [thereIsAtLeastOneCollision, bestDirection];
    }
    
    private Align(): THREE.Vector3 {
        const creatures = this._sceneManager.GetPopulation();
        let totalDirection = new THREE.Vector3(0, 0, 0);
        let count = 0;
    
        creatures.forEach(creature => {
            if (creature !== this) {
                const directionToCreature = new THREE.Vector3().subVectors(creature.Mesh.position, this.Mesh.position);
                totalDirection.add(directionToCreature);
                count++;
            }
        });
    
        if (count > 0) {
            totalDirection.divideScalar(count);
            totalDirection.normalize();
        }
    
        console.log(totalDirection)
        return totalDirection;
    }
}