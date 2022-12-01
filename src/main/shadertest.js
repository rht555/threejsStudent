//导入threejs
import * as THREE from 'three';
//导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 导入BufferGeometryUtils
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
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
//声明particles
let particles;
const PARTICLE = 20
let pointer, INTERSECTED;
let raycaster, intersects;
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
    camera.position.set(20, 20, 20);
    //创建渲染器
    renderer = new THREE.WebGLRenderer();
    //设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    //将渲染器添加到body中
    document.body.appendChild(renderer.domElement);
    //创建控制器
    controls = new OrbitControls(camera, renderer.domElement);
    //限制控制器旋转速度为0.3
    controls.rotateSpeed = 0.3;
    // 开启控制器阻尼
    controls.enableDamping = true;
    //创建天空盒
    initMeshs();
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
    particles.rotation.y += 0.002;
    requestAnimationFrame(animate);
    //渲染
    // 控制器更新
    controls.update();
    renderer.render(scene, camera);
}
function initMeshs() {
    // boxgeometry
    const boxGeometry = new THREE.BoxGeometry(200, 200, 200, 16, 16, 16);
    //删除boxgeometry的normal
    boxGeometry.deleteAttribute('normal');
    //删除boxgeometry的uv
    boxGeometry.deleteAttribute('uv');
    // 把boxgeometry的点变为8个
    const mergeGeometry = BufferGeometryUtils.mergeVertices(boxGeometry);
    //获取 mergeGeometry的顶点
    const vertices = mergeGeometry.getAttribute('position');

    const colors = []
    const sizes = []
    const color = new THREE.Color()

    // 声明一个geometry类型为BufferGeometry
    const geometry = new THREE.BufferGeometry();
    // 设置geometry的顶点位置
    geometry.setAttribute('position', vertices);
    //声明materal类型为shaderMateral
    const material = new THREE.ShaderMaterial({
        uniforms: {
            color: {
                value: new THREE.Color(0xffffff)
            },
            textture: {
                value: new THREE.TextureLoader().load('../assets/img/ball.png')
            }
        },
        vertexShader: `
        attribute float size;
        attribute vec3 customColor;
        varying vec3 vColor;
        void main() {
            vColor = customColor;
            vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
            gl_PointSize = size * ( 300.0 / -mvPosition.z );
            gl_Position = projectionMatrix * mvPosition;
        }
        `,
        fragmentShader: `
        uniform vec3 color;
        uniform sampler2D textture;
        varying vec3 vColor;
        void main() {
            gl_FragColor = vec4( color * vColor, 1.0 );
            gl_FragColor = gl_FragColor * texture2D( textture, gl_PointCoord );
            if ( gl_FragColor.a < 0.9 ) discard;
        }
        `,
    });
    particles = new THREE.Points(geometry, material);
    for (let i = 0; i < vertices.count; i++) {
        color.setHex(Math.random() * 0xffffff)
        color.toArray(colors, i * 3);
        sizes[i] = PARTICLE * 0.5
    }
    geometry.setAttribute("position", vertices)
    geometry.setAttribute("customColor", new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1))
    scene.add(particles);
}
init();
animate();
initHelper();
document.addEventListener('mousemove', onDocumentMouseMove, false);
function onDocumentMouseMove(event) {
    pointer = new THREE.Vector2((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    raycaster = new THREE.Raycaster();
    const attributes = particles.geometry.attributes;
    raycaster.setFromCamera(pointer, camera);
    intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        INTERSECTED = intersects[0].index;
        attributes.size.array[INTERSECTED] = PARTICLE * 1.2;
        attributes.size.needsUpdate = true;
    } else {
        attributes.size.array[INTERSECTED] = PARTICLE * 0.5;
        attributes.size.needsUpdate = true;
    }
}