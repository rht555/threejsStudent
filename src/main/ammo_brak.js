import MyTHRRE from '../utils/init'
//导入threejs
import * as THREE from 'three';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
let t = new MyTHRRE({
    cameraOptions: {
        position: [20, 20, 20],
        fov: 75
    },
    sceneOptions: {
        bgcolor: 0xeeeeee,
        sceneAmbientLight: [0x707070, 1],
        sceneDirectionalLightPosition: [-10, 18, 5],
        sceneDirectionalLightCastShadow: true
    }
})
t.init()
t.render()
t.addAxesHelper()
window.addEventListener('resize', t.onWindowResize.bind(t), false)
t.initObjects = function () {
    t.meshList.push(t.newCube({
        position: [8, 5, 0],
        size: [4, 10, 4],
        name: "方块1",
        isPhysics: true,
        mass: 80,
        isMesh: false,
        isBroken: true
    }))
    t.meshList.push(t.newCube({
        position: [-8, 5, 0],
        size: [4, 10, 4],
        name: "方块2",
        isPhysics: true,
        mass: 80,
        isMesh: false,
        isBroken: true
    }))
    t.meshList.push(t.newCube({
        position: [0, 20.2, 0],
        material: new THREE.MeshPhongMaterial({ color: Math.random() * 0xB3B865, side: 0, shadowSide: THREE.BackSide }),
        size: [14, 0.4, 3],
        name: "桥",
        isPhysics: true,
        mass: 140,
        isMesh: false,
        isBroken: true
    }))
    t.meshList.push(t.newCube({
        size: [100, 1, 100],
        position: [0, 0, 0],
        name: '地面',
        isPhysics: true,
        material: new THREE.MeshPhongMaterial({
            color: 0x999999, specular: 0x101010,
        }),
        isMesh: false,
    }))


    //循环八次
    for (let i = 0; i < 8; i++) {
        t.meshList.push(t.newCube({
            size: [2, 4, 0.3],
            material: new THREE.MeshPhongMaterial({ color: 0xB0B0B0, }),
            position: [0, 2, 15 * (0.5 - i / (9))],
            name: `${i}号小物体`,
            isPhysics: true,
            mass: 100,
            isMesh: false,
        }))
    }

    //定义一个点数组
    let points = [];
    //向点数组中添加三维向量
    points.push(new THREE.Vector3(4, -5, 4));
    points.push(new THREE.Vector3(-4, -5, 4));
    points.push(new THREE.Vector3(4, -5, -4));
    points.push(new THREE.Vector3(-4, -5, -4));
    points.push(new THREE.Vector3(0, 5, 0));
    //根据点数组创建cube
    let cube = new THREE.Mesh(
        new ConvexGeometry(points),
        new THREE.MeshPhongMaterial({ color: 0x00ff00, })
    );
    cube.position.set(10, 5, 10);
    cube.geometry.vertices = points;
    cube.name = "凸多边形"
    //cube阴影
    cube.castShadow = true;
    cube.receiveShadow = true;
    t.scene.add(cube);
    t.meshList.push(t.affixPhysics({
        isPhysics: true,
        mass: 300
    }, cube))
}
Ammo().then(res => {
    Ammo = res;
    t.initPhysics();
    t.initObjects();
    t.animate = function () {
        const deltaTime = t.clock.getDelta();
        for (let i = 0; i < t.meshList.length; i++) {
            t.meshList[i].call(t, deltaTime)
        }
        this.physicsWorld.stepSimulation(deltaTime, 10);
        return false
    }
    console.log(t.scene);
    window.addEventListener("pointerdown", (event) => {
        t.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        t.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        t.raycaster.setFromCamera(t.mouse, t.camera)

        //将raycaster的方向赋予val
        let val = t.raycaster.ray.direction.clone();
        val.multiplyScalar(24);
        //将raycaster的起点赋予pos
        let pos = t.raycaster.ray.origin.clone();
        //创建球体ball
        let ball = t.newSphere({
            position: [pos.x, pos.y, pos.z],
            name: "球体",
            isPhysics: true,
            mass: 35,
            isMesh: false,
            size: [0.4, 10, 14],
            vel: val,
        })
        t.meshList.push(ball)
    })
})
window.t = t