import * as THREE from 'three';
import { Component } from '../components/component';
import { Base } from '../base';

export class Entity extends Base {
  protected _name: string;
  protected _object3D: THREE.Object3D;
  protected _components: Map<string, Component>;
  protected _interfaces: string[] = [];

  public get Name(): string {
      return this._name;
  }

  public get Object3D(): THREE.Object3D {
    return this._object3D;
  }

  public get Components(): Map<string, Component> {
    return this._components;
  }

  public get Interfaces(): string[] {
    return this._interfaces;
  }

  constructor(name: string = "Entity") {
    super();
    this._name = name + "_" + super.GetInstanceID();
    this._object3D = new THREE.Object3D();
    this._components = new Map();
  }

  public AddComponent<T extends Component>(component: T): T {
    this.Components.set(component.constructor.name, component);
    component.Entity = this;
    return component;
  }

  public GetComponent<T extends Component>(componentName: string): T | undefined {
    return this.Components.get(componentName) as T;
  }

  public RemoveComponent(componentName: string): void {
    if (this.Components.has(componentName)) {
        this.Components.delete(componentName);
    }
  }
}