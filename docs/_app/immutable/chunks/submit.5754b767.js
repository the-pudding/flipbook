import"./paths.84d03bf2.js";async function h(o,s){var n;const e="https://pudding-server-utils.herokuapp.com/trace",c="";try{const t=Date.now(),a=JSON.stringify({endpoint:o,data:s}),i=await(await fetch(e,{method:"POST",headers:{Accept:"application/json","Content-Type":"application/json","X-Pudding-Token":c},credentials:"include",body:a})).json(),r=`${Date.now()-t}ms`;return{...i,duration:r}}catch(t){throw console.log((n=t==null?void 0:t.data)==null?void 0:n.message),t}}export{h as s};
