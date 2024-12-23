import * as THREE from "three";
import { InputManager } from "./input-manager";
import { InputMapping } from "./input-mapping";

export class CameraController {
    private camera: THREE.PerspectiveCamera;
    private inputManager: InputManager;
    private inputMapping: InputMapping;
    private speed: number = 0.1;

    constructor(camera: THREE.PerspectiveCamera, inputMapping: InputMapping) {
        this.camera = camera;
        this.inputManager = InputManager.GetInstance();
        this.inputMapping = inputMapping;
    }

    public Update(): void {
        const forward = new THREE.Vector3(); // Vetor para frente/trás
    const right = new THREE.Vector3();   // Vetor para direita/esquerda
    const up = new THREE.Vector3();      // Vetor para cima/baixo

    // Obtém a direção para frente da câmera no mundo
    this.camera.getWorldDirection(forward);
    forward.normalize(); // Normaliza para garantir magnitude consistente

    // Calcula o vetor para direita com base no "frente" e "cima" da câmera
    right.crossVectors(forward, this.camera.up).normalize();

    // Usa o vetor "up" diretamente da câmera para o movimento vertical
    up.copy(this.camera.up).normalize();

    // Movimentação para frente/trás no eixo local
    if (this.inputManager.GetKeyHeld(this.inputMapping.Forward)) {
        this.camera.position.addScaledVector(forward, this.speed);
    }
    if (this.inputManager.GetKeyHeld(this.inputMapping.Backward)) {
        this.camera.position.addScaledVector(forward, -this.speed);
    }

    // Movimentação para direita/esquerda no eixo local
    if (this.inputManager.GetKeyHeld(this.inputMapping.Right)) {
        this.camera.position.addScaledVector(right, this.speed);
    }
    if (this.inputManager.GetKeyHeld(this.inputMapping.Left)) {
        this.camera.position.addScaledVector(right, -this.speed);
    }

    // Movimentação para cima/baixo no eixo local da câmera
    if (this.inputManager.GetKeyHeld(this.inputMapping.Up)) {
        this.camera.position.addScaledVector(up, this.speed);
    }
    if (this.inputManager.GetKeyHeld(this.inputMapping.Down)) {
        this.camera.position.addScaledVector(up, -this.speed);
    }

    this.camera.updateProjectionMatrix();
    }
}