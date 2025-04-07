import Config from "./config.js";
const fileInput = document.getElementById('fileInput');
const previewContainer = document.getElementById('previewContainer');
const previewContent = document.getElementById('previewContent');
const fileName = document.getElementById("file-name");

fileInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (!file) return;

  fileName.innerText = file.name;

  previewContainer.style.display = 'block';
  previewContent.innerHTML = '';

  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');

      img.src = e.target.result;
      img.alt = 'Preview';
      previewContent.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
  else if (file.type.startsWith('video/')) {
    const video = document.createElement('video');
    video.controls = true;
    video.style.maxWidth = '100%';
    const source = document.createElement('source');
    source.src = URL.createObjectURL(file);
    source.type = file.type;
    video.appendChild(source);
    previewContent.appendChild(video);
  }
  else if (file.type === 'application/pdf') {
    const object = document.createElement('object');
    object.data = URL.createObjectURL(file);
    object.type = 'application/pdf';
    object.width = '100%';
    object.height = '400px';


    previewContent.appendChild(object);
  }
  else {
    previewContent.innerHTML = '<div class="unsupported-file">Preview not available for this file type</div>';
  }
});

document.querySelector(".upload-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  // console.log("you submeitted it ")
  const formData = new FormData(e.target);

  try {
    const res = await fetch(`${Config.DOMAIN}/upload`, { method: "POST", body: formData });
    const data = await res.json();
    console.log(data)
    if (!res.ok) {
      return alert(data.error);
    }
    if (res.ok) {
      window.location.href = "/uploads.html";
    }
  } catch (_err) {
    alert("Something went wrong, Try again later");
  }
})
