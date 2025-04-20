
// Fetch and parse the loader.json file
async function fetchLoaderData() {
  const response = await fetch('loader.json');
  return await response.json();
}

// Load sections on the homepage
async function loadSections() {
  const data = await fetchLoaderData();
  const container = document.getElementById('sections');
  data.forEach(section => {
    const link = document.createElement('a');
    link.href = `section.html?section=${encodeURIComponent(section.id)}`;
    link.textContent = section.title;
    container.appendChild(link);
  });
}

// Load subsections based on section ID
async function loadSubsections(sectionId) {
  const data = await fetchLoaderData();
  const section = data.find(sec => sec.id === sectionId);
  if (!section) {
    document.getElementById('section-title').textContent = 'Section not found';
    return;
  }
  document.getElementById('section-title').textContent = section.title;
  const container = document.getElementById('subsections');
  section.children.forEach(sub => {
    const link = document.createElement('a');
    link.href = `pdf.html?pdf=${encodeURIComponent(sub.pdfs[0])}&title=${encodeURIComponent(sub.title)}`;
    link.textContent = sub.title;
    container.appendChild(link);
  });
}

// Load and display the PDF content
function loadAndDisplayPDF(url, container) {
  const loadingTask = pdfjsLib.getDocument(url);
  loadingTask.promise.then(pdf => {
    let allText = '';
    const numPages = pdf.numPages;

    const loadPageText = pageNum =>
      pdf.getPage(pageNum).then(page =>
        page.getTextContent().then(textContent => {
          const pageText = textContent.items.map(item => item.str).join(' ');
          allText += pageText + '\n\n';
          if (pageNum < numPages) {
            return loadPageText(pageNum + 1);
          } else {
            const p = document.createElement('p');
            p.textContent = allText;
            container.appendChild(p);
          }
        })
      );

    return loadPageText(1);
  }).catch(err => {
    const error = document.createElement('p');
    error.textContent = 'Failed to load PDF: ' + err.message;
    container.appendChild(error);
  });
}
