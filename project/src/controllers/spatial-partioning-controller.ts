import * as THREE from "three";
import { DomainController } from "./domain-controller";
import { SceneManager } from "../managers/scene-manager";
import { SceneObject } from "../base";
import { BaseObject } from "../objects/base-object";
import { ObjectsBuilder } from "../managers/objects-builder";
import { LineBasicMaterial } from "../objects/default-materials";
import { WireframeObject } from "../objects/wireframe-object";
import { SolidObject } from "../objects/solid-object";

export class SpatialPartioningController extends SceneObject implements IVisible, IColorful
{
    private _sceneManager : SceneManager;
    private _domainController : DomainController;

    private _partitionsX : number = 1;
    private _partitionsY : number = 1;
    private _partitionsZ : number = 1;

    private _nodes: Map<string, SolidObject[]> = new Map<string, SolidObject[]>();
    private _nodeWidth: number = 0;
    private _nodeHeight: number = 0;
    private _nodeDepth: number = 0;
    private _nodesView: (WireframeObject | null)[][][] = [];

    public constructor(sceneManager: SceneManager, domainController: DomainController)
    {
        super();
        this._sceneManager = sceneManager;
        this._domainController = domainController;
        this._interfaces.push("IVisible", "IColorful");
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
                                node.Wireframe.material = material;
                            }
                        }
                    }
                }
        }
    }

    public GetColor(): string {
        const default_color = `#ffffff`;
        if (!this._nodesView || !this._nodesView[0][0][0] || !this._nodesView[0][0][0].Wireframe.material) {
            return default_color;
        }
        const material = this._nodesView[0][0][0].Wireframe.material as THREE.LineBasicMaterial;
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
                                node.Wireframe.visible = !node.Wireframe.visible;
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

    public Populate(): void {
        const objects = this._sceneManager.StaticColliders;
    
        objects.forEach(object => {
            const boundingBox = new THREE.Box3().setFromObject(object.Mesh);
            const min = boundingBox.min;
            const max = boundingBox.max;
            const vertices = [
                new THREE.Vector3(min.x, min.y, min.z),
                new THREE.Vector3(min.x, min.y, max.z),
                new THREE.Vector3(min.x, max.y, min.z),
                new THREE.Vector3(min.x, max.y, max.z),
                new THREE.Vector3(max.x, min.y, min.z),
                new THREE.Vector3(max.x, min.y, max.z),
                new THREE.Vector3(max.x, max.y, min.z),
                new THREE.Vector3(max.x, max.y, max.z) 
            ];
    
            vertices.forEach(vertex => {
                const index = this.VertexPositionToMatrixIndex(vertex);
                const key = `${index[0]},${index[1]},${index[2]}`;
                const node = this._nodes.get(key);
    
                if (node !== undefined) {
                    node.push(object);
                    const nodeView = this._nodesView[index[0]]?.[index[1]]?.[index[2]];
                    if (nodeView) {
                        nodeView.Wireframe.material = new THREE.LineBasicMaterial({ color: 0x00ff00 });
                    }
                }
            });
        });

        console.log(this._nodes.values())
    }

    private VertexPositionToMatrixIndex(vertex: THREE.Vector3): [number, number, number] {
        const bounds = this._domainController.GetLimits();
    
        const normalizedX = (vertex.x - bounds.min.x) / (bounds.max.x - bounds.min.x);
        const normalizedY = (vertex.y - bounds.min.y) / (bounds.max.y - bounds.min.y);
        const normalizedZ = (vertex.z - bounds.min.z) / (bounds.max.z - bounds.min.z);
    
        const x = Math.min(Math.floor(normalizedX * this._partitionsX), this._partitionsX - 1);
        const y = Math.min(Math.floor(normalizedY * this._partitionsY), this._partitionsY - 1);
        const z = Math.min(Math.floor(normalizedZ * this._partitionsZ), this._partitionsZ - 1);
    
        return [x, y, z];
    }

    private Update() {
        this.GenerateNodes(this._partitionsX, this._partitionsY, this._partitionsZ)
        this.UpdateVisualization();
    }

    private GenerateNodes(amountX: number, amountY: number, amountZ: number): void {
        this._nodes.forEach(node => {
            node.forEach(object => {
                this._sceneManager.RemoveObject(object);
            });
        });
    
        this._nodes.clear();
    
        for (let x = 0; x < amountX; x++) {
            for (let y = 0; y < amountY; y++) {
                for (let z = 0; z < amountZ; z++) {
                    const key = `${x},${y},${z}`;
                    this._nodes.set(key, []);
                }
            }
        }
    }

    private UpdateVisualization(): void {
        this._nodesView.flat(Infinity).forEach(node =>
            {
                if (node instanceof BaseObject)
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

        const objectBuilder = new ObjectsBuilder()

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const cuboid = objectBuilder.BuildWireframeCuboid(nodeWidth, nodeHeight, nodeDepth, LineBasicMaterial);
                    
                    cuboid.Wireframe.position.x = (x - partitionCenterX) * nodeWidth + nodeCenterX + center.x;
                    cuboid.Wireframe.position.y = (y - partitionCenterY) * nodeHeight + nodeCenterY + center.y;
                    cuboid.Wireframe.position.z = (z - partitionCenterZ) * nodeDepth + nodeCenterZ + center.z;
                    
                    this._sceneManager.AddObject(cuboid);
                    this._nodesView[x][y][z] = cuboid;
                }
            }
        }
    }
}