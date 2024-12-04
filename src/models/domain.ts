import * as THREE from "three";
import { SceneManager } from "../views/scenemanager";
import { Boid } from "./boid";

export class Domain
{
    private static _instance : Domain; 

    private _sizeX : number = 0;
    private _sizeY : number = 0;
    private _sizeZ : number = 0;

    private _partitionsX : number = 0;
    private _partitionsY : number = 0;
    private _partitionsZ : number = 0;

    public minX : number = 0;
    public minY : number = 0;
    public minZ : number = 0;

    public maxX : number = 0;
    public maxY : number = 0;
    public maxZ : number = 0;

    public Nodes: (THREE.LineSegments | null)[][][] = [];

    public Boid : Boid;

    private constructor(sizeX : number, sizeY : number, sizeZ : number, partitionsAmountX : number, partitionsAmountY : number, partitionsAmountZ : number)
    {
        this.SetDomainSize(sizeX, sizeY, sizeZ)
        this.SetPartitionsAmount(partitionsAmountX, partitionsAmountY, partitionsAmountZ)

        const geometry = new THREE.ConeGeometry();
        const mesh = new THREE.Mesh(geometry)
        this.Boid = new Boid(mesh)
        SceneManager.GetInstance().Scene.add(mesh)
        this.UpdateBoids()
    }

    public static GetInstance() : Domain
    {
        if(this._instance == null)
        {
            this._instance = new Domain(100,100,100,10,10,10);
        }

        return this._instance;
    }

    public SetDomainSize(x : number, y : number, z : number)
    {
        this._sizeX = x;
        this._sizeY = y;
        this._sizeZ = z;

        this.UpdateDomain()
    }

    public SetPartitionsAmount(x : number, y : number, z : number)
    {
        this._partitionsX = x;
        this._partitionsY = y;
        this._partitionsZ = z;

        this.UpdateDomain()
    }

    private UpdateDomain()
    {
        const sceneManager = SceneManager.GetInstance();
        
        const nodeSizeX = this._sizeX / this._partitionsX; 
        const nodeSizeY = this._sizeY / this._partitionsY; 
        const nodeSizeZ = this._sizeZ / this._partitionsZ; 

        this.Nodes.flat(1).forEach(node =>
            {
                if (node instanceof THREE.LineSegments)
                    {
                        sceneManager.Scene.remove(node)
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
                    line.position.y = y * nodeSizeY + nodeSizeY / 2;
                    line.position.z = (z - this._partitionsZ / 2) * nodeSizeZ + nodeSizeZ / 2;
                    
                    sceneManager.Scene.add(line);
                    this.Nodes[x][y][z] = line;
                }
            }
        }
    }

    private UpdateBoids()
    {
        requestAnimationFrame(this.UpdateBoids);
        
        const x = Math.floor(this.Boid.Mesh.position.x / this._partitionsX);
        const y = Math.floor(this.Boid.Mesh.position.y / this._partitionsY);
        const z = Math.floor(this.Boid.Mesh.position.z / this._partitionsZ);

        const mesh = this.Nodes[x][y][z]

        this.Nodes.flat(1).forEach(node =>
            {
                if (node instanceof THREE.LineSegments && node == mesh)
                    {
                        node.material = new THREE.LineBasicMaterial({ color: 0x001000 })
                    }
            }
        );

        const sceneManager = SceneManager.GetInstance()

        sceneManager.Renderer.render(sceneManager.Scene, sceneManager.Camera);
    }
}