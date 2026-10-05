function showView(a){
 const card=a.closest('article');
 card.querySelector('img').src=a.href;
 card.querySelector('.full').href=a.href;
 card.querySelectorAll('.view').forEach(link=>{link.classList.remove('active');link.removeAttribute('aria-current')});
 a.classList.add('active');a.setAttribute('aria-current','true');
 return false;
}
function filterLabels(weakOnly){
 document.querySelectorAll('.label-card').forEach(card=>card.hidden=weakOnly&&card.dataset.weak!=='true');
 document.querySelectorAll('.group-section').forEach(group=>{
  const total=group.querySelectorAll('.label-card').length;
  const visible=group.querySelectorAll('.label-card:not([hidden])').length;
  group.hidden=visible===0;
  group.querySelector('h2 span').textContent=weakOnly?`${visible}장 / 전체 ${total}장`:`${total}장`;
  const count=document.querySelector(`.group-menu a[href="#${group.id}"] span`);if(count)count.textContent=visible;
 });
 document.querySelectorAll('[data-label-filter]').forEach(button=>button.setAttribute('aria-pressed',(button.dataset.labelFilter==='weak')===weakOnly?'true':'false'));
}
document.querySelectorAll('[data-label-filter]').forEach(button=>button.addEventListener('click',()=>filterLabels(button.dataset.labelFilter==='weak')));
function revealLabel(){
 const card=document.getElementById(decodeURIComponent(location.hash.slice(1)));
 if(!card||!card.classList.contains('label-card'))return;
 if(card.hidden)filterLabels(false);
 const view=new URLSearchParams(location.search).get('view');
 if(view){const link=Array.from(card.querySelectorAll('.view')).find(a=>a.dataset.view===view);if(link)showView(link)}
 requestAnimationFrame(()=>card.scrollIntoView({block:'start'}));
}
revealLabel();window.addEventListener('hashchange',revealLabel);
