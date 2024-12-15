import { Domain } from "../../domain";

export class DomainStore implements IVisible, IAppliable
{
    visible: boolean = false;

    private sizeX:number = 50;
    private sizeY:number = 50;
    private sizeZ:number = 50;
    private partitionX: number = 10;
    private partitionY: number = 10;
    private partitionZ: number = 10;
    
    IsVisible(): boolean
    {
        return this.visible;
    }

    ToggleVisibility(): void
    {
        this.visible = !this.visible;
    }
    
    Aplly(): void
    {
            const domain = Domain.GetInstance();
            domain.SetDomainProperties(this.sizeX, this.sizeY, this.sizeZ, this.partitionX, this.partitionY, this.partitionZ);
    }

    public GetSize(axis: string) : number
    {
        axis = axis.toLowerCase()

        switch (axis) {
            case "x":
                return this.sizeX;
            case "y":
                return this.sizeY;
            case "z":
                return this.sizeZ;
            default:
                return 0;
        }
    }

    public GetPartition(axis: string) : number
    {
        axis = axis.toLowerCase()

        switch (axis) {
            case "x":
                return this.partitionX;
            case "y":
                return this.partitionY;
            case "z":
                return this.partitionZ;
            default:
                return 0;
        }
    }
}