import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";
import { SceneObject } from "../base";
import { BaseObject } from "../objects/base-object";
import { ObjectsBuilder } from "../managers/objects-builder";
import { LineBasicMaterial } from "../objects/default-materials";
import { WireframeObject } from "../objects/wireframe-object";

export class DomainController extends SceneObject implements IVisible, IColorful
{
    private _sceneManager : SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;
    
    private _divisionsX : number = 1;
    private _divisionsY : number = 1;
    private _divisionsZ : number = 1;

    private _domain: WireframeObject | null = null;

    public constructor(sceneManager : SceneManager)
    {
        super();
        this._interfaces.push("IVisible", "IColorful");
        this._sceneManager = sceneManager;
    }

    public SetColor(r: number, g: number, b: number): void {
        if(this._domain === null) return;

        const color = new THREE.Color(r, g, b);
        const material = new THREE.LineBasicMaterial({ color: color });

        this._domain.Wireframe.material = material;
    }

    public GetColor(): string {
        const default_color = `#ffffff`;
        if (!this._domain || !this._domain || !this._domain.Wireframe.material) {
            return default_color;
        }
        const material = this._domain.Wireframe.material as THREE.LineBasicMaterial;
        return `#${material.color.getHexString()}`;
    }

    public ToggleVisibility(): void {
        if(this._domain === null) return;
        
        this._domain.Wireframe.visible = !this._domain.Wireframe.visible;
    }

    public GetLimits() : {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} {
        return {
            min: {x: this._minX, y: this._minY, z: this._minZ},
            max: {x: this._maxX, y: this._maxY, z: this._maxZ},
        }
    }

    public GetCenter(): {x: number, y: number, z: number} {
        return {x: (this._maxX + this._minX) / 2,
                y: (this._maxY + this._minY) / 2,
                z: (this._maxZ + this._minZ) / 2};
    }

    public GetSize(): {x: number, y: number, z: number} {
        return {x: Math.abs(this._maxX - this._minX),
                y: Math.abs(this._maxY - this._minY),
                z: Math.abs(this._maxZ - this._minZ)};
    }

    public SetLimits(minX? : number, minY? : number, minZ? : number, maxX? : number, maxY? : number, maxZ? : number)
    {
        this._minX = minX == undefined ? this._minX : minX;
        this._minY = minY == undefined ? this._minY : minY;
        this._minZ = minZ == undefined ? this._minZ : minZ;
        this._maxX = maxX == undefined ? this._maxX : maxX;
        this._maxY = maxY == undefined ? this._maxY : maxY;
        this._maxZ = maxZ == undefined ? this._maxZ : maxZ;

        this.UpdateDomain()
    }

    private UpdateDomain(): void {
        if(this._domain instanceof THREE.LineSegments) {
            this._sceneManager.RemoveObject(this._domain)
        }

        const width = Math.abs(this._maxX - this._minX)
        const height = Math.abs(this._maxY - this._minY)
        const depth = Math.abs(this._maxZ - this._minZ)

        // const geometry = new THREE.BoxGeometry( width, height, depth);
        // const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const center = this.GetCenter();

        const objectBuilder = new ObjectsBuilder()
        const line = objectBuilder.BuildWireframeCuboid(width, height, depth, LineBasicMaterial);
        // const line = new THREE.LineSegments(edges, material);
        line.Wireframe.position.x = center.x;
        line.Wireframe.position.y = center.y;
        line.Wireframe.position.z = center.z;

        this._sceneManager.AddObject(line.Wireframe);
        this._domain = line;

    }

    // private UpdateDomain(): void {
    //     this.Nodes.flat(Infinity).forEach(node =>
    //         {
    //             if (node instanceof THREE.LineSegments)
    //                 {
    //                     this._sceneManager.RemoveObject(node)
    //                 }
    //         }
    //     );

    //     this.Nodes = []
    //     this.Nodes = Array.from({ length: this._divisionsX }, () =>
    //         Array.from({ length: this._divisionsY }, () =>
    //             Array.from({ length: this._divisionsZ }, () => null)
    //         )
    //     );

    //     const width = Math.abs(this._maxX - this._minX)
    //     const height = Math.abs(this._maxY - this._minY)
    //     const depth = Math.abs(this._maxZ - this._minZ)

    //     const nodeWidth = width / this._divisionsX;
    //     const nodeHeight = height / this._divisionsY;
    //     const nodeDepth = depth / this._divisionsZ;

    //     const geometry = new THREE.BoxGeometry( nodeWidth, nodeHeight, nodeDepth);
    //     const edges = new THREE.EdgesGeometry( geometry ); 
    //     const material = new THREE.LineBasicMaterial({ color: 0xffffff })

    //     const partitionCenterX = this._divisionsX / 2
    //     const partitionCenterY = this._divisionsY / 2
    //     const partitionCenterZ = this._divisionsZ / 2
        
    //     const nodeCenterX = nodeWidth / 2
    //     const nodeCenterY = nodeHeight / 2
    //     const nodeCenterZ = nodeDepth / 2

    //     const center = this.GetCenter();

    //     for (let x = 0; x < this._divisionsX; x++)
    //     {
    //         for (let y = 0; y < this._divisionsY; y++)
    //         {
    //             for (let z = 0; z < this._divisionsZ; z++)
    //             {
    //                 const line = new THREE.LineSegments(edges, material);
    //                 line.position.x = (x - partitionCenterX) * nodeWidth + nodeCenterX + center.x;
    //                 line.position.y = (y - partitionCenterY) * nodeHeight + nodeCenterY + center.y;
    //                 line.position.z = (z - partitionCenterZ) * nodeDepth + nodeCenterZ + center.z;
                    
    //                 this._sceneManager.AddObject(line);
    //                 this.Nodes[x][y][z] = line;
    //             }
    //         }
    //     }
    // }

    // private UpdateBoids = () =>
    // {
    //     if(this.Boid == null)
    //     {
    //         const geometry = new THREE.ConeGeometry();
    //         const boidMesh = new THREE.Mesh(geometry)
    //         this.Boid = new Boid(boidMesh)
    //         SceneManager.GetInstance().Scene.add(boidMesh)
    //     }

    //     requestAnimationFrame(this.UpdateBoids);
        
    //     const x = Math.floor(this.Boid.Mesh.position.x / this._partitionsX);
    //     const y = Math.floor(this.Boid.Mesh.position.y / this._partitionsY);
    //     const z = Math.floor(this.Boid.Mesh.position.z / this._partitionsZ);

    //     const mesh = this.Nodes[x][y][z]

    //     this.Nodes.flat(1).forEach(node =>
    //         {
    //             if (node instanceof THREE.LineSegments && node == mesh)
    //                 {
    //                     node.material = new THREE.LineBasicMaterial({ color: 0x001000 })
    //                 }
    //         }
    //     );

    //     this._sceneManager.Renderer.render(this._sceneManager.Scene, this._sceneManager.Camera);
    // }
}