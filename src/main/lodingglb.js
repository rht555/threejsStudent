import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
let renderer, camera, scene, axesHelper, controls;
let model;
let hemLight, dirLight;
initRenderer()
initCamera()
initScene()
initHelper()
initLight()
initMeshes()
enableShadow()
initControls()
animate()
window.addEventListener("resize", function () {
    camera.aspect = this.window.innerWidth / this.window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(this.window.innerWidth, this.window.innerHeight)
})
function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true })
    //设置像素比，设置以后会更清晰
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.outputEncoding = THREE.sRGBEncoding
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(1, 2, -3)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x888888)
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
}

function initLight() {
    hemLight = new THREE.HemisphereLight(0xffffff, 0x444444)
    scene.add(hemLight)
    dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(-3, 0, -10)
    scene.add(dirLight)
}

function initMeshes() {
    const loader = new GLTFLoader()
    loader.load("../assets/3d/盖子.glb", function (gltf) {
        console.log(gltf);
        model = gltf.scene
        model.rotation.y = Math.PI * 2 - Math.PI / 2
        scene.add(model)
        //动画我没得，随便写写
    })
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, 0)
    controls.update()
}
function enableShadow() {
}
function animate() {
    requestAnimationFrame(animate)
    render()
}
function render() {
    renderer.render(scene, camera)
}