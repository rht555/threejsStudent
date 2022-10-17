import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let renderer, camera, scene, axesHelper, controls;
let plane, box;
let raycaster = new THREE.Raycaster();
let v1 = new THREE.Vector3(0, 0, 0)
initRenderer()
initCamera()
initScene()
initLight()
initPlane()
// initBox()
initHelper()
// initControls()
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
    camera.position.set(100, 250, 100)
    camera.lookAt(50, 0, 50)
}
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x888888)
}
function initLight() {
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.125)
    dirLight.position.set(0, 0, 1).normalize()
    scene.add(dirLight)

    const pointLight = new THREE.PointLight(0xffffff, 1.5)
    pointLight.position.set(0, 100, 90)
    scene.add(pointLight)
}
function initPlane() {
    plane = new THREE.Mesh(
        new THREE.PlaneGeometry(200, 200),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
    )
    plane.position.set(50, 0, 50)
    plane.rotation.x = - Math.PI / 2
    plane.rotation.z = Math.PI / 4
    plane.name = "地面"
    scene.add(plane)
}
function initBox() {
    box = new THREE.Mesh(
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0x666666 })
    )
    scene.add(box)
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(100)
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
// 监听鼠标点击事件 展示详情页面
const onMouseClick = (event) => {
    const mouse = new THREE.Vector2() //创建二维向量保存鼠标的值
    mouse.x = event.clientX / window.innerWidth * 2 - 1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const intersection = raycaster.intersectObject(plane)
    if (intersection.length > 0) {
        // console.log(intersection[0].point);
        console.log(intersection[0].point.cross(v1));
    }
}
window.addEventListener("click", onMouseClick)