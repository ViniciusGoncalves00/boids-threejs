import * as THREE from "three";
import Alpine from "alpinejs";
import { Domain } from "../models/domain";
import { Boid } from "../models/boid";
import { SceneManager } from "./scenemanager";


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
        domain.SetDomainProperties(this.sizeX, this.sizeY, this.sizeZ, this.partitionX, this.partitionY, this.partitionZ);
    }
}));

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