import * as THREE from "three";
import { DomainController } from "./domain-controller";
import { SceneManager } from "../managers/scene-manager";

export class SpatialPartioningController implements IVisible, IColorful
{
    private _sceneManager : SceneManager;
    private _domainController : DomainController;

    private _partitionsX : number = 1;
    private _partitionsY : number = 1;
    private _partitionsZ : number = 1;

    private _nodes: Map<[number, number, number], THREE.Object3D[]> = new Map<[number, number, number], THREE.Object3D[]>;
    private _nodeWidth: number = 0;
    private _nodeHeight: number = 0;
    private _nodeDepth: number = 0;
    private _nodesView: (THREE.LineSegments | null)[][][] = [];

    public constructor(sceneManager: SceneManager, domainController: DomainController)
    {
        this._sceneManager = sceneManager;
        this._domainController = domainController;
    }

    public SetColor(r: number, g: number, b: number): void {
        const color = new THREE.Color(r, g, b);
        const material = new THREE.LineBasicMaterial({ color: color });

        if (this._nodesView !== null) {
            for (let x = 0; x < this._partitionsX; x++)
                {
                    for (let y = 0; y < this._partitionsY; y++)
                    {
                        for (let z = 0; z < this._partitionsZ; z++)
                        {
                            const node = this._nodesView[x][y][z];
                            if(node !== null) {
                                node.material = material;
                            }
                        }
                    }
                }
        }
    }

    public GetColor(): string {
        const default_color = `#ffffff`;
        if (!this._nodesView || !this._nodesView[0][0][0] || !this._nodesView[0][0][0].material) {
            return default_color;
        }
        const material = this._nodesView[0][0][0].material as THREE.LineBasicMaterial;
        return `#${material.color.getHexString()}`;
    }

    public ToggleVisibility(): void {
        if (this._nodesView !== null) {
            for (let x = 0; x < this._partitionsX; x++)
                {
                    for (let y = 0; y < this._partitionsY; y++)
                    {
                        for (let z = 0; z < this._partitionsZ; z++)
                        {
                            const node = this._nodesView[x][y][z];
                            if(node !== null) {
                                node.visible = !node.visible;
                            }
                        }
                    }
                }
        }
    }

    public SetDivisions(x? : number, y? : number, z? : number)
    {
        this._partitionsX = x == undefined ? this._partitionsX : x;
        this._partitionsY = y == undefined ? this._partitionsY : y;
        this._partitionsZ = z == undefined ? this._partitionsZ : z;

        this.Update()
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return { x: this._partitionsX, y: this._partitionsY, z: this._partitionsZ }
    }

    private Update() {
        this.GenerateNodes(this._partitionsX, this._partitionsY, this._partitionsZ)
        this.UpdateVisualization();
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

    private UpdateVisualization(): void {
        this._nodesView.flat(Infinity).forEach(node =>
            {
                if (node instanceof THREE.LineSegments)
                    {
                        this._sceneManager.RemoveObject(node)
                    }
            }
        );

        this._nodesView = []
        this._nodesView = Array.from({ length: this._partitionsX }, () =>
            Array.from({ length: this._partitionsY }, () =>
                Array.from({ length: this._partitionsZ }, () => null)
            )
        );

        const boundarySize = this._domainController.GetSize()

        const nodeWidth = boundarySize.x / this._partitionsX;
        const nodeHeight = boundarySize.y / this._partitionsY;
        const nodeDepth = boundarySize.z / this._partitionsZ;

        const geometry = new THREE.BoxGeometry( nodeWidth, nodeHeight, nodeDepth);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const partitionCenterX = this._partitionsX / 2
        const partitionCenterY = this._partitionsY / 2
        const partitionCenterZ = this._partitionsZ / 2
        
        const nodeCenterX = nodeWidth / 2
        const nodeCenterY = nodeHeight / 2
        const nodeCenterZ = nodeDepth / 2

        const center = this._domainController.GetCenter();

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = (x - partitionCenterX) * nodeWidth + nodeCenterX + center.x;
                    line.position.y = (y - partitionCenterY) * nodeHeight + nodeCenterY + center.y;
                    line.position.z = (z - partitionCenterZ) * nodeDepth + nodeCenterZ + center.z;
                    
                    this._sceneManager.AddObject(line);
                    this._nodesView[x][y][z] = line;
                }
            }
        }
    }
}