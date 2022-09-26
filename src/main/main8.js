import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
let scene, cube, camera, renderer;
let axesHelper, controls;
init()
render()
function init() {
    //创建scene，以及物体
    scene = new THREE.Scene();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    camera.position.x = 2

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
}
function render() {
    requestAnimationFrame(render)
    cube.rotation.y += 0.01
    cube.rotation.x += 0.01
    renderer.render(scene, camera)
}