import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { OimoPhysics } from "three/examples/jsm/physics/OimoPhysics"
let renderer, camera, scene, axesHelper, controls, light, dirLight;
let floor, boxes, spheres;
let physics;
let position = new THREE.Vector3()
let time = 0;
initRenderer()
initCamera()
initScene()
initHelper()
initControls()
initLight()
initMeshes()
enableShadow()
enablePhysics()

window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(this.window.innerWidth, this.window.innerHeight)
})
function initRenderer() {
    renderer = new THREE.WebGLRenderer()
    //设置像素比，设置以后会更清晰
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.outputEncoding = THREE.sRGBEncoding;
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(3, 3, 3)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x888888)
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)
}
function initLight() {
    //环境光
    light = new THREE.HemisphereLight(0xffffff, 0x888888)
    light.intensity = 0.3
    light.position.set(0, 1, 0)
    //加一个平行光
    dirLight = new THREE.DirectionalLight()
    dirLight.position.set(5, 5, -5)
    scene.add(dirLight)
    scene.add(light)
}
function initMeshes() {
    // boxes
    boxes = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshLambertMaterial(), // 镜面反射差，如木头之内的
        30
    )
    boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage) //提高画质
    const matrix = new THREE.Matrix4()

    for (let i = 0; i < boxes.count; i++) {
        matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5)
        boxes.setMatrixAt(i, matrix)
        boxes.setColorAt(i, new THREE.Color().setHex(Math.random() * 0xffffff))
    }
    spheres = new THREE.InstancedMesh(
        new THREE.IcosahedronGeometry(0.075, 3),
        new THREE.MeshLambertMaterial(), // 镜面反射差，如木头之内的
        30
    )
    spheres.instanceMatrix.setUsage(THREE.DynamicDrawUsage) //提高画质
    for (let i = 0; i < spheres.count; i++) {
        matrix.setPosition(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5)
        spheres.setMatrixAt(i, matrix)
        spheres.setColorAt(i, new THREE.Color().setHex(Math.random() * 0xffffff))
    }
    //floor
    floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, 1, 10),
        new THREE.ShadowMaterial({ color: 0x111111, })//影子的颜色
    )
    floor.position.set(0, -1, 0)
    scene.add(floor)
    scene.add(boxes)
    scene.add(spheres)
}
function enableShadow() {
    renderer.shadowMap.enabled = true
    dirLight.castShadow = true
    dirLight.shadow.camera.zoom  = 2;
    floor.receiveShadow = true
    boxes.castShadow = true
    boxes.receiveShadow = true
}
async function enablePhysics() {
    try {
        physics = await OimoPhysics()
    } catch (err) {
        console.log(err);
    }
    physics.addMesh(floor, 0)
    physics.addMesh(boxes, 1)
    physics.addMesh(spheres, 1)
    render()
}
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
}
function render(e) {

    renderer.render(scene, camera)
    if (e - time > 100) {
        let index = Math.floor(Math.random() * boxes.count)
        position.set(0, Math.random() * 2, 0);
        physics.setMeshPosition(boxes, position, index)
        let index2 = Math.floor(Math.random() * spheres.count)
        position.set(0, Math.random() * 2, 0);
        physics.setMeshPosition(spheres, position, index2)
        time = e
    }
    requestAnimationFrame(render)
}
