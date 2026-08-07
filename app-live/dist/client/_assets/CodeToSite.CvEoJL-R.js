import{j as e}from"./jsx-runtime.ClP7wGfN.js";import{r as n}from"./index.DK-fsZOb.js";const t=`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  :root{ --gold:#e6c878; --ink:#08080c }
  *{ box-sizing:border-box; margin:0 }
  body{ font-family:system-ui,sans-serif; background:var(--ink); color:#fff }
  .hero{ min-height:100vh; display:grid; place-items:center; text-align:center;
    background:
      radial-gradient(60% 50% at 50% 28%, rgba(230,200,120,.20), transparent 70%),
      var(--ink) }
  .eyebrow{ letter-spacing:.34em; font-size:11px; color:var(--gold) }
  h1{ font-size:clamp(40px,11vw,120px); line-height:.95; margin:14px 0 0;
    background:linear-gradient(92deg,#fff,var(--gold)); -webkit-background-clip:text;
    background-clip:text; color:transparent }
  p{ color:#9a9ea8; max-width:34ch; margin:18px auto 0 }
  .btn{ display:inline-block; margin-top:26px; padding:14px 30px; border-radius:99px;
    background:linear-gradient(100deg,#f6e2a6,#b8923f); color:#1a1407;
    font-weight:700; text-decoration:none }
</style>
</head>
<body>
  <section class="hero">
    <div>
      <p class="eyebrow">VAPOR &middot; CO</p>
      <h1>Built to glow.</h1>
      <p>Premium devices, designed in Michigan. Age-gated, fast, unforgettable.</p>
      <a class="btn" href="#">Shop the drop &rarr;</a>
    </div>
  </section>
</body>
</html>`;function g(){const[h,c]=n.useState(""),[p,o]=n.useState(!1),r=n.useRef(null),i=n.useRef(null);return n.useEffect(()=>{if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){c(t),o(!0),r.current&&(r.current.srcdoc=t);return}let a=0,s="type",l=0,d=0;const m=()=>{s==="type"?(a=Math.min(t.length,a+Math.ceil(Math.random()*4)+2),c(t.slice(0,a)),i.current&&(i.current.scrollTop=i.current.scrollHeight),a>=t.length&&(s="render")):s==="render"?(r.current&&(r.current.srcdoc=t),o(!0),s="hold",l=0):s==="hold"?(l+=1,l>230&&(s="reset")):(a=0,c(""),o(!1),r.current&&(r.current.srcdoc=""),s="type"),d=requestAnimationFrame(m)};return d=requestAnimationFrame(m),()=>cancelAnimationFrame(d)},[]),e.jsxs("div",{className:"c2s",children:[e.jsxs("div",{className:"c2s-pane c2s-code",children:[e.jsxs("div",{className:"c2s-bar",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsx("span",{className:"c2s-tab",children:"vex.html"}),e.jsx("span",{className:"c2s-engine",children:"VEX ENGINE"})]}),e.jsx("pre",{ref:i,className:"c2s-pre",children:e.jsxs("code",{children:[h,e.jsx("span",{className:"c2s-cursor"})]})})]}),e.jsxs("div",{className:`c2s-pane c2s-view${p?" on":""}`,children:[e.jsxs("div",{className:"c2s-bar",children:[e.jsx("i",{}),e.jsx("i",{}),e.jsx("i",{}),e.jsx("span",{className:"c2s-tab",children:"vapor.co"}),e.jsx("span",{className:"c2s-engine",children:p?"LIVE":"BUILDING…"})]}),e.jsx("iframe",{ref:r,title:"Generated site preview",className:"c2s-frame",sandbox:"allow-scripts"})]})]})}export{g as default};
