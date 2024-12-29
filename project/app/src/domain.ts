import * as THREE from "three";
import { SceneManager } from "./scene-manager";
import { Boid } from "./boid";
import { spawn } from "child_process";

export class Domain
{
    private static _instance : Domain;
    private _sceneManager : SceneManager;

    private _minX: number = 0;
    private _minY: number = 0;
    private _minZ: number = 0;
    private _maxX: number = 0;
    private _maxY: number = 0;
    private _maxZ: number = 0;
    
    private _divisionsX : number = 0;
    private _divisionsY : number = 0;
    private _divisionsZ : number = 0;
    
    private _spawnMinX : number = 0;
    private _spawnMinY : number = 0;
    private _spawnMinZ : number = 0;
    private _spawnMaxX : number = 0;
    private _spawnMaxY : number = 0;
    private _spawnMaxZ : number = 0;

    public Nodes: (THREE.LineSegments | null)[][][] = [];
    public Spawn: (THREE.LineSegments | null) = null;

    public Boids : Boid[] = [];

    private constructor()
    {
        this._sceneManager = SceneManager.GetInstance();
    }

    public static GetInstance() : Domain
    {
        if(this._instance == null)
        {
            this._instance = new Domain();
        }

        return this._instance;
    }

    public GetLimits() {
        const limits = {
            "min": [this._minX, this._minY, this._minZ],
            "max": [this._maxX, this._maxY, this._maxZ],
        }
        return limits;
    }

    public GetDivisions() {
        const divisions = [this._divisionsX, this._divisionsY, this._divisionsZ]

        return divisions;
    }

    public GetSpawn() {
        const spawn = {
            "min": [this._spawnMinX, this._spawnMinY, this._spawnMinZ],
            "max": [this._spawnMaxX, this._spawnMaxY, this._spawnMaxZ],
        }
        return spawn;
    }

    public SetLimits(min_x : number, min_y : number, min_z : number, max_x : number, max_y : number, max_z : number)
    {
        this._minX = min_x;
        this._minY = min_y;
        this._minZ = min_z;
        this._maxX = max_x;
        this._maxY = max_y;
        this._maxZ = max_z;

        this.UpdateDomain()
    }

    public SetDivisions(x : number, y : number, z : number)
    {
        this._divisionsX = x;
        this._divisionsY = y;
        this._divisionsZ = z;

        this.UpdateDomain()
    }

    public SetSpawn(min_x : number, min_y : number, min_z : number, max_x : number, max_y : number, max_z : number)
    {
        this._spawnMinX = min_x;
        this._spawnMinY = min_y;
        this._spawnMinZ = min_z;
        this._spawnMaxX = max_x;
        this._spawnMaxY = max_y;
        this._spawnMaxZ = max_z;

        this.UpdateSpawn()
    }

    private UpdateSpawn()
    {
        if(this.Spawn !== null){
            this._sceneManager.Scene.remove(this.Spawn)
        }

        const width = Math.abs(this._spawnMaxX - this._spawnMinX)
        const height = Math.abs(this._spawnMaxY - this._spawnMinY)
        const depth = Math.abs(this._spawnMaxZ - this._spawnMinZ)

        const geometry = new THREE.BoxGeometry( width, height, depth);
        const edges = new THREE.EdgesGeometry( geometry );
        const material = new THREE.LineBasicMaterial()
        material.color.setRGB(0, 0, 200);

        this.Spawn = new THREE.LineSegments(edges, material)

        this._sceneManager.Scene.add(this.Spawn)
    }

    private UpdateDomain(): void {
        const width = Math.abs(this._maxX - this._minX)
        const height = Math.abs(this._maxY - this._minY)
        const depth = Math.abs(this._maxZ - this._minZ)

        this.Nodes.flat(Infinity).forEach(node =>
            {
                if (node instanceof THREE.LineSegments)
                    {
                        this._sceneManager.Scene.remove(node)
                    }
            }
        );
        
        this.Nodes = []
        this.Nodes = Array.from({ length: this._divisionsX }, () =>
            Array.from({ length: this._divisionsY }, () =>
                Array.from({ length: this._divisionsZ }, () => null)
            )
        );

        const nodeWidth = width / this._divisionsX;
        const nodeHeight = height / this._divisionsY;
        const nodeDepth = depth / this._divisionsZ;

        const geometry = new THREE.BoxGeometry( nodeWidth, nodeHeight, nodeDepth);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        const partitionCenterX = this._divisionsX / 2
        const partitionCenterY = this._divisionsY / 2
        const partitionCenterZ = this._divisionsZ / 2
        
        const centerX = nodeWidth / 2
        const centerY = nodeHeight / 2
        const centerZ = nodeDepth / 2

        for (let x = 0; x < this._divisionsX; x++)
        {
            for (let y = 0; y < this._divisionsY; y++)
            {
                for (let z = 0; z < this._divisionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = (x - partitionCenterX) * nodeWidth + centerX;
                    line.position.y = (y - partitionCenterY) * nodeHeight + centerY;
                    line.position.z = (z - partitionCenterZ) * nodeDepth + centerZ;
                    
                    this._sceneManager.Scene.add(line);
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