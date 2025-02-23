import * as THREE from "three";
import { DomainController } from "./domain-controller";
import { SceneManager } from "../managers/scene-manager";

export class SpawnerController
{
    private _sceneManager : SceneManager;
    private _partitionSystem : IPartitionSystem;

    private _partitionsX : number = 1;
    private _partitionsY : number = 1;
    private _partitionsZ : number = 1;

    private _nodes: Map<[number, number, number], THREE.Object3D[]> = new Map<[number, number, number], THREE.Object3D[]>;
    private _nodeWidth: number = 0;
    private _nodeHeight: number = 0;
    private _nodeDepth: number = 0;
    private _nodesView: (THREE.Object3D | null)[][][] = [];

    public constructor(sceneManager: SceneManager, partitionSystem: IPartitionSystem)
    {
        this._sceneManager = sceneManager;
        this._partitionSystem = partitionSystem;
    }

    private GenerateNodes(amountX: number, amountY: number, amountZ: number): void {
        this._nodes.forEach(node => {
            node.forEach(object => {
                if (node instanceof THREE.Object3D)
                    {
                        this._sceneManager.RemoveObject(object)
                    }
            })
        })

        this._nodes = new Map<[number, number, number], THREE.Object3D[]>;

        for (let x = 0; x < amountX; x++) {
            for (let y = 0; y < amountY; y++) {
                for (let z = 0; z < amountZ; z++) {
                    this._nodes.set([x,y,z], [])
                }                
            }            
        }
    }

    private UpdateVisualization(bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}}, size: {x: number, y: number, z: number}, center: {x: number, y: number, z: number}): void {
        this._nodeWidth = size.x / this._partitionsX;
        this._nodeHeight = size.y / this._partitionsY;
        this._nodeDepth = size.z / this._partitionsZ;

        const geometry = new THREE.BoxGeometry(this._nodeWidth, this._nodeHeight, this._nodeDepth);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const partitionCenterX = this._partitionsX / 2
        const partitionCenterY = this._partitionsY / 2
        const partitionCenterZ = this._partitionsZ / 2
        
        const nodeCenterX = this._nodeWidth / 2
        const nodeCenterY = this._nodeHeight / 2
        const nodeCenterZ = this._nodeDepth / 2

        const dx = nodeCenterX + center.x;
        const dy = nodeCenterY + center.y;
        const dz = nodeCenterZ + center.z;

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = (x - partitionCenterX) * this._nodeWidth + dx;
                    line.position.y = (y - partitionCenterY) * this._nodeHeight + dy;
                    line.position.z = (z - partitionCenterZ) * this._nodeDepth + dz;
                    
                    this._sceneManager.AddObject(line);
                    this._nodesView[x][y][z] = line;
                }
            }
        }
    }
}