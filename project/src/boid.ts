import * as THREE from "three";
import { IUpgradeable } from "./interfaces/IUpdate";
import { Collision } from "./physic";
import { SceneManager } from "./managers/scene-manager";

export class Boid implements IUpgradeable
{
    private _sceneManager : SceneManager;
    public Mesh : THREE.Mesh;
    public ViewDistance : number = 100;
    public Speed : number = 1;
    public AngularSpeed : number = 2;

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

    public Update() : void {
        const bestDirection = this.GetBestDirection(this.Mesh.clone(), this._directions, this.ViewDistance, this._sceneManager.GetObjects(), this._limits);
        console.log(bestDirection)
        this.Move(this.Speed);
    }

    private Move(distance: number): void {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
    
        // Clonar posição inicial antes da modificação
        const newPosition = this.Mesh.position.clone().add(forward.clone().multiplyScalar(distance));
    
        // Vetor de colisão independente
        const forwardCollision = newPosition.clone().add(forward.clone().multiplyScalar(this.ViewDistance));
    
        let hitX = false, hitY = false, hitZ = false;
    
        if (forwardCollision.x < this._limits.min[0] || forwardCollision.x > this._limits.max[0]) {
            newPosition.x = THREE.MathUtils.clamp(newPosition.x, this._limits.min[0], this._limits.max[0]);
            hitX = true;
        }
    
        if (forwardCollision.y < this._limits.min[1] || forwardCollision.y > this._limits.max[1]) {
            newPosition.y = THREE.MathUtils.clamp(newPosition.y, this._limits.min[1], this._limits.max[1]);
            hitY = true;
        }
    
        if (forwardCollision.z < this._limits.min[2] || forwardCollision.z > this._limits.max[2]) {
            newPosition.z = THREE.MathUtils.clamp(newPosition.z, this._limits.min[2], this._limits.max[2]);
            hitZ = true;
        }
    
        // Atualiza a posição primeiro
        this.Mesh.position.copy(newPosition);
    
        // Evita ficar preso na quina: empurra levemente para fora
        if (hitX && hitY) newPosition.z += (Math.random() > 0.5 ? 1 : -1) * 0.1;
        if (hitX && hitZ) newPosition.y += (Math.random() > 0.5 ? 1 : -1) * 0.1;
        if (hitY && hitZ) newPosition.x += (Math.random() > 0.5 ? 1 : -1) * 0.1;
    
        // Aplica a rotação apenas quando necessário
        if (hitX || hitY || hitZ) {
            this.Mesh.rotateY(this.AngularSpeed * Math.PI / 180);
        }
    }
    
    private GetBestDirection(mesh: THREE.Mesh, directions: THREE.Vector3[], viewDistance: number, objects: THREE.Object3D[], limits: { min: [number, number, number], max: [number, number, number]}): THREE.Vector3 {
        const boxes: THREE.Box3[] = [];

        objects.forEach(object => {
            boxes.push(new THREE.Box3().setFromObject(object))
        });

        const forward = new THREE.Vector3()
        mesh.getWorldDirection(forward).normalize()
        const forwardVector = new THREE.Vector3()
        forwardVector.copy(forward)
        forwardVector.multiplyScalar(viewDistance)
        const collisorPosition = mesh.position.add(forwardVector);

        boxes.forEach(box => {
            if(!Collision.PointInsideBounds(collisorPosition, box)) {
                return forward;
            }
        });

        let collidingDirections = new Map<THREE.Vector3, number>();

        const rotatedDirections = directions.map(direction =>
            direction.clone().applyQuaternion(mesh.quaternion).normalize()
        );
        
        rotatedDirections.forEach(direction => {
            direction.multiplyScalar(viewDistance)
            const collisorPosition = mesh.position.add(direction);

            for (let index = 0; index < boxes.length; index++) {
                const box = boxes[index];

                if(Collision.PointInsideBounds(collisorPosition, box)) {
                    const currentDirection = collisorPosition.clone().sub(mesh.position).normalize();
                    
                    const pointMin = box.min.clone().sub(mesh.position).divide(currentDirection);
                    const pointMax = box.max.clone().sub(mesh.position).divide(currentDirection);

                    const coeficient = Math.max(
                        Math.min(pointMin.x, pointMax.x),
                        Math.min(pointMin.y, pointMax.y),
                        Math.min(pointMin.z, pointMax.z)
                    );

                    const intersection = mesh.position.clone().add(direction.multiplyScalar(coeficient));
                    const currentDistance = intersection.length()

                    if(collidingDirections.has(collisorPosition)) {
                        const cachedDistance = collidingDirections.get(collisorPosition) as number;

                        if(currentDistance < cachedDistance) {
                            collidingDirections.set(collisorPosition, currentDistance);
                        }
                    }
                    else {
                        collidingDirections.set(collisorPosition, currentDistance);
                    }
                }
            }
        });

        let lowerDistance: number = Infinity;
        let bestDirection: THREE.Vector3 = new THREE.Vector3(Infinity, Infinity, Infinity);

        collidingDirections.forEach((distance, direction) => {
            if(distance < lowerDistance) {
                lowerDistance = distance;
                bestDirection = direction;
            }
        })

        if (lowerDistance === Infinity) {
            return forward;
        }

        return bestDirection;
    }

    // public Update(): void {
    //     this.Move(this.Speed);
    // }
    
    // private Move(distance: number): void {
    //     const forward = new THREE.Vector3();
    //     this.Mesh.getWorldDirection(forward);
        
    //     // Obtém a melhor direção considerando obstáculos e limites
    //     const bestDirection = this.GetBestDirection(this.Mesh, this._directions, this.ViewDistance, this._sceneManager.BOXES, this._limits);
    
    //     if (!bestDirection.equals(forward)) {
    //         // Rotaciona o objeto para a melhor direção
    //         const angle = Math.atan2(bestDirection.x, bestDirection.z);
    //         this.Mesh.rotation.y = angle;
    //     }
    
    //     // Move para frente na direção atual
    //     this.Mesh.translateZ(distance);
    // }
    
    // private GetBestDirection(
    //     mesh: THREE.Mesh,
    //     directions: THREE.Vector3[],
    //     viewDistance: number,
    //     objects: THREE.Object3D[],
    //     limits: { min: [number, number, number], max: [number, number, number] }
    // ): THREE.Vector3 {
    //     const boxes: THREE.Box3[] = objects.map(object => new THREE.Box3().setFromObject(object));
    
    //     const forward = new THREE.Vector3();
    //     mesh.getWorldDirection(forward).normalize();
    
    //     const forwardVector = forward.clone().multiplyScalar(viewDistance);
    //     const collisorPosition = mesh.position.clone().add(forwardVector);
    
    //     // Verifica se a posição está saindo dos limites (TRATADO COMO COLISÃO)
    //     let isOutOfBounds =
    //         collisorPosition.x < limits.min[0] || collisorPosition.x > limits.max[0] ||
    //         collisorPosition.y < limits.min[1] || collisorPosition.y > limits.max[1] ||
    //         collisorPosition.z < limits.min[2] || collisorPosition.z > limits.max[2];
    
    //     if (!isOutOfBounds && !boxes.some(box => Collision.PointInsideBounds(collisorPosition, box))) {
    //         return forward; // Nenhuma colisão detectada, pode continuar reto
    //     }
    
    //     let collidingDirections = new Map<THREE.Vector3, number>();
    
    //     const rotatedDirections = directions.map(direction =>
    //         direction.clone().applyQuaternion(mesh.quaternion).normalize()
    //     );
    
    //     rotatedDirections.forEach(direction => {
    //         const adjustedDirection = direction.clone().multiplyScalar(viewDistance);
    //         const collisorPosition = mesh.position.clone().add(adjustedDirection);
    
    //         let isDirectionOutOfBounds =
    //             collisorPosition.x < limits.min[0] || collisorPosition.x > limits.max[0] ||
    //             collisorPosition.y < limits.min[1] || collisorPosition.y > limits.max[1] ||
    //             collisorPosition.z < limits.min[2] || collisorPosition.z > limits.max[2];
    
    //         if (isDirectionOutOfBounds) {
    //             collidingDirections.set(direction, 0); // Se estiver fora dos limites, adiciona como colisão
    //             return;
    //         }
    
    //         for (const box of boxes) {
    //             if (Collision.PointInsideBounds(collisorPosition, box)) {
    //                 const currentDirection = collisorPosition.clone().sub(mesh.position).normalize();
    
    //                 const pointMin = box.min.clone().sub(mesh.position).divide(currentDirection);
    //                 const pointMax = box.max.clone().sub(mesh.position).divide(currentDirection);
    
    //                 const coeficient = Math.max(
    //                     Math.min(pointMin.x, pointMax.x),
    //                     Math.min(pointMin.y, pointMax.y),
    //                     Math.min(pointMin.z, pointMax.z)
    //                 );
    
    //                 const intersection = mesh.position.clone().add(adjustedDirection.multiplyScalar(coeficient));
    //                 const currentDistance = intersection.length();
    
    //                 if (collidingDirections.has(direction)) {
    //                     const cachedDistance = collidingDirections.get(direction) as number;
    //                     if (currentDistance < cachedDistance) {
    //                         collidingDirections.set(direction, currentDistance);
    //                     }
    //                 } else {
    //                     collidingDirections.set(direction, currentDistance);
    //                 }
    //             }
    //         }
    //     });
    
    //     let lowerDistance: number = Infinity;
    //     let bestDirection: THREE.Vector3 = forward; // Mantém a direção original como fallback
    
    //     collidingDirections.forEach((distance, direction) => {
    //         if (distance < lowerDistance) {
    //             lowerDistance = distance;
    //             bestDirection = direction;
    //         }
    //     });
    
    //     return bestDirection;
    // }
}