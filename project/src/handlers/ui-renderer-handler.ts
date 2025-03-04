import { RendererComponent } from "../components/renderer-component";

export class UIRendererHandler {
    private _renderers: Map<string, RendererComponent>;

    public constructor(renderers: { key: string, component: RendererComponent }[]) {
        this._renderers = new Map(renderers.map(item => [item.key, item.component]));
    }

    public ToggleVisibility(name: string): void {
        const renderer = this._renderers.get(name);
        if (!renderer) return;

        renderer.SetVisibility(!renderer.IsVisible());
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
