import MyTHRRE from "../utils/init";
//导入threejs
import * as THREE from "three";
//导入gui
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { TeapotGeometry } from "three/examples/jsm/geometries/TeapotGeometry";
//导入colladaExporter
import { ColladaExporter } from "three/examples/jsm/exporters/ColladaExporter";
const t = new MyTHRRE({
    cameraOptions: {
        position: [5, 5, -10],
        fov: 75
    },
    sceneOptions: {
        bgcolor: 0xeeeeee,
        sceneAmbientLight: [0x707070, 1],
        sceneDirectionalLightPosition: [-10, 18, 5],
        sceneDirectionalLightCastShadow: true,
        isAutoRender: false,
    },
})
t.init()
// t.render()
t.addAxesHelper()
window.addEventListener('resize', t.onWindowResize.bind(t), false)
t.save = function (blob, filename) {
    t.link.href = URL.createObjectURL(blob)
    t.link.download = filename
    t.link.click()
}
t.saveString = function (text, filename) {
    t.save(new Blob([text], { type: 'text/plain' }), filename)
}
t.saveArrayBuffer = function (buffer, filename) {
    t.save(new Blob([buffer], { type: 'application/octet-stream' }), filename)
}
t.expostFunc = function () {
    const result = t.colladaExporter.parse(t.teapot, undefined, {
        upAxis: "Y_UP",
        unitName: "millimeter",
        unitMeter: 0.001,
    });
    let mediaType = "Phong";
    switch (t.effectController.material) {
        case "wireframe":
            mediaType = "Phong";
            break;
        case "Lambert":
            mediaType = "lambert";
            break;
    }
    t.saveString(result.data, "teapot.dae");
    result.textures.forEach((texture) => {
        texture.mediaType = mediaType;
        t.saveArrayBuffer(texture.data, texture.filename);
    });
}
t.initGUI = function () {
    t.newVar("gui", null)
    t.gui = new GUI()
    t.newVar("effectController", {
        hue: 0.121,
        saturation: 0.73,
        lightness: 0.66,

        lhue: 0.04,
        lsaturation: 0.01, // non-zero so that fractions will be shown
        llightness: 1.0,// 1.0 = 100%,
        lx: 0.32,
        ly: 0.39,
        lz: 0.7,

        lid: true,
        body: true,
        fitLid: true,
        bottom: true,
        blinn: true,
        size: 0.5,
        segments: 10,

        material: "phong",

        export: t.expostFunc,
    })
    const colorFolder = t.gui.addFolder("颜色")
    //默认收起
    colorFolder.close()
    colorFolder.add(t.effectController, "hue", 0, 1, 0.025).name("色调").onChange(t.update.bind(t))
    colorFolder.add(t.effectController, "saturation", 0, 1, 0.025).name("饱和度").onChange(t.update.bind(t))
    colorFolder.add(t.effectController, "lightness", 0, 1, 0.025).name("亮度").onChange(t.update.bind(t))

    const lightFolder = t.gui.addFolder("光照")
    //默认收起
    lightFolder.close()
    lightFolder.add(t.effectController, "lhue", 0, 1, 0.025).name("色调").onChange(t.update.bind(t))
    lightFolder.add(t.effectController, "lsaturation", 0, 1, 0.025).name("饱和度").onChange(t.update.bind(t))
    lightFolder.add(t.effectController, "llightness", 0, 1, 0.025).name("亮度").onChange(t.update.bind(t))
    lightFolder.add(t.effectController, "lx", -1, 1, 0.005).name("x").onChange(t.update.bind(t))
    lightFolder.add(t.effectController, "ly", -1, 1, 0.005).name("y").onChange(t.update.bind(t))
    lightFolder.add(t.effectController, "lz", -1, 1, 0.005).name("z").onChange(t.update.bind(t))

    const teapotFolder = t.gui.addFolder("茶壶")
    //默认收起
    teapotFolder.close()
    teapotFolder.add(t.effectController, "lid").name("杯盖").onChange(t.update.bind(t))
    teapotFolder.add(t.effectController, "body").name("杯身").onChange(t.update.bind(t))
    teapotFolder.add(t.effectController, "fitLid").name("杯盖是否合适").onChange(t.update.bind(t))
    teapotFolder.add(t.effectController, "bottom").name("杯底").onChange(t.update.bind(t))
    teapotFolder.add(t.effectController, "blinn").name("是否合适").onChange(t.update.bind(t))
    teapotFolder.add(t.effectController, "size", 0.1, 1, 0.025).name("尺寸").onChange(t.update.bind(t))
    //细分使用下拉框
    teapotFolder.add(t.effectController, "segments", [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]).name("细分").onChange(t.update.bind(t))

    //材质
    const materialFolder = t.gui.addFolder("材质")
    //默认收起
    materialFolder.close()
    materialFolder.add(t.effectController, "material", ["phong", "lamber", "flat", "texture"]).name("材质").onChange(t.update.bind(t))

    //添加导出按钮
    t.gui.add(t.effectController, "export").name("导出")
}
t.initTeaPot = function () {
    t.newVar("teapotG", null)
    t.teapotG = new TeapotGeometry(1, 10, true, true, true, true, true) // 1:尺寸 10:细分度 true:是否有杯盖 true:是否有杯底 true:是否有杯身 true:是否有杯柄 true:是否有杯嘴
    t.newVar("teapot", null)
    t.teapot = new THREE.Mesh(
        t.teapotG,
        t.phongMaterial
    )
    t.teapot.position.set(0, 1, 0)
    t.scene.add(t.teapot)
}
t.initMaterial = function () {
    t.newVar("material", null)
    t.newVar("phongMaterial", null)
    const materialColor = new THREE.Color().setHSL(1.0, 1.0, 1.0)
    t.phongMaterial = new THREE.MeshPhongMaterial({
        color: materialColor,
        side: THREE.DoubleSide,//两面可见
    })
    t.newVar("lamberMaterial", null)
    t.lamberMaterial = new THREE.MeshLambertMaterial({
        color: materialColor,
        side: THREE.DoubleSide,//两面可见
    })
    t.newVar("flatMaterial", null)
    t.flatMaterial = new THREE.MeshPhongMaterial({
        color: materialColor,
        side: THREE.DoubleSide,//两面可见
        specular: 0x000000,// 镜面反射
        flatShading: true,//平面着色
    })
    t.newVar("texturedMaterial", null)
    const loader = new THREE.TextureLoader()
    const texture = loader.load("../assets/img/uv_grid_opengl.jpg")
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping // 水平和垂直方向重复
    texture.anisotropy = 16 // 各向异性过滤
    texture.encoding = THREE.sRGBEncoding // 纹理编码
    t.texturedMaterial = new THREE.MeshPhongMaterial({
        map: texture,
        side: THREE.DoubleSide,//两面可见
    })
    t.material = t.phongMaterial
}
t.initExport = function () {
    t.newVar("link", null)
    t.link = document.createElement("a")
    t.link.style.display = "none"
    document.body.appendChild(t.link)

    t.newVar("colladaExporter", null)
    t.colladaExporter = new ColladaExporter()
}
t.initMaterial()
t.initGUI()
t.initTeaPot()
t.animate = function () {
    t.material.color.setHSL(t.effectController.hue, t.effectController.saturation, t.effectController.lightness)
    t.light.color.setHSL(t.effectController.lhue, t.effectController.lsaturation, t.effectController.llightness)
    t.light.position.set(t.effectController.lx, t.effectController.ly, t.effectController.lz)
    t.teapotG = new TeapotGeometry(t.effectController.size, t.effectController.segments, t.effectController.bottom, t.effectController.lid, t.effectController.body, t.effectController.fitLid, t.effectController.blinn)
    t.teapot.geometry = t.teapotG
    t.teapot.material = ((e) => {
        switch (e) {
            case "phong":
                t.material = t.phongMaterial
                t.material.color.setHSL(t.effectController.hue, t.effectController.saturation, t.effectController.lightness)
                return t.phongMaterial
            case "lamber":
                t.material = t.lamberMaterial
                t.material.color.setHSL(t.effectController.hue, t.effectController.saturation, t.effectController.lightness)
                return t.lamberMaterial
            case "flat":
                t.material = t.flatMaterial
                t.material.color.setHSL(t.effectController.hue, t.effectController.saturation, t.effectController.lightness)
                return t.flatMaterial
            case "texture":
                t.material = t.texturedMaterial
                return t.texturedMaterial
            default:
                t.material = t.phongMaterial
                t.material.color.setHSL(t.effectController.hue, t.effectController.saturation, t.effectController.lightness)
                return t.phongMaterial
        }
    })(t.effectController.material)
}
t.update()
t.initExport()