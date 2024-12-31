import * as THREE from "three";
import { SceneManager } from "./scene-manager";
import { Domain } from "./domain";

export class Boid
{
    public Mesh : THREE.Mesh;
    public ViewRadius : number = 20
    public Speed : number = 1
    public AngularSpeed : number = 10

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

    private Move(distance : number)
    {
        const forward = new THREE.Vector3();
        this.Mesh.getWorldDirection(forward);
    
        const forwardOffset = forward.multiplyScalar(distance);
    
        const position = this.Mesh.position;
        position.add(forwardOffset);

        const limits = this._domain.GetLimits();

        const forwardCollision = forward.multiplyScalar(this.ViewRadius);
        forwardCollision.add(position)

        if(forwardCollision.x < limits.min[0]) {
            this.Mesh.rotateY(this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateX(this.AngularSpeed * Math.PI / 180)
        }
        else if (forwardCollision.x > limits.max[0]) {
            this.Mesh.rotateY(-this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateX(-this.AngularSpeed * Math.PI / 180)
        }

        if(forwardCollision.y < limits.min[1]) {
            this.Mesh.rotateX(this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateY(this.AngularSpeed * Math.PI / 180)
        }
        else if (forwardCollision.y > limits.max[1]) {
            this.Mesh.rotateX(-this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateY(-this.AngularSpeed * Math.PI / 180)
        }

        if(forwardCollision.z < limits.min[2]) {
            this.Mesh.rotateY(this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateX(this.AngularSpeed * Math.PI / 180)
        }
        else if (forwardCollision.z > limits.max[2]) {
            this.Mesh.rotateY(-this.AngularSpeed * Math.PI / 180)
            this.Mesh.rotateX(-this.AngularSpeed * Math.PI / 180)
        }
    }
}