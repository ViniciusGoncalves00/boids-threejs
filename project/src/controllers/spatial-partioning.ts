import * as THREE from "three";
import { DomainController } from "./domain-controller";
import { SceneManager } from "../managers/scene-manager";

export class SpawnerController
{
    private _sceneManager : SceneManager;
    private _partitionSystem : IPartitionSystem;
    private _domainController : DomainController;

    private _partitionsX : number = 1;
    private _partitionsY : number = 1;
    private _partitionsZ : number = 1;

    private _nodes: Map<[number, number, number], THREE.Object3D[]> = new Map<[number, number, number], THREE.Object3D[]>;
    private _nodeWidth: number = 0;
    private _nodeHeight: number = 0;
    private _nodeDepth: number = 0;
    private _nodesView: (THREE.Object3D | null)[][][] = [];

    public constructor(sceneManager: SceneManager, domainController: DomainController, partitionSystem: IPartitionSystem)
    {
        this._sceneManager = sceneManager;
        this._domainController = domainController;
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

        this.UpdateVisualization(this._domainController.GetLimits(), this._domainController.GetSize());
    }

    private UpdateVisualization(bounds: {min: {x: number, y: number, z: number}}, boundary_size: {x: number, y: number, z: number}): void {
        this._nodeWidth = boundary_size.x / this._partitionsX;
        this._nodeHeight = boundary_size.y / this._partitionsY;
        this._nodeDepth = boundary_size.z / this._partitionsZ;

        const geometry = new THREE.BoxGeometry(this._nodeWidth, this._nodeHeight, this._nodeDepth);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const halfNodeWidth = this._nodeWidth / 2;
        const halfNodeHeight = this._nodeHeight / 2;
        const halfNodeDepth = this._nodeDepth / 2;

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = bounds.min.x * x + halfNodeWidth;
                    line.position.y = bounds.min.y * y + halfNodeHeight;
                    line.position.z = bounds.min.z * z + halfNodeDepth;
                    
                    this._sceneManager.AddObject(line);
                    this._nodesView[x][y][z] = line;
                }
            }
        }
    }
}