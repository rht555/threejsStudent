import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GUI } from "dat.gui"
let renderer, camera, scene, axesHelper, controls, ambientLight, spotLight;
let plane, cylinder;
let spotLightHelper;
let gui;
initRenderer()
initCamera()
initScene()
initHelper()
intAmbientLight()
initSpotLight()
initSpotLightHelper()
initControls()
initMesh()
initShadow()
buildGUI()
render()
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(20, 60, 80)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(80)
    scene.add(axesHelper)
}
function intAmbientLight() {
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)
}
function initMesh() {
    const geometryPlane = new THREE.PlaneGeometry(80, 80)
    const materialPlane = new THREE.MeshPhongMaterial({ color: 0x808080 })
    plane = new THREE.Mesh(geometryPlane, materialPlane)
    plane.rotation.x = -Math.PI / 2
    scene.add(plane)

    const geometry = new THREE.CylinderGeometry(5, 5, 2, 24, 1, false)
    const material = new THREE.MeshPhongMaterial({ color: 0x408080 })
    cylinder = new THREE.Mesh(geometry, material)
    cylinder.position.y = 6
    scene.add(cylinder)
}
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
}
function initSpotLight() {
    spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(-50, 80, 0)
    spotLight.angle = Math.PI / 6
    spotLight.penumbra = 0.3
    scene.add(spotLight)
}
function initSpotLightHelper() {
    spotLightHelper = new THREE.SpotLightHelper(spotLight);
    scene.add(spotLightHelper)
}
function initShadow() {
    cylinder.castShadow = true
    plane.receiveShadow = true
    spotLight.castShadow = true
    renderer.shadowMap.enabled = true
}
function buildGUI() {
    gui = new GUI()
    const spotlightFolder = gui.addFolder("spoltLight")
    spotlightFolder.addColor(spotLight, "color").onChange((e) => {
        spotLightHelper.update()
    })
    spotlightFolder.add(spotLight, "angle", 0, Math.PI / 2).onChange((e) => {
        spotLightHelper.update()
    })
    spotlightFolder.add(spotLight, "penumbra", 0, 1).onChange((e) => {
        spotLightHelper.update()
    })
    spotlightFolder.add(spotLight, "intensity", 0, 1).onChange((e) => {
        spotLightHelper.update()
    })

    const cameraFolder = gui.addFolder("camer")
    cameraFolder.add(camera.position, "x", -1000, 1000).step(10)
    gui.close()
}
function render() {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
}