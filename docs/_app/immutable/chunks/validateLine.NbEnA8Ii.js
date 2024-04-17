import{z as E}from"./scheduler.BIFECd0c.js";function B(e,{delay:r=0,duration:n=400,easing:t=E}={}){const o=+getComputedStyle(e).opacity;return{delay:r,duration:n,easing:t,css:a=>`opacity: ${a*o}`}}function _(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}function R(e){if(e.__esModule)return e;var r=e.default;if(typeof r=="function"){var n=function t(){return this instanceof t?Reflect.construct(r,arguments,this.constructor):r.apply(this,arguments)};n.prototype=r.prototype}else n={};return Object.defineProperty(n,"__esModule",{value:!0}),Object.keys(e).forEach(function(t){var o=Object.getOwnPropertyDescriptor(e,t);Object.defineProperty(n,t,o.get?o:{enumerable:!0,get:function(){return e[t]}})}),n}function I(e,r=!1){let n=0;for(let t=1;t<e.length;t++){const o=e[t-1],a=e[t];r?n+=Math.sqrt(Math.pow(a.x-o.x,2)+Math.pow(a.y-o.y,2)):n+=Math.sqrt(Math.pow(a[0]-o[0],2)+Math.pow(a[1]-o[1],2))}return n}function L(e){const n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("d",e),n.getTotalLength()}function j({prev:e,cur:r,strokeWidth:n=1,canvasSize:t=320,targetRatioOverlap:o=.5,targetRatioExcess:a=.5}){const s=document.createElement("canvas"),u=document.createElement("canvas"),h=document.createElement("canvas"),c=document.createElement("canvas");s.width=u.width=t,s.height=u.height=t,h.width=c.width=t,h.height=c.height=t;const l=s.getContext("2d"),i=u.getContext("2d"),d=h.getContext("2d"),f=c.getContext("2d");l.strokeStyle="lightgray",i.strokeStyle="black",d.strokeStyle="lightgray",f.strokeStyle="black",l.lineWidth=n,i.lineWidth=n,d.lineWidth=n*4,f.lineWidth=n*4;const p=new Path2D(e),m=new Path2D(r);l.stroke(p),i.stroke(m),d.stroke(p),f.stroke(m);const v=l.getImageData(0,0,t,t),y=i.getImageData(0,0,t,t),C=d.getImageData(0,0,t,t),M=f.getImageData(0,0,t,t);let w=0,P=0,x=0,D=0;for(let g=0;g<v.data.length;g+=4)v.data[g+3]>0&&(w++,M.data[g+3]>0&&x++);for(let g=0;g<y.data.length;g+=4)y.data[g+3]>0&&(P++,C.data[g+3]<=0&&D++);const O=x/w,b=D/P;return s.remove(),u.remove(),h.remove(),c.remove(),O>o&&b<a}function N({cur:e,prev:r,canvasSize:n,strokeWidth:t,attempts:o}){const a=L(e),s=L(r),u=Math.max(a,s);let h=0;a<s?h=a/s:h=s/a;let c=.5,l=.5,i=.5;const d=o<=1?.05:o<=2?.02:0,f=o<=1?.05:o<=2?.02:0,p=o<=1?-.02:0;u>100&&(c=.6),u>400&&(c=.7,l=.6,i=.4),u>600&&(c=.75,l=.7,i=.3),c+=d,l+=f,i+=p;const m=j({prev:r,cur:e,strokeWidth:t,canvasSize:n,targetRatioOverlap:l,targetRatioExcess:i});return h>=c&&m}export{R as a,B as f,_ as g,I as l,N as v};
