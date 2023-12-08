// main.js
import {loadVideo} from "./loader.js";
import {createChromaMaterial} from './chroma-video.js';

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener('DOMContentLoaded', () => {
  const start = async() => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/target-cr.mind?v=1701976017267",
    });

    const {renderer, scene, camera} = mindarThree;
    const videosData = [
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_00-converted.mp4?v=1702066807268",
        position: new THREE.Vector3(0, 0, 0),  // Ajusta la posición según sea necesario
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_01-converted.mp4?v=1702066807656",
        position: new THREE.Vector3(0, 0, 0.2),  // Ajusta la posición según sea necesario
      },
       {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_02-converted.mp4?v=1702066808076",
        position: new THREE.Vector3(0, 0, 0.4),  // Ajusta la posición según sea necesario
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_03-converted.mp4?v=1702066808378",
        position: new THREE.Vector3(0, 0, 0.6),
      },
       {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_04-converted.mp4?v=1702066808762",
        position: new THREE.Vector3(0, 0, 0.8),  // Ajusta la posición según sea necesario
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AR_CR_PLANO_05-converted.mp4?v=1702066806844",
        position: new THREE.Vector3(0, 0, 1),  // Ajusta la posición según sea necesario
      },
    ];

    const videos = await Promise.all(videosData.map(async (videoData) => {
      const videoTexture = await loadVideo(videoData.url);
      const video = videoTexture.image;

      const geometry = new THREE.PlaneGeometry(1, 1080/1080);
      const material = createChromaMaterial(videoTexture, 0x14FF09, 0.6, 0);
      const plane = new THREE.Mesh(geometry, material);
      plane.rotation.x = 0;
      plane.position.copy(videoData.position);  // Copia la posición desde la estructura de datos
      plane.scale.multiplyScalar(1);

      const anchor = mindarThree.addAnchor(0);
      anchor.group.add(plane);

      anchor.onTargetFound = () => {
        video.play();
      };
      anchor.onTargetLost = () => {
        video.pause();
      };

      return { video, plane };
    }));

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      videos.forEach(({ video, plane }) => {
        // Actualiza aquí las animaciones o transformaciones según sea necesario
      });

      renderer.render(scene, camera);
    });
  }

  const startButton = document.createElement("button");
  startButton.textContent = "Start";
  startButton.addEventListener("click", start);
  document.body.appendChild(startButton);
});
