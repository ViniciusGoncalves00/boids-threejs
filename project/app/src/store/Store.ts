import * as THREE from "three";
import { Domain } from "../domain";
import { Boid } from "../boid";
import { SceneManager } from "../scene-manager";

import Alpine from "alpinejs";
import {DomainStore} from "./stores/DomainStore";
import {PropertiesStore} from "./stores/PropertiesStore";

function InitializeStore() {
    // const stores: { [key: string]: IVisible } =
    // {
    //     "DomainStore": new DomainStore(),
    //     "PropertiesStore": new PropertiesStore(),
    // };

    // Object.keys(stores).forEach(storeName =>
    //     {
    //         Alpine.store(storeName, stores[storeName]);
    //     }
    // );

    Alpine.store("DomainStore", new DomainStore())
    Alpine.store("PropertiesStore", new PropertiesStore())

    Alpine.store("CurrentSimulation",
        {
            id: null
        }
    )

    // Alpine.store("Stores",
    //     {
    //         stores:
    //         {
    //             "DomainStore": { visible: false},
    //             "PropertiesStore": { visible: false},
    //         },

    //         Toggle(storeName: string)
    //         {
    //             Object.keys(stores).forEach(name =>
    //                 {
    //                     if(name === storeName)
    //                     {
    //                         stores[storeName].visible = !stores[storeName].visible;
    //                     }
    //                     else
    //                     {
    //                         stores[name].visible = false;
    //                     }
    //                 });
    //         }
    //     }
    // )

    // Alpine.store("visibility",
    // {
    //     IsVisible(storeName: string)
    //     {
    //         return stores[storeName].visible
    //     },

    //     Toggle(storeName: string)
    //     {
    //         Object.keys(stores).forEach(name =>
    //         {
    //             if(name === storeName)
    //             {
    //                 stores[storeName].visible = !stores[storeName].visible;
    //             }
    //             else
    //             {
    //                 stores[name].visible = false;
    //             }
    //         });
    //     }
    // })
}

document.addEventListener("alpine:init", () => {
    InitializeStore();
});
    
Alpine.store("simulation", {
    instantiate()
    {
        const domain = Domain.GetInstance();
        const geometry = new THREE.ConeGeometry();
        const boidMesh = new THREE.Mesh(geometry)
        const boid = new Boid(boidMesh)
        SceneManager.GetInstance().Scene.add(boidMesh)
        domain.Boids.push(boid)
    },
    refresh()
    {
        const domain = Domain.GetInstance();
        const scene = SceneManager.GetInstance().Scene;
        domain.Boids.forEach(boid => {
                scene.remove(boid.Mesh)
        });
        domain.Boids = []
    }
})

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