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
//声明一个cube
//声明天空盒
let skyBox;
//监听窗口变化
window.addEventListener('resize', onWindowResize, false);
//初始化
function init() {
    //创建场景
    scene = new THREE.Scene();
    //设置背景颜色
    scene.background = new THREE.Color(0x000000);
    //创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    //设置相机位置
    camera.position.set(2, 2, 2);
    //创建渲染器
    renderer = new THREE.WebGLRenderer();
    //设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    //将渲染器添加到body中
    document.body.appendChild(renderer.domElement);
    //创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    //限制控制器的范围
    controls.minDistance = 1;
    controls.maxDistance = 5;
    //禁止控制器平移
    controls.enablePan = false;
    //限制控制器旋转速度为0.3
    controls.rotateSpeed = 0.3;
    // 开启控制器阻尼
    controls.enableDamping = true;
    //创建天空盒
    createSkyBox();
    //渲染
    render();
}
//初始化渲染函数
function render() {
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
//初始化天空盒
function createSkyBox() {
    //创建一个立方体几何体
    let geometry = new THREE.BoxGeometry(10, 10, 10);
    const textures = getTextures("../assets/img/t1.jpg", 6);
    const materials = [];
    textures.forEach((texture) => {
        materials.push(new THREE.MeshBasicMaterial({
            map: texture
        }));
    })
    skyBox = new THREE.Mesh(geometry, materials);
    //翻转几何体
    skyBox.geometry.scale(-1, 1, 1);
    scene.add(skyBox);
}
//声明一个方法接收一个url和一个数组
function getTextures(urls, tilesNum) {
    //声明一个数组
    let textures = [];
    // 根据tilesNum的值，循环创建材质
    for (let i = 0; i < tilesNum; i++) {
        textures.push(new THREE.Texture())
    }
    //声明一个加载器
    let loader = new THREE.ImageLoader();
    loader.load(urls, function (image) {
        console.log(image);
        // 设置宽度
        let imageWidth = image.height;
        let canvas, context;
        // 循环给textures赋值
        for (let i = 0; i < textures.length; i++) {
            canvas = document.createElement('canvas');
            context = canvas.getContext('2d');
            canvas.height = imageWidth;
            canvas.width = imageWidth;
            context.drawImage(image, -i * imageWidth, 0);
            textures[i].image = canvas;
            textures[i].needsUpdate = true;
        }
    })
    return textures;
}
init();
animate();
initHelper();