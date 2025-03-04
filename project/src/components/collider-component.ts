import { Component } from "./component";

type CollisionType = "sphere" | "box" | "none";

export abstract class ColliderComponent extends Component {
  public type: CollisionType;
  public Enabled: boolean;

  constructor(type: CollisionType = "none", enabled: boolean = true) {
    super();
    this.type = type;
    this.Enabled = enabled;
  }
}