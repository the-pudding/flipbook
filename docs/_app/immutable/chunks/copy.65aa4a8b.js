async function v(n){if("clipboard"in navigator)await navigator.clipboard.writeText(n);else{const t=document.createElement("input");t.type="text",t.disabled=!0,t.style.setProperty("position","fixed"),t.style.setProperty("z-index","-100"),t.style.setProperty("pointer-events","none"),t.style.setProperty("opacity","0"),t.value=n,document.body.appendChild(t),t.click(),t.select(),document.execCommand("copy"),document.body.removeChild(t)}}const p=(n,t)=>{async function i(){if(r)try{await v(r),n.dispatchEvent(new CustomEvent("svelte-copy",{detail:r}))}catch(e){n.dispatchEvent(new CustomEvent("svelte-copy:error",{detail:e}))}}let c=typeof t=="string"?["click"]:[t.events].flat(1),r=typeof t=="string"?t:t.text;return c.forEach(e=>{n.addEventListener(e,i,!0)}),{update:e=>{const s=typeof e=="string"?["click"]:[e.events].flat(1),d=typeof e=="string"?e:e.text,l=s.filter(o=>!c.includes(o)),y=c.filter(o=>!s.includes(o));l.forEach(o=>{n.addEventListener(o,i,!0)}),y.forEach(o=>{n.removeEventListener(o,i,!0)}),c=s,r=d},destroy:()=>{c.forEach(e=>{n.removeEventListener(e,i,!0)})}}};export{p as c};
