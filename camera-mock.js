// 
export const mockWithVideo = async (path) => {
  const response = await fetch(path);
  const blob = await response.blob();
  const videoUrl = URL.createObjectURL(blob);

  return new Promise((resolve, reject) => {
    const video = document.createElement("video");

    // Configurar el atributo crossorigin
    video.setAttribute("crossorigin", "anonymous");

    video.oncanplay = () => {
      const startButton = document.createElement("button");
      startButton.innerHTML = "start";
      startButton.style.position = 'fixed';
      startButton.style.zIndex = 10000;
      document.body.appendChild(startButton);

      startButton.addEventListener('click', () => {
        const stream = video.captureStream();
        video.play();
        document.body.removeChild(startButton);
        resolve(stream);
      });
    };

    // Asegúrate de que el atributo loop esté desactivado antes de asignar la fuente
    video.src = videoUrl;

    // Asegúrate de añadir el elemento de video al DOM
    document.body.appendChild(video);
  });
};
