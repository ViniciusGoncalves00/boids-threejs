import * as THREE from "three";
import { DomainController } from "./domain-controller";
import { SceneManager } from "../managers/scene-manager";
import { Entity } from "../entities/entity";
import { RendererComponent } from "../components/renderer-component";

export class SpatialPartitioningController extends Entity {
    private _sceneManager: SceneManager;
    private _domainController: DomainController;
    private _partitionsX = 1;
    private _partitionsY = 1;
    private _partitionsZ = 1;

    private _nodes: Map<string, Entity[]> = new Map();
    private _nodesView: THREE.Mesh[][][] = [];

    constructor(sceneManager: SceneManager, domainController: DomainController) {
        super("SpatialPartitioningController");
        this._sceneManager = sceneManager;
        this._domainController = domainController;
        this.AddComponent(new RendererComponent(this, this._nodesView.flat(2).filter(node => node !== null)));
        this.SoftUpdate();
    }

    private get _renderer(): RendererComponent {
        return this.GetComponent("RendererComponent")!;
    }

    public SetDivisions(x?: number, y?: number, z?: number): void {
        this._partitionsX = x ?? this._partitionsX;
        this._partitionsY = y ?? this._partitionsY;
        this._partitionsZ = z ?? this._partitionsZ;
        this.SoftUpdate();
    }

    public GetDivisions(): { x: number; y: number; z: number } {
        return { x: this._partitionsX, y: this._partitionsY, z: this._partitionsZ };
    }

    public PopulateStatic(): void {
        this._sceneManager.Colliders.forEach(entity => {
            const boundingBox = new THREE.Box3().setFromObject(entity.Object3D);
            const [minX, minY, minZ] = this.VertexPositionToMatrixIndex(boundingBox.min);
            const [maxX, maxY, maxZ] = this.VertexPositionToMatrixIndex(boundingBox.max);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    for (let z = minZ; z <= maxZ; z++) {
                        this._nodes.get(this.VertexToKey(x, y, z))?.push(entity);
                    }
                }
            }
        });
    }

    public Update(): void {
        this._nodes.forEach(list => list.length = 0);
        this._sceneManager.GetPopulation().forEach(boid => {
            const [x, y, z] = this.VertexPositionToMatrixIndex(boid.Mesh.position);
            this._nodes.get(this.VertexToKey(x, y, z))?.push(boid);
        });
    }

    private SoftUpdate(): void {
        this.GenerateNodes();
        this.UpdateVisualization();
    }

    private GenerateNodes(): void {
        this._nodes.clear();
        for (let x = 0; x < this._partitionsX; x++) {
            for (let y = 0; y < this._partitionsY; y++) {
                for (let z = 0; z < this._partitionsZ; z++) {
                    this._nodes.set(this.VertexToKey(x, y, z), []);
                }
            }
        }
    }

    private UpdateVisualization(): void {
        this._renderer.Destroy();
        this.Object3D.clear();
    
        // this._nodesView = Array.from({ length: this._partitionsX }, () =>
        //     Array.from({ length: this._partitionsY }, () =>
        //         Array.from({ length: this._partitionsZ }, () => null)
        //     )
        // );
    
        const boundarySize = this._domainController.GetSize();
        const nodeWidth = boundarySize.width / this._partitionsX;
        const nodeHeight = boundarySize.height / this._partitionsY;
        const nodeDepth = boundarySize.depth / this._partitionsZ;
        const center = this._domainController.GetCenter();
    
        for (let x = 0; x < this._partitionsX; x++) {
            for (let y = 0; y < this._partitionsY; y++) {
                for (let z = 0; z < this._partitionsZ; z++) {
                    const box = new THREE.BoxGeometry(nodeWidth, nodeHeight, nodeDepth);
                    const mesh = new THREE.Mesh(box);

                    mesh.position.set(
                        (x - this._partitionsX / 2) * nodeWidth + nodeWidth / 2 + center.x,
                        (y - this._partitionsY / 2) * nodeHeight + nodeHeight / 2 + center.y,
                        (z - this._partitionsZ / 2) * nodeDepth + nodeDepth / 2 + center.z
                    );
    
                    this.Object3D.add(mesh);
                    this._nodesView[x][y][z] = mesh;
                }
            }
        }
    }
    

    private VertexToKey(x: number, y: number, z: number): string {
        return `${x},${y},${z}`;
    }

    private VertexPositionToMatrixIndex(vertex: THREE.Vector3): [number, number, number] {
        const bounds = this._domainController.GetLimits();
        return [
            Math.min(Math.floor((vertex.x - bounds.min.x) / (bounds.max.x - bounds.min.x) * this._partitionsX), this._partitionsX - 1),
            Math.min(Math.floor((vertex.y - bounds.min.y) / (bounds.max.y - bounds.min.y) * this._partitionsY), this._partitionsY - 1),
            Math.min(Math.floor((vertex.z - bounds.min.z) / (bounds.max.z - bounds.min.z) * this._partitionsZ), this._partitionsZ - 1)
        ];
    }
}
