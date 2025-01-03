import * as THREE from "three";
import { Domain } from "../domain";
import { Boid } from "../boid";
import { SceneManager } from "../scene-manager";

import Alpine from "alpinejs";
import {DomainStore} from "./stores/DomainStore";
import {PropertiesStore} from "./stores/PropertiesStore";

function InitializeStore() {
    Alpine.store("DomainStore", new DomainStore())
    Alpine.store("PropertiesStore", new PropertiesStore())

    Alpine.store("CurrentSimulation",
        {
            id: null
        }
    )
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