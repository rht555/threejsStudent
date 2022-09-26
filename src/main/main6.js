/**
 * @Author rht
 * @Date 2022-08-27
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
//实例化纹理加载器
const textureLoader = new THREE.TextureLoader();
//声明全局变量
let camera, scene, renderer, labelRenderer, moon, earth, clock = new THREE.Clock();
let mouse = new THREE.Vector2();
let raycaster = new THREE.Raycaster();
/**
 * 初始化函数
 */
function init() {
    //地球和月球的半径大小
    const EARTH_RADIUS = 2.5;
    const MOON_RADIUS = 0.27
    //实例化相机
    /**
     * PerspectiveCamera 透视相机
     * Object3D->Camera->PerspectiveCamera
     * PerspectiveCamera( fov : Number, aspect : Number, near : Number, far : Number )
     * fov — 摄像机视锥体垂直视野角度
     * aspect — 摄像机视锥体长宽比
     * near — 摄像机视锥体近端面
     * far — 摄像机视锥体远端面
     */
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    //设置摄像机的位值
    camera.position.set(10, 5)
    //实例化场景
    scene = new THREE.Scene()
    //创建聚光灯光源,添加到场景当中
    /**
     * 聚光灯（SpotLight）
     * SpotLight( color : Integer, intensity : Float, distance : Float, angle : Radians, penumbra : Float, decay : Float )
     * color - (可选参数) 十六进制光照颜色。 缺省值 0xffffff (白色)。
     * intensity - (可选参数) 光照强度。 缺省值 1。
     * distance - 从光源发出光的最大距离，其强度根据光源的距离线性衰减。
     * angle - 光线散射角度，最大为Math.PI/2。
     * penumbra - 聚光锥的半影衰减百分比。在0和1之间的值。默认为0。
     * decay - 沿着光照距离的衰减量。
     */
    const dirLight = new THREE.SpotLight(0xffffff)
    dirLight.intensity = 2
    //辐射出对应的阴影 
    dirLight.castShadow = true
    dirLight.position.set(0, 0, 10)
    //添加到场景中
    scene.add(dirLight)
    //添加环境光
    const aLight = new THREE.AmbientLight(0xcccccc)
    aLight.intensity = 0.3
    scene.add(aLight)
    const moonGeometry = new THREE.SphereGeometry(MOON_RADIUS, 16, 16)
    //月球的材质
    const moonMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load('../assets/img/bg.jpg')
    })
    moon = new THREE.Mesh(moonGeometry, moonMaterial)
    moon.receiveShadow = true
    moon.castShadow = true
    moon.name = "月球"
    scene.add(moon)

    const earthGeometry = new THREE.SphereGeometry(EARTH_RADIUS, 16, 16)
    const earthMaterial = new THREE.MeshPhongMaterial({
        map: textureLoader.load("../assets/img/33.jpg"),
        shininess: 5
    })
    earth = new THREE.Mesh(earthGeometry, earthMaterial)
    earth.receiveShadow = true
    earth.castShadow = true
    earth.name = "地球"
    scene.add(earth)
    //创建渲染器
    renderer = new THREE.WebGLRenderer({
        alpha: true
    })
    //像素
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    //渲染阴影
    renderer.shadowMap.enabled = true
    document.body.appendChild(renderer.domElement)

    //绑定控制器和摄像头
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
}
//渲染函数
function animate() {
    const elapsed = clock.getElapsedTime() * 0.05
    moon.position.set(Math.sin(elapsed) * 5, 0, Math.cos(elapsed) * 5)
    //地球自转
    var axis = new THREE.Vector3(0, 1, 0)
    earth.rotateOnAxis(axis, Math.PI / 1000)
    moon.rotateOnAxis(axis, Math.PI / 2000)
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}

function onMouseClick(event) {
    //通过鼠标点击的位置计算出raycaster所需要的点的位置，以屏幕中心为原点，值的范围为-1到1.
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    // 通过鼠标点的位置和当前相机的矩阵计算出raycaster
    raycaster.setFromCamera(mouse, camera);

    // 获取raycaster直线和所有模型相交的数组集合
    var intersects = raycaster.intersectObjects(scene.children);

    //将所有的相交的模型的颜色设置为红色，如果只需要将第一个触发事件，那就数组的第一个模型改变颜色即可
    if (intersects.length > 0) {
        console.log(intersects[0].object.name + '被点击了')
    }
    // for (var i = 0; i < intersects.length; i++) {
    // }
}
window.addEventListener("click", onMouseClick, false)
init()
animate()