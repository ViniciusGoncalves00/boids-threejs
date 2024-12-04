import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";

export class Boid
{
    public Mesh : THREE.Mesh;

    public constructor(mesh : THREE.Mesh)
    {
        this.Mesh = mesh;

        this.Update()
    }

    public Update = () => {
        requestAnimationFrame(this.Update);
    
        this.Move(new THREE.Vector3(0, 1, 0), 0.01);
    
        const sceneManager = SceneManager.GetInstance();
        sceneManager.Renderer.render(sceneManager.Scene, sceneManager.Camera);
    };

    private Move(direction : THREE.Vector3, distance : number)
    {
        direction.normalize()
        const offset = direction.multiplyScalar(distance)
        this.Mesh.position.add(offset)
    }
}