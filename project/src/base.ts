export class Base {
    id: number;
  
    constructor() {
      this.id = Math.random();
    }
  
    public GetInstanceID(): number
    {
      return this.id;
    }
  }