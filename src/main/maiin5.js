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
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //透视相机

//设置相机对象的位值x,y,z
camera.position.set(0, 0, 10)
//将相机添加到场景当中
scene.add(camera)

//打造酷炫三角形
for (let i = 0; i < 20; i++) {
    // 每一个三角形需要三个 顶点，每一个顶点要三个坐标
    const geo = new THREE.BoxBufferGeometry()
    const position = new Float32Array(9)
    for (let j = 0; j < 9; j++) {
        position[j] = Math.floor((Math.random() * 10) - 5)
    }
    geo.setAttribute(
        "position",
        new THREE.BufferAttribute(position, 3)
    )
    let color = new THREE.Color(Math.random(), Math.random(), Math.random())
    const mater = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.5 })
    const mesh = new THREE.Mesh(geo, mater)
    scene.add(mesh)
}

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