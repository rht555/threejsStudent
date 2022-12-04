//导入threejs
import * as THREE from 'three';
//导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class MyTHRRE {
    camera;
    controls;
    scene;
    renderer;
    axesHelper;
    cameraOptions = {
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 2000,
        position: [0, 0, 0]
    }
    light;
    sceneOptions = {
        fogColor: 0x000000,
        fogNear: 1,
        fogFar: 1000,
        sceneAmbientLight: [0x222222, 1],
        sceneDirectionalLight: [0xffffff, 1, 1, 1],
        sceneDirectionalLightCastShadow: false,
        sceneDirectionalLightPosition: [1, 1, 1],
        sceneDirectionalLightShadow: {

        }
    }
    renderOptions = {
        shadowMapEnabled: true,
    }
    mouse = new THREE.Vector2();
    clock = new THREE.Clock();
    transformAux1;
    constructor(options) {
        this.cameraOptions = Object.assign(this.cameraOptions, options?.cameraOptions);
        this.sceneOptions = Object.assign(this.sceneOptions, options?.sceneOptions);
        this.renderOptions = Object.assign(this.renderOptions, options?.renderOptions);
    }
    init() {
        //创建场景
        this.scene = new THREE.Scene();
        //场景雾化
        this.scene.fog = new THREE.Fog(this.sceneOptions.fogColor, this.sceneOptions.fogNear, this.sceneOptions.fogFar);
        //设置背景颜色
        // this.scene.background = new THREE.Color(0x222222);
        //向环境添加环境光颜色为0xffffff
        this.scene.add(new THREE.AmbientLight(...this.sceneOptions.sceneAmbientLight));
        //新建平行光 
        this.light = new THREE.DirectionalLight(...this.sceneOptions.sceneDirectionalLight);
        //设置平行光位置为(1,1,1)
        this.light.position.set(...this.sceneOptions.sceneDirectionalLightPosition);
        if (this.sceneOptions.sceneDirectionalLightCastShadow) {
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = this.sceneOptions.sceneDirectionalLightShadow.width || 1024;
            this.light.shadow.mapSize.height = this.sceneOptions.sceneDirectionalLightShadow.height || 1024;
            this.light.shadow.camera.left = this.sceneOptions.sceneDirectionalLightShadow.left || -40;
            this.light.shadow.camera.right = this.sceneOptions.sceneDirectionalLightShadow.right || 40;
            this.light.shadow.camera.top = this.sceneOptions.sceneDirectionalLightShadow.top || 40;
            this.light.shadow.camera.bottom = this.sceneOptions.sceneDirectionalLightShadow.bottom || -40;
            this.light.shadow.camera.far = this.sceneOptions.sceneDirectionalLightShadow.far || 1000;
        }
        // //给平行光添加辅助对象
        // this.lightHelper = new THREE.DirectionalLightHelper(this.light, 5);
        // this.scene.add(this.lightHelper)
        //向场景添加平行光
        this.scene.add(this.light);
        //创建相机
        this.camera = new THREE.PerspectiveCamera(this.cameraOptions.fov, this.cameraOptions.aspect, this.cameraOptions.near, this.cameraOptions.far);
        //设置相机位置
        this.camera.position.set(...this.cameraOptions.position);
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.shadowMap.enabled = this.renderOptions.shadowMapEnabled;
        //设置渲染器大小
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //将渲染器添加到body中
        document.body.appendChild(this.renderer.domElement);
        //创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //设置控制器的聚焦点
        this.controls.target.set(0, 10, 0);
        //限制控制器旋转速度为0.3
        this.controls.rotateSpeed = 0.3;
        // 开启控制器阻尼
        this.controls.enableDamping = true;
        //渲染
        this.render();
    }
    render() {
        //渲染
        //更新控制器
        this.controls.update();
        if (!this.animate()) {
            this.renderer.render(this.scene, this.camera);
        }
        requestAnimationFrame(this.render.bind(this));
        //循环渲染
    }
    // 监听窗口变化
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    // 添加坐标轴
    addAxesHelper() {
        this.axesHelper = new THREE.AxesHelper(100);
        this.scene.add(this.axesHelper);
    }
    animate() {
    }
    newVar(e, v) {
        this[e] = v;
    }
    newCube(options) {
        options = Object.assign({
            size: [5, 5, 5],
            position: [0, 0, 0],
            mass: 0,
            material: new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff }),
            isPhysics: false,
            quaternion: new THREE.Quaternion(0, 0, 0, 1),
            friction: 1,
            isMesh:true
        }, options);
        let geometry = new THREE.BoxGeometry(...options.size);
        let cube = new THREE.Mesh(geometry, options.material);
        cube.position.set(...options.position);
        cube.rotation.set(options.quaternion.x, options.quaternion.y, options.quaternion.z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.mass = options.mass;
        this.scene.add(cube);
        if (options.isPhysics) {
            //物理世界的初始化
            let transform = new Ammo.btTransform();
            transform.setIdentity();
            transform.setOrigin(new Ammo.btVector3(options.position[0], options.position[1], options.position[2])); //设置物体的位置
            transform.setRotation(new Ammo.btQuaternion(options.quaternion.x, options.quaternion.y, options.quaternion.z, options.quaternion.w)); //设置物体的旋转
            let boxShape = new Ammo.btBoxShape(new Ammo.btVector3(options.size[0] / 2, options.size[1] / 2, options.size[2] / 2)); // 设置碰撞几何结构
            boxShape.setMargin(0.05);//设置碰撞几何结构的边距
            let localInertia = new Ammo.btVector3(0, 0, 0);// 设置刚体的惯性
            boxShape.calculateLocalInertia(options.mass, localInertia);//计算刚体的惯性
            let rigidBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(options.mass, new Ammo.btDefaultMotionState(transform), boxShape, localInertia));//创建刚体
            rigidBody.setFriction(options.friction);//设置刚体的摩擦力
            rigidBody.setRestitution(0.6);//设置刚体的弹性
            this.physicsWorld.addRigidBody(rigidBody);//将刚体添加到物理世界中
            cube.userData.physicsBody = rigidBody; //将刚体添加到网格对象中
            if (!options.isMesh) {
                rigidBody.setActivationState(4);//设置刚体的激活状态
                return function sync(dt) {
                    let ms = rigidBody.getMotionState();
                    if (ms) {
                        ms.getWorldTransform(this.transformAux1);// 获取物体的变换
                        let p = this.transformAux1.getOrigin();// 获取物体的位置
                        let q = this.transformAux1.getRotation();// 获取物体的旋转
                        cube.position.set(p.x(), p.y(), p.z());// 设置物体的位置
                        cube.quaternion.set(q.x(), q.y(), q.z(), q.w());// 设置物体的旋转
                    }
                }
            }
        }
        return cube;
    }
}