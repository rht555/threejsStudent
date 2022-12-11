import MyTHRRE from "../utils/init";
//导入threejs
import * as THREE from "three";
//导入colladaLoader
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
const t = new MyTHRRE({
    cameraOptions: {
        position: [5, 5, -10],
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
t.addGridHelper()
let mixer;
window.addEventListener('resize', t.onWindowResize.bind(t), false)
t.initLoader = function () {
    // const loader = new ColladaLoader(new THREE.LoadingManager());
    const loader = new ColladaLoader();
    loader.load('../assets/collada/stormtrooper/stormtrooper.dae', function (collada) {
        //将collada模型添加到场景中
        t.newVar("collada", collada)
        t.newVar("stormtrooper", collada.scene)
        t.stormtrooper.traverse(function (child) {
            if (child instanceof THREE.SkinnedMesh) {
                child.frustumCulled = false;//防止模型被裁剪
                console.log(child);
            }
        });
        t.scene.add(collada.scene);
        mixer = new THREE.AnimationMixer(t.stormtrooper);
        const animations = collada.animations;
        const action = mixer.clipAction(animations[0]);
        action.play()
        t.animate = function () {
            const delta = t.clock.getDelta();
            mixer.update(delta);
        }
    });
}
t.initLoader()