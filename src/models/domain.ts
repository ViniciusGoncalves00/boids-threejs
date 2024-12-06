import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";
import { Boid } from "./boid";

export class Domain
{
    private static _instance : Domain;
    private _sceneManager : SceneManager;

    private _sizeX : number = 0;
    private _sizeY : number = 0;
    private _sizeZ : number = 0;

    private _partitionsX : number = 0;
    private _partitionsY : number = 0;
    private _partitionsZ : number = 0;

    public MinX : number = 0;
    public MinY : number = 0;
    public MinZ : number = 0;

    public MaxX : number = 0;
    public MaxY : number = 0;
    public MaxZ : number = 0;

    public Nodes: (THREE.LineSegments | null)[][][] = [];

    public Boids : Boid[] = [];

    private constructor(sizeX : number, sizeY : number, sizeZ : number, partitionsAmountX : number, partitionsAmountY : number, partitionsAmountZ : number)
    {
        this._sceneManager = SceneManager.GetInstance();

        this.SetDomainProperties(sizeX, sizeY, sizeZ, partitionsAmountX, partitionsAmountY, partitionsAmountZ)

        // this.UpdateBoids()
    }

    public static GetInstance() : Domain
    {
        if(this._instance == null)
        {
            this._instance = new Domain(100,100,100,5,5,5);
        }

        return this._instance;
    }

    public SetDomainProperties(x : number, y : number, z : number, p_x : number, p_y : number, p_z : number)
    {
        this._sizeX = x;
        this._sizeY = y;
        this._sizeZ = z;

        this._partitionsX = p_x;
        this._partitionsY = p_y;
        this._partitionsZ = p_z;

        this.MinX = -x
        this.MaxX = x
        this.MinY = -y
        this.MaxY = y
        this.MinZ = -z
        this.MaxZ = z

        this.UpdateDomain()
    }

    private UpdateDomain = () =>
    {
        const nodeSizeX = this._sizeX / this._partitionsX; 
        const nodeSizeY = this._sizeY / this._partitionsY; 
        const nodeSizeZ = this._sizeZ / this._partitionsZ; 

        this.Nodes.flat(Infinity).forEach(node =>
            {
                if (node instanceof THREE.LineSegments)
                    {
                        this._sceneManager.Scene.remove(node)
                    }
            }
        );
        
        this.Nodes = []
        this.Nodes = Array.from({ length: this._partitionsX }, () =>
            Array.from({ length: this._partitionsY }, () =>
                Array.from({ length: this._partitionsZ }, () => null)
            )
        );

        const geometry = new THREE.BoxGeometry( nodeSizeX, nodeSizeY, nodeSizeZ);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const material = new THREE.LineBasicMaterial({ color: 0xffffff })

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, material);
                    line.position.x = (x - this._partitionsX / 2) * nodeSizeX + nodeSizeX / 2;
                    line.position.y = (y - this._partitionsY / 2) * nodeSizeY + nodeSizeY / 2;
                    line.position.z = (z - this._partitionsZ / 2) * nodeSizeZ + nodeSizeZ / 2;
                    
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