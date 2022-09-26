import * as THREE from "three"
import { Mesh } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { ShadowMapViewer } from "three/examples/jsm/utils/ShadowMapViewer"
let renderer, camera, scene, axesHelper, controls;
let dirLight, spotLight;
let ground, torusKont, cube;
let clock = new THREE.Clock()
let dirViewer, spotViewer;
initRenderer()
initCamera()
initScene()
initHelper()
initLights()
initMeshes()
enableShadow()
initControls()
initCameraHelper()
initShadowMapViewer()
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
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(15, 15, 15)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)
}
function initLights() {
    // 环境光
    scene.add(new THREE.AmbientLight({ Color: 0x404040 }))
    //spot Light 聚光灯
    spotLight = new THREE.SpotLight(0xffffff)
    spotLight.name = "spotLight"
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.3
    spotLight.position.set(10, 10, 5)
    scene.add(spotLight)

    //dir light
    dirLight = new THREE.DirectionalLight(0xaaaaaa, 0.5)
    dirLight.name = "dirLight"
    dirLight.position.set(0, 10, 0)
    scene.add(dirLight)
}
function initMeshes() {
    //环星戒
    torusKont = new Mesh(
        new THREE.TorusKnotGeometry(25, 8, 75, 20),
        new THREE.MeshPhongMaterial({ color: 0xff0000, shininess: 150, specular: 0x222222 })
    )
    torusKont.scale.multiplyScalar(1 / 18)
    torusKont.position.y = 3
    scene.add(torusKont)
    //cube
    cube = new THREE.Mesh(new THREE.BoxGeometry(3, 3, 3), torusKont.material)
    cube.position.set(8, 3, 8)
    scene.add(cube)

    // ground
    ground = new THREE.Mesh(
        new THREE.BoxGeometry(30, 0.15, 30),
        new THREE.MeshPhongMaterial({ color: 0xa0adaf, shininess: 150, specular: 0x111111 })
    )
    scene.add(ground)
}
function enableShadow() {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap
    dirLight.castShadow = true
    torusKont.castShadow = true
    torusKont.receiveShadow = true
    cube.castShadow = true
    cube.receiveShadow = true
    ground.castShadow = true
    ground.receiveShadow = true
    spotLight.castShadow = true
    spotLight.receiveShadow = true
}
render()
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, 0)
    controls.update()
}
function initCameraHelper() {
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 30;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 10;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.bottom = -10;
    scene.add(new THREE.CameraHelper(spotLight.shadow.camera))
    scene.add(new THREE.CameraHelper(dirLight.shadow.camera))
}
function initShadowMapViewer() {
    dirViewer = new ShadowMapViewer(dirLight)
    spotViewer = new ShadowMapViewer(spotLight)
    resizeShadowMapviewers()
    // scene.add(dirViewer)
    // scene.add(spotViewer)
}
function resizeShadowMapviewers() {
    const size = window.innerWidth * 0.15
    dirViewer.position.x = 10
    dirViewer.position.y = 10
    dirViewer.size.width = size
    dirViewer.size.height = size
    dirViewer.update()
}
function render(e) {
    const delta = clock.getDelta()
    renderer.render(scene, camera)
    torusKont.rotation.x -= 0.55 * delta
    torusKont.rotation.y -= 0.55 * delta
    cube.rotation.x -= 0.55 * delta
    cube.rotation.y -= 0.55 * delta
    dirViewer.render(renderer)
    requestAnimationFrame(render)
}
