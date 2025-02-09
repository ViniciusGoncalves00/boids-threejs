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

    private Move(distance: number) : void {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
    
        const forwardOffset = forward.multiplyScalar(distance);
        const position = this.Mesh.position.clone().add(forwardOffset);

        const forwardCollision = forward.multiplyScalar(this.ViewRadius);
        forwardCollision.add(position)
    
        if (forwardCollision.x < this._limits.min[0] || forwardCollision.x > this._limits.max[0]) {
            const correction = forwardCollision.x < this._limits.min[0] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.x = THREE.MathUtils.clamp(position.x, this._limits.min[0], this._limits.max[0]);
        }
    
        if (forwardCollision.y < this._limits.min[1] || forwardCollision.y > this._limits.max[1]) {
            const correction = forwardCollision.y < this._limits.min[1] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.y = THREE.MathUtils.clamp(position.y, this._limits.min[1], this._limits.max[1]);
        }
    
        if (forwardCollision.z < this._limits.min[2] || forwardCollision.z > this._limits.max[2]) {
            const correction = forwardCollision.z < this._limits.min[2] ? 1 : -1;
            this.Mesh.rotateX(correction * this.AngularSpeed * Math.PI / 180);
            this.Mesh.rotateY(correction * this.AngularSpeed * Math.PI / 180);
            position.z = THREE.MathUtils.clamp(position.z, this._limits.min[2], this._limits.max[2]);
        }
    
        this.Mesh.position.copy(position);
    }
}