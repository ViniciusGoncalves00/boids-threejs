import * as THREE from "three";
import { Node } from "./node";
import { SceneManager } from "../views/scenemanager";

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

    public Nodes: Node[][][] = [];

    private constructor(sizeX : number, sizeY : number, sizeZ : number, partitionsAmountX : number, partitionsAmountY : number, partitionsAmountZ : number)
    {
        this.SetDomainSize(sizeX, sizeY, sizeZ)
        this.SetPartitionsAmount(partitionsAmountX, partitionsAmountY, partitionsAmountZ)
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

        this.Update()
    }

    public SetPartitionsAmount(x : number, y : number, z : number)
    {
        this._partitionsX = x;
        this._partitionsY = y;
        this._partitionsZ = z;

        this.Update()
    }

    private Update()
    {
        const nodeSizeX = this._sizeX / this._partitionsX; 
        const nodeSizeY = this._sizeY / this._partitionsY; 
        const nodeSizeZ = this._sizeZ / this._partitionsZ; 

        this.Nodes = Array.from({ length: this._partitionsX }, () =>
            Array.from({ length: this._partitionsY }, () =>
                Array.from({ length: this._partitionsZ }, () => new Node(nodeSizeX, nodeSizeY, nodeSizeZ))
            )
        );

        const geometry = new THREE.BoxGeometry( nodeSizeX, nodeSizeY, nodeSizeZ);
        const edges = new THREE.EdgesGeometry( geometry ); 
        const sceneManager = SceneManager.GetInstance();

        for (let x = 0; x < this._partitionsX; x++)
        {
            for (let y = 0; y < this._partitionsY; y++)
            {
                for (let z = 0; z < this._partitionsZ; z++)
                {
                    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
                    line.position.x = (x - this._partitionsX / 2) * nodeSizeX + nodeSizeX / 2;
                    line.position.y = y * nodeSizeY + nodeSizeY / 2;
                    line.position.z = (z - this._partitionsZ / 2) * nodeSizeZ + nodeSizeZ / 2;
                    
                    sceneManager.Scene.add(line);
                }
            }
        }
    }
}