import Config from "./config.js"
document.addEventListener("DOMContentLoaded", initPage);

async function initPage() {
  try {
    const res = await fetch(`${Config.DOMAIN}/getFiles`);
    if (!res.ok) throw new Error("Failed to fetch");
    const data = await res.json();
    console.log("Files info:", data);
    renderFileContainer(".file-container", data)
  } catch (err) {
    console.error("Error fetching files:", err);
  }
}

function renderFileContainer(selector, files) {
  const container = document.querySelector(selector);
  container.innerHTML = "";

  files.forEach(file => {
    const { originalname, filename, size, mimetype } = file;

    const fileContainerHtml = `
    <div class="file-box">
      <div class="file-info">
      <p><strong>Name:</strong>${originalname}</p>
      <p><strong>Type:</strong>${mimetype}</p>
      <p><strong>Size:</strong>${size}</p>
      </div>
      <a href="/uploads/${filename}" download="${originalname}" class="download-btn"
        title="Download">
        ⬇
      </a>
    </div>
`;
    container.insertAdjacentHTML("beforeend", fileContainerHtml);
  })
}
