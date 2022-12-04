import MyTHRRE from '../utils/init'
import * as THREE from 'three';
const t = new MyTHRRE({
    cameraOptions: {
        position: [20, 20, 20],
        fov: 60
    },
    sceneOptions: {
        sceneDirectionalLightCastShadow: false
    },
})
let meshList = []
t.newVar("physicsWorld", null);
Ammo().then((res) => {
    t.init()
    t.render()
    initPhysics()
    t.initMesh = function () {
        meshList = [this.newCube(
            {
                isPhysics: true,
                size: [10, 2, 10],
                position: [4, 1, 4]
            }
        ),
        this.newCube({
            size: [1, 1, 1],
            position: [0, 5, 0],
            isPhysics: true,
            mass: 1
        }), this.newCube({
            size: [2, 1, 1],
            position: [2, 10, 2],
            isPhysics: true,
            mass: 1
        })]
    }
    t.addAxesHelper()
    t.initMesh()
    t.animate = function () {
        const deltaTime = t.clock.getDelta();
        this.physicsWorld.stepSimulation(deltaTime, 10); // 物理世界进行模拟
        //循环更新物理世界中的物体
        for (let i = 0; i < meshList.length; i++) {
            let mesh = meshList[i];
            let physicsBody = mesh.userData.physicsBody;
            //获取姿态
            let ms = physicsBody.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.transformAux1);// 获取物体的变换
                let p = this.transformAux1.getOrigin();// 获取物体的位置
                let q = this.transformAux1.getRotation();// 获取物体的旋转
                mesh.position.set(p.x(), p.y(), p.z());// 设置物体的位置
                mesh.quaternion.set(q.x(), q.y(), q.z(), q.w());// 设置物体的旋转
            }
        }
        return false
    }
})
function initPhysics() {
    const collisionConfiguration = new Ammo.btDefaultCollisionConfiguration(); //创建碰撞配置
    const dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration); //创建碰撞检测器
    const overlappingPairCache = new Ammo.btDbvtBroadphase(); //创建重叠对缓存
    const solver = new Ammo.btSequentialImpulseConstraintSolver(); //创建约束求解器
    t.physicsWorld = new Ammo.btDiscreteDynamicsWorld(dispatcher, overlappingPairCache, solver, collisionConfiguration); //创建物理世界
    t.physicsWorld.setGravity(new Ammo.btVector3(0, -70, 0)); //设置重力
    t.transformAux1 = new Ammo.btTransform(); //创建变换
}