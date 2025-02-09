import * as THREE from "three";
import { IUpgradeable } from "./interfaces/IUpdate";

export class Boid implements IUpgradeable
{
    public Mesh : THREE.Mesh;
    public ViewRadius : number = 10;
    public Speed : number = 1;
    public AngularSpeed : number = 2;

    private _limits : { min: [number, number, number], max: [number, number, number]};

    public constructor(mesh: THREE.Mesh, limits: { min: [number, number, number], max: [number, number, number]})
    {
        this.Mesh = mesh;
        this._limits = limits;

        this.Update()
    }

    public Update() : void {
        this.Move(this.Speed);
    }

    public ShowGizmos() {
    }

    private Move(distance: number): void {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
    
        // Clonar posição inicial antes da modificação
        const newPosition = this.Mesh.position.clone().add(forward.clone().multiplyScalar(distance));
    
        // Vetor de colisão independente
        const forwardCollision = newPosition.clone().add(forward.clone().multiplyScalar(this.ViewRadius));
    
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
    
    
    
}