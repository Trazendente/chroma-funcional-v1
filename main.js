// main.js
import { loadVideo } from "./loader.js";
import { loadAudio } from "./loader.js";
import { createChromaMaterial } from "./chroma-video.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  const start = async () => {
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc:
        "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/target-cr.mind?v=1701976017267",
    
    });

    const { renderer, scene, camera } = mindarThree;

    // Configuración del audio
    const audioClip = await loadAudio(
      "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/AUDIO_CR_V1_2.mp3?v=1702306241238"
    );
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const audio = new THREE.PositionalAudio(listener);
    audio.setBuffer(audioClip);
    audio.setRefDistance(100);
    // Ajustar el volumen
    audio.setVolume(9.0);
    
    const startButton = document.getElementById("startButton");
    const infoText = document.getElementById("infoText");

    // Oculta o elimina el botón y el texto después de iniciar
    startButton.style.display = "none";
    infoText.style.display = "none";

    const videosData = [
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2000-MAIN.mp4?v=1702332451877",
        position: new THREE.Vector3(0, 0, 0),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2001-MAIN.mp4?v=1702332455111",
        position: new THREE.Vector3(0, 0, 0.1),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2002-MAIN.mp4?v=1702332455784",
        position: new THREE.Vector3(0, 0, 0.2),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2003-MAIN.mp4?v=1702332456514",
        position: new THREE.Vector3(0, 0, 0.3),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2004-MAIN.mp4?v=1702332457314",
        position: new THREE.Vector3(0, 0, 0.4),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2005-MAIN.mp4?v=1702332458527",
        position: new THREE.Vector3(0, 0, 0.5),
      },
    ];

    const videos = await Promise.all(
      videosData.map(async (videoData) => {
        const videoTexture = await loadVideo(videoData.url);
        const video = videoTexture.image;

        const geometry = new THREE.PlaneGeometry(1, 1080 / 1080);
        const material = createChromaMaterial(videoTexture, 0x14ff09, 0.4, 0.2);
        const plane = new THREE.Mesh(geometry, material);
        plane.rotation.x = 0;
        plane.position.copy(videoData.position);
        plane.scale.multiplyScalar(0.5);

        const anchor = mindarThree.addAnchor(0);
        anchor.group.add(plane);
        anchor.group.add(audio);

        anchor.onTargetFound = () => {
          video.play();
          audio.play();
        };

        anchor.onTargetLost = () => {
          video.pause();
          audio.pause();
        };

        return { video, plane };
      })
    );

    await mindarThree.start();

    renderer.setAnimationLoop(() => {
      videos.forEach(({ video, plane }) => {});

      renderer.render(scene, camera);
    });
  };

  const startButton = document.createElement("button");
  startButton.textContent = "Empezar AR";
  startButton.id = "startButton";
  startButton.addEventListener("click", start);
  document.body.appendChild(startButton);

  const infoText = document.createElement("p");
  infoText.textContent = "Presiona 'Start' para empezar";
  infoText.id = "infoText";
  document.body.appendChild(infoText);
});
