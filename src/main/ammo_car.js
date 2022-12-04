import MyTHRRE from '../utils/init'
import * as THREE from 'three';
const t = new MyTHRRE({
    cameraOptions: {
        position: [-100, 50, -20],
        fov: 30
    },
    sceneOptions: {
        sceneDirectionalLightCastShadow: false
    },
})
let action = {}
let keyActions = {
    "KeyW": "forward",
    "KeyS": "back",
    "KeyA": "left",
    "KeyD": "right",
}
window.addEventListener("keydown", keyDown, false);
window.addEventListener("keyup", keyUp, false);
window.addEventListener("resize",t.onWindowResize.bind(t))
Ammo().then((Ammo) => {
    t.init()
    t.render()
    t.addAxesHelper()
    //常量
    const DISABLE_DEACTIVATION = 4; // 禁用休眠

    let m1 = newMaterial(0xfca400)
    let m2 = newMaterial(0x999999)
    let m3 = newMaterial(0x990000)

    t.newVar("physicsWorld", null)
    let tmpTrans = new Ammo.btTransform();
    let meshList = []

    initPhysics()
    t.initMesh = function () {
        t.newCube({
            size: [500, 1, 500],
            position: [0, -1, 0],
            isPhysics: true,
            material: m2
        })
        t.newCube({
            size: [8, 4, 10],
            position: [0, -2, 0],
            isPhysics: true,
            material: m3,
            quaternion: new THREE.Quaternion(0, 0, 0, 1).setFromAxisAngle(new THREE.Vector3(1, 0, 0), -Math.PI / 18),
        })
        //嵌套循环，内层6次外层8次
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 6; j++) {
                meshList.push(t.newCube({
                    size: [2, 2, 2],
                    position: [-10 + i * 2, -2 + j * 2 + 3, 12],
                    isPhysics: true,
                    material: m1,
                    mass: 10,
                    isMesh: false
                }))
            }
        }
        meshList.push(createCar(new THREE.Vector3(-4, 2, -10), new THREE.Quaternion(0, 0, 0, 1)))
    }
    t.initMesh()
    t.animate = function () {
        const deltaTime = t.clock.getDelta();
        //循环更新物理世界中的物体
        for (let i = 0; i < meshList.length; i++) {
            meshList[i].call(t, deltaTime)
        }
        this.physicsWorld.stepSimulation(deltaTime, 10); // 物理世界进行模拟
        return false
    }
})
function keyDown(e) {
    if (keyActions[e.code]) {
        action[keyActions[e.code]] = true
        e.preventDefault()
        e.stopPropagation()
        return false
    }
}
function keyUp(e) {
    if (keyActions[e.code]) {
        action[keyActions[e.code]] = false
        e.preventDefault()
        e.stopPropagation()
        return false
    }
}
function newMaterial(color) {
    return new THREE.MeshLambertMaterial({
        color
    })
}
function initPhysics() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); //创建碰撞配置
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); //创建碰撞检测器
    const solver = new Ammo.btSequentialImpulseConstraintSolver(); //创建约束求解器
    const overlappingPairCache = new Ammo.btDbvtBroadphase(); //创建碰撞检测的加速结构
    t.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration); //创建物理世界
    t.physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0)); //设置重力
    t.transformAux1 = new Ammo.btTransform(); //创建变换
}
function createCar(pos, quat) {
    var vw = 1.8; //宽度
    var vh = 0.6; //高度
    var vl = 4; //长度
    var vmass = 800; //质量

    var wheelAxisPositionBack = -1; //后轮轴位置
    var wheelRadius = 0.4; //轮半径
    var wheelHalfTrackBack = 1; //后轮轴距离
    var wheelHalfTrackFront = 1; //前轮轴距离
    var wheelAxisHeight = 0.3; //轮轴高度
    var wheelAxisFrontPosition = 1.7; //前轮轴位置

    //摩擦
    var friction = 1000;
    var suspensionStiffness = 20.0; //弹簧刚度
    var suspensionDamping = 2.3; //阻尼
    var suspensionCompression = 4.4; //压缩
    var suspensionRestLength = 0.6; //弹簧伸长长度
    var rollInfluence = 0.2; //转向角

    //转向
    var steeringIncrement = 0.04; //转向增量
    var steeringClamp = 0.5; //转向限制
    var maxEngineForce = 2000; //最大马力
    var maxBreakingForce = 100; //最大刹车力

    const transform = new Ammo.btTransform(); //创建变换
    transform.setIdentity();// 设置变换为单位矩阵
    transform.setOrigin(new Ammo.btVector3(pos.x, pos.y, pos.z)); //设置变换的原点
    transform.setRotation(new Ammo.btQuaternion(quat.x, quat.y, quat.z, quat.w)); //设置变换的旋转
    const motionState = new Ammo.btDefaultMotionState(transform); //创建运动状态
    const localInertia = new Ammo.btVector3(0, 0, 0); //创建惯性
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(vw * 0.5, vh * 0.5, vl * 0.5)); //创建盒子形状
    shape.calculateLocalInertia(vmass, localInertia); //计算惯性
    //刚体
    const body = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(vmass, motionState, shape, localInertia)); //创建刚体
    body.setActivationState(4); //设置激活状态
    t.physicsWorld.addRigidBody(body); //将刚体添加到物理世界中
    //车身
    const chassisMesh = new THREE.Mesh(
        new THREE.BoxGeometry(vw, vh, vl, 1, 1, 1),
        newMaterial(0x999999)
    )
    t.scene.add(chassisMesh)
    let engineForce = 0; //马力
    let breakingForce = 0; //刹车力
    let steering = 0; //转向

    let tuning = new Ammo.btVehicleTuning(); //创建车辆调整
    let rayCaster = new Ammo.btDefaultVehicleRaycaster(t.physicsWorld); //创建车辆射线检测器
    let vehicle = new Ammo.btRaycastVehicle(tuning, body, rayCaster); //创建车辆
    vehicle.setCoordinateSystem(0, 1, 2); //设置坐标系
    t.physicsWorld.addAction(vehicle); //将车辆添加到物理世界中

    //wheel
    let wheelMeshs = []
    let wheelDirectionCS0 = new Ammo.btVector3(0, -1, 0); //轮子方向
    let wheelAxleCS = new Ammo.btVector3(-1, 0, 0); //轮子轴
    function addWheel(isFront, pos, radius, width, index) {
        //添加轮子
        let wheelInfo = vehicle.addWheel(
            pos,
            wheelDirectionCS0,
            wheelAxleCS,
            suspensionRestLength,
            radius,
            tuning,
            isFront
        );
        //设置轮子参数
        wheelInfo.set_m_suspensionStiffness(suspensionStiffness);
        //阻尼
        wheelInfo.set_m_wheelsDampingRelaxation(suspensionDamping);
        //压缩
        wheelInfo.set_m_wheelsDampingCompression(suspensionCompression);
        //弹簧伸长长度
        wheelInfo.set_m_frictionSlip(friction);
        //转向角
        wheelInfo.set_m_rollInfluence(rollInfluence);
        //轮子
        let wheelMesh = createWhell(radius, width)
        wheelMeshs.push(wheelMesh)
    }
    addWheel(true, new Ammo.btVector3(wheelHalfTrackFront, wheelAxisHeight, wheelAxisFrontPosition), wheelRadius, 0.4, 0);
    addWheel(true, new Ammo.btVector3(-wheelHalfTrackFront, wheelAxisHeight, wheelAxisFrontPosition), wheelRadius, 0.4, 1);
    addWheel(false, new Ammo.btVector3(-wheelHalfTrackBack, wheelAxisHeight, wheelAxisPositionBack), wheelRadius, 0.4, 2);
    addWheel(false, new Ammo.btVector3(wheelHalfTrackBack, wheelAxisHeight, wheelAxisPositionBack), wheelRadius, 0.4, 3);
    let dkm = document.getElementById("speed")
    return function sync(dt) {
        const speed = vehicle.getCurrentSpeedKmHour();// 获取当前速度
        dkm.innerText = `${Math.floor(speed)} KM/s`
        //设置轮子转向
        breakingForce = 0;
        engineForce = 0;
        if (action.forward) {
            if (speed < -1) {
                breakingForce = maxBreakingForce;
            } else {
                engineForce = maxEngineForce;
            }
        }
        if (action.back) {
            if (speed > 1) {
                breakingForce = maxBreakingForce;
            } else {
                engineForce = -maxEngineForce / 2;
            }
        }
        if (action.left) {
            if (steering < steeringClamp) {
                steering += steeringIncrement;
            }
        } else {
            if (action.right) {
                if (steering > -steeringClamp) {
                    steering -= steeringIncrement;
                }
            } else {
                if (steering < -steeringClamp) {
                    steering += steeringIncrement;
                } else {
                    if (steering > steeringIncrement) {
                        steering -= steeringIncrement;
                    } else {
                        steering = 0;
                    }
                }
            }
        }
        vehicle.applyEngineForce(engineForce, 2);// 底盘前轮
        vehicle.applyEngineForce(engineForce, 3);// 底盘后轮
        vehicle.setBrake(breakingForce / 2, 2);// 底盘前轮
        vehicle.setBrake(breakingForce / 2, 3);// 底盘后轮
        vehicle.setSteeringValue(steering, 0);// 底盘前轮
        vehicle.setSteeringValue(steering, 1);// 底盘后轮
        //同步车辆
        for (let i = 0; i < vehicle.getNumWheels(); i++) {
            vehicle.updateWheelTransform(i, true);
            let t = vehicle.getWheelTransformWS(i);
            let p = t.getOrigin();
            let q = t.getRotation();
            wheelMeshs[i].position.set(p.x(), p.y(), p.z());
            wheelMeshs[i].quaternion.set(q.x(), q.y(), q.z(), q.w());
        }
        let tm = vehicle.getChassisWorldTransform();
        let p = tm.getOrigin();
        let q = tm.getRotation();
        chassisMesh.position.set(p.x(), p.y(), p.z());
        chassisMesh.quaternion.set(q.x(), q.y(), q.z(), q.w());
    }
}

function createWhell(r, w) {
    const cylinder = new THREE.CylinderGeometry(r, r, w, 32);
    cylinder.rotateZ(Math.PI / 2);
    const mesh = new THREE.Mesh(cylinder, newMaterial(0x999999));
    mesh.add(new THREE.Mesh(new THREE.BoxGeometry(r * 1.5, r * 1.75, r * 0.25), newMaterial(0x666666)));
    t.scene.add(mesh);
    return mesh;
}