//导入threejs
import * as THREE from 'three';
//导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//声明相机
let camera;
//声明控制器
let controls;
//声明场景
let scene;
//声明渲染器
let renderer;
//声明辅助轴
let axesHelper;
// 声明变量存储鼠标位置
let mouseX = 0, mouseY = 0;
//监听窗口变化
window.addEventListener('resize', onWindowResize, false);
// 监听指针移动事件
document.addEventListener('pointermove', onPointerMove);
function onPointerMove(e) {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;
}
let material;
//初始化
function init() {
    //创建场景
    scene = new THREE.Scene();
    //设置背景颜色
    scene.background = new THREE.Color(0x000000);
    // 给场景添加雾
    scene.fog = new THREE.FogExp2(0x000000, 0.0007);
    //创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    //设置相机位置
    camera.position.set(10, 10, 10);
    //创建渲染器
    renderer = new THREE.WebGLRenderer();
    //设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    //将渲染器添加到body中
    document.body.appendChild(renderer.domElement);
    //创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    //渲染
    render();
}
//初始化渲染函数
function render() {
    const time = Date.now() * 0.00005;
    // 相机位置根据mouseX和mouseY变化
    camera.position.x += (mouseX - camera.position.x) * 0.05;
    camera.position.y += (-mouseY - camera.position.y) * 0.05;
    //相机朝向
    camera.lookAt(scene.position);
    if (material) {
        //根据time变化材质的color
        const h = (360 * (1.0 + time) % 360) / 360;
        material.color.setHSL(h, 0.5, 0.5);
    }
    //渲染
    renderer.render(scene, camera);
    //循环渲染
    requestAnimationFrame(render);
}
//窗口变化函数
function onWindowResize() {
    //设置相机宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    //更新相机投影矩阵
    camera.updateProjectionMatrix();
    //设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
}
//初始化辅助轴
function initHelper() {
    axesHelper = new THREE.AxesHelper(20);
    scene.add(axesHelper);
}
//动画帧
function animate() {
    requestAnimationFrame(animate);
    //渲染
    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
}
function initMesh() {
    //geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    //循环1000次
    for (let i = 0; i < 1000; i++) {
        //生成变量x范围在-1000到1000之间
        const x = 2000 * Math.random() - 1000;
        //生成变量y范围在-1000到1000之间
        const y = 2000 * Math.random() - 1000;
        //生成变量z范围在-1000到1000之间
        const z = 2000 * Math.random() - 1000;
        //将x,y,z添加到vertices中
        vertices.push(x, y, z);
    }
    //设置geometry的属性position
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    // texture
    const texture = new THREE.TextureLoader().load('../assets/img/ball.png');
    //设置材质
    material = new THREE.PointsMaterial({ color: 0x888888, size: 50, map: texture, alphaTest: 0.5, transparent: true });
    //创建点
    const points = new THREE.Points(geometry, material);
    //将点添加到场景中
    scene.add(points);
}
init();
animate();
initHelper();
initMesh();