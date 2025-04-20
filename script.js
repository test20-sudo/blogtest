// window.addEventListener('DOMContentLoaded', () => {
//     fetch('loader.json')
//       .then(res => res.json())
//       .then(sections => renderSections(sections));
//   });
  
//   function renderSections(sections) {
//     const sidebar = document.getElementById('sidebar');
//     const content = document.getElementById('content');
//     sidebar.innerHTML = '';
//     content.innerHTML = '';
  
//     sections.forEach(sec => {
//       const secEl = document.createElement('div');
//       secEl.className = 'section';
//       const title = document.createElement('h2');
//       title.textContent = sec.title;
//       secEl.appendChild(title);
//       sidebar.appendChild(secEl);
  
//       const secContent = document.createElement('section');
//       secContent.id = sec.id;
//       secContent.classList.add('hidden');
//       content.appendChild(secContent);
  
//       title.addEventListener('click', () => {
//         secContent.classList.toggle('hidden');
//       });
  
//       sec.children.forEach(sub => {
//         const subEl = document.createElement('div');
//         subEl.className = 'subsection';
//         const subtitle = document.createElement('h3');
//         subtitle.textContent = sub.title;
//         subEl.appendChild(subtitle);
//         secEl.appendChild(subEl);
  
//         const subContent = document.createElement('section');
//         subContent.id = sub.id;
//         subContent.classList.add('hidden');
//         secContent.appendChild(subContent);
  
//         subtitle.addEventListener('click', () => {
//           subContent.classList.toggle('hidden');
//         });
  
//         (sub.pdfs || []).forEach(url => loadAndDisplayPDF(url, subContent));
//       });
  
//       (sec.pdfs || []).forEach(url => loadAndDisplayPDF(url, secContent));
//     });
//   }
  
//   function loadAndDisplayPDF(url, container) {
//     const loadingTask = pdfjsLib.getDocument(url);
    
//     loadingTask.promise.then(pdf => {
//       let allText = "";
  
//       const numPages = pdf.numPages;
//       const loadPageText = (pageNum) =>
//         pdf.getPage(pageNum).then(page =>
//           page.getTextContent().then(textContent => {
//             const pageText = textContent.items.map(item => item.str).join(" ");
//             allText += pageText + "\n\n";
//             if (pageNum < numPages) {
//               return loadPageText(pageNum + 1);
//             } else {
//               const p = document.createElement("p");
//               p.textContent = allText;
//               container.appendChild(p);
//             }
//           })
//         );
  
//       return loadPageText(1);
//     }).catch(err => {
//       const error = document.createElement("p");
//       error.textContent = "Failed to load PDF: " + err.message;
//       container.appendChild(error);
//     });
//   }
  
  
//   function addSection(id, title) {
//     fetch('loader.json')
//       .then(r => r.json())
//       .then(sections => {
//         sections.push({ id, title, children: [], pdfs: [] });
//         renderSections(sections);
//         // TODO: persist
//       });
//   }
  
//   function addSubsection(sectionId, subId, subTitle) {
//     fetch('loader.json')
//       .then(r => r.json())
//       .then(sections => {
//         const sec = sections.find(s => s.id === sectionId);
//         if (sec) {
//           sec.children.push({ id: subId, title: subTitle, pdfs: [] });
//           renderSections(sections);
//           // TODO: persist
//         }
//       });
//   }
  

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
