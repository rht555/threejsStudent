import MyTHREE from '../utils/init';
//导入threejs
import * as THREE from 'three';
//导入colladaLoader
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
//导入three中的tween
import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js';
//定义起点
// t.paras = {}
// let target = {}//目标值
let tw;
const t = new MyTHREE({
    cameraOptions: {
        position: [10, 10, 12],
        fov: 80
    },
    sceneOptions: {
        bgcolor: 0xeeeeee,
        sceneAmbientLight: [0x707070, 1],
        sceneDirectionalLightPosition: [-10, 18, 5],
        sceneDirectionalLightCastShadow: true
    }
});
t.newVar("paras", {})
t.newVar("target", {})
t.init()
t.addAxesHelper()
t.render()
t.initLoader = function () {
    const loader = new ColladaLoader(new THREE.LoadingManager());
    // const loader = new ColladaLoader();
    // loader.load('../assets/collada/abb_irb52_7_120.dae', function (collada) {
    //     t.newVar('dae', collada.scene)
    //     t.newVar('collada', collada)
    //     t.dae.traverse(function (child) {
    //         if (child instanceof THREE.Mesh) {
    //             child.material.flatShading = true;
    //             child.material.color.setHex(Math.random() * 0xffffff);
    //         }
    //     });
    //     t.dae.scale.x = t.dae.scale.y = t.dae.scale.z = 10;
    //     t.scene.add(t.dae);
    //     t.setUpTween()
    //     t.animate = function (e) {
    //         if (tw) {
    //             tw.update(e)
    //         }
    //         return false
    //     }
    // });
    loader.load('../assets/collada/elf/teapot.dae', function (collada) {
        console.log(collada)
        collada.scene.scale.x = collada.scene.scale.y = collada.scene.scale.z = 0.1;
        t.newVar("elf", collada.scene)
        t.scene.add(collada.scene);
    });
}

t.setUpTween = function () {
    let d = THREE.MathUtils.randInt(1000, 5000)
    for (const prop in t.collada.kinematics.joints) {
        if (t.collada.kinematics.joints.hasOwnProperty(prop)) {
            //排除静态的
            if (!t.collada.kinematics.joints[prop].static) {
                const joint = t.collada.kinematics.joints[prop];
                const old = t.target[prop]
                const position = old ? old : joint.zeroPosition;
                t.paras[prop] = position;
                t.target[prop] = THREE.MathUtils.randInt(
                    joint.limits.min,
                    joint.limits.max
                )
            }
        }
    }
    console.log(t.target, t.paras);
    tw = new TWEEN.Tween(t.paras).to(t.target, d).easing(TWEEN.Easing.Quadratic.Out)
    tw.onUpdate(function (object) {
        for (const prop in t.collada.kinematics.joints) {
            if (t.collada.kinematics.joints.hasOwnProperty(prop)) {
                //排除静态的
                if (!t.collada.kinematics.joints[prop].static) {
                    t.collada.kinematics.setJointValue(prop, object[prop])
                }
            }
        }
    })
    tw.start()
    setTimeout(() => {
        t.setUpTween()
    }, d);
}
t.initLoader()
t.animate = function () {
    if (t.elf) {
        t.elf.rotation.z += t.clock.getDelta() * 0.5
    }
    return false
}
