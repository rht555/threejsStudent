import MyTHRRE from "../utils/init";
import * as THREE from "three";
//导入GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//导入ktx2Loader
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
//导入MeshoptDecoder
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module";
//导入roomEnvironment
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment";
const t = new MyTHRRE({
    cameraOptions: {
        position: [14, 14, 14],
        fov: 75,
    },
    sceneOptions: {
        sceneDirectionalLightCastShadow: false,
        fogColor: 0xffffff,
        bgcolor: 0xbbbbbb,
        sceneAmbientLight: [0xffffff, 1],
    },
});
t.init();
t.render();
t.addAxesHelper();
t.addGridHelper()
window.addEventListener("resize", t.onWindowResize.bind(t), false);
t.initModel = function () {
    const loader = new GLTFLoader();
    const ktx2loader = new KTX2Loader();
    ktx2loader.setTranscoderPath('/main/libs/basis/');
    ktx2loader.detectSupport(t.renderer);
    loader.setKTX2Loader(ktx2loader);
    loader.setMeshoptDecoder(MeshoptDecoder);//设置MeshoptDecoder
    loader.setPath("../assets/3d/");
    loader.load("coffeemat.glb", function (gltf) {
        //缩小5倍
        gltf.scene.scale.set(0.2, 0.2, 0.2);
        t.scene.add(gltf.scene);
    })
}
t.initEnvironment = function () {
    const envMap = new RoomEnvironment();
    const pmremg = new THREE.PMREMGenerator(t.renderer); // 生成环境贴图
    t.scene.environment = pmremg.fromScene(envMap).texture; // 设置场景环境贴图
    envMap.dispose();
}
t.initModel()