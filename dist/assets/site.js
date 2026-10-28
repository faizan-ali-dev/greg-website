const menuButton = document.querySelector('.menu-toggle');
const menu = document.querySelector('#main-nav');
const servicesMenu = document.querySelector('.nav-services');
function closeMenu() {
  menuButton?.setAttribute('aria-expanded','false');
  menu?.classList.remove('is-open');
  servicesMenu?.removeAttribute('open');
}
menuButton?.addEventListener('click',()=>{
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded',String(open));
  menu.classList.toggle('is-open',open);
});
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  const mobileWasOpen=menuButton?.getAttribute('aria-expanded')==='true';
  const servicesWasOpen=servicesMenu?.open;
  closeMenu();
  if(mobileWasOpen)menuButton.focus();
  else if(servicesWasOpen)servicesMenu.querySelector('summary').focus();
});
document.addEventListener('click',event=>{
  if(menu?.classList.contains('is-open') && !event.target.closest('.site-header')) closeMenu();
  if(servicesMenu?.open && !event.target.closest('.nav-services'))servicesMenu.removeAttribute('open');
});
menu?.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeMenu));
matchMedia('(min-width: 1000px)').addEventListener('change',event=>{if(event.matches)closeMenu();});

const serviceRoutes = {
  financial: {title:'Your financial future',text:'Explore insurance protection, retirement strategies and business-owner needs through Greg’s official financial-services profile.',href:'/financial-services.html',button:'Explore financial services'},
  crm: {title:'A CRM that works for your team',text:'Start with the problem: adoption, data, reporting or a rollout. Discover how Denizard Consulting can help.',href:'/crm-consulting.html',button:'Explore CRM consulting'},
  community: {title:'Make room for meaningful growth',text:'Find connection, purposeful habits and a community centered on learning and personal development.',href:'/community.html',button:'Explore the community'}
};
document.querySelectorAll('[data-service-tab]').forEach(tab=>tab.addEventListener('click',()=>{
  document.querySelectorAll('[data-service-tab]').forEach(t=>{t.setAttribute('aria-pressed',String(t===tab));t.classList.toggle('selected',t===tab);});
  const route=serviceRoutes[tab.dataset.serviceTab];
  const panel=document.querySelector('#path-result');
  panel.querySelector('h3').textContent=route.title;
  panel.querySelector('p').textContent=route.text;
  const link=panel.querySelector('a');link.href=route.href;link.querySelector('span').textContent=route.button;
}));

const form=document.querySelector('#inquiry-form');
if(form){
  const service=form.elements.service;
  const selectService=()=>{
    const company=document.querySelector('#company-field');
    company.hidden=service.value!=='crm';
    if(company.hidden)form.elements.company.value='';
    const notice=document.querySelector('#financial-note');
    notice.hidden=service.value!=='financial';
  };
  const query=new URLSearchParams(location.search).get('service');
  if(Object.hasOwn(serviceRoutes,query??''))service.value=query;
  selectService();service.addEventListener('change',selectService);
  const dialog=document.querySelector('#message-dialog');
  let message='';
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if(!form.reportValidity())return;
    const data=new FormData(form);
    const label=service.options[service.selectedIndex].text;
    message=`Hi Greg,\n\n${String(data.get('message')).trim()}\n\nName: ${String(data.get('name')).trim()}\nEmail: ${String(data.get('email')).trim()}\nInterested in: ${label}${data.get('company')?'\nOrganization: '+String(data.get('company')).trim():''}${data.get('phone')?'\nPhone: '+String(data.get('phone')).trim():''}`;
    dialog.querySelector('pre').textContent=message;
    document.querySelector('#open-email').href=`mailto:gregorydenizard@gmail.com?subject=${encodeURIComponent('Website inquiry — '+label)}&body=${encodeURIComponent(message)}`;
    document.querySelector('#copy-status').textContent='';
    dialog.showModal();
  });
  document.querySelector('#close-dialog').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  document.querySelector('#copy-message').addEventListener('click',async()=>{
    const status=document.querySelector('#copy-status');
    try{await navigator.clipboard.writeText(message);status.textContent='Message copied. Paste it into your email to Greg.';}
    catch{status.textContent='Copy is unavailable in this browser. Select and copy the message above.';}
  });
}

document.querySelectorAll('.faq details').forEach(detail=>detail.addEventListener('toggle',()=>{
  if(detail.open)detail.closest('.faq').querySelectorAll('details').forEach(other=>{if(other!==detail)other.open=false;});
}));
const topLink=document.querySelector('.back-top');
const scrollListener=()=>{topLink?.classList.toggle('visible',window.scrollY>800);};
window.addEventListener('scroll',scrollListener,{passive:true});scrollListener();

const ticker=document.querySelector('.service-ticker');
const tickerToggle=ticker?.querySelector('.ticker-toggle');
if(ticker){
  const tickerWindow=ticker.querySelector('.ticker-window');
  const updateTickerWidth=()=>ticker.style.setProperty('--ticker-window-width',`${tickerWindow.clientWidth}px`);
  updateTickerWidth();
  if('ResizeObserver' in window)new ResizeObserver(updateTickerWidth).observe(tickerWindow);
  else window.addEventListener('resize',updateTickerWidth,{passive:true});
}
tickerToggle?.addEventListener('click',()=>{
  const paused=ticker.classList.toggle('is-paused');
  tickerToggle.setAttribute('aria-pressed',String(paused));
  tickerToggle.setAttribute('aria-label',paused?'Play service ticker':'Pause service ticker');
  tickerToggle.querySelector('span').textContent=paused?'▶':'Ⅱ';
});

const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
if(!motionPreference.matches && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  },{threshold:0,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.section-heading,.service-card,.about-image,.about-copy,.steps-grid article,.finder-panel,.timeline article,.education-grid article,.detail-grid article,.crm-service-grid article,.reference-grid article,.academy-feature').forEach(element=>{
    element.classList.add('reveal');observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
}
