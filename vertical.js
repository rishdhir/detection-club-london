const videos=[...document.querySelectorAll('video')];
const visible=new Set(), manuallyPaused=new Set();
const icons={pause:'<path d="M8 5V19M16 5V19" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>',play:'<path d="M8 5L19 12L8 19Z"/>'};
function updateButton(v){const b=v.closest('.media').querySelector('.play');b.querySelector('svg').innerHTML=icons[v.paused?'play':'pause'];b.querySelector('span').textContent=v.paused?'Play':'Pause';b.setAttribute('aria-label',`${v.paused?'Play':'Pause'} ${v.closest('.node').querySelector('h2').textContent.replace(/ video$/i,'')} video`)}
function reconcile(){videos.forEach(v=>{if(visible.has(v)&&!manuallyPaused.has(v)&&!document.hidden){v.play().catch(()=>updateButton(v))}else v.pause()})}
for(const v of videos){v.muted=true;v.loop=true;v.closest('.media').querySelector('.play').addEventListener('click',()=>{if(v.paused){manuallyPaused.delete(v);v.play().catch(()=>updateButton(v))}else{manuallyPaused.add(v);v.pause()}});v.addEventListener('play',()=>updateButton(v));v.addEventListener('pause',()=>updateButton(v));}
const visibility=new IntersectionObserver(entries=>{entries.forEach(({target,isIntersecting})=>{if(isIntersecting)visible.add(target);else visible.delete(target)});reconcile()},{threshold:.15});videos.forEach(v=>visibility.observe(v));
document.addEventListener('visibilitychange',reconcile);
const contrast=matchMedia('(prefers-contrast: more)'),transparency=matchMedia('(prefers-reduced-transparency: reduce)');let glass=[];
function configureGlass(){glass.forEach(g=>g.destroy());glass=[];if(window.liquidGlass&&!contrast.matches&&!transparency.matches)document.querySelectorAll('.glass-control,.play,.inspect').forEach(el=>glass.push(liquidGlass(el,{scale:-112,chroma:5,blur:3,saturate:1.35,fallbackBlur:20,border:.12})));}
configureGlass();[contrast,transparency].forEach(q=>q.addEventListener('change',configureGlass));
function drawConnections(){
 const chart=document.querySelector('.flowchart'),base=chart.getBoundingClientRect();
 const nodes=[...chart.querySelectorAll('.node')].map(n=>({node:n.getBoundingClientRect(),media:n.querySelector('.media').getBoundingClientRect()}));
 const paths=['link-one','link-two','link-three'].map(id=>document.getElementById(id));
 const x=r=>r.left-base.left,y=r=>r.top-base.top;
 if(true){
  for(let i=0;i<3;i++){let a=nodes[i],b=nodes[i+1],cx=x(a.node)+a.node.width/2;paths[i].setAttribute('d',`M${cx} ${y(a.node)+a.node.height+12}V${y(b.node)-14}`)}
 }else{
  for(const i of [0,2]){let a=nodes[i].media,b=nodes[i+1].media,cy=y(a)+a.height/2;paths[i].setAttribute('d',`M${x(a)+a.width+8} ${cy}H${x(b)-9}`)}
  let a=nodes[1].node,b=nodes[2].node,ax=x(a)+a.width/2,bx=x(b)+b.width/2,ay=y(a)+a.height+12,by=y(b)-16,my=(ay+by)/2;
  paths[1].setAttribute('d',`M${ax} ${ay}V${my-12}Q${ax} ${my} ${ax-12} ${my}H${bx+12}Q${bx} ${my} ${bx} ${my+12}V${by}`);
  document.querySelector('.join-note').style.top=`${my-8}px`;
 }
 document.querySelectorAll('.connection-port').forEach(port=>{const path=document.getElementById(port.dataset.route);if(path.getAttribute('d')){const point=path.getPointAtLength(0);port.setAttribute('cx',point.x);port.setAttribute('cy',point.y)}});
}
new ResizeObserver(drawConnections).observe(document.querySelector('.flowchart'));
window.addEventListener('load',drawConnections);document.fonts.ready.then(drawConnections);
