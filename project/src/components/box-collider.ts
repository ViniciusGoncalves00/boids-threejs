import * as THREE from "three";
import { ColliderComponent } from "./collider-component";

export class BoxCollider extends ColliderComponent {
    public size: THREE.Vector3;
    private boundingBox: THREE.Mesh;
  
    constructor(width: number, height: number, depth: number) {
      super("box");
      this.size = new THREE.Vector3(width, height, depth);
  
      const geometry = new THREE.BoxGeometry(width, height, depth);
      const material = new THREE.MeshBasicMaterial({ wireframe: true, visible: false });
      this.boundingBox = new THREE.Mesh(geometry, material);
    }
  
    public GetBoundingVolume(): THREE.Mesh {
      return this.boundingBox;
    }
  }