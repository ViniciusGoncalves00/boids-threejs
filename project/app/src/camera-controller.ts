import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "./input-manager";
import { InputMapping } from "./input-mapping";
import { SceneManager } from "./scene-manager";

export interface CameraControllerEventMap {
    /**
     * Fires when the camera has been transformed by the controls.
     */
    change: {};

    /**
     * Fires when an interaction was initiated.
     */
    start: {};

    /**
     * Fires when an interaction has finished.
     */
    end: {};
}

export class CameraController extends THREE.Controls<CameraControllerEventMap> {
    private camera: THREE.PerspectiveCamera;
    private inputManager: InputManager;
    private speed: number = 1;
    private orbitControls: OrbitControls;

    constructor(camera: THREE.PerspectiveCamera, domElement: HTMLElement) {
        super(camera, domElement);
        this.camera = camera;
        this.inputManager = InputManager.GetInstance();

        this.orbitControls = new OrbitControls( this.camera, domElement);
        this.orbitControls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown'}
        this.orbitControls.enableDamping = true;
        this.orbitControls.dampingFactor = 0.05;
        this.orbitControls.minDistance = 1;
        this.orbitControls.maxDistance = 100000;
        
        // this.orbitControls.enablePan = true;
        // this.orbitControls.enableRotate = true;
        // this.orbitControls.enableZoom = true;
        // this.orbitControls.update();
    }

    public Update(): void {
        // this.orbitControls.update();

        const localForward = new THREE.Vector3();
        const localRight = new THREE.Vector3();
        const worldUp = new THREE.Vector3();

        this.camera.getWorldDirection(localForward);
        localForward.normalize();

        localRight.crossVectors(localForward, this.camera.up).normalize();

        worldUp.copy(this.camera.up).normalize();

        let speed = this.speed;

        if (this.inputManager.GetKeyHeld(InputMapping.Moddifier)) {
            speed *= 10
        }

        if (this.inputManager.GetKeyHeld(InputMapping.Forward)) {
            this.camera.position.addScaledVector(localForward, speed);
        }
        if (this.inputManager.GetKeyHeld(InputMapping.Backward)) {
            this.camera.position.addScaledVector(localForward, -speed);
        }

        if (this.inputManager.GetKeyHeld(InputMapping.Right)) {
            this.camera.position.addScaledVector(localRight, speed);
        }
        if (this.inputManager.GetKeyHeld(InputMapping.Left)) {
            this.camera.position.addScaledVector(localRight, -speed);
        }

        if (this.inputManager.GetKeyHeld(InputMapping.Up)) {
            this.camera.position.y += speed;
        }
        if (this.inputManager.GetKeyHeld(InputMapping.Down)) {
            this.camera.position.y -= speed;
        }

        this.camera.updateProjectionMatrix();
    }

    public FrontView(): void {
        this.camera.position.x = 0
        this.camera.position.y = 0
        this.camera.position.z = 150
        this.camera.lookAt(0, 0, 0)
    }

    public BackView(): void {
        this.camera.position.x = 0
        this.camera.position.y = 0
        this.camera.position.z = -150
        this.camera.lookAt(0, 0, 0)
    }
    
    public RightView(): void {
        this.camera.position.x = 150
        this.camera.position.y = 0
        this.camera.position.z = 0
        this.camera.lookAt(0, 0, 0)
    }

    public LeftView(): void {
        this.camera.position.x = -150
        this.camera.position.y = 0
        this.camera.position.z = 0
        this.camera.lookAt(0, 0, 0)
    }

    public TopView(): void {
        this.camera.position.x = 0
        this.camera.position.y = 150
        this.camera.position.z = 0
        this.camera.lookAt(0, 0, 0)
    }

    public BotView(): void {
        this.camera.position.x = 0
        this.camera.position.y = -150
        this.camera.position.z = 0
        this.camera.lookAt(0, 0, 0)
    }

    public IsometricView(): void {
        this.camera.position.x = 100
        this.camera.position.y = 100
        this.camera.position.z = 100
        this.camera.lookAt(0, 0, 0)
    }
}