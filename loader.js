import * as THREE from "./three.module.js";

//const THREE = window.MINDAR.IMAGE ? window.MINDAR.IMAGE.THREE : window.MINDAR.FACE.THREE;

export const loadAudio = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.AudioLoader();
    loader.load(path, (buffer) => {
      resolve(buffer);
    });
  });
}

export const loadVideo = async (url) => {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    video.crossOrigin = "anonymous"; 
    video.addEventListener('loadedmetadata', () => {
      video.setAttribute('playsinline', '');
      resolve(new THREE.VideoTexture(video));
    });
    video.src = url;
    video.load();
  });
}

export const loadTexture = (path) => {
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(path, (texture) => {
      resolve(texture);
    }); 
  });
}

export const loadTextures = (paths) => {
  const loader = new THREE.TextureLoader();
  const promises = [];
  for (let i = 0; i < paths.length; i++) {
    promises.push(new Promise((resolve, reject) => {
      loader.load(paths[i], (texture) => {
        resolve(texture);
      }); 
    }));
  }
  return Promise.all(promises);
}
