import{s as d,n as m,e as f}from"../chunks/scheduler.fcd7ba46.js";import{S as _,i as h,g as v,m as u,h as $,j as E,n as p,f as b,a as S,y as l,o as g}from"../chunks/index.a1e46192.js";import{d as x}from"../chunks/singletons.9299b68a.js";const y=()=>{const t=x;return{page:{subscribe:t.page.subscribe},navigating:{subscribe:t.navigating.subscribe},updated:t.updated}},j={subscribe(t){return y().page.subscribe(t)}};function q(t){let e,r=t[0].status+"",n,o,i=t[0].error.message+"",c;return{c(){e=v("h1"),n=u(r),o=u(": "),c=u(i)},l(a){e=$(a,"H1",{});var s=E(e);n=p(s,r),o=p(s,": "),c=p(s,i),s.forEach(b)},m(a,s){S(a,e,s),l(e,n),l(e,o),l(e,c)},p(a,[s]){s&1&&r!==(r=a[0].status+"")&&g(n,r),s&1&&i!==(i=a[0].error.message+"")&&g(c,i)},i:m,o:m,d(a){a&&b(e)}}}function C(t,e,r){let n;return f(t,j,o=>r(0,n=o)),[n]}let z=class extends _{constructor(e){super(),h(this,e,C,q,d,{})}};export{z as component};