import * as THREE from "three";
import { Collision } from "./physic";
import { SceneManager } from "./managers/scene-manager";

export class Boid implements IUpdatable, IGizmos
{
    private _sceneManager : SceneManager;
    public Mesh : THREE.Mesh;
    public ViewDistance : number = 50;
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
        const boxes: THREE.Box3[] = objects.map(object => new THREE.Box3().setFromObject(object));
    
        const forward = new THREE.Vector3();
        mesh.getWorldDirection(forward).normalize();
    
        const forwardVector = forward.clone().multiplyScalar(viewDistance);
        const collisorPosition = mesh.position.clone().add(forwardVector);
    
        // Verifica se a posição está saindo dos limites (TRATADO COMO COLISÃO)
        let isOutOfBounds =
            collisorPosition.x < limits.min[0] || collisorPosition.x > limits.max[0] ||
            collisorPosition.y < limits.min[1] || collisorPosition.y > limits.max[1] ||
            collisorPosition.z < limits.min[2] || collisorPosition.z > limits.max[2];
    
        let isColliding = isOutOfBounds || boxes.some(box => Collision.PointInsideBounds(collisorPosition, box));
    
        // Se NÃO houver colisão, manter a direção atual
        if (!isColliding) {
            return [false, forward];
        }
    
        // Buscar a melhor direção alternativa se houver colisão
        let bestDirection = forward;
        let maxClearDistance = -Infinity;
    
        const rotatedDirections = directions.map(direction =>
            direction.clone().applyQuaternion(mesh.quaternion).normalize()
        );
    
        rotatedDirections.forEach(direction => {
            const adjustedDirection = direction.clone().multiplyScalar(viewDistance);
            const testPosition = mesh.position.clone().add(adjustedDirection);
    
            let isDirectionOutOfBounds =
                testPosition.x < limits.min[0] || testPosition.x > limits.max[0] ||
                testPosition.y < limits.min[1] || testPosition.y > limits.max[1] ||
                testPosition.z < limits.min[2] || testPosition.z > limits.max[2];
    
            let minDistance = viewDistance; // Define a distância livre inicial
    
            // Se já saiu dos limites, essa direção não é válida
            if (isDirectionOutOfBounds) {
                minDistance = 0;
            } else {
                for (const box of boxes) {
                    if (Collision.PointInsideBounds(testPosition, box)) {
                        const intersection = mesh.position.clone().add(adjustedDirection);
                        const distanceToCollision = intersection.distanceTo(mesh.position);
    
                        minDistance = Math.min(minDistance, distanceToCollision);
                    }
                }
            }
    
            // Se essa direção tem maior espaço livre, ela é a melhor opção
            if (minDistance > maxClearDistance) {
                maxClearDistance = minDistance;
                bestDirection = direction.clone();
            }
        });
    
        return [true, bestDirection];
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