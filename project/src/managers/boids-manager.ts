import { SimulationController } from "../controllers/simulation-controller";
import { SceneManager } from "./scene-manager";

export class BoidsManager implements IObserver
{
    private _avoidance: boolean = true;
    private _alignment: boolean = true;
    private _cohesion: boolean = true;
    private _death: boolean = false;

    private _viewDistance : number = 100;
    private _speed : number = 1.2;
    private _rotationSpeed : number = 0.1;
    private _separationDistance = 20;
    private _alignmentRadius: number = 50
    private _cohesionRadius: number = 25

    private _bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} = {min: {x: 0, y: 0, z: 0}, max: {x: 0, y: 0, z: 0}}

    private _sceneManager: SceneManager;

    public constructor(sceneManager: SceneManager) {
        this._sceneManager = sceneManager;
    }

    public Update(subject: ISubject, args?: string[]) {
        if(subject instanceof SimulationController && args?.includes("Stop")) {
            const creatures = this._sceneManager.GetPopulation()

            if(creatures === null) {
                return;
            }
    
            for (let index = 0; index < creatures.length; index++) {
                creatures[index].Destroy();
                this._sceneManager.RemoveObject(creatures[index]);
            }
        }
    }

    public ToggleAvoidance(): void {
        this._avoidance = !this._avoidance;
    }

    public ToggleAlignment(): void {
        this._alignment = !this._alignment;
    }

    public ToggleCohesion(): void {
        this._cohesion = !this._cohesion;
    }

    public ToggleDeath(): void {
        this._death = !this._death;
    }

    public GetAvoidance(): boolean {
        return this._avoidance;
    }

    public GetAlignment(): boolean {
        return this._alignment;
    }

    public GetCohesion(): boolean {
        return this._cohesion;
    }

    public GetDeath(): boolean {
        return this._death;
    }

    public GetViewDistance(): number {
        return this._viewDistance;
    }

    public GetSpeed(): number {
        return this._speed;
    }

    public GetRotationSpeed(): number {
        return this._rotationSpeed;
    }

    public GetSeparationDistance(): number {
        return this._separationDistance;
    }

    public GetAlignmentRadius(): number {
        return this._alignmentRadius;
    }

    public GetCohesionRadius(): number {
        return this._cohesionRadius;
    }

    public GetBounds(): {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}} {
        return this._bounds;
    }

    public SetViewDistance(value: number): void {
        this._viewDistance = value;
    }

    public SetSpeed(value: number): void {
        this._speed = value;
    }

    public SetRotationSpeed(value: number): void {
        this._rotationSpeed = value;
    }

    public SetSeparationDistance(value: number): void {
        this._separationDistance = value;
    }

    public SetAlignmentRadius(value: number): void {
        this._alignmentRadius = value;
    }

    public SetCohesionRadius(value: number): void {
        this._cohesionRadius = value;
    }

    public SetBounds(minX?: number, minY?: number, minZ?: number, maxX?: number, maxY?: number, maxZ?: number): void {
        this._bounds.min.x = minX == undefined ? this._bounds.min.x : minX;
        this._bounds.min.y = minY == undefined ? this._bounds.min.y : minY;
        this._bounds.min.z = minZ == undefined ? this._bounds.min.z : minZ;
        this._bounds.max.x = maxX == undefined ? this._bounds.max.x : maxX;
        this._bounds.max.y = maxY == undefined ? this._bounds.max.y : maxY;
        this._bounds.max.z = maxZ == undefined ? this._bounds.max.z : maxZ;
    }
}