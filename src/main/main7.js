import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Water } from "three/examples/jsm/objects/Water2"
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
const textureLoader = new THREE.TextureLoader()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
const render = new THREE.WebGLRenderer({
    //设置抗锯齿
    antialias: true
})
render.outputEncoding = THREE.sRGBEncoding;
render.setSize(window.innerWidth, window.innerHeight)
//设置相机的位值
camera.position.set(-50, 50, 130)
//跟新摄像头宽高的比例
camera.aspect = window.innerWidth / window.innerHeight
//跟新助阵
camera.updateProjectionMatrix()
scene.add(camera)

//添加平面
const planeGeometry = new THREE.PlaneGeometry(100, 100)
const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff
})
const plan = new THREE.Mesh(planeGeometry, planeMaterial)
plan.position.y = 10
plan.rotation.x = -Math.PI / 2
scene.add(plan)
//监听屏幕的大小改变

const skyGeometry = new THREE.SphereGeometry(1000, 60, 60)
const skyMaterial = new THREE.MeshBasicMaterial({
    map: textureLoader.load("../assets/img/sky.jpg")
})
skyGeometry.scale(1, 1, -1)
const sky = new THREE.Mesh(skyGeometry, skyMaterial)
scene.add(sky)

const loader = new GLTFLoader()
var dracoLoader = new DRACOLoader()
loader.setDRACOLoader(dracoLoader)
loader.load('../assets/3d/test1.glb', (obj) => {
    obj.scene.traverse(child => {
        if (child.type == 'Mesh') {
            child.castShadow = true
            child.receiveShadow = true
        }
    })
    obj.scene.receiveShadow = true
    obj.scene.position.setX(100)
    obj.scene.position.setY(100)
    scene.add(obj.scene)
})
const waterG = new THREE.CircleBufferGeometry(300, 64)
const water = new Water(waterG, {
    textureWidth: 1024,
    textureHeight: 1024,
    color: 0xddddff,
    flowDirection: new THREE.Vector2(1, 1),
    scale: 1,
})
water.rotation.x = -Math.PI / 2
scene.add(water)
const controls = new OrbitControls(camera, render.domElement)
window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    render.setSize(window.innerWidth, window.innerHeight)
})
document.body.appendChild(render.domElement)

function renderer() {
    render.render(scene, camera)
    requestAnimationFrame(renderer)
}
renderer()