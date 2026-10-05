function filter(minimum){document.querySelectorAll('.result-row').forEach(row=>row.hidden=Number(row.dataset.remaining)<minimum);document.querySelectorAll('[data-min]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.min)===minimum?'true':'false'))}
document.querySelectorAll('[data-min]').forEach(b=>b.addEventListener('click',()=>filter(Number(b.dataset.min))));
function revealHash(){const row=document.getElementById(decodeURIComponent(location.hash.slice(1)));if(row&&row.classList.contains('result-row')){filter(0);requestAnimationFrame(()=>row.scrollIntoView({block:'start'}));return true}return false}
filter(30);revealHash();window.addEventListener('hashchange',revealHash);
