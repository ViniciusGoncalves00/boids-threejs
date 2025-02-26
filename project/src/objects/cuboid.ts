import * as THREE from "three";
import { IStatic } from "../interfaces/IStatic";
import { SolidObject } from "./solid-object";

export class Cuboid extends SolidObject implements ICollider, IStatic
{
    private _collider: THREE.Box3;

    public get Collider(): THREE.Box3 {
        return this._collider;
    }

    private set Collider(value: THREE.Box3) {
        if (!value) {
            throw new Error("Box cannot be null or undefined.");
        }
        this._collider = value;
    }

    public constructor(width: number, height: number, depth: number, material: THREE.Material) {
        super(new THREE.BoxGeometry(width, height, depth), material);
        this._collider = new THREE.Box3(
            new THREE.Vector3(-width / 2, -height / 2, -depth / 2),
            new THREE.Vector3(width / 2, height / 2, depth / 2))
    }
}