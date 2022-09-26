import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let renderer, camera, scene, axesHelper, controls, light, meshes;
let amout = 10;
let count = Math.pow(amout, 3)
let white = new THREE.Color().setHex(0xffffff)
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2(1,1)
let color = new THREE.Color()
initRenderer()
initCamera()
initScene()
initHelper()
initControls()
initLight()
initMeshes()
render()
window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(this.window.innerWidth, this.window.innerHeight)
})
document.addEventListener("mousemove", (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1 //-1 ~ 1
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1 //-1 ~ 1
})
function initRenderer() {
    renderer = new THREE.WebGLRenderer()
    //设置像素比，设置以后会更清晰
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(30)
    scene.add(axesHelper)
}
function initLight() {
    light = new THREE.HemisphereLight(0xffffff, 0x888888)
    light.position.set(0, 1, 0)
    scene.add(light)
}
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
}
function initMeshes() {
    const geometry = new THREE.IcosahedronGeometry(0.5, 2)//正二十面体
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff })
    meshes = new THREE.InstancedMesh(geometry, material, count) //一组mesh
    let index = 0;
    const offset = (amout - 1) / 2 //4.5
    const matrix = new THREE.Matrix4();
    for (let i = 0; i < amout; i++) {
        for (let j = 0; j < amout; j++) {
            for (let k = 0; k < amout; k++) {
                matrix.setPosition(offset - i, offset - j, offset - k)
                meshes.setMatrixAt(index, matrix)
                meshes.setColorAt(index, white)
                index += 1;
            }
        }
    }
    scene.add(meshes)
}
function render() {
    renderer.render(scene, camera)
    raycaster.setFromCamera(mouse, camera)
    const intersection = raycaster.intersectObject(meshes)
    if (intersection.length > 0) {
        const instanceId = intersection[0].instanceId;
        meshes.getColorAt(instanceId, color)
        if (color.equals(white)) {
            meshes.setColorAt(instanceId, new THREE.Color().setHex(Math.random() * 0xffffff))
            meshes.instanceColor.needsUpdate = true;
        }
    }
    requestAnimationFrame(render)
}
