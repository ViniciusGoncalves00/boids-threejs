import * as THREE from "three";
import { SceneManager } from "../managers/scene-manager";

export class DomainController
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

    public Nodes: (THREE.LineSegments | null)[][][] = [];

    public constructor(sceneManager : SceneManager)
    {
        this._sceneManager = sceneManager;
    }

    public GetLimits() : {min: [number, number, number], max: [number, number, number]} {
        return {
            min: [this._minX, this._minY, this._minZ],
            max: [this._maxX, this._maxY, this._maxZ],
        }
    }

    public GetDivisions() : {x: number, y: number, z: number} {
        return { x: this._divisionsX, y: this._divisionsY, z: this._divisionsZ }
    }

    public GetCenter() {
        const x = (this._maxX + this._minX) / 2;
        const y = (this._maxY + this._minY) / 2;
        const z = (this._maxZ + this._minZ) / 2;

        return [x, y, z];
    }

    public GetSize() {
        const x = this._maxX - this._minX;
        const y = this._maxY - this._minY;
        const z = this._maxZ - this._minZ;

        return [x, y, z];
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

    public SetDivisions(x? : number, y? : number, z? : number)
    {
        this._divisionsX = x == undefined ? this._divisionsX : x;
        this._divisionsY = y == undefined ? this._divisionsY : y;
        this._divisionsZ = z == undefined ? this._divisionsZ : z;

        this.UpdateDomain()
    }

    private UpdateDomain(): void {
        this.Nodes.flat(Infinity).forEach(node =>
            {
                if (node instanceof THREE.LineSegments)
                    {
                        this._sceneManager.RemoveObject(node)
                    }
            }
        );

        this.Nodes = []
        this.Nodes = Array.from({ length: this._divisionsX }, () =>
            Array.from({ length: this._divisionsY }, () =>
                Array.from({ length: this._divisionsZ }, () => null)
            )
        );

        const width = Math.abs(this._maxX - this._minX)
        const height = Math.abs(this._maxY - this._minY)
        const depth = Math.abs(this._maxZ - this._minZ)

        const nodeWidth = width / this._divisionsX;
        const nodeHeight = height / this._divisionsY;
        const nodeDepth = depth / this._divisionsZ;

        const geometry = new THREE.BoxGeometry( nodeWidth, nodeHeight, nodeDepth);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const partitionCenterX = this._divisionsX / 2
        const partitionCenterY = this._divisionsY / 2
        const partitionCenterZ = this._divisionsZ / 2
        
        const nodeCenterX = nodeWidth / 2
        const nodeCenterY = nodeHeight / 2
        const nodeCenterZ = nodeDepth / 2

        const center = this.GetCenter();

        for (let x = 0; x < this._divisionsX; x++)
        {
            for (let y = 0; y < this._divisionsY; y++)
            {
                for (let z = 0; z < this._divisionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = (x - partitionCenterX) * nodeWidth + nodeCenterX + center[0];
                    line.position.y = (y - partitionCenterY) * nodeHeight + nodeCenterY + center[1];
                    line.position.z = (z - partitionCenterZ) * nodeDepth + nodeCenterZ + center[2];
                    
                    this._sceneManager.AddObject(line);
                    this.Nodes[x][y][z] = line;
                }
            }
        }

    }

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