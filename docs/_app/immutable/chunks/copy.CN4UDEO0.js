import{s as G,e as i,p as z,q as J,c as s,d as r,m as e,f as a,n as H,r as L,i as R}from"./scheduler.--4Niz_R.js";import{e as O}from"./each.D6YF6ztN.js";import{S as B,i as U}from"./index.BKFpFCK7.js";function K(c,n,h){const u=c.slice();return u[5]=n[h],u}function Y(c){let n,h;return{c(){n=i("link"),this.h()},l(u){n=s(u,"LINK",{rel:!0,href:!0,as:!0,type:!0,crossorigin:!0}),this.h()},h(){e(n,"rel","preload"),e(n,"href",h=c[5]),e(n,"as","font"),e(n,"type","font/woff2"),e(n,"crossorigin","")},m(u,p){R(u,n,p)},p(u,p){p&16&&h!==(h=u[5])&&e(n,"href",h)},d(u){u&&r(n)}}}function V(c){let n,h,u,p,f,w,g,m,T,E,y,N,M,A,W,j,q,F,b,k,v,x,P,_,D,S;document.title=n=c[0];let C=O(c[4]),d=[];for(let o=0;o<C.length;o+=1)d[o]=Y(K(c,C,o));return{c(){h=i("meta"),u=i("meta"),p=i("meta"),f=i("meta"),w=i("meta"),g=i("meta"),m=i("meta"),T=i("meta"),E=i("meta"),y=i("meta"),M=i("meta"),A=i("meta"),W=i("meta"),j=i("meta"),q=i("meta"),F=i("meta"),b=i("meta"),k=i("meta"),v=i("meta"),P=i("meta"),_=i("link");for(let o=0;o<d.length;o+=1)d[o].c();S=z(),this.h()},l(o){const t=J("svelte-1htu80s",document.head);h=s(t,"META",{name:!0,content:!0}),u=s(t,"META",{name:!0,content:!0}),p=s(t,"META",{name:!0,content:!0}),f=s(t,"META",{property:!0,content:!0}),w=s(t,"META",{property:!0,content:!0}),g=s(t,"META",{property:!0,content:!0}),m=s(t,"META",{property:!0,content:!0}),T=s(t,"META",{property:!0,content:!0}),E=s(t,"META",{property:!0,content:!0}),y=s(t,"META",{property:!0,content:!0}),M=s(t,"META",{property:!0,content:!0}),A=s(t,"META",{property:!0,content:!0}),W=s(t,"META",{property:!0,content:!0}),j=s(t,"META",{name:!0,content:!0}),q=s(t,"META",{name:!0,content:!0}),F=s(t,"META",{name:!0,content:!0}),b=s(t,"META",{name:!0,content:!0}),k=s(t,"META",{name:!0,content:!0}),v=s(t,"META",{name:!0,content:!0}),P=s(t,"META",{name:!0,content:!0}),_=s(t,"LINK",{rel:!0,href:!0});for(let l=0;l<d.length;l+=1)d[l].l(t);S=z(),t.forEach(r),this.h()},h(){e(h,"name","description"),e(h,"content",c[1]),e(u,"name","author"),e(u,"content","The Pudding"),e(p,"name","news_keywords"),e(p,"content",c[3]),e(f,"property","og:title"),e(f,"content",c[0]),e(w,"property","og:site_name"),e(w,"content","The Pudding"),e(g,"property","og:url"),e(g,"content",c[2]),e(m,"property","og:description"),e(m,"content",c[1]),e(T,"property","og:type"),e(T,"content","article"),e(E,"property","og:locale"),e(E,"content","en_US"),e(y,"property","og:image"),e(y,"content",N=c[2]+"/assets/social-facebook.jpg"),e(M,"property","og:image:type"),e(M,"content","image/jpeg"),e(A,"property","og:image:width"),e(A,"content","1200"),e(W,"property","og:image:height"),e(W,"content","600"),e(j,"name","twitter:card"),e(j,"content","summary_large_image"),e(q,"name","twitter:site"),e(q,"content","https://pudding.cool"),e(F,"name","twitter:creator"),e(F,"content","@puddingviz"),e(b,"name","twitter:title"),e(b,"content",c[0]),e(k,"name","twitter:description"),e(k,"content",c[1]),e(v,"name","twitter:image:src"),e(v,"content",x=c[2]+"/assets/social-twitter.jpg"),e(P,"name","robots"),e(P,"content","max-image-preview:large"),e(_,"rel","canonical"),e(_,"href",D=c[2]+"/")},m(o,t){a(document.head,h),a(document.head,u),a(document.head,p),a(document.head,f),a(document.head,w),a(document.head,g),a(document.head,m),a(document.head,T),a(document.head,E),a(document.head,y),a(document.head,M),a(document.head,A),a(document.head,W),a(document.head,j),a(document.head,q),a(document.head,F),a(document.head,b),a(document.head,k),a(document.head,v),a(document.head,P),a(document.head,_);for(let l=0;l<d.length;l+=1)d[l]&&d[l].m(document.head,null);a(document.head,S)},p(o,[t]){if(t&1&&n!==(n=o[0])&&(document.title=n),t&2&&e(h,"content",o[1]),t&8&&e(p,"content",o[3]),t&1&&e(f,"content",o[0]),t&4&&e(g,"content",o[2]),t&2&&e(m,"content",o[1]),t&4&&N!==(N=o[2]+"/assets/social-facebook.jpg")&&e(y,"content",N),t&1&&e(b,"content",o[0]),t&2&&e(k,"content",o[1]),t&4&&x!==(x=o[2]+"/assets/social-twitter.jpg")&&e(v,"content",x),t&4&&D!==(D=o[2]+"/")&&e(_,"href",D),t&16){C=O(o[4]);let l;for(l=0;l<C.length;l+=1){const I=K(o,C,l);d[l]?d[l].p(I,t):(d[l]=Y(I),d[l].c(),d[l].m(S.parentNode,S))}for(;l<d.length;l+=1)d[l].d(1);d.length=C.length}},i:H,o:H,d(o){r(h),r(u),r(p),r(f),r(w),r(g),r(m),r(T),r(E),r(y),r(M),r(A),r(W),r(j),r(q),r(F),r(b),r(k),r(v),r(P),r(_),L(d,o),r(S)}}}function Q(c,n,h){let{title:u="Title TK"}=n,{description:p="Description TK"}=n,{url:f="https://pudding.cool"}=n,{keywords:w=""}=n,{preloadFont:g=[]}=n;return c.$$set=m=>{"title"in m&&h(0,u=m.title),"description"in m&&h(1,p=m.description),"url"in m&&h(2,f=m.url),"keywords"in m&&h(3,w=m.keywords),"preloadFont"in m&&h(4,g=m.preloadFont)},[u,p,f,w,g]}class be extends B{constructor(n){super(),U(this,n,Q,V,G,{title:0,description:1,url:2,keywords:3,preloadFont:4})}}const X="https://pudding.cool/projects/flipbook",Z="The Flipbook Experiment",$="The results of making a crowd-sourced flipbook animation.",ee="The<br>Flipbook<br>Experiment",te="Help draw <strong>the longest flipbook animation</strong> ever. It’s like the telephone game, but visual.",oe=[{type:"text",value:"For a few weeks in the Spring of 2024, readers took turns tracing the previous person’s drawing to make a flipbook-style animation. The result was <strong>22,454 drawings.</strong>"},{type:"img",value:{src:"demo.png",alt:"Screenshot of the tracing interface"}},{type:"text",value:"We set out with a singular focus; make the longest collaborative flipbook animation ever. We ended up creating 25 different animations. The initial experiment ran for the majority of the period, resulting in an eight-minute video composed of 5,760 drawings. Watch it below."},{type:"video",value:{src:"rYtYV8HqwpE",alt:"The longest collaborative flipbook animation"}},{type:"text",value:"The second experiment involved creating a 30-second animation, repeated four times with the same starting image, to compare how they evolved. We did this for six different starting images (24 total animations). You can scrub through frame-by-frame results below."},{type:"component",value:"Scrub"},{type:"text",value:"But wait, there’s more! We ran a secret experiment in an attempt to observe the <a href=https://en.wikipedia.org/wiki/Online_disinhibition_effect target=_blank rel=noreferrer>online disinhibition effect</a>. Our theory: people would be more inclined to draw inappropriate images (i.e., penises) with no personal information attached to their submissions. Why? Without fail, any free-form drawing project on the internet yields phallic imagery. Despite our best algorithmic efforts to thwart these from surfacing, you will still notice two  exemplary moments if you watch the video above closely. We wanted to quantify this tendency."},{type:"text",value:"To test the effect, people were asked to add their name for recognition or get notified when the flipbook results were ready. We split the group in two; half were prompted to draw a circle confirming they were a human before being asked for their information (name, phone number, or email), the other half were prompted to draw after we had their info."},{type:"text",value:"The results were…surprisingly mild. We had <strong>5,899 participants;</strong> 3,308 submitted a drawing before giving their information, and 2,591 after. The results for both groups were similar. Our conclusion was that most likely the experiment was flawed. Regardless of the order of the prompts, people knew personal information was about to be collected. While the disinhibition effect wasn’t significant, the lack of subversiveness in general was quite surprising. Despite accepting all forms of drawing attempts, <strong>99.2% of people still adhered to the prompt</strong> by attempting a proper circle."},{type:"img",value:{src:"circles.png",alt:"a selection of circles from the secret experiment"}},{type:"text",value:"Our small rebellious group yielded a meager <strong>four probable penises,</strong> some non-circle geometric shapes, hearts, flowers, human figures, and various other doodles."},{type:"img",value:{src:"subvert.png",alt:"a selection of non-circles from the secret experiment"}},{type:"text",value:"That’s all for the recap. If you want to go deeper about what it all means and learn about other aspects of the experiments, check out the deep-dive conversation our team had reviewing the results."}],ne="Thanks for helping! Please spread the word to get others to contribute.",re="Thanks for helping!",ae="Get added to the credits and/or notified when the flipbook is done.",ie="Get notified when the flipbook is done.",se="We have some other flipbooks going. Want to help?",le="Or let others know about this experiment.",ce="Copy link and share",he="Check out some other stories by <a href=https://pudding.cool target=_blank rel=noreferrer>The Pudding</a> or support us on <a href=https://www.patreon.com/thepudding target=_blank rel=noreferrer>Patreon</a>.",ue="have been drawn.",me={task:"to the best of your ability, please trace the <mark><strong>last person’s drawing</strong></mark> below.",note:"Make one continuous line.",ink:"You have limited ink.",warningSummary:"may contain offensive images",warningDetails:"This project features real-time drawings that are mostly unmoderated from random internet people like you. While we have algorithmic checks in place to mitigate offensive material, nothing is perfect!"},de={prompt:"Just two quick steps",credit:"How do you want to be credited?",notify:"How do you want to be notified?",issue:"There was an issue. Please try again later.",message:"Phone/email will be deleted after we message you.",humanLabel:"Are you a human?",humanPrompt:"Prove it. Draw a circle.",humanReview:"Eh, good enough."},pe=[{q:"Why?",a:"This is essentially an experiment in <a href=https://en.wikipedia.org/wiki/Generation_loss target=_blank rel=noreferrer>generation loss</a>; how will the original drawing mutate as it is traced by more and more people?"},{q:"Who made this?",a:"<a href=https://pudding.cool/author/russell-samora target=_blank rel=no_referrer>Russell Samora</a> with assists from <a href=https://pudding.cool/author/alvin-chang target=_blank rel=no_referrer>Alvin Chang</a> and <a href=https://pudding.cool/author/jan-diehm target=_blank rel=no_referrer>Jan Diehm</a>. Send an email to russell@pudding.cool with questions or issues."},{q:"Will this really be the longest collaborative animation ever?",a:"There have been many crowd-sourced projects where people draw random sections of an animation (e.g., <a href=https://www.aaronkoblin.com/project/johnny-cash-project/ target=_blank rel=noreferrer>Johnny Cash Project</a>, <a href=https://thefreemovie.buzz/ target=_blank rel=noreferrer>The Free Movie</a>) where contributions can be done synchronously. This is different because frames are drawn in succession, dependent on the previous one. In that sense, I like our odds."},{q:"Accessibility statement",a:"We try to make our projects accessible to as many people as possible. However, this project relies on visual input and hand-eye coordination to accurately trace drawings, so it  can’t be used by individuals who are blind or have serious visual impairments. We recognize this limitation and understand that it may not be accessible to everyone. We apologize for any exclusion this may cause and appreciate your understanding."}],fe="make one continuous line.",ke={url:X,title:Z,description:$,hed:ee,sub:te,recap:oe,exhausted:ne,submitted:re,signup:ae,signupNoCredit:ie,other:se,share:le,spread:ce,recirc:he,statsFrames:ue,draw:me,join:de,faq:pe,playgroundNote:fe};export{be as M,ke as c};
