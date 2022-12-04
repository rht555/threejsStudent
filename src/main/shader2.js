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
let uniforms;
//监听窗口变化
window.addEventListener('resize', onWindowResize, false);
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
    //相机朝向
    camera.lookAt(scene.position);
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
    //运动
    if (uniforms) {
        uniforms.time.value += 0.05;
    }
    requestAnimationFrame(animate);
    //渲染
    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
}
function initMesh() {
    // 环形
    const geometry = new THREE.TorusGeometry(5, 1, 80, 80);
    // 加载texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('../assets/img/cloud.png');
    const texture2 = textureLoader.load('../assets/img/lavatile.jpg');
    // warping 重复
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture2.wrapS = texture2.wrapT = THREE.RepeatWrapping;
    uniforms = {
        time: { value: 1.0 },
        texture1: { value: texture },
        texture2: { value: texture2 },
        fogColor: { value: new THREE.Vector3(0, 0, 0) },
        fogDensity: { value: 0.5 }
    }
    // 材质
    material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `,
        fragmentShader: `
        uniform float time;
        uniform vec3 fogColor;
        uniform float fogDensity;
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        varying vec2 vUv;
        void main() {
            vec4 noise = texture2D(texture1, vUv);
            vec2 T1 = vUv + vec2(1.5, -1.5) * time * 0.02;
            vec2 T2 = vUv + vec2(-0.5, 2.0) * time * 0.01;
            T1.x += noise.x * 2.0;
            T1.y += noise.y * 2.0;
            T2.x -= noise.y * 0.2;
            T2.y += noise.z * 0.2;
            float p = texture2D(texture1, T1 * 2.0).a;
            vec4 color = texture2D(texture2, T2 * 2.0);
            vec4 temp = color * (vec4(p, p, p, p) * 2.0) + (color * color) * 0.5;
            if (temp.r > 1.0) {
                temp.bg += clamp(temp.r - 2.0, 0.0, 100.0);
            }
            if (temp.g > 1.0) {
                temp.rb += temp.g - 1.0;
            }
            if (temp.b > 1.0) {
                temp.rg += temp.b - 1.0;
            }
            gl_FragColor = temp;
            //fog
            float depth = gl_FragCoord.z / gl_FragCoord.w;
            const float LOG2 = 1.442695;
            float fogFactor = exp2(- fogDensity * fogDensity * depth * depth * LOG2);
            fogFactor = 1.0 - clamp(fogFactor, 0.0, 1.0);
            gl_FragColor = mix(gl_FragColor, vec4(fogColor, gl_FragColor.w), fogFactor);
        }   
        `
    });
    scene.add(new THREE.Mesh(geometry, material));
}
init();
initMesh();
animate();
initHelper();