import{s as g,f,l as u,g as _,h,m as p,d as m,i as v,v as l,n as b,w as d,B as $}from"../chunks/scheduler.03bad25f.js";import{S as E,i as S}from"../chunks/index.29cfdd55.js";import{d as x}from"../chunks/singletons.a608a9f6.js";const q=()=>{const t=x;return{page:{subscribe:t.page.subscribe},navigating:{subscribe:t.navigating.subscribe},updated:t.updated}},w={subscribe(t){return q().page.subscribe(t)}};function y(t){let e,a=t[0].status+"",n,o,i=t[0].error.message+"",c;return{c(){e=f("h1"),n=u(a),o=u(": "),c=u(i)},l(r){e=_(r,"H1",{});var s=h(e);n=p(s,a),o=p(s,": "),c=p(s,i),s.forEach(m)},m(r,s){v(r,e,s),l(e,n),l(e,o),l(e,c)},p(r,[s]){s&1&&a!==(a=r[0].status+"")&&b(n,a),s&1&&i!==(i=r[0].error.message+"")&&b(c,i)},i:d,o:d,d(r){r&&m(e)}}}function B(t,e,a){let n;return $(t,w,o=>a(0,n=o)),[n]}let k=class extends E{constructor(e){super(),S(this,e,B,y,g,{})}};export{k as component};
