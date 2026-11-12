'use strict';
const DATA='data/';
let revealObserver;
function initMenu(){
  const button=document.querySelector('.menu-button'),menu=document.querySelector('.site-menu'),close=document.querySelector('.menu-close');
  if(!button||!menu)return;
  let closeTimer;
  const links=()=>[...menu.querySelectorAll('a[href],button:not([disabled])')];
  const setOpen=open=>{
    clearTimeout(closeTimer);
    button.setAttribute('aria-expanded',String(open));
    if(open){menu.hidden=false;document.body.classList.add('menu-open');requestAnimationFrame(()=>menu.classList.add('is-open'));links()[0]?.focus();}
    else{menu.classList.remove('is-open');document.body.classList.remove('menu-open');button.focus();closeTimer=setTimeout(()=>{if(button.getAttribute('aria-expanded')==='false')menu.hidden=true},620);}
  };
  button.addEventListener('click',()=>setOpen(button.getAttribute('aria-expanded')!=='true'));
  close?.addEventListener('click',()=>setOpen(false));
  menu.addEventListener('click',e=>{if(e.target.closest('a')&&button.getAttribute('aria-expanded')==='true'){button.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open');menu.classList.remove('is-open');closeTimer=setTimeout(()=>menu.hidden=true,620)}});
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'&&button.getAttribute('aria-expanded')==='true'){e.preventDefault();setOpen(false);return}
    if(e.key==='Tab'&&button.getAttribute('aria-expanded')==='true'){const items=links(),first=items[0],last=items[items.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus()}}
  });
}
async function readJSON(path){const r=await fetch(path);if(!r.ok)throw new Error(path);return r.json()}
function make(tag,cls,text){const el=document.createElement(tag);if(cls)el.className=cls;if(text!==undefined)el.textContent=text;return el}
function updateCount(visible,total){const count=document.getElementById('project-count');if(count)count.textContent=visible===total?String(total).padStart(2,'0')+' projects':String(visible).padStart(2,'0')+' / '+String(total).padStart(2,'0')+' projects'}
function renderProjects(projects){
  const grid=document.getElementById('project-grid'),filters=document.getElementById('project-filters');if(!grid||!filters)return;
  filters.replaceChildren();
  const categories=['All categories',...new Set(projects.map(p=>p.category).filter(Boolean))];let active='All categories';
  const draw=()=>{
    const visible=projects.filter(p=>active==='All categories'||p.category===active);grid.replaceChildren();updateCount(visible.length,projects.length);
    if(!visible.length){grid.append(make('p','empty-note','No projects in this category yet.'));return}
    visible.forEach((p,i)=>{
      const card=make('a','project-card');card.href='project.html?p='+encodeURIComponent(p.slug);card.dataset.reveal='';
      const frame=make('div','project-card-image'),img=make('img');img.src=p.cover;img.alt=p.coverAlt||p.title;img.loading='lazy';
      frame.append(img,make('span','card-index',String(i+1).padStart(2,'0')),make('span','card-open','View project ↗'));
      const meta=make('div','project-card-meta');meta.append(make('span','',p.category||'Project'),make('span','',p.year||''));
      card.append(frame,meta,make('h2','',p.title));if(p.projectType)card.append(make('p','project-type',p.projectType));if(p.summary)card.append(make('p','project-card-summary',p.summary));
      const foot=make('div','project-card-footer');foot.append(make('span','','Project details'),make('span','','Read more →'));card.append(foot);grid.append(card);
    });
    attachReveal(grid);
    if(grid.animate)grid.animate([{opacity:.45,transform:'translateY(8px)'},{opacity:1,transform:'translateY(0)'}],{duration:360,easing:'cubic-bezier(.2,.7,.2,1)'});
  };
  categories.forEach(category=>{const b=make('button','filter-button',category);b.type='button';b.setAttribute('aria-pressed',String(category===active));b.addEventListener('click',()=>{active=category;filters.querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));draw()});filters.append(b)});draw();
}
async function initProjects(){try{const d=await readJSON(DATA+'projects.json');renderProjects(d.projects||[])}catch{document.getElementById('project-grid')?.replaceChildren(make('p','empty-note','Project data did not load. Open through the local server in README.md.'))}}
async function initAbout(){const root=document.getElementById('about-content');if(!root)return;try{const a=await readJSON(DATA+'about.json'),grid=make('section','profile-grid'),copy=make('div','profile-copy'),side=make('div','profile-side');copy.append(make('p','eyebrow','A little about me'));(a.intro||[]).forEach(line=>copy.append(make('p','',line)));if(a.looking_for)copy.append(make('p','',a.looking_for));side.append(make('h2','','Skills & tools'));const tags=make('div','skill-tags');(a.skills||[]).forEach(skill=>tags.append(make('span','',skill)));side.append(tags,make('h2','','Education'));const list=make('ul','education-list');(a.education||[]).forEach(item=>list.append(make('li','',item)));side.append(list);grid.append(copy,side);root.replaceChildren(grid);const contact=make('section','contact-section');contact.id='contact';contact.append(make('p','eyebrow','Get in touch'),make('h2','','Contact'));if(a.contact?.email&&a.contact.email!=='TODO'){const link=make('a','text-link',a.contact.email);link.href='mailto:'+a.contact.email;contact.append(link)}else contact.append(make('p','contact-placeholder','Contact details to be added'));root.append(contact);attachReveal(root)}catch{root.replaceChildren(make('p','empty-note','Profile data did not load. Open through the local server in README.md.'))}}
function attachReveal(root=document){const nodes=[];if(root.matches?.('[data-reveal]'))nodes.push(root);nodes.push(...root.querySelectorAll?.('[data-reveal]')||[]);if(!revealObserver){nodes.forEach(n=>n.classList.add('is-visible'));return}nodes.forEach(n=>revealObserver.observe(n))}
function initMotion(){document.body.classList.add('motion-ready');document.querySelectorAll('main section:not(.hero),.intro-grid,.site-footer,.technical-images figure').forEach(el=>el.dataset.reveal='');if(!('IntersectionObserver'in window)||matchMedia('(prefers-reduced-motion: reduce)').matches){document.querySelectorAll('[data-reveal]').forEach(el=>el.classList.add('is-visible'));return}revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');revealObserver.unobserve(entry.target)}}),{threshold:.12,rootMargin:'0px 0px -36px 0px'});attachReveal()}
initMotion();initMenu();if(document.body.dataset.page==='projects')initProjects();if(document.body.dataset.page==='about')initAbout();
