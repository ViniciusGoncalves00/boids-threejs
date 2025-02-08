import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { InputManager } from "../input-manager";
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

        this._camera = new THREE.PerspectiveCamera()

        this._inputManager = InputManager.GetInstance();

        this._orbitControls = new OrbitControls(this._camera, canvas);
        // this.orbitControls.keys = { LEFT: 'ArrowLeft', UP: 'ArrowUp', RIGHT: 'ArrowRight', BOTTOM: 'ArrowDown'}
        // this.orbitControls.enableDamping = true;
        // this.orbitControls.dampingFactor = 0.05;
        this._orbitControls.minDistance = 1;
        this._orbitControls.maxDistance = 100000;
        
        this._orbitControls.update();
    }

    public GetCamera(): THREE.Camera {
        return this._camera;
    }

    public Update(): void {
        // this.orbitControls.update();

        const localForward = new THREE.Vector3();
        const localRight = new THREE.Vector3();
        const worldUp = new THREE.Vector3();

        this._camera.getWorldDirection(localForward);
        localForward.normalize();

        localRight.crossVectors(localForward, this._camera.up).normalize();

        worldUp.copy(this._camera.up).normalize();

        let speed = this._speed;

        if (this._inputManager.GetKeyHeld(InputMapping.Moddifier)) {
            speed *= 10
        }

        if (this._inputManager.GetKeyHeld(InputMapping.Forward)) {
            this._camera.position.addScaledVector(localForward, speed);
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Backward)) {
            this._camera.position.addScaledVector(localForward, -speed);
        }

        if (this._inputManager.GetKeyHeld(InputMapping.Right)) {
            this._camera.position.addScaledVector(localRight, speed);
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Left)) {
            this._camera.position.addScaledVector(localRight, -speed);
        }

        if (this._inputManager.GetKeyHeld(InputMapping.Up)) {
            this._camera.position.y += speed;
        }
        if (this._inputManager.GetKeyHeld(InputMapping.Down)) {
            this._camera.position.y -= speed;
        }

        this._camera.updateProjectionMatrix();
    }

    public Rotate(angle_degrees: number) {
        this._camera.rotateZ(degToRad(angle_degrees));
        this._camera.updateProjectionMatrix();
    }

    public ToggleProjection(projection: string): void {
        switch (projection) {
            case "Perspective":
                this.SetPerspectiveProjection();
                break;
            case "Orthographic":
                this.SetOrthographicProjection();
                break;
            default:
                this.SetPerspectiveProjection();
                break;
        }

        this._orbitControls = new OrbitControls(this._camera, this._canvas);
        this._camera.updateProjectionMatrix();
    }

    public ToggleView(canvas_size : { width: number, height: number}, view: string, bounds: { min: [number, number, number]; max: [number, number, number] }): void {
        const face_mapping: Record<string, [number, number]> = {
            right: [1, 2],
            left: [1, 2],
            front: [0, 2],
            back: [0, 2],
            superior: [0, 1],
            inferior: [0, 1],
            isometric: [0, 2],
        };
        const directions: Record<string, [number, number, number]> = {
            right: [1, 0, 0],
            left: [-1, 0, 0],
            front: [0, 1, 0],
            back: [0, -1, 0],
            superior: [0, 0, 1],
            inferior: [0, 0, -1],
            isometric: [1, 1, 1],
        };

        const direction = directions[view];
        const view_map = face_mapping[view];

        if (this._camera instanceof THREE.PerspectiveCamera) {
            this.SetPerspectiveView(bounds, view_map, direction);
        } else {
            this.SetOrthographicView(canvas_size, bounds, view_map, direction);
        }
        if (view == "superior" || view == "inferior") {
            this._camera.rotateZ(degToRad(-90));
        }
    }

    private SetPerspectiveProjection(): THREE.PerspectiveCamera {
        const aspect_ratio = window.innerWidth / window.innerHeight;
        const perspective_camera = new THREE.PerspectiveCamera(75, aspect_ratio, 0.01, 100000);
        perspective_camera.up.set(0, 0, 1);
        this._camera = perspective_camera;
        this._camera.position.set(500, 500, 500);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        return perspective_camera;
    }
    private SetOrthographicProjection(): THREE.OrthographicCamera {
        const orthographic_camera = new THREE.OrthographicCamera(
            window.innerWidth / -2,
            window.innerWidth / 2,
            window.innerHeight / 2,
            window.innerHeight / -2,
            0.0,
            1000000
        );
        orthographic_camera.up.set(0, 0, 1);
        this._camera = orthographic_camera;
        this._camera.position.set(500, 500, 500);
        this._camera.lookAt(new THREE.Vector3(0, 0, 0));
        return orthographic_camera;
    }

    private SetPerspectiveView(
        bounds: { min: [number, number, number]; max: [number, number, number] },
        face: [number, number],
        direction: [number, number, number]
    ) {
        const framing_buffer_multiplier: number = 2;

        const size = [
            Math.abs(bounds.max[0] - bounds.min[0]),
            Math.abs(bounds.max[1] - bounds.min[1]),
            Math.abs(bounds.max[2] - bounds.min[2]),
        ];
        const center = [
            (bounds.min[0] + bounds.max[0]) / 2,
            (bounds.min[1] + bounds.max[1]) / 2,
            (bounds.min[2] + bounds.max[2]) / 2,
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
        renderer_size : { width: number, height: number},
        bounds: { min: [number, number, number]; max: [number, number, number] },
        face: [number, number],
        direction: [number, number, number]
    ) {
        const framing_buffer_multiplier: number = 1.2;

        const size = [
            Math.abs(bounds.max[0] - bounds.min[0]),
            Math.abs(bounds.max[1] - bounds.min[1]),
            Math.abs(bounds.max[2] - bounds.min[2]),
        ];
        const center = [
            (bounds.min[0] + bounds.max[0]) / 2,
            (bounds.min[1] + bounds.max[1]) / 2,
            (bounds.min[2] + bounds.max[2]) / 2,
        ];

        const camera = this._camera as THREE.OrthographicCamera;

        const width = size[face[0]];
        const height = size[face[1]];
        const higher_dimension = Math.max(width, height);

        const renderer_width = renderer_size.width;
        const renderer_height = renderer_size.height;

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