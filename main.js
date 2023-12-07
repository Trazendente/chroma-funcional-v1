// main.js
import {loadGLTF, loadVideo} from "./loader.js";
import {mockWithVideo} from './camera-mock.js';
import {createChromaMaterial} from './chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
   // mockWithVideo("https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/course-banner1.mp4?v=1701962148008");
    
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/target-cr.mind?v=1701976017267",
    });
    const {renderer, scene, camera} = mindarThree;

    const videoTexture = await loadVideo("https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_02-converted.mp4?v=1701976517418");
    const video = videoTexture.image;

    const geometry = new THREE.PlaneGeometry(1, 1080/1920);
    const material = createChromaMaterial(videoTexture, 0x00ff00);
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = 0;
    plane.position.y = 0.7;
    plane.scale.multiplyScalar(4);

    const anchor = mindarThree.addAnchor(0);
    anchor.group.add(plane);

    anchor.onTargetFound = () => {
      video.play();
    }
    anchor.onTargetLost = () => {
      video.pause();
    }

    await mindarThree.start();
    renderer.setAnimationLoop(() => {
      renderer.render(scene, camera);
    });
  }

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", start);
  document.body.appendChild(startButton);
});
