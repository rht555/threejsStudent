import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//控制3d物体移动
//了解基本内容
//创建场景
const scene = new THREE.Scene()

//创建相机//                               角度 ，宽高比
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000) //透视相机

//设置相机对象的位值x,y,z
camera.position.set(0, 0, 10)
//将相机添加到场景当中
scene.add(camera)
//添加物体
const cubeGeometry = new THREE.BoxGeometry()
//基本材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
//添加到场景
scene.add(cube)
console.log(cube);
//初始化渲染器
const render = new THREE.WebGLRenderer()
//设置渲染尺寸
render.setSize(window.innerWidth, window.innerHeight)
//将webgl渲染的canvas内容添加到body
document.body.append(render.domElement)
//使用渲染器通过相机将场景渲染出来
// render.render(scene, camera)
//创建轨道控制器
const controls = new OrbitControls(camera, render.domElement)
//设置渲染函数
//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
//设置时钟
const clock = new THREE.Clock()
function readerFunc() {
    //获取时钟运行的总时长
    let time = clock.getElapsedTime()
    // let deltaTime = clock.getDelta()
    // console.log("时钟总时长", time);
    // console.log("两次间隔时间", deltaTime);
    let t = time % 5;
    cube.position.x = t * 1
    render.render(scene, camera)
    //渲染下一帧的时候就会调用一次
    requestAnimationFrame(readerFunc)
}
readerFunc()