import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";

export class Domain
{
    public constructor()
    {
        const nodeSize : number = 5;
        const domainSizeX : number = 10;
        const domainSizeY : number = 5;
        const domainSizeZ : number = 10;
        
        const geometry = new THREE.BoxGeometry( nodeSize, nodeSize, nodeSize );
        const edges = new THREE.EdgesGeometry( geometry ); 
        const sceneManager = SceneManager.GetInstance();
        for (let x = -domainSizeX/2; x < domainSizeX/2; x++)
        {
            for (let y = 0; y < domainSizeY; y++)
            {
                for (let z = -domainSizeZ/2; z < domainSizeZ/2; z++)
                {
                    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
                    line.position.x = x * nodeSize;
                    line.position.y = y * nodeSize + nodeSize / 2;
                    line.position.z = z * nodeSize;
                    sceneManager.Scene.add( line );
                }
            }
        }

    }
}