import Alpine from "alpinejs";

Alpine.data("options", () =>
    (
        {
            open : false,
        }
    )
);

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