import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "./input-manager";
import { InputMapping } from "./input-mapping";
import { SceneManager } from "./scene-manager";
import { Domain } from "./domain";

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

    private _distanceMultiplierBuffer: number = 1.2;

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
        
        this.orbitControls.update();
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
        this.SetHorizontalView(0, 1, 2, 0, 1)
    }

    public BackView(): void {
        this.SetHorizontalView(0, 1, 2, 0, -1)
    }
    
    public RightView(): void {
        this.SetHorizontalView(2, 1, 0, 1, 0)
    }

    public LeftView(): void {
        this.SetHorizontalView(2, 1, 0, -1, 0)
    }

    public TopView(): void {
        this.SetTopDownView(1)
    }

    public BotView(): void {
        this.SetTopDownView(-1)
    }

    public IsometricView(): void {
        this.camera.position.x = 100;
        this.camera.position.y = 100;
        this.camera.position.z = 100;
        this.camera.lookAt(0, 0, 0);
    }

    private SetTopDownView(direction: number) {
        const domain = Domain.GetInstance()
        const center = domain.GetCenter();
        const size = domain.GetSize();

        const verticalFOVrad = this.camera.fov * Math.PI / 180;
        const aspectRatio = this.camera.aspect;
    
        const horizontalFOVrad = 2 * Math.atan(Math.tan(verticalFOVrad / 2) * aspectRatio);

        let fov: number = 0;
        let higherSize: number = 0;

        if(size[0] > size[2]) {
            fov = verticalFOVrad;
            higherSize = size[0]
        }
        else {
            fov = horizontalFOVrad;
            higherSize = size[2]
        }

        const distanceFromLimits = (higherSize / 2) * Math.tan(fov / 2)
        const distanceFromCenter = size[1] / 2;

        this.camera.position.x = center[0];
        this.camera.position.y = center[1] + (distanceFromLimits + (distanceFromCenter * this._distanceMultiplierBuffer)) * direction
        this.camera.position.z = center[2];
        
        this.camera.lookAt(center[0], center[1], center[2]);
    }

    private SetHorizontalView(right: number, upward : number, forward: number, right_multiplier: number, forward_multiplier: number) {
        const domain = Domain.GetInstance()
        const center = domain.GetCenter();
        const size = domain.GetSize();

        const verticalFOVrad = this.camera.fov * Math.PI / 180;
        const aspectRatio = this.camera.aspect;
    
        const horizontalFOVrad = 2 * Math.atan(Math.tan(verticalFOVrad / 2) * aspectRatio);

        let fov: number = 0;
        let higherSize: number = 0;

        if(size[right] > size[upward]) {
            fov = verticalFOVrad;
            higherSize = size[right]
        }
        else {
            fov = horizontalFOVrad;
            higherSize = size[upward]
        }

        const distanceFromLimits = (higherSize / 2) * Math.tan(fov / 2)
        const distanceFromCenter = size[forward] / 2;

        this.camera.position.x = center[0] + (distanceFromLimits + (distanceFromCenter * this._distanceMultiplierBuffer)) * right_multiplier;
        this.camera.position.y = center[1];
        this.camera.position.z = center[2] + (distanceFromLimits + (distanceFromCenter * this._distanceMultiplierBuffer)) * forward_multiplier;
        
        this.camera.lookAt(center[0], center[1], center[2]);
    }
}