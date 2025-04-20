window.addEventListener('DOMContentLoaded', () => {
    fetch('loader.json')
      .then(res => res.json())
      .then(sections => renderSections(sections));
  });
  
  function renderSections(sections) {
    const sidebar = document.getElementById('sidebar');
    const content = document.getElementById('content');
    sidebar.innerHTML = '';
    content.innerHTML = '';
  
    sections.forEach(sec => {
      const secEl = document.createElement('div');
      secEl.className = 'section';
      const title = document.createElement('h2');
      title.textContent = sec.title;
      secEl.appendChild(title);
      sidebar.appendChild(secEl);
  
      const secContent = document.createElement('section');
      secContent.id = sec.id;
      secContent.classList.add('hidden');
      content.appendChild(secContent);
  
      title.addEventListener('click', () => {
        secContent.classList.toggle('hidden');
      });
  
      sec.children.forEach(sub => {
        const subEl = document.createElement('div');
        subEl.className = 'subsection';
        const subtitle = document.createElement('h3');
        subtitle.textContent = sub.title;
        subEl.appendChild(subtitle);
        secEl.appendChild(subEl);
  
        const subContent = document.createElement('section');
        subContent.id = sub.id;
        subContent.classList.add('hidden');
        secContent.appendChild(subContent);
  
        subtitle.addEventListener('click', () => {
          subContent.classList.toggle('hidden');
        });
  
        (sub.pdfs || []).forEach(url => loadAndDisplayPDF(url, subContent));
      });
  
      (sec.pdfs || []).forEach(url => loadAndDisplayPDF(url, secContent));
    });
  }
  
  function loadAndDisplayPDF(url, container) {
    const placeholder = document.createElement('p');
    placeholder.textContent = `Loaded PDF from ${url}`;
    container.appendChild(placeholder);
  }
  
  function addSection(id, title) {
    fetch('loader.json')
      .then(r => r.json())
      .then(sections => {
        sections.push({ id, title, children: [], pdfs: [] });
        renderSections(sections);
        // TODO: persist
      });
  }
  
  function addSubsection(sectionId, subId, subTitle) {
    fetch('loader.json')
      .then(r => r.json())
      .then(sections => {
        const sec = sections.find(s => s.id === sectionId);
        if (sec) {
          sec.children.push({ id: subId, title: subTitle, pdfs: [] });
          renderSections(sections);
          // TODO: persist
        }
      });
  }
  