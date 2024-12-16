import { Domain } from "../../domain";

export class PropertiesStore implements IVisible, IAppliable
{
    visible: boolean = false;

    private Separation:number = 10;
    private Alignment:number = 10;
    private Cohesion:number = 10;
    
    IsVisible(): boolean
    {
        return this.visible;
    }

    ToggleVisibility(): void
    {
        this.visible = !this.visible;
    }
    
    Apply(): void
    {
            const domain = Domain.GetInstance();
            // domain.SetDomainProperties(this.sizeX, this.sizeY, this.sizeZ, this.partitionX, this.partitionY, this.partitionZ);
    }

    public GetSeparation() : number
    {
        return this.Separation;
    }

    public SetSeparation(value: number) : void
    {
        this.Separation = value;
    }

    public GetAlignment() : number
    {
        return this.Alignment;
    }

    public SetAlignment(value: number) : void
    {
        this.Alignment = value;
    }

    public GetCohesion() : number
    {
        return this.Cohesion;
    }

    public SetCohesion(value: number) : void
    {
        this.Cohesion = value;
    }
}