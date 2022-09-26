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
//添加物体
const cubeGeometry = new THREE.BoxGeometry()
//基本材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 })
//根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
//添加到场景
scene.add(cube)
const gui = new dat.GUI();
gui.add(cube.position, "x").min(0).max(5).step(0.1).name("x距离").onChange((value) => {
    console.log(value);
}).onFinishChange(() => { })
gui.addColor({ color: '#ffff00' }, "color").onChange(v => {
    // console.log(v);
    cube.material.color.set(v)
})
gui.add(cube, "visible").name("是否显示")
gui.add({
    fn: () => {
        gsap.to(cube.position, { x: 5, duration: 5, yoyo: true, repeat: -1 })
    }
}, 'fn')
var folder = gui.addFolder("设置立方体")
folder.add(cube.material,"wireframe")
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
function readerFunc() {
    controls.update()
    render.render(scene, camera)
    //渲染下一帧的时候就会调用一次
    requestAnimationFrame(readerFunc)
}
readerFunc()