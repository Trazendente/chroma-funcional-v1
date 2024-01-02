import { loadVideo } from "./loader.js";
import { loadAudio } from "./loader.js";
import { createChromaMaterial } from "./chroma-video.js";

const THREE = window.MINDAR.IMAGE.THREE;

document.addEventListener("DOMContentLoaded", () => {
  let experienceStarted = false;
  const start = async () => {
    if (experienceStarted) {
      return;
    }

    experienceStarted = true;
    const mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.body,
      imageTargetSrc:
        "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/target-cr-opcion4.mind?v=1702930452080",
      uiScanning: "#scanning",
      uiLoading: "no",
    });

    const { renderer, scene, camera } = mindarThree;
    // Configuración de la cámara
    camera.near = 0.01; // Ajusta según sea necesario
    camera.far = 5000; // Ajusta según sea necesario

    // Configuración del audio
    const audioClipPromise = loadAudio(
      "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/audio_fix_cre_v3_high.mp3?v=1703001585354"
    );
    const listener = new THREE.AudioListener();
    camera.add(listener);
    const audio = new THREE.Audio(listener); // Utiliza THREE.Audio en lugar de THREE.PositionalAudio

    audioClipPromise.then((audioClip) => {
      audio.setBuffer(audioClip);
      // Volumen
      audio.setVolume(1.0);
    });
    const startButton = document.getElementById("startButton");
    const infoText = document.getElementById("infoText");

    // Oculta o elimina el botón y el texto después de iniciar
    startButton.style.display = "none";
    infoText.style.display = "none";

    const paredVideoData = {
      url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Pared-v2_MAIN.mp4?v=1703002526892",
      position: new THREE.Vector3(0, 0.365, -0.1),
      scale: 1.25, // Ajusta la escala según sea necesario
      rotation: new THREE.Euler(0, 0, 0), // Ajusta la rotación según sea necesario
    };

    const paredVideoTexture = await loadVideo(paredVideoData.url);
    const paredVideo = paredVideoTexture.image;

    const paredGeometry = new THREE.PlaneGeometry(1, 1);
    const paredMaterial = createChromaMaterial(
      paredVideoTexture,
      0x14ff09,
      0.4,
      0.2
    );
    paredMaterial.side = THREE.DoubleSide;

    const paredPlane = new THREE.Mesh(paredGeometry, paredMaterial);
    paredPlane.renderOrder = 1; // Ajusta el orden de representación
    paredPlane.rotation.x = paredVideoData.rotation.x;
    paredPlane.position.copy(paredVideoData.position);
    paredPlane.scale.multiplyScalar(paredVideoData.scale);

    const paredAnchor = mindarThree.addAnchor(0);
    paredAnchor.group.add(paredPlane);
    //paredAnchor.group.add(audio);

    paredAnchor.onTargetFound = () => {
      paredVideo.play();
      audio.play();
    };

    paredAnchor.onTargetLost = () => {
      paredVideo.pause();
      audio.pause();
    };

    const videosData = [
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2000-MAIN_V3.mp4?v=1703184989844",
        position: new THREE.Vector3(0, 0, 0),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2001-MAIN_V3.mp4?v=1703194210840",
        position: new THREE.Vector3(0, 0, 0.1),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2002-MAIN_V3.mp4?v=1703194211541",
        position: new THREE.Vector3(0, 0, 0.2),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2003-MAIN_V3.mp4?v=1703194211207",
        position: new THREE.Vector3(0, 0, 0.3),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2004-MAIN_V3.mp4?v=1703184990979",
        position: new THREE.Vector3(0, 0, 0.4),
      },
      {
        url: "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/Ar%20Cr%20Plano%2005-MAIN_V3.mp4?v=1703184990617",
        position: new THREE.Vector3(0, 0, 0.5),
      },
    ];

    const pisoVideoUrl =
      "https://cdn.glitch.global/5b7a1209-5438-4fcd-96dc-ba81f0837a93/PisoV3-MAIN.mp4?v=1703193624768";
    const pisoVideoPosition = new THREE.Vector3(0, -0.26, 0.3);
    const pisoVideoTexture = await loadVideo(pisoVideoUrl);
    const pisoVideo = pisoVideoTexture.image;

    const pisoGeometry = new THREE.PlaneGeometry(1231 / 514, 1);
    const pisoMaterial = createChromaMaterial(
      pisoVideoTexture,
      0x14ff09,
      0.4,
      0.2
    );
    pisoMaterial.side = THREE.DoubleSide;
    pisoMaterial.transparent = true; // Asegura que el material sea transparente

    const pisoPlane = new THREE.Mesh(pisoGeometry, pisoMaterial);
    pisoPlane.renderOrder = 1; // Ajusta el orden de representación

    pisoPlane.rotation.x = Math.PI / 2;
    pisoPlane.position.copy(pisoVideoPosition);
    pisoPlane.scale.set(0.52, 0.8, 1);

    const pisoAnchor = mindarThree.addAnchor(0);
    pisoAnchor.group.add(pisoPlane);
    pisoAnchor.group.add(audio);

    pisoAnchor.onTargetFound = () => {
      pisoVideo.play();
      // audio.play();
    };

    pisoAnchor.onTargetLost = () => {
      pisoVideo.pause();
      // audio.pause();
    };

    const videos = await Promise.all(
      videosData.map(async (videoData) => {
        const videoTexture = await loadVideo(videoData.url);
        const video = videoTexture.image;

        const geometry = new THREE.PlaneGeometry(1231 / 514, 1);
        const material = createChromaMaterial(videoTexture, 0x14ff09, 0.4, 0.2);
        material.side = THREE.DoubleSide;
        material.transparent = true; // Asegura que el material sea transparente

        const plane = new THREE.Mesh(geometry, material);
        plane.renderOrder = 3; // Ajusta el orden de representación
        plane.rotation.x = 0;
        plane.position.copy(videoData.position);
        plane.scale.multiplyScalar(0.5);

        if (videoData.rotation) {
          plane.rotation.copy(videoData.rotation);
        }
        if (videoData.scale) {
          plane.scale.copy(videoData.scale);
        }

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
  startButton.style.backgroundColor = "#CB4A5A"; // Color de fondo del botón
  startButton.style.color = "#FFFFFF"; // Color del texto del botón
  startButton.id = "startButton";
  startButton.style.fontFamily = "Segoe, sans-serif"; // Aplicar la fuente

  
  startButton.addEventListener("click", start);
  document.body.appendChild(startButton);

  const infoText = document.createElement("p");
  //infoText.textContent = "Presiona para comenzar";
  infoText.id = "infoText";
    infoText.style.fontFamily = "Segoe, sans-serif"; // Aplicar la fuente

  document.body.appendChild(infoText);
});
