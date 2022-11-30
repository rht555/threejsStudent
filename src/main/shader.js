//导入threejs
import * as THREE from 'three';
//导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//导入水
import { Water } from 'three/examples/jsm/objects/Water.js';
//导入sky
import { Sky } from 'three/examples/jsm/objects/Sky.js';
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
//声明水
let water;
//声明太阳
let sun;
//天空
let sky;
//声明cube
let cube;
let pmremGenerator;
let renderTarget;
//监听窗口变化
window.addEventListener('resize', onWindowResize, false);
//初始化
function init() {
    //创建场景
    scene = new THREE.Scene();
    //设置背景颜色
    scene.background = new THREE.Color(0x000000);
    //创建相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    //设置相机位置
    camera.position.set(-20, 20, 0);
    //创建渲染器
    renderer = new THREE.WebGLRenderer();
    pmremGenerator = new THREE.PMREMGenerator(renderer);
    render.toneMapping = THREE.ACESFilmicToneMapping;
    //设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    //将渲染器添加到body中
    document.body.appendChild(renderer.domElement);
    //创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    //设置控制器的聚焦点
    controls.target.set(0, 10, 0);
    //限制控制器旋转速度为0.3
    controls.rotateSpeed = 0.3;
    // 开启控制器阻尼
    controls.enableDamping = true;
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
    if (water)
        water.material.uniforms['time'].value += 1.0 / 60.0;
    const time = performance.now() * 0.0001;
    if (cube) cube.position.y = Math.sin(time) * 20 + 5;
    if (cube) cube.rotation.x = time * 5;
    if (cube) cube.rotation.z = time * 5;
    requestAnimationFrame(animate);
    //渲染
    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
}
//初始化水
function initWater() {
    sun = new THREE.Vector3(100, 1, 0);
    //创建水
    water = new Water(
        //水面
        new THREE.PlaneGeometry(10000, 10000),
        //水面参数
        {
            textureWidth: 512,//水面宽度
            textureHeight: 512,//水面高度
            waterNormals: new THREE.TextureLoader().load('../assets/img/waterdudv.jpg', function (texture) {
                texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
            }),
            alpha: 1.0,
            sunDirection: sun,//太阳方向
            sunColor: 0xffffff,//太阳颜色
            waterColor: 0x001e0f,//水面颜色
            distortionScale: 2.7,//水面扭曲程度
            fog: scene.fog !== undefined,//是否开启雾化
        }
    );
    //设置水面位置
    water.position.y = 10;
    //设置水面旋转
    water.rotation.x = - Math.PI / 2;
    //将水面添加到场景中
    scene.add(water);
    //sky
    sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    sky.material.uniforms['sunPosition'].value.copy(sun);
    //物体的反射效果
    if (renderTarget) {
        renderTarget.dispose();
    }
    renderTarget = pmremGenerator.fromScene(sky);
    scene.environment = renderTarget.texture;
    //实现cube
    cube = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshStandardMaterial());
    cube.position.set(0, 10, 0);
    scene.add(cube);
}

init();
animate();
initHelper();
initWater();