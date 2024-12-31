import * as THREE from "three";
import { SceneManager } from "./scene-manager";
import { Domain } from "./domain";

export class Boid
{
    public Mesh : THREE.Mesh;
    public ViewRadius : number = 10
    public Speed : number = 1
    public AngularSpeed : number = 2

    private _domain : Domain;

    public constructor(mesh : THREE.Mesh)
    {
        this.Mesh = mesh;
        this._domain = Domain.GetInstance()

        this.Update()
    }

    public Update = () => {
        this.Move(this.Speed);
    };

    public ShowGizmos() {
    }

    private Move(distance: number) {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
    
        const forwardOffset = forward.multiplyScalar(distance);
        const position = this.Mesh.position.clone().add(forwardOffset);

        const forwardCollision = forward.multiplyScalar(this.ViewRadius);
        forwardCollision.add(position)
    
        const limits = this._domain.GetLimits();
    
        // Corrigir posição e rotação para cada eixo separadamente
        if (forwardCollision.x < limits.min[0] || forwardCollision.x > limits.max[0]) {
            const correction = forwardCollision.x < limits.min[0] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.x = THREE.MathUtils.clamp(position.x, limits.min[0], limits.max[0]);
        }
    
        if (forwardCollision.y < limits.min[1] || forwardCollision.y > limits.max[1]) {
            const correction = forwardCollision.y < limits.min[1] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.y = THREE.MathUtils.clamp(position.y, limits.min[1], limits.max[1]);
        }
    
        if (forwardCollision.z < limits.min[2] || forwardCollision.z > limits.max[2]) {
            const correction = forwardCollision.z < limits.min[2] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.z = THREE.MathUtils.clamp(position.z, limits.min[2], limits.max[2]);
        }
    
        // Atualiza a posição do boid após todas as correções
        this.Mesh.position.copy(position);
    }
    
}