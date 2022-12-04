import * as THREE from 'three';
import MyThree from '../utils/init';
//导入gltf加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
//导入gui
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
//导入效果编辑器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
// shaderPass
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
const t = new MyThree({
    cameraOptions: {
        position: [20, 20, 20]
    },
    sceneOptions: {
        sceneAmbientLight: [0xaaaaaa, 0.2],
        sceneDirectionalLight: [0xddffdd, 0.6, 1, 1],
        sceneDirectionalLightCastShadow: true,
        sceneDirectionalLightPosition: [10, 8, 10],
        sceneDirectionalLightShadow: {
            width: 1024,
            height: 1024,
            left: -40,
            right: 40,
            top: 40,
            bottom: -40,
            far: 1000
        }
    }
})
t.init()
t.render()
window.addEventListener('resize', t.onWindowResize.bind(t), false)
t.addAxesHelper()
t.initMeshs = function () {
    const loader = new GLTFLoader();
    loader.load('../assets/3d/car.glb', (gltf) => {

        const root = gltf.scene;
        root.traverse((child) => {
            // 如果是Mesh对象
            if (child.isMesh) {
                // 设置接收阴影
                child.castShadow = true;
                child.receiveShadow = true;
                //设置side
                child.material.side = 0;
            }
        })
        // 将物体放大10倍
        root.scale.multiplyScalar(10);
        root.position.y = 2.7
        this.scene.add(root);
    }
    );
    // 球形geometry
    const sphereGeometry = new THREE.SphereGeometry(3, 48, 24);
    //循环二十次
    for (let i = 0; i < 20; i++) {
        // 球体材质
        const sphereMaterial = new THREE.MeshLambertMaterial({
            color: Math.random() * 0xffffff
        });
        // 球体网格
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        // 设置球体位置
        sphere.position.set(
            Math.random() * 4 + 2,
            Math.random() * 4 + 8,
            Math.random() * 4 + 2,
        )
        // 随机设置球体大小
        sphere.scale.multiplyScalar(Math.random() * 0.3 + 0.1);
        // 设置球体接收阴影
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        // 将球体添加到场景中
        this.scene.add(sphere);
    }
    // 地面
    const planeGeometry = new THREE.PlaneGeometry(100, 100);
    const planeMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
        side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = 0;
    plane.receiveShadow = true;
    this.scene.add(plane);

    // 环形
    const torusGeometry = new THREE.TorusGeometry(3, 1, 16, 100);
    const torusMaterial = new THREE.MeshLambertMaterial({
        color: 0xaaaaaa,
    });
    const torus = new THREE.Mesh(torusGeometry, torusMaterial);
    torus.position.set(6, 4, 10);
    torus.castShadow = true;
    torus.receiveShadow = true;
    this.scene.add(torus);

    // outline
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.outlinePass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), this.scene, this.camera);
    this.composer.addPass(this.outlinePass)

    //抗锯齿
    const fxaaPass = new ShaderPass(FXAAShader);
    fxaaPass.material.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    this.composer.addPass(fxaaPass);
}
t.newVar("raycaster", new THREE.Raycaster())
t.initMeshs()
t.renderer.domElement.addEventListener("pointermove", (event) => {
    event.preventDefault();
    // 获取鼠标位置
    t.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    t.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    t.raycaster.setFromCamera(t.mouse, t.camera);
    const intersects = t.raycaster.intersectObjects(t.scene.children, true);
    if (intersects.length > 0) {
        t.outlinePass.selectedObjects = [intersects[0].object];
    } else {
        t.outlinePass.selectedObjects = [];
    }
})
t.animate = function () {
    t.composer.render();
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children, true);
    if (intersects > 0) {
        const intersect = intersects[0].object;
        this.outlinePass.selectedObjects = [intersect];
    }
    return true
}
t.newVar("params", "")
t.newVar("gui", new GUI())
t.updateOutline = function () {
    this.outlinePass.edgeStrength = this.params.edgeStrength;
    this.outlinePass.edgeGlow = this.params.edgeGlow;
    this.outlinePass.edgeThickness = this.params.edgeThickness;
    this.outlinePass.visibleEdgeColor.set(this.params.visibleEdgeColor);
    this.outlinePass.hiddenEdgeColor.set(this.params.hiddenEdgeColor);
    this.outlinePass.usePatternTexture = this.params.usePatternTexture;
    this.outlinePass.pulsePeriod = this.params.pulsePeriod;
}
t.initGui = function () {
    this.params = {
        edgeStrength: 3.0, // 边缘强度
        edgeGlow: 0.0, // 边缘发光
        edgeThickness: 1.0, // 边缘厚度
        pulsePeriod: 0.5, // 脉冲周期
        usePatternTexture: false, // 是否使用纹理
        visibleEdgeColor: "#ffffff", // 可见边缘颜色
        hiddenEdgeColor: "#190a05", // 隐藏边缘颜色
    }
    this.updateOutline()
    this.gui.add(this.params, "edgeStrength", 0.0, 10.0).name("边缘强度").onChange(this.updateOutline.bind(this));
    this.gui.add(this.params, "edgeGlow", 0.0, 10.0).name("边缘发光").onChange(this.updateOutline.bind(this));
    this.gui.add(this.params, "edgeThickness", 1.0, 5.0).name("边缘厚度").onChange(this.updateOutline.bind(this));
    this.gui.add(this.params, "pulsePeriod", 0.0, 5.0).name("脉冲周期").onChange(this.updateOutline.bind(this));
    this.gui.add(this.params, "usePatternTexture").name("是否使用纹理").onChange(this.updateOutline.bind(this));
    this.gui.addColor(this.params, "visibleEdgeColor").name("可见边缘颜色").onChange(this.updateOutline.bind(this));
    this.gui.addColor(this.params, "hiddenEdgeColor").name("隐藏边缘颜色").onChange(this.updateOutline.bind(this));
}
t.initGui()