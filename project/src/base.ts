export abstract class SceneObject {
    protected _interfaces: string[] = [];

    public GetInterfaces(): string[] {
        return this._interfaces;
    }
}