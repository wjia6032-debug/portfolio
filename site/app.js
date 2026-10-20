history.scrollRestoration = 'manual';
if (location.hash) history.replaceState(null, '', location.pathname + location.search);
window.scrollTo({top:0,left:0,behavior:'instant'});
window.addEventListener('load',()=>window.scrollTo({top:0,left:0,behavior:'instant'}),{once:true});

const projects = [
  {title:'肌序研',type:'护肤品品牌形象设计',category:'brand',cover:16,images:[16,9,10,11,12,13,14,15]},
  {title:'四时糕作',type:'品牌形象设计',category:'brand',cover:0,images:[0,1,2,3,4,5,6,7,8]},
  {title:'归零',type:'睡眠类 App · 交互设计',category:'digital',cover:28,images:[28,29,23,24,25,26,27]},
  {title:'雾里村',type:'文旅品牌形象设计',category:'brand',cover:17,images:[17,18,19,20,21,22]},
  {title:'隰县玉露香梨',type:'地域农产品 · 包装设计',category:'pack',cover:30,images:[30,31,32,33,34,35]},
  {title:'麦饺轻食',type:'食品包装设计',category:'pack',cover:36,images:[36,37,38,39,40,41]},
  {title:'四季药膳',type:'信息可视化 · 版式设计',category:'graphic',cover:60,images:[60,61,62,63,64]},
  {title:'字体选集',type:'字体设计 · 版式探索',category:'graphic',cover:57,images:[57,58,59,46,47,48,49,50,51]},
  {title:'书籍设计',type:'书籍装帧 · 视觉实验',category:'graphic',cover:42,images:[42,43,44,45]},
  {title:'海报选集',type:'商业海报 · 视觉表达',category:'graphic',cover:56,images:[56,52,53,54,55]}
];
const grid = document.querySelector('#projects');
const dialog = document.querySelector('#project-dialog');
projects.forEach((project,index)=>{
  const button = document.createElement('button');
  button.className='project';button.dataset.category=project.category;
  button.classList.toggle('portrait', [16,0,42,56].includes(project.cover));
  let currentImage = 0;
  let clickTimer;
  button.title = '单击查看下一张 · 双击放大 · Shift + Enter 放大';
  button.innerHTML=`<div class="project-image"><img loading="lazy" decoding="async" src="assets/900/project-${project.cover}.webp" alt="${project.title} — ${project.type}"><span class="image-count" aria-live="polite">1 / ${project.images.length}</span><span class="arrow" aria-hidden="true">→</span></div><div class="project-meta"><h3>${project.title}</h3><span>${project.type} / ${String(index+1).padStart(2,'0')}</span></div><span class="interaction-hint">单击切换图片 · 双击放大查看</span>`;
  let switching = false;
  const nextImage = async () => {
    if (switching) return;
    switching = true;
    const nextIndex = (currentImage + 1) % project.images.length;
    const preview = new Image();
    preview.src = `assets/900/project-${project.images[nextIndex]}.webp`;
    button.querySelector('.image-count').textContent = '加载中…';
    try {
      await preview.decode();
      currentImage = nextIndex;
      button.querySelector('img').src = preview.src;
      button.querySelector('img').alt = `${project.title} — 项目展示 ${currentImage + 1}`;
    } catch {
      button.querySelector('.image-count').textContent = '加载失败，点击重试';
      return;
    } finally {
      switching = false;
    }
    button.querySelector('.image-count').textContent = `${currentImage + 1} / ${project.images.length}`;
  };
  const openProject = () => {
    clearTimeout(clickTimer);
    document.querySelector('#dialog-title').textContent=project.title;
    document.querySelector('#dialog-type').textContent=project.type;
    document.querySelector('#dialog-images').innerHTML=project.images.map((id,imageIndex)=>`<img src="assets/project-${id}.webp" decoding="async" alt="${project.title} 项目展示 ${imageIndex+1}" loading="lazy">`).join('');
    dialog.showModal();document.body.classList.add('modal-open');
    dialog.querySelectorAll('#dialog-images img')[currentImage].scrollIntoView({block:'start'});
  };
  button.addEventListener('click',event=>{
    clearTimeout(clickTimer);
    if (event.detail === 0) {
      nextImage();
    } else if (event.detail === 1) {
      clickTimer = setTimeout(nextImage, 350);
    }
  });
  button.addEventListener('dblclick',openProject);
  button.addEventListener('keydown',event=>{
    if (event.key === 'Enter' && event.shiftKey) {
      event.preventDefault();
      openProject();
    }
  });
  grid.append(button);
});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('[data-filter]').forEach(item=>{item.classList.toggle('active',item===button);item.setAttribute('aria-pressed',String(item===button));});
  document.querySelectorAll('.project').forEach(item=>item.hidden=button.dataset.filter!=='all'&&item.dataset.category!==button.dataset.filter);
}));
document.querySelectorAll('[data-filter]').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
dialog.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog.addEventListener('click',event=>{if(event.target===dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom)dialog.close();}});
document.querySelector('#contact-action').addEventListener('click',event=>{
  event.preventDefault();
  const note = document.querySelector('#contact-note');
  note.hidden = !note.hidden;
  event.currentTarget.setAttribute('aria-expanded', String(!note.hidden));
  if (!note.hidden) note.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
});
