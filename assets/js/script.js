let quill;
let currentTab = 'home';

function initQuill() {
  try {
    const Font = Quill.import('formats/font');
    Font.whitelist = ['arial', 'calibri', 'courier', 'georgia', 'times', 'verdana'];
    Quill.register(Font, true);

    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['8px', '9px', '10px', '11px', '12px', '14px', '16px', '18px', '20px', '22px', '24px', '26px', '28px', '36px', '48px', '72px'];
    Quill.register(Size, true);

    if (typeof QuillTable !== 'undefined') {
      Quill.register('modules/table', QuillTable);
    } else {
      console.warn('QuillTable module not found. Table functionality will be disabled.');
    }

    if (typeof ImageResize !== 'undefined') {
      Quill.register('modules/imageResize', ImageResize);
    } else {
      console.warn('ImageResize module not found. Image resizing will be disabled.');
    }

    quill = new Quill('#editor-container', {
      modules: {
        toolbar: false,
        table: typeof QuillTable !== 'undefined',
        imageResize: typeof ImageResize !== 'undefined' ? {
          displayStyles: {
            backgroundColor: 'black',
            border: 'none',
            color: 'white'
          },
          modules: ['Resize', 'DisplaySize']
        } : false
      },
      placeholder: 'Start typing here...',
      theme: 'snow',
      formats: [
        'bold', 'italic', 'underline', 'strike',
        'align', 'list', 'font', 'size', 'color', 'background',
        'link', 'image', 'video', 'table'
      ]
    });

    quill.clipboard.dangerouslyPasteHTML(`
      <p style="text-align: center; font-size: 28px; margin-bottom: 20px;"><b>Bienvenido a BetaWord! 🌌</b></p>
      <p style="text-indent: 0.5in;">Start typing here... This is a fully functional text editor built with Quill.js.</p>
    `);

    quill.on('text-change', () => {
      updateWordCount();
      updatePageCount();
      updatePageBreaks();
    });

    quill.on('selection-change', updateToolbar);
  } catch (error) {
    console.error('Error initializing Quill:', error);
    document.getElementById('analysis-result').innerText = 'Error al inicializar el editor.';
  }
}

function updateToolbar() {
  if (!quill || currentTab !== 'home') return;
  const format = quill.getFormat();
  const buttons = {
    bold: format.bold,
    italic: format.italic,
    underline: format.underline,
    strike: format.strike,
    'list-bullet': format.list === 'bullet',
    'list-ordered': format.list === 'ordered',
    'align-left': !format.align,
    'align-center': format.align === 'center',
    'align-right': format.align === 'right',
    'align-justify': format.align === 'justify'
  };
  for (const [id, active] of Object.entries(buttons)) {
    const button = document.querySelector(`button[id="${id}"]`);
    if (button) button.classList.toggle('bg-gray-300', active);
  }

  document.getElementById('font-family-display').textContent = format.font || 'Calibri';
  document.getElementById('font-size-display').textContent = (format.size || '11px').replace('px', '');
}

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('home-tab').classList.toggle('bg-blue-700', tab === 'home');
  document.getElementById('insert-tab').classList.toggle('bg-blue-700', tab === 'insert');
  document.getElementById('home-toolbar').style.display = tab === 'home' ? 'block' : 'none';
  document.getElementById('insert-toolbar').style.display = tab === 'insert' ? 'block' : 'none';
}

async function insertImage() {
  if (!quill) return;
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) {
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', url);
      }
    }
  };
  input.click();
}

async function uploadImage(file) {
  const formData = new FormData();
  formData.append('image', file);
  try {
    const response = await fetch('./upload_image.php', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Error al subir la imagen');
    const result = await response.json();
    return result.url || null;
  } catch (error) {
    console.error('Error uploading image:', error);
    document.getElementById('analysis-result').innerText = 'Error al subir la imagen.';
    return null;
  }
}

function insertTable() {
  if (!quill || typeof QuillTable === 'undefined') {
    alert('Table functionality is not available.');
    return;
  }
  const range = quill.getSelection(true);
  quill.getModule('table').insertTable(2, 2);
}

function insertLink() {
  if (!quill) return;
  const url = prompt('Ingresa la URL del enlace:');
  if (url) {
    const range = quill.getSelection(true);
    if (range.length === 0) {
      quill.insertText(range.index, url, 'link', url);
    } else {
      quill.formatText(range.index, range.length, 'link', url);
    }
  }
}

function insertVideo() {
  if (!quill) return;
  const url = prompt('Ingresa la URL del video (por ejemplo, YouTube):');
  if (url) {
    const range = quill.getSelection(true);
    const videoId = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/)?.[1] ||
                    url.match(/(?:https?:\/\/)?youtu\.be\/([^?]+)/)?.[1];
    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`;
      quill.insertEmbed(range.index, 'video', embedUrl);
    } else {
      alert('Por favor, ingresa una URL válida de YouTube.');
    }
  }
}

function insertPageBreak() {
  if (!quill) return;
  const range = quill.getSelection(true);
  quill.clipboard.dangerouslyPasteHTML(range.index, '<div class="page-break" data-manual="true"></div>');
  updatePageCount();
}

function updatePageBreaks() {
  if (!quill) return;
  const editor = document.querySelector('.ql-editor');
  const children = Array.from(editor.children);
  let currentHeight = 0;
  const pageHeight = 11 * 96;
  let breaksToAdd = [];

  children.forEach(child => {
    if (child.classList.contains('page-break') && !child.dataset.manual) {
      child.remove();
    }
  });

  let updatedChildren = Array.from(editor.children);
  updatedChildren.forEach((child, index) => {
    if (child.classList.contains('page-break')) {
      currentHeight = 0;
      return;
    }

    const childHeight = child.offsetHeight;
    currentHeight += childHeight;

    if (currentHeight > pageHeight && index < updatedChildren.length - 1) {
      breaksToAdd.push(index + 1);
      currentHeight = childHeight;
    }
  });

  breaksToAdd.forEach((insertIndex, i) => {
    const breakElement = document.createElement('div');
    breakElement.className = 'page-break';
    breakElement.style.borderTop = '1px dashed #ccc';
    breakElement.style.margin = '10px 0';
    const referenceChild = editor.children[insertIndex + i];
    if (referenceChild) {
      editor.insertBefore(breakElement, referenceChild);
    } else {
      editor.appendChild(breakElement);
    }
  });
}

function updateWordCount() {
  if (!quill) return;
  const text = quill.getText().trim();
  const wordCount = text === '' ? 0 : text.split(/\s+/).length;
  document.getElementById('word-count').textContent = `Words: ${wordCount}`;
}

function updatePageCount() {
  if (!quill) return;
  const editor = document.querySelector('.ql-editor');
  const pageBreaks = Array.from(editor.querySelectorAll('.page-break')).length;
  const pageCount = pageBreaks + 1;
  document.getElementById('page-count').textContent = `Page 1 of ${pageCount}`;
}

function initZoom() {
  let zoomLevel = 100;
  const editor = document.querySelector('.ql-editor');

  document.getElementById('zoom-in').addEventListener('click', () => {
    if (zoomLevel < 200) {
      zoomLevel += 10;
      updateZoom();
    }
  });

  document.getElementById('zoom-out').addEventListener('click', () => {
    if (zoomLevel > 50) {
      zoomLevel -= 10;
      updateZoom();
    }
  });

  function updateZoom() {
    editor.style.transform = `scale(${zoomLevel / 100})`;
    editor.style.transformOrigin = 'top center';
    document.getElementById('zoom-level').textContent = `${zoomLevel}%`;
  }
}

function initFullscreen() {
  document.getElementById('fullscreen').addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error enabling fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) document.exitFullscreen();
    }
  });
}

function adjustDropdownPosition() {
  document.querySelectorAll('.dropdown').forEach(dropdown => {
    const button = dropdown.querySelector('button');
    const content = dropdown.querySelector('.dropdown-content');
    button.addEventListener('mouseover', () => {
      const buttonHeight = button.offsetHeight;
      content.style.top = `${buttonHeight}px`;
    });
  });
}

function exportPDF() {
  if (!quill) return;
  const element = document.querySelector('.ql-editor');
  html2pdf()
    .from(element)
    .set({
      margin: 0.5,
      filename: 'BetaWord_document.pdf',
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    })
    .save();
}

function exportHTML() {
  if (!quill) return;
  const content = document.querySelector('.ql-editor').innerHTML;
  const blob = new Blob([content], { type: 'text/html' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'BetaWord_document.html';
  link.click();
}

function exportPNG() {
  if (!quill) return;
  html2canvas(document.querySelector('.ql-editor')).then(canvas => {
    const link = document.createElement('a');
    link.download = 'BetaWord_document.png';
    link.href = canvas.toDataURL();
    link.click();
  });
}

async function saveDocument() {
  if (!quill) return;
  try {
    const content = document.querySelector('.ql-editor').innerHTML;
    const title = prompt('Ingresa un título para el documento:', 'Documento ' + new Date().toISOString().slice(0, 19));
    if (!title) return;
    const response = await fetch('./save_document.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `content=${encodeURIComponent(content)}&title=${encodeURIComponent(title)}`
    });
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    document.getElementById('analysis-result').innerText = result.message || result.error;
  } catch (error) {
    console.error('Error al guardar documento:', error);
    document.getElementById('analysis-result').innerText = 'Error al guardar el documento.';
  }
}

async function loadDocuments() {
  try {
    const response = await fetch('./list_documents.php');
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const documents = await response.json();
    if (documents.error) throw new Error(documents.error);
    const listDiv = document.getElementById('document-list');
    if (documents.length === 0) {
      listDiv.innerHTML = '<p>No hay documentos guardados.</p>';
    } else {
      listDiv.innerHTML = documents.map(doc => `<p style="cursor: pointer;" onclick="loadDocument(${doc.id}); document.getElementById('document-modal').style.display = 'none'">${doc.title}: ${doc.content.slice(0, 50)}...</p>`).join('');
    }
    document.getElementById('document-modal').style.display = 'block';
  } catch (error) {
    console.error('Error al cargar documentos:', error);
    document.getElementById('analysis-result').innerText = 'Error al cargar documentos: ' + error.message;
  }
}

async function loadDocument(id) {
  if (!quill) return;
  try {
    const response = await fetch(`./load_document.php?id=${id}`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const doc = await response.json();
    if (doc.error) throw new Error(doc.error);
    quill.root.innerHTML = doc.content;
  } catch (error) {
    console.error('Error al cargar documento:', error);
    document.getElementById('analysis-result').innerText = 'Error al cargar el documento: ' + error.message;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initQuill();
  initZoom();
  initFullscreen();
  adjustDropdownPosition();
  updateWordCount();
  updatePageCount();
  updatePageBreaks();

  document.getElementById('home-tab').addEventListener('click', () => switchTab('home'));
  document.getElementById('insert-tab').addEventListener('click', () => switchTab('insert'));
});