import{j as N}from"./jsx-runtime.ClP7wGfN.js";import{r as P}from"./index.DK-fsZOb.js";import{S as F,P as I,W as V,G as W,I as D,e as k,A as T,b as _,M as q,B as L,f as H,g as O,h as U,C as X}from"./three.module.DEXnaLYH.js";function Q({className:j="iv-hero3d"}){const u=P.useRef(null);return P.useEffect(()=>{const n=u.current;if(!n)return;const h=window.matchMedia("(prefers-reduced-motion: reduce)").matches,v=new F,r=new I(45,1,.1,100);r.position.z=4.2;const o=new V({antialias:!0,alpha:!0,powerPreference:"high-performance"});o.setClearColor(0,0),o.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.appendChild(o.domElement),o.domElement.style.width="100%",o.domElement.style.height="100%",o.domElement.style.display="block";const s=new W;v.add(s);const R=`
      uniform float uTime;
      uniform float uAmp;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;

      // classic simplex noise (Ashima)
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
        i=mod(i,289.0);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }

      void main(){
        vNormal = normalize(normalMatrix * normal);
        float n = snoise(normal * 1.6 + uTime * 0.25);
        n += 0.5 * snoise(normal * 3.2 - uTime * 0.18);
        vDisp = n;
        vec3 pos = position + normal * n * uAmp;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `,S=`
      precision highp float;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;

      void main(){
        float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
        // iridescent core: shift hue by displacement + view
        vec3 a = vec3(0.92, 0.78, 0.42);  // gold
        vec3 b = vec3(0.86, 0.88, 0.93);  // silver
        vec3 c = vec3(1.0, 0.90, 0.62);   // bright gold
        float t = 0.5 + 0.5 * sin(vDisp * 3.0 + uTime * 0.5);
        vec3 core = mix(mix(a, b, t), c, fres * 0.6);
        vec3 col = core * (0.18 + vDisp * 0.25) + core * fres * 1.5;
        float alpha = clamp(0.32 + fres * 0.9, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `,m={uTime:{value:0},uAmp:{value:.55}},f=new D(1.25,64),w=new k({vertexShader:R,fragmentShader:S,uniforms:m,transparent:!0,depthWrite:!1,blending:T}),B=new _(f,w);s.add(B);const l=new _(new D(1.45,3),new q({color:13214794,wireframe:!0,transparent:!0,opacity:.08}));s.add(l);const z=900,a=new Float32Array(z*3);for(let e=0;e<z;e++){const t=2.4+Math.random()*4.5,E=Math.random()*Math.PI*2,y=Math.acos(2*Math.random()-1);a[e*3]=t*Math.sin(y)*Math.cos(E),a[e*3+1]=t*Math.sin(y)*Math.sin(E),a[e*3+2]=t*Math.cos(y)}const p=new L;p.setAttribute("position",new H(a,3));const g=new O({color:15124600,size:.018,transparent:!0,opacity:.7,blending:T,depthWrite:!1}),M=new U(p,g);v.add(M);const c={x:0,y:0},i={x:0,y:0},b=e=>{const t=n.getBoundingClientRect();c.x=((e.clientX-t.left)/t.width-.5)*2,c.y=((e.clientY-t.top)/t.height-.5)*2};window.addEventListener("pointermove",b,{passive:!0});const C=()=>{const e=n.clientWidth||1,t=n.clientHeight||1;o.setSize(e,t,!1),r.aspect=e/t,r.updateProjectionMatrix()};C();const A=new ResizeObserver(C);A.observe(n);const G=new X;let d=0;const x=()=>{const e=G.getElapsedTime();m.uTime.value=e,i.x+=(c.x-i.x)*.04,i.y+=(c.y-i.y)*.04,s.rotation.y=e*.12+i.x*.5,s.rotation.x=i.y*.35,M.rotation.y=-e*.03,r.position.x=i.x*.3,r.position.y=-i.y*.3,r.lookAt(0,0,0),o.render(v,r),h||(d=requestAnimationFrame(x))};return h?(m.uTime.value=1.2,x()):d=requestAnimationFrame(x),()=>{cancelAnimationFrame(d),window.removeEventListener("pointermove",b),A.disconnect(),f.dispose(),w.dispose(),p.dispose(),g.dispose(),l.geometry.dispose(),l.material.dispose(),o.dispose(),o.domElement.parentNode===n&&n.removeChild(o.domElement)}},[]),N.jsx("div",{ref:u,className:j,"aria-hidden":"true"})}export{Q as default};
