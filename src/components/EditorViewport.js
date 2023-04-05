import { Scene, Camera, MeshRenderer, UnlitMaterial, Mesh } from "@onepolygon/webgl-pbr";

export class EditorViewport {
    /**
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas) {
        this.canvas = canvas;

        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientWidth * 9 / 16;

        this.scene = new Scene(canvas);
        this.camera = new Camera();
        this.scene.setCamera(this.camera);

        this.mesh = new Mesh();
        const s = 1.0;
        this.mesh.vertices = [
            -s, -s, 0.0,
            -s, s, 0.0,
            s, s, 0.0,
            s, -s, 0.0
        ];
        this.mesh.normals = [
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0,
            0.0, 0.0, 1.0
        ];
        this.mesh.uv = [
            0.0, 0.0,
            0.0, 1.0,
            1.0, 1.0,
            1.0, 0.0
        ];
        this.mesh.indices = [
            0, 3, 2, 2, 1, 0
        ];
        this.mesh.update();
        this.material = new UnlitMaterial([1.0, 0.0, 0.0, 1.0]);

        const plane = new MeshRenderer(this.mesh, this.material);
        this.shader = this.material.shader;
        this.scene.add(plane);
    }
}