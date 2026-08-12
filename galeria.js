/* Visor de piezas Glamour */
(function(){
const css=`.gl-ov{position:fixed;inset:0;z-index:3000;background:rgba(12,12,12,.94);display:flex;align-items:center;justify-content:center;opacity:0;visibility:hidden;transition:opacity .25s}
.gl-ov.on{opacity:1;visibility:visible}
.gl-stage{max-width:min(92vw,900px);max-height:82vh;display:flex;flex-direction:column;align-items:center;gap:1.2rem}
.gl-stage img{max-width:100%;max-height:66vh;object-fit:contain;user-select:none}
.gl-cap{text-align:center;color:#fff}
.gl-cap .n{font-family:'Cormorant Garamond',serif;font-size:1.5rem;font-weight:400}
.gl-cap .m{font-size:.62rem;letter-spacing:.22em;text-transform:uppercase;color:rgba(255,255,255,.45);margin-top:.45rem}
.gl-x,.gl-nav{position:fixed;background:none;border:none;color:rgba(255,255,255,.65);cursor:pointer;z-index:2;transition:color .2s}
.gl-x:hover,.gl-nav:hover{color:#fff}
.gl-x{top:1.5rem;right:2rem;font-size:2rem;line-height:1}
.gl-nav{top:50%;transform:translateY(-50%);font-size:2.4rem;padding:1rem}
.gl-prev{left:1rem}.gl-next{right:1rem}
.gl-count{position:fixed;bottom:1.6rem;left:50%;transform:translateX(-50%);font-size:.6rem;letter-spacing:.25em;color:rgba(255,255,255,.4)}
.gl-zoom{cursor:zoom-in}
@media(max-width:600px){.gl-nav{font-size:1.8rem;padding:.6rem}.gl-stage img{max-height:58vh}}`;
const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
let items=[],idx=0;
function collect(){
  items=[];
  document.querySelectorAll('article.piece').forEach(a=>{
    const img=a.querySelector('.piece-img img');if(!img)return;
    items.push({src:img.getAttribute('src'),n:(a.querySelector('.piece-name')||{}).textContent||'',m:(a.querySelector('.piece-meta')||{}).textContent||'',el:img});
    img.classList.add('gl-zoom');
  });
  if(!items.length){
    document.querySelectorAll('.photo-rotator img').forEach(img=>{
      const card=img.closest('.col-card');if(!card)return;
      items.push({src:img.getAttribute('src'),n:(card.querySelector('.col-name')||{}).textContent||'',m:img.getAttribute('alt')||'',el:img});
      img.classList.add('gl-zoom');
    });
  }
}
const ov=document.createElement('div');ov.className='gl-ov';
ov.innerHTML='<button class="gl-x" aria-label="Cerrar">&times;</button><button class="gl-nav gl-prev" aria-label="Anterior">\u2039</button><button class="gl-nav gl-next" aria-label="Siguiente">\u203a</button><div class="gl-stage"><img alt=""><div class="gl-cap"><div class="n"></div><div class="m"></div></div></div><div class="gl-count"></div>';
document.body.appendChild(ov);
const gimg=ov.querySelector('.gl-stage img'),gn=ov.querySelector('.gl-cap .n'),gm=ov.querySelector('.gl-cap .m'),gc=ov.querySelector('.gl-count');
function render(){const it=items[idx];if(!it)return;gimg.src=it.src;gimg.alt=it.n;gn.textContent=it.n;gm.textContent=it.m;gc.textContent=(idx+1)+' / '+items.length}
function open(i){idx=i;render();ov.classList.add('on');document.body.style.overflow='hidden'}
function close(){ov.classList.remove('on');document.body.style.overflow=''}
function go(d){idx=(idx+d+items.length)%items.length;render()}
ov.querySelector('.gl-x').onclick=close;
ov.querySelector('.gl-prev').onclick=e=>{e.stopPropagation();go(-1)};
ov.querySelector('.gl-next').onclick=e=>{e.stopPropagation();go(1)};
ov.addEventListener('click',e=>{if(e.target===ov||e.target.classList.contains('gl-stage'))close()});
document.addEventListener('keydown',e=>{if(!ov.classList.contains('on'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')go(-1);if(e.key==='ArrowRight')go(1)});
let x0=null;ov.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});
ov.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)go(dx<0?1:-1);x0=null},{passive:true});
function wire(){collect();items.forEach((it,i)=>{it.el.addEventListener('click',ev=>{ev.preventDefault();open(i)})})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wire);else wire();
})();