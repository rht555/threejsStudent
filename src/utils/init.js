//导入threejs
import * as THREE from 'three';
//导入控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ConvexGeometry } from 'three/examples/jsm/geometries/ConvexGeometry.js';
//导入ConvexObjectBreaker
import { ConvexObjectBreaker } from 'three/examples/jsm/misc/ConvexObjectBreaker.js';
export default class MyTHRRE {
    camera;
    controls;
    scene;
    renderer;
    axesHelper;
    cameraOptions = {
        fov: 75,
        aspect: window.innerWidth / window.innerHeight,
        near: 0.2,
        far: 2000,
        position: [0, 0, 0],
        lookAt: [0, -4, 0]
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

        },
        bgcolor: 0x222222
    }
    renderOptions = {
        shadowMapEnabled: true,
    }
    mouse = new THREE.Vector2();
    clock = new THREE.Clock();
    transformAux1;
    physicsWorld = null;
    raycaster = new THREE.Raycaster();
    convexObject = null;
    dispatcher = null;
    removeObj = [];
    impactPoint = new THREE.Vector3();
    impactNormal = new THREE.Vector3();
    test = 0;
    meshList = [];
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
        this.scene.background = new THREE.Color(this.sceneOptions.bgcolor);
        //向环境添加环境光颜色为0xffffff
        this.scene.add(new THREE.AmbientLight(...this.sceneOptions.sceneAmbientLight));
        //新建平行光 
        this.light = new THREE.DirectionalLight(...this.sceneOptions.sceneDirectionalLight);
        //设置平行光位置为(1,1,1)
        this.light.position.set(...this.sceneOptions.sceneDirectionalLightPosition);
        if (this.sceneOptions.sceneDirectionalLightCastShadow) {
            this.light.castShadow = true;
            this.light.shadow.mapSize.width = this.sceneOptions.sceneDirectionalLightShadow.width || 4096;
            this.light.shadow.mapSize.height = this.sceneOptions.sceneDirectionalLightShadow.height || 4096;
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
        this.camera.lookAt(...this.cameraOptions.lookAt);
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = this.renderOptions.shadowMapEnabled;
        //设置渲染器大小
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        //将渲染器添加到body中
        document.body.appendChild(this.renderer.domElement);
        //创建控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        //设置控制器的聚焦点
        this.controls.target.set(0, 2, 0);
        //限制控制器旋转速度为0.3
        this.controls.rotateSpeed = 0.3;
        // 开启控制器阻尼
        this.controls.enableDamping = true;
        //渲染
        this.render();
    }
    render(e) {
        //渲染
        //更新控制器
        this.controls.update();
        if (!this.animate(e)) {
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
            material: new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, side: 0, shadowSide: THREE.BackSide }),
            isPhysics: false,
            quaternion: new THREE.Quaternion(0, 0, 0, 1),
            friction: 1,
            isMesh: true,
            name: "",
            vel: new THREE.Vector3(0, 0, 0),
            angVel: new THREE.Vector3(0, 0, 0)
        }, options);
        let geometry = new THREE.BoxGeometry(...options.size);
        let cube = new THREE.Mesh(geometry, options.material);
        cube.name = options.name
        cube.position.set(...options.position);
        cube.rotation.set(options.quaternion.x, options.quaternion.y, options.quaternion.z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.mass = options.mass;
        this.scene.add(cube);
        if (options.isPhysics && this.physicsWorld) {
            //物理世界的初始化
            let sync = this.affixPhysics(options, cube);
            if (!options.isMesh) {
                return sync;
            }
        }
        return cube;
    }
    newSphere(options) {
        options = Object.assign({
            size: [5, 5, 5],
            position: [0, 0, 0],
            mass: 0,
            material: new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff, side: 0, shadowSide: THREE.BackSide }),
            isPhysics: false,
            quaternion: new THREE.Quaternion(0, 0, 0, 1),
            friction: 1,
            isMesh: true,
            name: "",
            vel: new THREE.Vector3(0, 0, 0),
            angVel: new THREE.Vector3(0, 0, 0)
        }, options);
        let geometry = new THREE.SphereGeometry(...options.size);
        let cube = new THREE.Mesh(geometry, options.material);
        cube.name = options.name
        cube.position.set(...options.position);
        cube.rotation.set(options.quaternion.x, options.quaternion.y, options.quaternion.z);
        cube.castShadow = true;
        cube.receiveShadow = true;
        cube.mass = options.mass;
        this.scene.add(cube);
        if (options.isPhysics && this.physicsWorld) {
            //物理世界的初始化
            let sync = this.affixPhysics(options, cube);
            if (!options.isMesh) {
                return sync;
            }
        }
        return cube;
    }
    initPhysics() {
        //物理世界的初始化
        let collisionConfiguration = new Ammo.btDefaultCollisionConfiguration();//创建碰撞配置
        this.dispatcher = new Ammo.btCollisionDispatcher(collisionConfiguration);//创建碰撞分配器
        let overlappingPairCache = new Ammo.btDbvtBroadphase();//创建碰撞检测的算法
        let solver = new Ammo.btSequentialImpulseConstraintSolver();//创建约束求解器
        this.physicsWorld = new Ammo.btDiscreteDynamicsWorld(this.dispatcher, overlappingPairCache, solver, collisionConfiguration);//创建物理世界
        this.physicsWorld.setGravity(new Ammo.btVector3(0, -9.8, 0));//设置重力
        this.transformAux1 = new Ammo.btTransform(); //创建变换
    }
    affixPhysics(options, cube) {
        if (!options.position) {
            options.position = [cube.position.x, cube.position.y, cube.position.z];
        }
        if (!options.quaternion) {
            options.quaternion = cube.quaternion
        }
        options = Object.assign({
            vel: new THREE.Vector3(0, 0, 0),
            angVel: new THREE.Vector3(0, 0, 0),
            isBroken: false,
        }, options);
        let boxShape;
        if (options.isBroken) {
            if (!this.convexObject) {
                this.convexObject = new ConvexObjectBreaker()
            }
            this.convexObject.prepareBreakableObject(cube, options.mass, options.vel, options.angVel, true);
            boxShape = new Ammo.btConvexHullShape();
            for (let i = 0, li = cube.geometry.attributes.position.array.length; i < li; i += 3) {
                const lastOne = (i >= (li - 3));
                boxShape.addPoint(new Ammo.btVector3(cube.geometry.attributes.position.array[i], cube.geometry.attributes.position.array[i + 1], cube.geometry.attributes.position.array[i + 2]), lastOne);
            }
        } else {
            if (cube.geometry instanceof THREE.BoxGeometry) {
                cube.geometry.computeBoundingBox();
                const sx = cube.geometry.boundingBox.max.x - cube.geometry.boundingBox.min.x;
                const sy = cube.geometry.boundingBox.max.y - cube.geometry.boundingBox.min.y;
                const sz = cube.geometry.boundingBox.max.z - cube.geometry.boundingBox.min.z;
                boxShape = new Ammo.btBoxShape(new Ammo.btVector3(sx / 2, sy / 2, sz / 2)); // 设置碰撞几何结构
            } else if (cube.geometry instanceof THREE.SphereGeometry) {
                cube.geometry.computeBoundingSphere();
                const sx = cube.geometry.boundingSphere.radius;
                boxShape = new Ammo.btSphereShape(sx); // 设置碰撞几何结构
            } else if (cube.geometry instanceof ConvexGeometry) {
                boxShape = new Ammo.btConvexHullShape();
                for (let i = 0; i < cube.geometry.vertices.length; i++) {
                    const v = cube.geometry.vertices[i];
                    boxShape.addPoint(new Ammo.btVector3(v.x, v.y, v.z));
                }
            }
        }
        let transform = new Ammo.btTransform();
        transform.setIdentity();
        transform.setOrigin(new Ammo.btVector3(options.position[0], options.position[1], options.position[2])); //设置物体的位置
        transform.setRotation(new Ammo.btQuaternion(options.quaternion.x, options.quaternion.y, options.quaternion.z, options.quaternion.w)); //设置物体的旋转
        boxShape.setMargin(0.05);//设置碰撞几何结构的边距
        let localInertia = new Ammo.btVector3(0, 0, 0);// 设置刚体的惯性
        boxShape.calculateLocalInertia(options.mass, localInertia);//计算刚体的惯性
        let rigidBody = new Ammo.btRigidBody(new Ammo.btRigidBodyConstructionInfo(options.mass, new Ammo.btDefaultMotionState(transform), boxShape, localInertia));//创建刚体
        rigidBody.setFriction(options.friction);//设置刚体的摩擦力
        rigidBody.setLinearVelocity(new Ammo.btVector3(options.vel.x, options.vel.y, options.vel.z));//设置刚体的线速度
        rigidBody.setAngularVelocity(new Ammo.btVector3(options.angVel.x, options.angVel.y, options.angVel.z));//设置刚体的角速度
        rigidBody.setRestitution(0.6);//设置刚体的弹性
        cube.userData.physicsBody = rigidBody; //将刚体添加到网格对象中
        this.physicsWorld.addRigidBody(rigidBody);//将刚体添加到物理世界中
        rigidBody.setActivationState(4);//设置刚体的激活状态
        const btVector = new Ammo.btVector3(0, 0, 0);
        btVector.threeObject = cube; // 将网格对象添加到刚体中
        rigidBody.setUserPointer(btVector);//将刚体添加到网格对象中
        for (let i = 0; i < 500; i++) {
            this.removeObj.push(null)
        }
        return function sync(dt) {
            let ms = rigidBody.getMotionState();
            if (ms) {
                ms.getWorldTransform(this.transformAux1);// 获取物体的变换
                let p = this.transformAux1.getOrigin();// 获取物体的位置
                let q = this.transformAux1.getRotation();// 获取物体的旋转
                cube.position.set(p.x(), p.y(), p.z());// 设置物体的位置
                cube.quaternion.set(q.x(), q.y(), q.z(), q.w());// 设置物体的旋转
            }
            if (options.isBroken) {
                for (let i = 0; i < this.dispatcher.getNumManifolds(); i++) {
                    let contactManifold = this.dispatcher.getManifoldByIndexInternal(i);
                    let rb0 = Ammo.castObject(contactManifold.getBody0(), Ammo.btRigidBody);
                    let rb1 = Ammo.castObject(contactManifold.getBody1(), Ammo.btRigidBody);

                    let mesh0 = Ammo.castObject(rb0.getUserPointer(), Ammo.btVector3).threeObject;
                    let mesh1 = Ammo.castObject(rb1.getUserPointer(), Ammo.btVector3).threeObject;

                    const userData0 = mesh0.userData;
                    const userData1 = mesh1.userData;

                    const breakable0 = userData0.breakable ? userData0.breakable : false;
                    const breakable1 = userData1.breakable ? userData1.breakable : false;

                    if (!breakable0 && !breakable1) {
                        continue;
                    }
                    let contact = false;
                    let maxImpulse = 0;
                    for (let j = 0; j < contactManifold.getNumContacts(); j++) {
                        let contactPoint = contactManifold.getContactPoint(j);
                        // 如果距离小于0
                        if (contactPoint.getDistance() < 0) {
                            let impulse = contactPoint.getAppliedImpulse();
                            if (impulse > maxImpulse) {
                                contact = true;
                                maxImpulse = impulse;
                                let pos = contactPoint.get_m_positionWorldOnB(); // 获取碰撞点的位置
                                let normal = contactPoint.get_m_normalWorldOnB();// 获取碰撞点的法线
                                this.impactPoint.set(pos.x(), pos.y(), pos.z());
                                this.impactNormal.set(normal.x(), normal.y(), normal.z());
                            }
                        }
                    }

                    //设置破碎的阈值fracureImpulse
                    const fractureImpulse = 250;
                    if (!contact || maxImpulse <= fractureImpulse) continue;
                    if (breakable0) {
                        const debris = this.convexObject.subdivideByImpact(mesh0, this.impactPoint, this.impactNormal, 1, 2, 1.5);
                        const numObjects = debris.length;
                        for (let j = 0; j < numObjects; j++) {
                            const vel = rb0.getLinearVelocity();
                            const angVel = rb0.getAngularVelocity();
                            debris[j].userData.velocity.set(vel.x(), vel.y(), vel.z());
                            debris[j].userData.angularVelocity.set(angVel.x(), angVel.y(), angVel.z());
                            this.scene.add(debris[j]);
                            this.meshList.push(this.affixPhysics({
                                isPhysics: true,
                                mass: debris[j].userData.mass,
                                vel: debris[j].userData.velocity,
                                angVel: debris[j].userData.angularVelocity,
                                isBroken: true
                            }, debris[j]))
                        }
                        this.removeObj[this.test++] = mesh0
                    }
                    if (breakable1) {

                        const debris = this.convexObject.subdivideByImpact(mesh1, this.impactPoint, this.impactNormal, 1, 2, 1.5);
                        const numObjects = debris.length;
                        for (let j = 0; j < numObjects; j++) {
                            const vel = rb1.getLinearVelocity();
                            const angVel = rb1.getAngularVelocity();
                            debris[j].userData.velocity = new THREE.Vector3(vel.x(), vel.y(), vel.z());
                            debris[j].userData.angularVelocity = new THREE.Vector3(angVel.x(), angVel.y(), angVel.z());
                            this.scene.add(debris[j]);
                            this.meshList.push(this.affixPhysics({
                                isPhysics: true,
                                mass: debris[j].userData.mass,
                                vel: debris[j].userData.velocity,
                                angVel: debris[j].userData.angularVelocity,
                                isBroken: true
                            }, debris[j]))
                        }
                        this.removeObj[this.test++] = mesh1
                    }
                }
                for (let i = 0; i < this.removeObj.length; i++) {
                    if (this.removeObj[i]) {
                        this.scene.remove(this.removeObj[i]);
                        let rigidBody = this.removeObj[i].userData.physicsBody;
                        this.physicsWorld.removeRigidBody(rigidBody);
                        this.removeObj[i] = null;
                    }
                }
            }
        }
    }
}