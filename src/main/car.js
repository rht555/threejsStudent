import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import gsap from "gsap"
let renderer, camera, scene, axesHelper, controls;
let road, road2, road3, car, car2, car3, car4, car5, car6, car7;
let carbox, car2box, car3box, car4box, car5box, car6box, car7box;
let isleft = false, isright = false, c2 = false, c3 = false, c4 = false, c5 = false, c6 = false, c7 = false;
let num = 0;
const loader = new GLTFLoader()
initRenderer()
initCamera()
initScene()
initLight()
initRoad()
initCar()
initObstacle()
// initHelper()
// initControls()
function initRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    })
    //设置像素比，设置以后会更清晰
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
}
function initCamera() {
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 10, 10)
    camera.lookAt(0, 0, 0)
}
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xFFFAF0)
}
function initLight() {
    scene.add(new THREE.AmbientLight(0xffffff))
}
function initRoad() {
    loader.load("../assets/3d/test.glb", function (gltf) {
        road = gltf.scene
        scene.add(road)
    })
    loader.load("../assets/3d/test.glb", function (gltf) {
        road2 = gltf.scene
        road2.position.set(0, 0, -11)
        scene.add(road2)
    })
    loader.load("../assets/3d/test.glb", function (gltf) {
        road3 = gltf.scene
        road3.position.set(0, 0, -22)
        scene.add(road3)
    })
    animate()
}
function initCar() {
    loader.load("../assets/3d/car.glb", function (gltf) {
        car = gltf.scene
        carbox = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        carbox.setFromObject(car)
        const carHelper = new THREE.BoxHelper(car, 0xFFFFFF);
        // car.add(carHelper)
        car.position.set(0, 0.682, 4)
        scene.add(car)
    })
}
function initObstacle() {
    loader.load("../assets/3d/car.glb", function (gltf) {
        car2 = gltf.scene
        car2box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car2box.setFromObject(car2)
        const carHelper = new THREE.BoxHelper(car2, 0xFFFFFF);
        // car2.add(carHelper)
        car2.position.set(Math.random() * 2 - 1.5, 0.682, Math.random() * 10 - 36)
        scene.add(car2)
    })
    loader.load("../assets/3d/car.glb", function (gltf) {
        car3 = gltf.scene
        car3box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car3box.setFromObject(car3)
        const carHelper = new THREE.BoxHelper(car3, 0xFFFFFF);
        // car3.add(carHelper)
        car3.position.set(Math.random() * 2 - 1.5, 0.682, Math.random() * 10 - 24)
        scene.add(car3)
    })
    loader.load("../assets/3d/car.glb", function (gltf) {
        car4 = gltf.scene
        car4box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car4box.setFromObject(car4)
        const carHelper = new THREE.BoxHelper(car4, 0xFFFFFF);
        // car4.add(carHelper)
        car4.position.set(Math.random() * 2 - 1, 0.682, Math.random() * 10 - 28)
        scene.add(car4)
    })
    loader.load("../assets/3d/car.glb", function (gltf) {
        car5 = gltf.scene
        car5box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car5box.setFromObject(car5)
        const carHelper = new THREE.BoxHelper(car5, 0xFFFFFF);
        // car5.add(carHelper)
        car5.position.set(Math.random() * 2 - 1.5, 0.682, Math.random() * 10 - 32)
        scene.add(car5)
    })
    loader.load("../assets/3d/car.glb", function (gltf) {
        car6 = gltf.scene
        car6box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car6box.setFromObject(car6)
        const carHelper = new THREE.BoxHelper(car6, 0xFFFFFF);
        // car6.add(carHelper)
        car6.position.set(Math.random() * 2 - 1, 0.682, Math.random() * 10 - 20)
        scene.add(car6)
    })
    loader.load("../assets/3d/car.glb", function (gltf) {
        car7 = gltf.scene
        car7box = new THREE.Box3(new THREE.Vector3(), new THREE.Vector3());
        car7box.setFromObject(car7)
        const carHelper = new THREE.BoxHelper(car7, 0xFFFFFF);
        // car7.add(carHelper)
        car7.position.set(Math.random() * 2 - 1.5, 0.682, Math.random() * 10 - 30)
        scene.add(car7)
    })
}

function initHelper() {
    axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)
}
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 1, 0)
    controls.update()
}
function animate() {
    if (isleft && !c2 && !c3 && !c4 && !c5 && !c6 && !c7) {
        if (car.position.x > -1.4) {
            gsap.to(car.position, {
                x: car.position.x - 0.2,
                duration: 0.2
            })
        }
    }
    if (isright && !c2 && !c3 && !c4 && !c5 && !c6 && !c7) {
        if (car.position.x < 1.4) {
            gsap.to(car.position, {
                x: car.position.x + 0.2,
                duration: 0.2
            })
        }
    }
    if (road) {
        if (road.position.z <= 11) {
            road.position.z += 0.01
        } else {
            road.position.z = -22
        }
    }
    if (road2) {
        if (road2.position.z <= 11) {
            road2.position.z += 0.01
        } else {
            road2.position.z = -22
        }
    }
    if (road3) {
        if (road3.position.z <= 11) {
            road3.position.z += 0.01
        } else {
            road3.position.z = -22
        }
    }
    if (car2) {
        if (car2.position.z <= 10) {
            car2.position.z += 0.03
        } else {
            car2.position.x = Math.random() * 2 - 1.5
            car2.position.z = Math.random() * 5 - 20
            num += 1
        }
    }
    if (car3) {
        if (car3.position.z <= 10) {
            car3.position.z += 0.03
        } else {
            car3.position.x = Math.random() * 2 - 1
            car3.position.z = Math.random() * 5 - 24
            num += 1
        }
    }
    if (car4) {
        if (car4.position.z <= 10) {
            car4.position.z += 0.03
        } else {
            car4.position.x = Math.random() * 2 - 1
            car4.position.z = Math.random() * 5 - 18
            num += 1
        }
    }
    if (car5) {
        if (car5.position.z <= 10) {
            car5.position.z += 0.03
        } else {
            car5.position.x = Math.random() * 2 - 1.5
            car5.position.z = Math.random() * 5 - 21
            num += 1
        }
    }
    if (car6) {
        if (car6.position.z <= 10) {
            car6.position.z += 0.03
        } else {
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
            num += 1
        }
    }
    if (car7) {
        if (car7.position.z <= 10) {
            car7.position.z += 0.03
        } else {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
            num += 1
        }
    }
    if (carbox) {
        carbox.setFromObject(car)
        car2box.setFromObject(car2)
        car3box.setFromObject(car3)
        car4box.setFromObject(car4)
        car5box.setFromObject(car5)
        car6box.setFromObject(car6)
        car7box.setFromObject(car7)
        if (car2box.intersectsBox(car3box)) {
            car3.position.x = Math.random() * 2 - 1
            car3.position.z = Math.random() * 5 - 24
        }
        if (car2box.intersectsBox(car4box)) {
            car4.position.x = Math.random() * 2 - 1
            car4.position.z = Math.random() * 5 - 18
        }
        if (car2box.intersectsBox(car5box)) {
            car5.position.x = Math.random() * 2 - 1.5
            car5.position.z = Math.random() * 5 - 21
        }
        if (car2box.intersectsBox(car6box)) {
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
        }
        if (car2box.intersectsBox(car7box)) {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        }
        if (car3box.intersectsBox(car4box)) {
            car4.position.x = Math.random() * 2 - 1
            car4.position.z = Math.random() * 5 - 18
        }
        if (car3box.intersectsBox(car5box)) {
            car5.position.x = Math.random() * 2 - 1.5
            car5.position.z = Math.random() * 5 - 21
        }
        if (car3box.intersectsBox(car6box)) {
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
        }
        if (car3box.intersectsBox(car7box)) {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        }
        if (car4box.intersectsBox(car5box)) {
            car5.position.x = Math.random() * 2 - 1.5
            car5.position.z = Math.random() * 5 - 21
        }
        if (car4box.intersectsBox(car6box)) {
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
        }
        if (car4box.intersectsBox(car7box)) {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        }
        if (car5box.intersectsBox(car6box)) {
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
        }
        if (car5box.intersectsBox(car7box)) {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        }
        if (car6box.intersectsBox(car7box)) {
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        }
        if (carbox.intersectsBox(car2box)) {
            c2 = true
            car2.position.x = Math.random() * 2 - 1.5
            car2.position.z = Math.random() * 5 - 20
        } else {
            c2 = false
        }
        if (carbox.intersectsBox(car3box)) {
            c3 = true
            car3.position.x = Math.random() * 2 - 1
            car3.position.z = Math.random() * 5 - 24
        } else {
            c3 = false
        }
        if (carbox.intersectsBox(car4box)) {
            c4 = true
            car4.position.x = Math.random() * 2 - 1
            car4.position.z = Math.random() * 5 - 18
        } else {
            c4 = false
        }
        if (carbox.intersectsBox(car5box)) {
            c5 = true
            car5.position.x = Math.random() * 2 - 1.5
            car5.position.z = Math.random() * 5 - 21
        } else {
            c5 = false
        }
        if (carbox.intersectsBox(car6box)) {
            c6 = true
            car6.position.x = Math.random() * 2 - 1
            car6.position.z = Math.random() * 5 - 18
        } else {
            c6 = false
        }
        if (carbox.intersectsBox(car7box)) {
            c7 = true
            car7.position.x = Math.random() * 2 - 1.5
            car7.position.z = Math.random() * 5 - 25
        } else {
            c7 = false
        }
    }
    requestAnimationFrame(animate)
    render()
    document.getElementById("num").innerText = `num:${num}`
}
function render() {
    renderer.render(scene, camera)
}
window.addEventListener("keydown", (key) => {
    if (key.key == "a") {
        isleft = true
    }
})
window.addEventListener("keyup", (key) => {
    if (key.key == "a") {
        isleft = false
    }
})
window.addEventListener("keydown", (key) => {
    if (key.key === "d") {
        isright = true
    }
})
window.addEventListener("keyup", (key) => {
    if (key.key === "d") {
        isright = false
    }
})