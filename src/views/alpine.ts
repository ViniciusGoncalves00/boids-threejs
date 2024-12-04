import Alpine from "alpinejs";
import { Domain } from "../models/domain";


Alpine.data("options", () => ({
    open: false,
    sizeX: 50,
    sizeY: 50,
    sizeZ: 50,
    partitionX: 10,
    partitionY: 10,
    partitionZ: 10,
    
    apply() {
        const domain = Domain.GetInstance();
        domain.SetDomainSize(this.sizeX, this.sizeY, this.sizeZ);
        domain.SetPartitionsAmount(this.partitionX, this.partitionY, this.partitionZ);
    }
}));

Alpine.data("slider",({ label = "size", min = 0, max = 10, step = 1, value = 5 }) =>
    (
        {
            label,
            min,
            max,
            step,
            value,
        }
    )
);