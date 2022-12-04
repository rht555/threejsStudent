import MyTHRRE from "../utils/init";
import * as THREE from 'three';
//导入效果编辑器
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
//导入GlitchPass
import {GlitchPass} from 'three/examples/jsm/postprocessing/GlitchPass.js';
let t = new MyTHRRE({
    cameraOptions: {
        position: [20, 20, 20]
    }
})
t.init()
t.render()
window.addEventListener('resize', t.onWindowResize.bind(t), false)
t.addAxesHelper()

console.log(t);
t.object = new THREE.Object3D()
t.initMeshs = function () {
    return new Promise((resolve, reject) => {
        this.scene.add(t.object)
        const geometry = new THREE.SphereGeometry(1, 16, 16);
        //for 100次
        for (let i = 0; i < 100; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: Math.random() * 0xffffff,
                flatShading: true
            });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize();
            mesh.position.multiplyScalar(Math.random() * 200);
            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3;
            t.object.add(mesh);
        }
        // giltch post processing
        t.composer = new EffectComposer(t.renderer);
        t.composer.addPass(new RenderPass(t.scene, t.camera));
        t.composer.addPass(new GlitchPass());
        resolve()
    })
}
t.initMeshs().then(res => {
    t.animate = () => {
        t.object.rotation.x += 0.005;
        t.object.rotation.y += 0.001;
        t.composer.render()
        return true
    }
})