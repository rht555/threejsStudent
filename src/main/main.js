import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入动画库
import gsap from "gsap"
//导入dat.gui
import * as dat from "dat.gui"
//了解基本内容
//创建场景
const scene = new THREE.Scene()

//创建相机//                               角度 ，宽高比
const camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 1000) //透视相机

//设置相机对象的位值x,y,z
camera.position.set(0, 0, 10)
//将相机添加到场景当中
scene.add(camera)
//导入纹理
const texture = new THREE.TextureLoader()
const door = texture.load("../assets/img/bg.jpg")
//设置纹理偏移
// door.offset.set(0.5, 0.5)
// 旋转
// door.rotation = Math.PI / 4
door.center.set(0.5, 0.5)
//添加物体
const subeGeo = new THREE.BoxBufferGeometry(1, 1, 1);
//材质
let color = new THREE.Color(Math.random(), Math.random(), Math.random())
const basic = new THREE.MeshBasicMaterial({ color, map: door })
const cube = new THREE.Mesh(subeGeo, basic)
scene.add(cube)
//初始化渲染器
const render = new THREE.WebGLRenderer()
//设置渲染尺寸
render.setSize(window.innerWidth, window.innerHeight)
//将webgl渲染的canvas内容添加到body
document.body.append(render.domElement)
//创建轨道控制器
const controls = new OrbitControls(camera, render.domElement)
//设置阻力。让控制器更有真实的效果，必须在动画训话中调用upatae
controls.enableDamping = true
//设置渲染函数
//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
function readerFunc() {
    controls.update()
    render.render(scene, camera)
    //渲染下一帧的时候就会调用一次
    requestAnimationFrame(readerFunc)
}
readerFunc()