import * as THREE from "three";
import { SceneManager } from "./scene-manager";
import { Domain } from "./domain";

export class Boid
{
    public Mesh : THREE.Mesh;
    private _domain : Domain;

    public constructor(mesh : THREE.Mesh)
    {
        this.Mesh = mesh;
        this._domain = Domain.GetInstance()

        this.Update()
    }

    public Update = () => {
        this.Move(1);
    };

    private Move(distance : number)
    {
        const direction = new THREE.Vector3();
        this.Mesh.getWorldDirection(direction);
    
        const offset = direction.multiplyScalar(distance);
    
        const position = this.Mesh.position;
        position.add(offset);

        const limits = this._domain.GetLimits();
    
        if (position.x < limits.min[0]) {
            
            position.x = limits.max[0];
        } else if (position.x > limits.max[0]) {
            position.x = limits.min[0];
        }
    
        if (position.y < limits.min[1]) {
            position.y = limits.max[1];
        } else if (position.y > limits.max[1]) {
            position.y = limits.min[1];
        }
    
        if (position.z < limits.min[2]) {
            position.z = limits.max[2];
        } else if (position.z > limits.max[2]) {
            position.z = limits.min[2];
        }
    }
}