import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let renderer, camera, scene, axesHelper, controls;
let mesh;
let clip, mixer;
let clock = new THREE.Clock()
initRenderer()
initCamera()
initScene()
initLight()
initMesh()
initHelper()
initControls()
initAnimation()
enableAnimation()
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
    scene.background = new THREE.Color(0x888888)
}
function initLight() {
    scene.add(new THREE.AmbientLight(0xffffff, 0.2))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(10, 10, 5)
    scene.add(dirLight)
}
function initMesh() {
    mesh = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: 0xff0000 })
    )
    scene.add(mesh)
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)
}
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, 0)
    controls.update()
}
function initAnimation() {
    //位值
    const positionKey = new THREE.VectorKeyframeTrack(
        '.position',
        [0, 1, 2],
        [
            0, 0, 0,
            10, 0, 0,
            0, 0, 0
        ]
    ) // 关键帧
    //缩放
    const scaleKey = new THREE.VectorKeyframeTrack(
        ".scale",
        [0, 1, 2],
        [
            1, 1, 1,
            2, 2, 2,
            1, 1, 1
        ]
    )
    //旋转
    const xAxis = new THREE.Vector3(1, 0, 0)
    const qInitial = new THREE.Quaternion().setFromAxisAngle(xAxis, 0)
    const qFinal = new THREE.Quaternion().setFromAxisAngle(xAxis, Math.PI)
    const quaternionKey = new THREE.QuaternionKeyframeTrack(
        ".quaternion",
        [0, 1, 2],
        [
            qInitial.x, qInitial.y, qInitial.z, qInitial.w,
            qFinal.x, qFinal.y, qFinal.z, qFinal.w,
            qInitial.x, qInitial.y, qInitial.z, qInitial.w,
        ]
    )
    const colorKey = new THREE.ColorKeyframeTrack(
        ".material.color",
        [0, 1, 2],
        [
            1,0,0,
            0,1,0,
            0,0,1,
        ]

    )
    clip = new THREE.AnimationClip(
        "Action",
        4, //持续时间
        [positionKey, scaleKey, quaternionKey, colorKey]
    )
}


function enableAnimation() {
    mixer = new THREE.AnimationMixer(mesh) //动画混合器
    const clipAction = mixer.clipAction(clip)
    clipAction.play()
}

function animate() {
    requestAnimationFrame(animate)
    render()
}
function render(e) {
    const delta = clock.getDelta()
    renderer.render(scene, camera)
    mixer.update(delta)
}