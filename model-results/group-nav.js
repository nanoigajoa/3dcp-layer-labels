const groups=[...document.querySelectorAll('.group-section')];
const links=[...document.querySelectorAll('.group-menu a')];
function updateGroup(){
 if(!groups.length)return;
 const top=(document.querySelector('.site-header')?.offsetHeight||0)+(document.querySelector('.group-menu')?.offsetHeight||0)+32;
 let active=groups[0];
 for(const group of groups){if(group.getBoundingClientRect().top<=top)active=group;else break;}
 for(const link of links){const selected=link.hash==='#'+active.id;link.classList.toggle('active',selected);if(selected)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
}
window.addEventListener('scroll',updateGroup,{passive:true});
window.addEventListener('resize',updateGroup);updateGroup();
