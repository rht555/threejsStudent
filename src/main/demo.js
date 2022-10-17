import * as THREE from "three"
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls"
let renderer, camera, scene, axesHelper, controls;
initRenderer()
initCamera()
initScene()
initLight()
initMeshes()
initHelper()
initControls()
function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    //设置像素比，设置以后会更清晰
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 0, 500)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFFFAF0)
}
function initLight() {
    scene.add(new THREE.AmbientLight(0x222222))
    const light = new THREE.PointLight(0xffffff)
    light.position.copy(camera.position)
    scene.add(light)
}

function initMeshes() {
    //例1：环形extrude
    //path
    const closedSpline = new THREE.CatmullRomCurve3(
        [
            new THREE.Vector3(-60, -100, 60), //左下
            new THREE.Vector3(-60, 20, 60), //左中
            new THREE.Vector3(-60, 120, 60), //左上
            new THREE.Vector3(60, 20, -60), //右中
            new THREE.Vector3(60, -100, -60), //右下
        ]
    )
    closedSpline.curveType = 'catmullrom';
    closedSpline.closed = true;
    //extruede setting
    const extrudeSettings = {
        steps: 100,
        bevelEnabled: false,
        extrudePath: closedSpline
    }
    const r = 20;
    const pts1 = [], count = 4;
    for (let i = 0; i < count; i++) {
        const a = i / count * 2 * Math.PI;
        pts1.push(new THREE.Vector2(
            r * Math.cos(a),
            r * Math.sin(a),
        ))
    }
    const shape1 = new THREE.Shape(pts1)
    // geometry
    const geometry1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings)
    const material = new THREE.MeshLambertMaterial({
        color: 0xb00000
    })
    const mesh1 = new THREE.Mesh(geometry1, material)
    scene.add(mesh1)

    //2
    //path
    const randomPoints = [];
    for (let i = 0; i < 10; i++) {
        randomPoints.push(new THREE.Vector3(
            (i - 4.5) * 50, THREE.MathUtils.randFloat(-50, 50), THREE.MathUtils.randFloat(-50, 50)
        ))
    }
    const randomSpline = new THREE.CatmullRomCurve3(randomPoints)
    const extrudeSettings2 = {
        steps: 200,
        bevelEnabled: false,
        extrudePath: randomSpline
    }
    //shape
    const pts2 = [], numPts = 5;
    for (let i = 0; i < numPts * 2; i++) {
        const l = i % 2 == 1 ? 10 : 20;
        const a = i / numPts * Math.PI;
        pts2.push(
            new THREE.Vector2(Math.cos(a) * l, Math.sin(a) * l)
        )
        const shape2 = new THREE.Shape(pts2)
        const geometry2 = new THREE.ExtrudeGeometry(shape2, extrudeSettings2)
        const material2 = new THREE.MeshLambertMaterial({
            color: 0xff8000
        })
        scene.add(new THREE.Mesh(geometry2, material2))
    }
}
function initHelper() {
    axesHelper = new THREE.AxesHelper(100)
    scene.add(axesHelper)
}

function initControls() {
    controls = new TrackballControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.minDistance = 200;
    controls.maxDistance = 500;
    controls.update()
}
animate()
function animate() {
    requestAnimationFrame(animate)
    controls.update()
    render()
}
function render() {
    renderer.render(scene, camera)
}