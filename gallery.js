function showView(a){
 const card=a.closest('article');
 card.querySelector('img').src=a.href;
 card.querySelector('.full').href=a.href;
 card.querySelectorAll('.view').forEach(link=>{link.classList.remove('active');link.removeAttribute('aria-current')});
 a.classList.add('active');a.setAttribute('aria-current','true');
 return false;
}
