import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextGeometry } from 'three'

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
const donutNumTotal = 100;
const matNum = 8;
/**
 * Base
 */
// Debug
const gui = new dat.GUI()
gui.hide();

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)
/**
 * Textures
 */
const donut = [];
const textureLoader = new THREE.TextureLoader()
const matcapTexture = []
for (let i = 0; i < matNum; i++) {
  matcapTexture[i] = textureLoader.load(`/textures/matcaps/${i + 1}.png`)
}
const material = []
for (let i = 0; i < matNum; i++) {
  material[i] = new THREE.MeshMatcapMaterial(
    { matcap: matcapTexture[i] }
  )
}
/**
 * Fonts
 */
const fontLoader = new THREE.FontLoader()

fontLoader.load(
  '/fonts/helvetiker_regular.typeface.json',
  (font) => {
    const textGeometry = new THREE.TextBufferGeometry(
      'DOOOONUTS',
      {
        font: font,
        size: 0.5,
        height: 0.2,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.03,
        bevelSize: 0.02,
        bevelOffset: 0,
        bevelSegments: 4
      }
    )
    textGeometry.center()
    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //   -(textGeometry.boundingBox.max.x - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.y - 0.02) * 0.5,
    //   -(textGeometry.boundingBox.max.z - 0.03) * 0.5
    // )
    // getRandomInt(3)
    const text = new THREE.Mesh(textGeometry, material[getRandomInt(matNum)])
    scene.add(text)
  }
)

console.time('donuts')

const donutGeometry = new THREE.TorusBufferGeometry(.3, .2, 20, 45)

for (let i = 0; i < 100; i++) {
  donut[i] = new THREE.Mesh(donutGeometry, material[getRandomInt(matNum)])

  donut[i].position.x = (Math.random() - .5) * 10
  donut[i].position.y = (Math.random() - .5) * 10
  donut[i].position.z = (Math.random() - .5) * 10
  donut[i].rotation.x = Math.random() * Math.PI
  donut[i].rotation.y = Math.random() * Math.PI

  const scale = Math.random()
  donut[i].scale.set(scale, scale, scale)
  console.log('text')
  scene.add(donut[i])
}
console.timeEnd('donuts')
/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

let rotate = []
for (let i = 0; i < donutNumTotal; i++) {
  rotate[i] = (Math.random() - .5) * 5
}

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  for (let i = 0; i < donutNumTotal; i++) {
    donut[i].rotation.set(rotate[i] * elapsedTime, rotate[i] * elapsedTime, rotate[i] * elapsedTime)
  }
  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()