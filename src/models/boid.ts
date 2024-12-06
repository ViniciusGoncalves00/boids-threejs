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
    
        this.Move(new THREE.Vector3(0, 1, 0), 0.5);

        this._sceneManager.Renderer.render(this._sceneManager.Scene, this._sceneManager.Camera);
    };

    private Move(direction : THREE.Vector3, distance : number)
    {
        direction.normalize();
        const offset = direction.multiplyScalar(distance);
        const position = this.Mesh.position;
    
        position.add(offset);
    
        if (position.x < this._domain.MinX) {
            position.x += this._domain.MaxX - this._domain.MinX;
        } else if (position.x > this._domain.MaxX) {
            position.x -= this._domain.MaxX - this._domain.MinX;
        }
    
        if (position.y < this._domain.MinY) {
            position.y += this._domain.MaxY - this._domain.MinY;
        } else if (position.y > this._domain.MaxY) {
            position.y -= this._domain.MaxY - this._domain.MinY;
        }
    
        if (position.z < this._domain.MinZ) {
            position.z += this._domain.MaxZ - this._domain.MinZ;
        } else if (position.z > this._domain.MaxZ) {
            position.z -= this._domain.MaxZ - this._domain.MinZ;
        }
    
    }
}