const records=JSON.parse(document.getElementById('gallery-data').textContent);
const byId=new Map(records.map(r=>[r.id,r]));
const cards=[...document.querySelectorAll('.image-card')];
const viewer=document.getElementById('viewer');
const contexts={validation:'AI 학습에 사용하지 않고 결과를 확인한 사진입니다. 현재 검증 사진은 모두 Data 2입니다.',difficult:'현재 자동 라벨 기준 F1이 40% 미만인 검증 사진입니다. 제외하지 않고 함께 확인합니다.',worsened:'첫 학습보다 자동 라벨 기준 F1이 내려간 검증 사진 8장입니다.',train:'AI가 학습할 때 이미 본 사진입니다. 새로운 장면에서의 성능을 뜻하지 않습니다.'};
let filter='validation',current=null,view='final',visible=[];
const labels={final:'현재 AI · 46회 학습 시점',initial:'첫 학습 AI · 1회 학습 시점',auto:'자동으로 표시한 경계 · 평가 기준'};
function applyFilters(){
 const query=document.getElementById('search').value.trim().toLowerCase();
 visible=records.filter(r=>{
  const match=filter==='train'?r.role==='train':r.role==='validation'&&(filter==='validation'||filter==='difficult'&&r.f1<.4||filter==='worsened'&&r.delta<0);
  return match&&(!query||r.title.toLowerCase().includes(query)||r.id.toLowerCase().includes(query));
 });
 const sort=document.getElementById('sort').value;
 visible.sort((a,b)=>sort==='low'?(a.f1??Infinity)-(b.f1??Infinity):sort==='high'?(b.f1??-Infinity)-(a.f1??-Infinity):a.group-b.group||a.number-b.number);
 const ids=new Set(visible.map(r=>r.id));
 cards.forEach(c=>c.hidden=!ids.has(c.dataset.id));
 visible.forEach(r=>document.getElementById('cards').appendChild(document.getElementById('card-'+r.id)));
 document.getElementById('result-count').textContent=`${visible.length}장`;
 document.getElementById('empty').hidden=visible.length!==0;
 document.getElementById('gallery-context').textContent=contexts[filter];
 document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
}
function selectView(name){
 view=name;if(!current)return;
 document.getElementById('viewer-result').src=current.assets[view];
 document.getElementById('viewer-result').alt=`${current.title} · ${labels[view]}`;
 document.getElementById('viewer-view-label').textContent=labels[view];
 document.querySelectorAll('[data-view]').forEach(b=>{const active=b.dataset.view===view;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active)});
}
function showRecord(id){
 current=byId.get(id);
 document.getElementById('viewer-title').textContent=current.title;
 document.getElementById('viewer-role').textContent=current.role==='validation'?'검증 사진 · 학습에 사용하지 않음':'학습 예시 · 학습에 사용한 사진';
 document.getElementById('viewer-original').src=current.assets.original;
 document.getElementById('viewer-original').alt=`${current.title} 원본 사진`;
 document.getElementById('viewer-score').textContent=current.role==='validation'?`자동 라벨 기준 F1 ${(current.previous_f1*100).toFixed(2)}% → ${(current.f1*100).toFixed(2)}%`:'학습 사진에는 검증 점수를 표시하지 않습니다.';
 document.getElementById('full-comparison').href=current.assets.comparison;
 const i=visible.findIndex(r=>r.id===id);
 document.getElementById('viewer-position').textContent=`${i+1} / ${visible.length}`;
 document.getElementById('previous').disabled=i<=0;
 document.getElementById('next').disabled=i>=visible.length-1;
 selectView(view);
}
function openRecord(id){view='final';showRecord(id);viewer.showModal();document.body.classList.add('viewer-open');viewer.scrollTop=0;}
function move(direction){const i=visible.findIndex(r=>r.id===current.id);const next=visible[i+direction];if(next)showRecord(next.id);}
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.filter;applyFilters()}));
document.getElementById('search').addEventListener('input',applyFilters);
document.getElementById('sort').addEventListener('change',applyFilters);
document.getElementById('show-difficult').addEventListener('click',()=>{filter='difficult';document.getElementById('search').value='';applyFilters()});
document.querySelectorAll('.card-open').forEach(b=>b.addEventListener('click',()=>openRecord(b.dataset.id)));
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>selectView(b.dataset.view)));
document.getElementById('close-viewer').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>document.body.classList.remove('viewer-open'));
viewer.addEventListener('click',e=>{if(e.target===viewer){const r=viewer.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)viewer.close()}});
document.getElementById('previous').addEventListener('click',()=>move(-1));
document.getElementById('next').addEventListener('click',()=>move(1));
viewer.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();move(-1)}if(e.key==='ArrowRight'){e.preventDefault();move(1)}});
applyFilters();
