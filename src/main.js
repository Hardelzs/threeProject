import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Setup Scene


// Grid Helper & Axes Helper for better 3D perspective
const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// Torus with Standard Material for better lighting effects
const torusGeometry = new THREE.TorusGeometry(10, 3, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff, wireframe: true, metalness: 0.7, roughness: 0.2 });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Lighting for 3D Depth
const pointLight = new THREE.PointLight(0xffffff, 1, 100);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light

scene.add(pointLight, ambientLight);

// Lines for Extra 3D Effect
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff});
const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    // new THREE.Vector3(-10, 0, 0),
    // new THREE.Vector3(0, 10, 0),
    // new THREE.Vector3(10, 0, 0)
]);
const line = new THREE.Line(lineGeometry, lineMaterial);
scene.add(line);

// Orbit Controls for interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Stars
function addStar() {
    const geometry = new THREE.SphereGeometry(0.25, 24, 24);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff });
    const star = new THREE.Mesh(geometry, material);

    const [x, y, z] = Array.from({ length: 3 }).map(() => THREE.MathUtils.randFloatSpread(100));
    star.position.set(x, y, z);
    scene.add(star);
}

Array.from({ length: 200 }).forEach(addStar);

// Background
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

// Avatar (3D Cube)
const jeffTexture = new THREE.TextureLoader().load();
const jeff = new THREE.Mesh(
    new THREE.BoxGeometry(3, 3, 3),
    new THREE.MeshStandardMaterial({ map: jeffTexture, metalness: 0.8, roughness: 0.3 })
);
scene.add(jeff);

// Moon with Normal Mapping for 3D Effect
const moonTexture = new THREE.TextureLoader().load('moon.jpg');
const normalTexture = new THREE.TextureLoader().load('normal.jpg');
const moon = new THREE.Mesh(
    new THREE.SphereGeometry(3, 32, 32),
    new THREE.MeshStandardMaterial({ map: moonTexture, normalMap: normalTexture, metalness: 0.9, roughness: 0.2 })
);
scene.add(moon);

moon.position.z = 30;
moon.position.setX(-10);
jeff.position.z = -5;
jeff.position.x = 2;

// Scroll Animation
function moveCamera() {
    const t = document.body.getBoundingClientRect().top;
    moon.rotation.x += 0.05;
    moon.rotation.y += 0.075;
    moon.rotation.z += 0.05;
    jeff.rotation.y += 0.01;
    jeff.rotation.z += 0.01;
    camera.position.z = t * -0.01;
    camera.position.x = t * -0.0002;
    camera.rotation.y = t * -0.0002;
}

let ticking = false;
document.body.onscroll = () => {
    if (!ticking) {
        requestAnimationFrame(() => {
            moveCamera();
            ticking = false;
        });
        ticking = true;
    }
};

// Animation Loop
function animate() {
    requestAnimationFrame(animate);

    torus.rotation.y += 0.005;
    moon.rotation.x += 0.005;
    line.rotation.y += 0.01;
    line.rotation.x += 0.01;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// Resize Handling
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
