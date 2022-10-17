import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let renderer, camera, scene, axesHelper, controls;
let textureCube;
initRenderer()
initScene()
initCamera()
initMeshes()
initHelper()
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
    camera.position.set(2, 2, 2)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
    const urls = [
        '../assets/img/px.png',
        '../assets/img/nx.png',
        '../assets/img/py.png',
        '../assets/img/ny.png',
        '../assets/img/pz.png',
        '../assets/img/nz.png',
    ]
    textureCube = new THREE.CubeTextureLoader().load(urls)
    scene.background = textureCube

}

function initMeshes() {

    for (let i = 0; i < 100; i++) {
        let xq = new THREE.Mesh(
            new THREE.SphereGeometry(0.1, 64, 64),
            new THREE.MeshBasicMaterial({ color: 0xffffff, envMap: textureCube })
        )
        xq.position.set(Math.random() * 3, Math.random() * 3, Math.random() * 3)
        scene.add(xq)
    }
}

function initHelper() {
    axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
}

function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.update()
}
function animate() {
    requestAnimationFrame(animate)
    render()
}
function render() {
    renderer.render(scene, camera)
}