import { Component } from "./component";

type CollisionType = "sphere" | "box" | "none";

export class ColliderComponent extends Component {
  public type: CollisionType;
  public Enabled: boolean;

  constructor(type: CollisionType = "box", enabled: boolean = true) {
    super();
    this.type = type;
    this.Enabled = enabled;
  }
}