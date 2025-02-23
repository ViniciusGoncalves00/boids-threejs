import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "../managers/input-manager";
import { InputMapping } from "../input-mapping";
import { degToRad } from "three/src/math/MathUtils";

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

export class CameraController {
    private _camera: THREE.PerspectiveCamera | THREE.OrthographicCamera;
    private _canvas: HTMLCanvasElement;
    private _inputManager: InputManager;
    private _speed: number = 1;
    private _orbitControls: OrbitControls;

    private _wasMoving: boolean = false;

    constructor(cameraProjection: string, canvas: HTMLCanvasElement) {
        this._canvas = canvas;

        if(cameraProjection == "Perspective") {
            this._camera = this.SetPerspectiveProjection()
        }
        else if(cameraProjection == "Orthographic") {
            this._camera = this.SetOrthographicProjection()
        }
        else {
            throw new Error("Argument is not a projection type")
        }

        this._inputManager = InputManager.GetInstance();

        this._orbitControls = new OrbitControls(this._camera, canvas);
        // this._orbitControls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown'}
        // this._orbitControls.enableDamping = true;
        // this._orbitControls.dampingFactor = 0.05;
        this._orbitControls.minDistance = 1;
        this._orbitControls.maxDistance = 100000;
        
        this._orbitControls.update();
    }

    public GetCamera(): THREE.Camera {
        return this._camera;
    }

    public Update(): void {
        const localForward = new THREE.Vector3();
        const localRight = new THREE.Vector3();
        const worldUp = new THREE.Vector3();

        this._camera.getWorldDirection(localForward);
        localForward.normalize();

        localRight.crossVectors(localForward, this._camera.up).normalize();

        worldUp.copy(this._camera.up).normalize();

        let speed = this._speed;

        let keyHelded = false;
        // if (this._inputManager.GetKeyHeld(InputMapping.Moddifier)) {
        //     speed *= 10
        // }

        if (this._inputManager.GetKeyHeld(InputMapping.Forward)) {
            this._camera.position.addScaledVector(localForward, speed);
            keyHelded = true;
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Backward)) {
            this._camera.position.addScaledVector(localForward, -speed);
            keyHelded = true;
        }

        if (this._inputManager.GetKeyHeld(InputMapping.Right)) {
            this._camera.position.addScaledVector(localRight, speed);
            keyHelded = true;
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Left)) {
            this._camera.position.addScaledVector(localRight, -speed);
            keyHelded = true;
        }

        if (this._inputManager.GetKeyHeld(InputMapping.Up)) {
            this._camera.position.y += speed;
            keyHelded = true;
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Down)) {
            this._camera.position.y -= speed;
            keyHelded = true;
        }

        if (keyHelded) {
            this._orbitControls.enableRotate = false;
            this._wasMoving = true;
        } else {
            this._orbitControls.enableRotate = true;
    
            if (this._wasMoving) {
                const newTarget = new THREE.Vector3();
                this._camera.getWorldDirection(newTarget);
                newTarget.multiplyScalar(100).add(this._camera.position);
                this._orbitControls.target.copy(newTarget);
                this._orbitControls.update();
                this._wasMoving = false;
            }
        }
    
        this._camera.updateProjectionMatrix();
    }

    public Rotate(angle_degrees: number) {
        this._camera.rotateZ(degToRad(angle_degrees));
        this._camera.updateProjectionMatrix();
    }

    public ToggleProjection(projection: string): void {
        projection.toLowerCase()
        
        switch (projection) {
            case "perspective":
                this.SetPerspectiveProjection();
                break;
            case "orthographic":
                this.SetOrthographicProjection();
                break;
            default:
                this.SetPerspectiveProjection();
                break;
        }

        this._orbitControls = new OrbitControls(this._camera, this._canvas);
        this._camera.updateProjectionMatrix();
    }

    public ToggleView(view_size : { width: number, height: number}, view: string, bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}}): void {
        const face_mapping: Record<string, [number, number]> = {
            right: [2, 1],
            left: [2, 1],
            front: [0, 1],
            back: [0, 1],
            superior: [0, 2],
            inferior: [0, 2],
            isometric: [0, 2],
        };
        const directions: Record<string, [number, number, number]> = {
            right: [1, 0, 0],
            left: [-1, 0, 0],
            front: [0, 0, 1],
            back: [0, 0, -1],
            superior: [0, 1, 0],
            inferior: [0, -1, 0],
            isometric: [1, 1, 1],
        };

        const direction = directions[view];
        const view_map = face_mapping[view];

        if (this._camera instanceof THREE.PerspectiveCamera) {
            this.SetPerspectiveView(bounds, view_map, direction);
        } else {
            this.SetOrthographicView(view_size, bounds, view_map, direction);
        }
    }

    private SetPerspectiveProjection(): THREE.PerspectiveCamera {
        const aspect_ratio = this._canvas.clientWidth / this._canvas.clientHeight;
        const perspective_camera = new THREE.PerspectiveCamera(50, aspect_ratio, 0.01, 100000);
        this._camera = perspective_camera;
        this._camera.position.set(500, 500, 500);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        return perspective_camera;
    }
    private SetOrthographicProjection(): THREE.OrthographicCamera {
        const orthographic_camera = new THREE.OrthographicCamera(
            this._canvas.clientWidth / -2,
            this._canvas.clientWidth / 2,
           this._canvas.clientHeight / 2,
           this._canvas.clientHeight / -2,
            0.0,
            1000000
        );
        this._camera = orthographic_camera;
        this._camera.position.set(500, 500, 500);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        return orthographic_camera;
    }

    private SetPerspectiveView(
        bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}},
        face: [number, number],
        direction: [number, number, number]
    ) {
        const framing_buffer_multiplier: number = 2;

        const size = [
            Math.abs(bounds.max.x - bounds.min.x),
            Math.abs(bounds.max.y - bounds.min.y),
            Math.abs(bounds.max.z - bounds.min.z),
        ];
        const center = [
            (bounds.min.x + bounds.max.x) / 2,
            (bounds.min.y + bounds.max.y) / 2,
            (bounds.min.z + bounds.max.z) / 2,
        ];

        const camera = this._camera as THREE.PerspectiveCamera;

        // we need the field of view to be able to frame
        const fovVertical = camera.fov;
        const fovVerticalRad = THREE.MathUtils.degToRad(fovVertical);

        // threeJS does not give the horizontal field of view, so we need to calculate
        const aspect = camera.aspect;
        const fovHorizontalRad = 2 * Math.atan(Math.tan(fovVerticalRad / 2) * aspect);

        // at this moment, we need to see the lower field of view, and the higher dimension of domain
        const lower_fov = Math.min(fovHorizontalRad, fovVerticalRad);
        const higher_dimension = Math.max(size[face[0]], size[face[1]]);

        // finally, the distance to the domain boundary will be the worst case result for framing (lower fov, higher domain dimension)
        const distance =
            (higher_dimension / 2 / Math.tan(lower_fov / 2)) * framing_buffer_multiplier;

        this._camera.position.set(
            distance * direction[0] + center[0],
            distance * direction[1] + center[1],
            distance * direction[2] + center[2]
        );

        this._camera.lookAt(center[0], center[1], center[2]);
        this._orbitControls.target = new THREE.Vector3(center[0], center[1], center[2]);
        camera.updateProjectionMatrix();
    }

    private SetOrthographicView(
        view_size : { width: number, height: number},
        bounds: {min: {x: number, y: number, z: number}, max: {x: number, y: number, z: number}},
        face: [number, number],
        direction: [number, number, number]
    ) {
        const framing_buffer_multiplier: number = 1.2;

        const size = [
            Math.abs(bounds.max.x - bounds.min.x),
            Math.abs(bounds.max.y - bounds.min.y),
            Math.abs(bounds.max.z - bounds.min.z),
        ];
        const center = [
            (bounds.min.x + bounds.max.x) / 2,
            (bounds.min.y + bounds.max.y) / 2,
            (bounds.min.z + bounds.max.z) / 2,
        ];

        const camera = this._camera as THREE.OrthographicCamera;

        const width = size[face[0]];
        const height = size[face[1]];
        const higher_dimension = Math.max(width, height);

        const renderer_width = view_size.width;
        const renderer_height = view_size.height;

        const maxSize = Math.max(renderer_width, renderer_height);
        const normalizedWidth = renderer_width / maxSize;
        const normalizedHeight = renderer_height / maxSize;

        camera.left = -higher_dimension * normalizedWidth * framing_buffer_multiplier;
        camera.right = higher_dimension * normalizedWidth * framing_buffer_multiplier;
        camera.top = higher_dimension * normalizedHeight * framing_buffer_multiplier;
        camera.bottom = -higher_dimension * normalizedHeight * framing_buffer_multiplier;

        const distance = higher_dimension * framing_buffer_multiplier;

        camera.position.set(0, 0, 0);
        camera.lookAt(-direction[0], -direction[1], -direction[2]);

        camera.position.set(
            distance * direction[0] + center[0],
            distance * direction[1] + center[1],
            distance * direction[2] + center[2]
        );

        this._orbitControls.target = new THREE.Vector3(center[0], center[1], center[2]);
        this._camera.updateProjectionMatrix();
    }
}