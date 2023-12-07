import{s as ee,f as z,a as w,l as F,Q as _e,g as E,d as b,c as D,h as M,m as H,u as Q,j as g,k as W,v as h,i as O,R as ye,w as X,n as K,S as ge,x as $,J as ie,o as ve,G as Y,B as fe,T as ke}from"../chunks/scheduler.a009160e.js";import{S as te,i as se,a as R,g as ue,c as ce,t as G,b as he,d as me,m as pe,e as de}from"../chunks/index.aacbeec2.js";import{e as Z}from"../chunks/each.e59479a4.js";import"../chunks/transform.4d2927c0.js";import{b as be}from"../chunks/paths.b84d5b6a.js";import{c as Ce}from"../chunks/copy.65aa4a8b.js";function ze(s,e){return s==null||e==null?NaN:e<s?-1:e>s?1:e>=s?0:NaN}class Ee extends Map{constructor(e,n=Se){if(super(),Object.defineProperties(this,{_intern:{value:new Map},_key:{value:n}}),e!=null)for(const[t,f]of e)this.set(t,f)}get(e){return super.get(ne(this,e))}has(e){return super.has(ne(this,e))}set(e,n){return super.set(Te(this,e),n)}delete(e){return super.delete(xe(this,e))}}function ne({_intern:s,_key:e},n){const t=e(n);return s.has(t)?s.get(t):n}function Te({_intern:s,_key:e},n){const t=e(n);return s.has(t)?s.get(t):(s.set(t,n),n)}function xe({_intern:s,_key:e},n){const t=e(n);return s.has(t)&&(n=s.get(t),s.delete(t)),n}function Se(s){return s!==null&&typeof s=="object"?s.valueOf():s}function Me(s){return s}function we(s,...e){return De(s,Array.from,Me,e)}function De(s,e,n,t){return function f(i,C){if(C>=t.length)return n(i);const d=new Ee,m=t[C++];let o=-1;for(const v of i){const l=m(v,++o,i),r=d.get(l);r?r.push(v):d.set(l,[v])}for(const[v,l]of d)d.set(v,f(l,C));return e(d)}(s,0)}function Ne(s){let e,n,t,f,i,C,d,m,o,v,l,r="CSS Snippet",p,y,j,N,A,x,S="Copy CSS to Clipboard",B,T,P,U,V;return{c(){e=z("link"),n=w(),t=z("div"),f=z("h3"),i=F(s[0]),C=w(),d=z("p"),m=F(s[1]),o=w(),v=z("details"),l=z("summary"),l.textContent=r,p=w(),y=z("code"),j=F(s[2]),N=w(),A=z("p"),x=z("button"),x.textContent=S,T=z("span"),P=F(s[3]),this.h()},l(k){const a=_e("svelte-1uevrx3",document.head);e=E(a,"LINK",{rel:!0,href:!0}),a.forEach(b),n=D(k),t=E(k,"DIV",{style:!0,class:!0});var I=M(t);f=E(I,"H3",{class:!0});var u=M(f);i=H(u,s[0]),u.forEach(b),C=D(I),d=E(I,"P",{});var _=M(d);m=H(_,s[1]),_.forEach(b),o=D(I),v=E(I,"DETAILS",{class:!0});var c=M(v);l=E(c,"SUMMARY",{class:!0,"data-svelte-h":!0}),Q(l)!=="svelte-1p4cxwi"&&(l.textContent=r),p=D(c),y=E(c,"CODE",{class:!0});var L=M(y);j=H(L,s[2]),L.forEach(b),c.forEach(b),N=D(I),A=E(I,"P",{});var q=M(A);x=E(q,"BUTTON",{class:!0,"data-svelte-h":!0}),Q(x)!=="svelte-v2s51m"&&(x.textContent=S),T=E(q,"SPAN",{class:!0});var J=M(T);P=H(J,s[3]),J.forEach(b),q.forEach(b),I.forEach(b),this.h()},h(){g(e,"rel","external stylesheet"),g(e,"href",s[5]),g(f,"class","svelte-19ry7n"),W(d,"font-size",s[4]),g(l,"class","svelte-19ry7n"),g(y,"class","svelte-19ry7n"),g(v,"class","svelte-19ry7n"),g(x,"class","svelte-19ry7n"),g(T,"class","svelte-19ry7n"),W(t,"font-family","'"+s[0]+"'"),g(t,"class","svelte-19ry7n")},m(k,a){h(document.head,e),O(k,n,a),O(k,t,a),h(t,f),h(f,i),h(t,C),h(t,d),h(d,m),h(t,o),h(t,v),h(v,l),h(v,p),h(v,y),h(y,j),h(t,N),h(t,A),h(A,x),h(A,T),h(T,P),U||(V=[ye(B=Ce.call(null,x,s[2])),X(x,"svelte-copy",s[6])],U=!0)},p(k,[a]){a&1&&K(i,k[0]),a&2&&K(m,k[1]),a&16&&W(d,"font-size",k[4]),a&4&&K(j,k[2]),B&&ge(B.update)&&a&4&&B.update.call(null,k[2]),a&8&&K(P,k[3]),a&1&&W(t,"font-family","'"+k[0]+"'")},i:$,o:$,d(k){k&&(b(n),b(t)),b(e),U=!1,ie(V)}}}function Pe(s,e,n){let t,{id:f=""}=e,{family:i=""}=e,{size:C=16}=e,{text:d}=e,m="",o="";const v=`${be}/assets/demo/fonts/${f}.css`,l=()=>{n(3,o="Copied!"),setTimeout(()=>{n(3,o="")},1e3)};return ve(async()=>{const r=await fetch(v);n(2,m=await r.text())}),s.$$set=r=>{"id"in r&&n(7,f=r.id),"family"in r&&n(0,i=r.family),"size"in r&&n(8,C=r.size),"text"in r&&n(1,d=r.text)},s.$$.update=()=>{s.$$.dirty&256&&n(4,t=`${C}px`)},[i,d,m,o,t,v,l,f,C]}class Ie extends te{constructor(e){super(),se(this,e,Pe,Ne,ee,{id:7,family:0,size:8,text:1})}}const Le=[{id:"atkinson",family:"Atkinson",type:"sans-serif"},{id:"atlas",family:"Atlas Grotesk",type:"sans-serif"},{id:"baloo-bhai",family:"Baloo Bhai",type:"sans-serif"},{id:"canela",family:"Canela",type:"serif"},{id:"computer-modern",family:"Computer Modern",type:"serif"},{id:"cozette",family:"Cozette",type:"other"},{id:"inter",family:"Inter",type:"sans-serif"},{id:"jamboree",family:"Jamboree",type:"other"},{id:"jersey",family:"Jersey M54",type:"other"},{id:"lyon",family:"Lyon Display",type:"serif"},{id:"metropolis",family:"Metropolis",type:"sans-serif"},{id:"national",family:"National 2 Web",type:"sans-serif"},{id:"publico",family:"Publico Text",type:"serif"},{id:"recoleta",family:"Recoleta",type:"serif"},{id:"rubik",family:"Rubik",type:"sans-serif"},{id:"spacemono",family:"Space Mono",type:"mono"},{id:"tiempos",family:"Tiempos Text",type:"serif"}];function le(s,e,n){const t=s.slice();return t[5]=e[n][0],t[6]=e[n][1],t}function oe(s,e,n){const t=s.slice();return t[9]=e[n].family,t[10]=e[n].id,t}function re(s){let e,n;return e=new Ie({props:{id:s[10],family:s[9],size:s[0],text:s[1]}}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,f){pe(e,t,f),n=!0},p(t,f){const i={};f&1&&(i.size=t[0]),f&2&&(i.text=t[1]),e.$set(i)},i(t){n||(R(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){de(e,t)}}}function ae(s){let e,n=s[5]+"",t,f,i,C,d,m=Z(s[6]),o=[];for(let l=0;l<m.length;l+=1)o[l]=re(oe(s,m,l));const v=l=>G(o[l],1,1,()=>{o[l]=null});return{c(){e=z("h2"),t=F(n),f=w(),i=z("section");for(let l=0;l<o.length;l+=1)o[l].c();C=w(),this.h()},l(l){e=E(l,"H2",{});var r=M(e);t=H(r,n),r.forEach(b),f=D(l),i=E(l,"SECTION",{class:!0});var p=M(i);for(let y=0;y<o.length;y+=1)o[y].l(p);C=D(p),p.forEach(b),this.h()},h(){g(i,"class","svelte-1lzc8ku")},m(l,r){O(l,e,r),h(e,t),O(l,f,r),O(l,i,r);for(let p=0;p<o.length;p+=1)o[p]&&o[p].m(i,null);h(i,C),d=!0},p(l,r){if(r&7){m=Z(l[6]);let p;for(p=0;p<m.length;p+=1){const y=oe(l,m,p);o[p]?(o[p].p(y,r),R(o[p],1)):(o[p]=re(y),o[p].c(),R(o[p],1),o[p].m(i,C))}for(ue(),p=m.length;p<o.length;p+=1)v(p);ce()}},i(l){if(!d){for(let r=0;r<m.length;r+=1)R(o[r]);d=!0}},o(l){o=o.filter(Boolean);for(let r=0;r<o.length;r+=1)G(o[r]);d=!1},d(l){l&&(b(e),b(f),b(i)),fe(o,l)}}}function Ae(s){let e,n,t="Hosted Fonts on The Pudding",f,i,C="<em>Do not use fonts hosted by The Pudding without written permission.</em>",d,m,o,v,l,r,p,y,j,N,A="text sample",x,S,B,T,P,U,V,k=Z(s[2]),a=[];for(let u=0;u<k.length;u+=1)a[u]=ae(le(s,k,u));const I=u=>G(a[u],1,1,()=>{a[u]=null});return{c(){e=z("div"),n=z("h1"),n.textContent=t,f=w(),i=z("p"),i.innerHTML=C,d=w(),m=z("form"),o=z("label"),v=F("font-size: "),l=F(s[0]),r=F("px"),p=w(),y=z("input"),j=w(),N=z("label"),N.textContent=A,x=w(),S=z("input"),B=w(),T=z("article");for(let u=0;u<a.length;u+=1)a[u].c();this.h()},l(u){e=E(u,"DIV",{id:!0,class:!0});var _=M(e);n=E(_,"H1",{"data-svelte-h":!0}),Q(n)!=="svelte-1m2hcwq"&&(n.textContent=t),f=D(_),i=E(_,"P",{"data-svelte-h":!0}),Q(i)!=="svelte-895ja5"&&(i.innerHTML=C),d=D(_),m=E(_,"FORM",{});var c=M(m);o=E(c,"LABEL",{for:!0,class:!0});var L=M(o);v=H(L,"font-size: "),l=H(L,s[0]),r=H(L,"px"),L.forEach(b),p=D(c),y=E(c,"INPUT",{id:!0,type:!0,min:!0,max:!0}),j=D(c),N=E(c,"LABEL",{for:!0,class:!0,"data-svelte-h":!0}),Q(N)!=="svelte-16zo6eo"&&(N.textContent=A),x=D(c),S=E(c,"INPUT",{id:!0,type:!0,maxlength:!0}),c.forEach(b),_.forEach(b),B=D(u),T=E(u,"ARTICLE",{class:!0});var q=M(T);for(let J=0;J<a.length;J+=1)a[J].l(q);q.forEach(b),this.h()},h(){g(o,"for","size"),g(o,"class","svelte-1lzc8ku"),g(y,"id","size"),g(y,"type","range"),g(y,"min","12"),g(y,"max","48"),g(N,"for","text"),g(N,"class","svelte-1lzc8ku"),g(S,"id","text"),g(S,"type","text"),g(S,"maxlength","100"),g(e,"id","info"),g(e,"class","svelte-1lzc8ku"),g(T,"class","svelte-1lzc8ku")},m(u,_){O(u,e,_),h(e,n),h(e,f),h(e,i),h(e,d),h(e,m),h(m,o),h(o,v),h(o,l),h(o,r),h(m,p),h(m,y),Y(y,s[0]),h(m,j),h(m,N),h(m,x),h(m,S),Y(S,s[1]),O(u,B,_),O(u,T,_);for(let c=0;c<a.length;c+=1)a[c]&&a[c].m(T,null);P=!0,U||(V=[X(y,"change",s[3]),X(y,"input",s[3]),X(S,"input",s[4])],U=!0)},p(u,[_]){if((!P||_&1)&&K(l,u[0]),_&1&&Y(y,u[0]),_&2&&S.value!==u[1]&&Y(S,u[1]),_&7){k=Z(u[2]);let c;for(c=0;c<k.length;c+=1){const L=le(u,k,c);a[c]?(a[c].p(L,_),R(a[c],1)):(a[c]=ae(L),a[c].c(),R(a[c],1),a[c].m(T,null))}for(ue(),c=k.length;c<a.length;c+=1)I(c);ce()}},i(u){if(!P){for(let _=0;_<k.length;_+=1)R(a[_]);P=!0}},o(u){a=a.filter(Boolean);for(let _=0;_<a.length;_+=1)G(a[_]);P=!1},d(u){u&&(b(e),b(B),b(T)),fe(a,u),U=!1,ie(V)}}}function Be(s,e,n){let t=18,f="The quick brown fox jumps over the lazy dog.";const i=we(Le,m=>m.type);i.sort((m,o)=>ze(m[1].length,o[1].length));function C(){t=ke(this.value),n(0,t)}function d(){f=this.value,n(1,f)}return[t,f,i,C,d]}class je extends te{constructor(e){super(),se(this,e,Be,Ae,ee,{})}}function Fe(s){let e,n;return e=new je({}),{c(){he(e.$$.fragment)},l(t){me(e.$$.fragment,t)},m(t,f){pe(e,t,f),n=!0},p:$,i(t){n||(R(e.$$.fragment,t),n=!0)},o(t){G(e.$$.fragment,t),n=!1},d(t){de(e,t)}}}class Ge extends te{constructor(e){super(),se(this,e,null,Fe,ee,{})}}export{Ge as component};
