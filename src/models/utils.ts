import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";

export function resizeRenderer(renderer: THREE.WebGLRenderer, camera: THREE.Camera): void {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();
  }

export class Grid
{
  private _grid : THREE.GridHelper;

  public constructor()
  {
    const size = 10;
    const divisions = 10;
    this._grid = new THREE.GridHelper( size, divisions );
    SceneManager.GetInstance().Scene.add( this._grid );
  }
}