import MyTHRRE from "../utils/init";
import * as THREE from "three";
//导入GLTFLoader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
//导入HDRLoader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
const t = new MyTHRRE({
    cameraOptions: {
        position: [4, 4, 4],
        fov: 75,
    },
    sceneOptions: {
        sceneDirectionalLightCastShadow: false,
        fogColor: 0xffffff,
        bgcolor: 0xffffff,
        sceneAmbientLight: [0xffffff, 1],
    },
});
t.init();
t.render();
t.addAxesHelper();
window.addEventListener("resize", t.onWindowResize.bind(t), false);
t.initModel = function () {
    const loader = new GLTFLoader();
    loader.setPath("../assets/3d/DamagedHelmet/glTF/");
    loader.load("DamagedHelmet.gltf", function (gltf) {
        gltf.scene.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        t.scene.add(gltf.scene);
    })
}
t.initModel()
t.initHDR = function () {
    new RGBELoader()
        .setPath("../assets/3d/hdr/")
        .load("my.hdr", function (texture) {
            texture.encoding = THREE.sRGBEncoding; //设置纹理编码
            texture.mapping = THREE.EquirectangularReflectionMapping; //设置纹理映射
            t.scene.environment = texture; //设置环境贴图
            t.scene.background = texture; //设置背景
        });
}
t.initHDR()