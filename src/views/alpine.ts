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
    
    Apply(sizeX : number, sizeY : number, sizeZ : number, partitionsAmountX : number, partitionsAmountY : number, partitionsAmountZ : number) {
        const domain = Domain.GetInstance();
        domain.SetDomainSize(sizeX, sizeY, sizeZ);
        domain.SetPartitionsAmount(partitionsAmountX, partitionsAmountY, partitionsAmountZ);
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

// Alpine.store('domain', {
//     Apply(sizeX : number, sizeY : number, sizeZ : number, partitionsAmountX : number, partitionsAmountY : number, partitionsAmountZ : number) {
//         const domain = Domain.GetInstance();
//         domain.SetDomainSize(sizeX, sizeY, sizeZ);
//         domain.SetPartitionsAmount(partitionsAmountX, partitionsAmountY, partitionsAmountZ);
//     }
// })