import * as THREE from "three";
import { IUpgradeable } from "./interfaces/IUpdate";
import { Collision } from "./physic";
import { SceneManager } from "./managers/scene-manager";

export class Boid implements IUpgradeable
{
    private _sceneManager : SceneManager;
    public Mesh : THREE.Mesh;
    public ViewDistance : number = 50;
    public Speed : number = 1.2;
    public AngularSpeed : number = 0.05;

    private _limits : { min: [number, number, number], max: [number, number, number]};
    private _directions = [
        new THREE.Vector3(0, 1, 0).normalize(),
        new THREE.Vector3(1, 0, 0).normalize(),
        new THREE.Vector3(0, -1, 0).normalize(),
        new THREE.Vector3(-1, 0, 0).normalize(),
        new THREE.Vector3(1, 1, 1).normalize(),
        new THREE.Vector3(1, -1, 1).normalize(),
        new THREE.Vector3(-1, 1, 1).normalize(),
        new THREE.Vector3(-1, -1, 1).normalize(),
    ]

    public constructor(sceneManager: SceneManager, mesh: THREE.Mesh, limits: { min: [number, number, number], max: [number, number, number]})
    {
        this._sceneManager = sceneManager;

        this.Mesh = mesh;
        this._limits = limits;

        this.Update()
    }

    public ShowGizmos() {
    }

    // public Update() : void {
    //     const bestDirection = this.GetBestDirection(this.Mesh.clone(), this._directions, this.ViewDistance, this._sceneManager.GetObjects(), this._limits);
    //     console.log(bestDirection)
    //     this.Move(this.Speed);
    // }

    // private Move(distance: number): void {
    //     const forward = new THREE.Vector3();
    //     this.Mesh.getWorldDirection(forward);
    
    //     // Clonar posição inicial antes da modificação
    //     const newPosition = this.Mesh.position.clone().add(forward.clone().multiplyScalar(distance));
    
    //     // Vetor de colisão independente
    //     const forwardCollision = newPosition.clone().add(forward.clone().multiplyScalar(this.ViewDistance));
    
    //     let hitX = false, hitY = false, hitZ = false;
    
    //     if (forwardCollision.x < this._limits.min[0] || forwardCollision.x > this._limits.max[0]) {
    //         newPosition.x = THREE.MathUtils.clamp(newPosition.x, this._limits.min[0], this._limits.max[0]);
    //         hitX = true;
    //     }
    
    //     if (forwardCollision.y < this._limits.min[1] || forwardCollision.y > this._limits.max[1]) {
    //         newPosition.y = THREE.MathUtils.clamp(newPosition.y, this._limits.min[1], this._limits.max[1]);
    //         hitY = true;
    //     }
    
    //     if (forwardCollision.z < this._limits.min[2] || forwardCollision.z > this._limits.max[2]) {
    //         newPosition.z = THREE.MathUtils.clamp(newPosition.z, this._limits.min[2], this._limits.max[2]);
    //         hitZ = true;
    //     }
    
    //     // Atualiza a posição primeiro
    //     this.Mesh.position.copy(newPosition);
    
    //     // Evita ficar preso na quina: empurra levemente para fora
    //     if (hitX && hitY) newPosition.z += (Math.random() > 0.5 ? 1 : -1) * 0.1;
    //     if (hitX && hitZ) newPosition.y += (Math.random() > 0.5 ? 1 : -1) * 0.1;
    //     if (hitY && hitZ) newPosition.x += (Math.random() > 0.5 ? 1 : -1) * 0.1;
    
    //     // Aplica a rotação apenas quando necessário
    //     if (hitX || hitY || hitZ) {
    //         this.Mesh.rotateY(this.AngularSpeed * Math.PI / 180);
    //     }
    // }
    
    // private GetBestDirection(mesh: THREE.Mesh, directions: THREE.Vector3[], viewDistance: number, objects: THREE.Object3D[], limits: { min: [number, number, number], max: [number, number, number]}): THREE.Vector3 {
    //     const boxes: THREE.Box3[] = [];

    //     objects.forEach(object => {
    //         boxes.push(new THREE.Box3().setFromObject(object))
    //     });

    //     const forward = new THREE.Vector3()
    //     mesh.getWorldDirection(forward).normalize()
    //     const forwardVector = new THREE.Vector3()
    //     forwardVector.copy(forward)
    //     forwardVector.multiplyScalar(viewDistance)
    //     const collisorPosition = mesh.position.add(forwardVector);

    //     boxes.forEach(box => {
    //         if(!Collision.PointInsideBounds(collisorPosition, box)) {
    //             return forward;
    //         }
    //     });

    //     let collidingDirections = new Map<THREE.Vector3, number>();

    //     const rotatedDirections = directions.map(direction =>
    //         direction.clone().applyQuaternion(mesh.quaternion).normalize()
    //     );
        
    //     rotatedDirections.forEach(direction => {
    //         direction.multiplyScalar(viewDistance)
    //         const collisorPosition = mesh.position.add(direction);

    //         for (let index = 0; index < boxes.length; index++) {
    //             const box = boxes[index];

    //             if(Collision.PointInsideBounds(collisorPosition, box)) {
    //                 const currentDirection = collisorPosition.clone().sub(mesh.position).normalize();
                    
    //                 const pointMin = box.min.clone().sub(mesh.position).divide(currentDirection);
    //                 const pointMax = box.max.clone().sub(mesh.position).divide(currentDirection);

    //                 const coeficient = Math.max(
    //                     Math.min(pointMin.x, pointMax.x),
    //                     Math.min(pointMin.y, pointMax.y),
    //                     Math.min(pointMin.z, pointMax.z)
    //                 );

    //                 const intersection = mesh.position.clone().add(direction.multiplyScalar(coeficient));
    //                 const currentDistance = intersection.length()

    //                 if(collidingDirections.has(collisorPosition)) {
    //                     const cachedDistance = collidingDirections.get(collisorPosition) as number;

    //                     if(currentDistance < cachedDistance) {
    //                         collidingDirections.set(collisorPosition, currentDistance);
    //                     }
    //                 }
    //                 else {
    //                     collidingDirections.set(collisorPosition, currentDistance);
    //                 }
    //             }
    //         }
    //     });

    //     let lowerDistance: number = 99;
    //     let bestDirection: THREE.Vector3 = new THREE.Vector3(99, 99, 99);

    //     collidingDirections.forEach((distance, direction) => {
    //         if(distance < lowerDistance) {
    //             lowerDistance = distance;
    //             bestDirection = direction;
    //         }
    //     })

    //     if (lowerDistance === Infinity) {
    //         return forward;
    //     }

    //     return bestDirection;
    // }

    public Update(): void {
        let isDirectionOutOfBounds =
        this.Mesh.position.x < this._limits.min[0] || this.Mesh.position.x > this._limits.max[0] ||
        this.Mesh.position.y < this._limits.min[1] || this.Mesh.position.y > this._limits.max[1] ||
        this.Mesh.position.z < this._limits.min[2] || this.Mesh.position.z > this._limits.max[2];

        const boxes: THREE.Box3[] = this._sceneManager.BOXES.map(object => new THREE.Box3().setFromObject(object));

        for (const box of boxes) {
            if (Collision.PointInsideBounds(this.Mesh.position, box)) {
                isDirectionOutOfBounds = true;
                break;
            }
        }

        if(isDirectionOutOfBounds) {
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
        
        const bestDirection = this.GetBestDirection(this.Mesh, this._directions, this.ViewDistance, this._sceneManager.BOXES, this._limits);

        this.UpdateRotation(this.Mesh, bestDirection, this.AngularSpeed); 

        this.Mesh.translateZ(distance);
    }

    private UpdateRotation(mesh: THREE.Mesh, targetDirection: THREE.Vector3, rotationSpeed: number): void {
        const currentDirection = new THREE.Vector3();
        mesh.getWorldDirection(currentDirection);
    
        currentDirection.normalize();
        targetDirection.normalize();
    
        // Verifica se já está alinhado
        if (currentDirection.angleTo(targetDirection) < 0.01) return;
    
        // Criar um quaternion que rotaciona suavemente na direção desejada
        const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(currentDirection, targetDirection);
    
        // Aplicar uma rotação suave usando slerp()
        mesh.quaternion.slerp(targetQuaternion.multiply(mesh.quaternion), rotationSpeed);
    }
    
    private GetBestDirection(
        mesh: THREE.Mesh,
        directions: THREE.Vector3[],
        viewDistance: number,
        objects: THREE.Object3D[],
        limits: { min: [number, number, number], max: [number, number, number] }
    ): THREE.Vector3 {
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
            return forward;
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
    
        return bestDirection;
    }
    
    
}