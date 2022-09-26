import * as THREE from "three"
//导入轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
//导入动画库
import gsap from "gsap"
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
//设置阻力。让控制器更有真实的效果，必须在动画训话中调用upatae
controls.enableDamping = true
//设置渲染函数
//添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5)
scene.add(axesHelper)
//设置动画
let ani1 = gsap.to(cube.position, {
    x: 5, duration: 5, ease: "none", onComplete: () => {
        console.log('over');
    }, repeat: -1,
    yoyo: true
})
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "none", repeat: -1 })
gsap.to(cube.scale, { x: 2, duration: 5, ease: "none" })
function readerFunc() {
    controls.update()
    render.render(scene, camera)
    //渲染下一帧的时候就会调用一次
    requestAnimationFrame(readerFunc)
}
readerFunc()
window.addEventListener("dblclick", () => {
    //暂停动画
    if (ani1.isActive()) {
        ani1.pause()
    } else {
        //恢复
        ani1.resume()
    }
    const fullScreenElemnt = document.fullscreenElement;
    if (fullScreenElemnt) {
        document.exitFullscreen()
    } else {
        //全屏
        render.domElement.requestFullscreen()
    }
})
//监听画面变化 更新渲染画面
window.addEventListener("resize", () => {
    // console.log("画面变化了");
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight //宽高比
    //更新摄像机的投影矩阵
    camera.updateProjectionMatrix()
    //更新渲染器
    render.setSize(window.innerWidth, window.innerHeight)
    //设置渲染器的像素比
    render.setPixelRatio(window.devicePixelRatio)
})