import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Сцена
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0f0f0);

// Камера
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);

// Отрисовщик
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 0;
controls.maxDistance = 200;
controls.minPolarAngle = 0;
controls.maxPolarAngle = 5;
controls.autoRotate = false;
controls.target = new THREE.Vector3(0, 0, 0);
controls.update();

// Raycaster
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
let INTERSECTED = null;

document.addEventListener('mousemove', onPointerMove);

function onPointerMove(event) {
  pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
  pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(directionalLight);

// Кубы
const geometry = new THREE.BoxGeometry();

for (let i = 0; i < 2000; i++) {

  const object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));

  object.position.x = Math.random() * 40 - 20;
  object.position.y = Math.random() * 40 - 20;
  object.position.z = Math.random() * 40 - 20;

  object.rotation.x = Math.random() * 2 * Math.PI;
  object.rotation.y = Math.random() * 2 * Math.PI;
  object.rotation.z = Math.random() * 2 * Math.PI;

  object.scale.set(0.5, 0.5, 0.5);

  scene.add(object);

}

// Анимация
function animate() {
  requestAnimationFrame(animate);

  // Обновляем Raycaster
  raycaster.setFromCamera(pointer, camera);

  // Ищем пересечения с объектами сцены
  const intersects = raycaster.intersectObjects(scene.children, false);

  if (intersects.length > 0) {
    if (INTERSECTED !== intersects[0].object) {
      if (INTERSECTED) {
        // Сброс цвета предыдущего объекта
        INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
      }

      INTERSECTED = intersects[0].object;
      INTERSECTED.currentHex = INTERSECTED.material.color.getHex();
      INTERSECTED.material.color.setHex(0xff0000); // Устанавливаем красный цвет
    }
  } else {
    if (INTERSECTED) {
      // Сброс цвета объекта при отсутствии пересечения
      INTERSECTED.material.color.setHex(INTERSECTED.currentHex);
    }
    INTERSECTED = null;
  }

  controls.update();
  renderer.render(scene, camera);
}



animate();