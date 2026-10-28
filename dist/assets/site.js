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
  financial: {title:'Your financial future',text:'Explore insurance protection, retirement strategies and business-owner needs through Greg’s official financial-services profile.',href:'./financial-services.html',button:'Explore financial services'},
  crm: {title:'A CRM that works for your team',text:'Start with the problem: adoption, data, reporting or a rollout. Discover how Denizard Consulting can help.',href:'./crm-consulting.html',button:'Explore CRM consulting'},
  community: {title:'Make room for meaningful growth',text:'Find connection, purposeful habits and a community centered on learning and personal development.',href:'./community.html',button:'Explore the community'}
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

const motionPreference=matchMedia('(prefers-reduced-motion: reduce)');
document.querySelectorAll('.faq').forEach(group=>{
  const controllers=[];
  group.querySelectorAll('details').forEach(detail=>{
    const summary=detail.querySelector('summary');
    const answer=detail.querySelector('.faq-answer');
    let expanded=detail.open;
    let animation;
    let answerAnimation;
    const setOpen=open=>{
      const start=detail.getBoundingClientRect().height;
      expanded=open;
      animation?.cancel();
      answerAnimation?.cancel();
      summary.setAttribute('aria-expanded',String(open));
      detail.classList.toggle('is-collapsing',!open);
      answer.inert=!open;
      if(motionPreference.matches || !detail.animate){
        detail.open=open;
        detail.style.overflow='';
        return;
      }
      detail.open=true;
      const end=open?detail.getBoundingClientRect().height:summary.getBoundingClientRect().height+1;
      detail.style.overflow='hidden';
      animation=detail.animate([{height:`${start}px`},{height:`${end}px`}],{duration:360,easing:'cubic-bezier(.22,.68,.2,1)',fill:'both'});
      answerAnimation=answer.animate([{opacity:open?0:1,transform:`translateY(${open?6:0}px)`},{opacity:open?1:0,transform:`translateY(${open?0:-4}px)`}],{duration:open?320:200,easing:'ease-out'});
      animation.onfinish=()=>{
        detail.open=expanded;
        detail.style.overflow='';
        animation.cancel();
        animation=null;
      };
    };
    const controller={close:()=>{if(expanded)setOpen(false);}};
    controllers.push(controller);
    summary.setAttribute('aria-expanded',String(expanded));
    answer.inert=!expanded;
    summary.addEventListener('click',event=>{
      event.preventDefault();
      if(!expanded)controllers.forEach(other=>{if(other!==controller)other.close();});
      setOpen(!expanded);
    });
  });
});

const stories=document.querySelector('.testimonials-carousel');
if(stories){
  const viewport=stories.querySelector('.testimonials-viewport');
  const slides=[...stories.querySelectorAll('.testimonial-slide')];
  const dots=[...stories.querySelectorAll('[data-testimonial-slide]')];
  const pause=stories.querySelector('[data-testimonial-pause]');
  const status=stories.querySelector('[data-testimonial-status]');
  let index=0;
  let paused=motionPreference.matches;
  let hovered=false;
  let focused=false;
  let inView=false;
  let timer;
  const stop=()=>{clearInterval(timer);timer=null;};
  const updateDots=()=>dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===index)));
  const go=(next,announce=false)=>{
    index=(next+slides.length)%slides.length;
    viewport.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior:motionPreference.matches?'instant':'smooth'});
    updateDots();
    if(announce)status.textContent=`Story ${index+1} of ${slides.length}: ${slides[index].querySelector('h3').textContent}`;
  };
  const schedule=()=>{
    stop();
    if(!paused&&!hovered&&!focused&&inView&&!document.hidden)timer=setInterval(()=>go(index+1),6000);
  };
  const updatePause=()=>{
    pause.setAttribute('aria-pressed',String(paused));
    pause.setAttribute('aria-label',paused?'Play client stories':'Pause client stories');
    pause.querySelector('span').textContent=paused?'▶':'Ⅱ';
  };
  stories.querySelector('.testimonials-controls').hidden=false;
  stories.classList.add('is-enhanced');
  stories.querySelector('[data-testimonial-prev]').addEventListener('click',()=>{go(index-1,true);schedule();});
  stories.querySelector('[data-testimonial-next]').addEventListener('click',()=>{go(index+1,true);schedule();});
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>{go(i,true);schedule();}));
  pause.addEventListener('click',()=>{paused=!paused;updatePause();schedule();});
  viewport.addEventListener('keydown',event=>{
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();go(index+(event.key==='ArrowRight'?1:-1),true);schedule();
  });
  viewport.addEventListener('scroll',()=>{
    const current=slides.reduce((nearest,slide,i)=>Math.abs(slide.offsetLeft-slides[0].offsetLeft-viewport.scrollLeft)<Math.abs(slides[nearest].offsetLeft-slides[0].offsetLeft-viewport.scrollLeft)?i:nearest,0);
    if(current!==index){index=current;updateDots();}
  },{passive:true});
  stories.addEventListener('pointerenter',event=>{if(event.pointerType==='mouse'){hovered=true;schedule();}});
  stories.addEventListener('pointerleave',()=>{hovered=false;schedule();});
  stories.addEventListener('focusin',()=>{focused=true;schedule();});
  stories.addEventListener('focusout',event=>{focused=stories.contains(event.relatedTarget);schedule();});
  document.addEventListener('visibilitychange',schedule);
  motionPreference.addEventListener('change',event=>{if(event.matches)paused=true;updatePause();schedule();});
  if('IntersectionObserver' in window)new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;schedule();},{threshold:.25}).observe(stories);
  else {inView=true;schedule();}
  if('ResizeObserver' in window)new ResizeObserver(()=>viewport.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior:'instant'})).observe(viewport);
  updatePause();
}
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

if(!motionPreference.matches && 'IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
  },{threshold:0,rootMargin:'0px 0px -24px 0px'});
  document.querySelectorAll('.section-heading,.service-card,.about-image,.about-copy,.steps-grid article,.finder-panel,.timeline article,.education-grid article,.detail-grid article,.crm-service-grid article,.reference-grid article,.academy-feature,.testimonials-intro,.testimonials-carousel,.faq-layout,.financial-socials,.closing-inner').forEach(element=>{
    element.classList.add('reveal');observer.observe(element);
  });
  document.documentElement.classList.add('motion-ready');
}
