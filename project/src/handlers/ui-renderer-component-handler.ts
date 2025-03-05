import { RendererComponent } from "../components/renderer-component";
import { Entity } from "../entities/entity";

export class UIRendererComponentHandler {
    private _renderers: Map<string, RendererComponent>;

    public constructor(entities: Entity[]) {
        this._renderers = new Map(
            entities
                .map(entity => {
                    const renderer = entity.GetComponent("RendererComponent") as RendererComponent | undefined;
                    return renderer ? [entity.constructor.name, renderer] : null;
                })
                .filter((entry): entry is [string, RendererComponent] => entry !== null)
        );
    }

    public ToggleVisibility(name: string): void {
        const renderer = this._renderers.get(name);
        if (!renderer) return;

        console.log(name)
        console.log(renderer)
        console.log(renderer.IsVisible())
        if(renderer.IsVisible()) {
            renderer.SetVisibility(false);
        }
        else {
            renderer.SetVisibility(true);
        }
        // renderer.SetVisibility(renderer.IsVisible());
    }

    public SetColor(name: string, r: number, g: number, b: number): void {
        const renderer = this._renderers.get(name);
        if (!renderer) return;

        renderer.SetColor(r, g, b);
    }

    public GetColor(name: string): string {
        const renderer = this._renderers.get(name);
        if (!renderer) return "#000000";

        return renderer.GetHexColor()[0];
    }
}
