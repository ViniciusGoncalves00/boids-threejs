import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";
import { Domain } from "./domain";

export class Boid
{
    public Mesh : THREE.Mesh;
    private _domain : Domain;
    private _sceneManager : SceneManager;

    public constructor(mesh : THREE.Mesh)
    {
        this.Mesh = mesh;
        this._domain = Domain.GetInstance()
        this._sceneManager = SceneManager.GetInstance()

        this.Update()
    }

    public Update = () => {
        requestAnimationFrame(this.Update);
    
        this.Move(new THREE.Vector3(0, 1, 0), 0.01);

        this._sceneManager.Renderer.render(this._sceneManager.Scene, this._sceneManager.Camera);
    };

    private Move(direction : THREE.Vector3, distance : number)
    {
        direction.normalize()
        const offset = direction.multiplyScalar(distance)
        const position = this.Mesh.position;
        const targetPosition = position.add(offset)

        if(targetPosition.x < this._domain.MinX)
        {
            offset.x += this._domain.MaxX * 2
        }
        else if(targetPosition.x > this._domain.MaxX)
        {
            offset.x -= this._domain.MaxX * 2
        }
        else if(targetPosition.y < this._domain.MinY)
        {
            offset.y += this._domain.MaxY * 2
        }
        else if(targetPosition.y > this._domain.MaxY)
        {
            offset.y -= this._domain.MaxY * 2
        }
        else if(targetPosition.z < this._domain.MinZ)
        {
            offset.z -= this._domain.MaxZ * 2
        }
        else if(targetPosition.z > this._domain.MaxZ)
        {
            offset.z -= this._domain.MaxZ * 2
        }

        this.Mesh.position.add(offset)
    }
}