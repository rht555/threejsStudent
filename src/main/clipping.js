import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let renderer, camera, scene, axesHelper, controls;
let ground, object;
let spotLight, dirLight;
let material;
initRenderer()
initScene()
initCamera()
initLights()
initMeshes()
enableShadow()
enableClipping()
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
    scene.background = new THREE.Color(0x888888)
}
function initLights() {
    spotLight = new THREE.SpotLight(0xffffff)
    spotLight.position.set(3, 3, 1)
    spotLight.angle = Math.PI / 8 //角度
    spotLight.penumbra = 0.3 //半影
    scene.add(spotLight)

    dirLight = new THREE.DirectionalLight(0x55505a, 1)
    dirLight.position.set(0, 3, 0)
    scene.add(dirLight)
}
function initMeshes() {
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(10, 10),
        new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150 })
    )
    ground.rotateX(-Math.PI / 2)
    scene.add(ground)

    material = new THREE.MeshPhongMaterial({ color: 0x80ee10, shininess: 100 })
    object = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.4, 0.08, 95, 20),
        material
    )
    object.position.set(0, 0.8, 0)
    scene.add(object)
}

function enableShadow() {
    renderer.shadowMap.enabled = true
    // renderer.shadowMap.type = THREE.BasicShadowMap
    dirLight.castShadow = true
    spotLight.castShadow = true
    ground.castShadow = true
    ground.receiveShadow = true
    object.castShadow = true
    // object.receiveShadow = true
}
function enableClipping() {
    const plane = new THREE.Plane(new THREE.Vector3(1, 0, 0), 0);
    //localClippingEnabled
    material.clippingPlanes = [plane];
    material.side = THREE.DoubleSide
    material.clipShadows = true
    renderer.localClippingEnabled = true
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