import { Entity } from "../entities/entity";

export class Component {
    public Entity!: Entity;
    public Enabled: boolean = true;
  
    public Awake(): void {}
    public Start(): void {}
    public Update(): void {}
  }