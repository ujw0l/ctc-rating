(()=>{"use strict";class t{constructor(t){null!=t&&this.createOverlay(t)}createOverlay(t){let e=window.innerWidth+1,r=window.innerHeight+1,i=null!=t.containerHt?t.containerHt:500,a=null!=t.containerWd?t.containerWd:650,o=this.getOptimizedElSize(window.innerWidth,window.innerHeight,a,i),n=document.createElement("style");n.id="ctc-scroll-css",n.innerHTML="::-webkit-scrollbar-track {background: rgba(255, 255, 255, 1);} ::-moz-scrollbar-track { background: rgba(255, 255, 255, 1);} #gal-sidebar::-webkit-scrollbar {display: none;} #gal-sidebar::-moz-scrollbar {display: none;}",document.querySelector("head").appendChild(n),document.body.style.overflow="hidden";let l=document.createElement("div");l.id="js-modal-overlay",l.style=`position:fixed;height:${r}px;width:${e}px;background-color:rgba(0,0,0,.6);z-index:100000;top:0%;left:0%;right:0%;bottom:0%;`;let d=document.createElement("div");d.id="js-modal-el-container",d.style=`overflow:auto;border:1px solid rgba(0,0,0,1);left:${(e-5-o.width)/2}px;top:${(r-o.height)/2}px;width:${o.width}px;height:${o.height}px;position:absolute;float:left;background-color:rgba(255,255,255,1);`,l.appendChild(d);let s=document.createElement("span");s.id="overlay-close-btn",s.title="Close",s.innerHTML="&#10539;",s.style=`line-height:1.5;text-align:center;position:absolute;width:30px;height:30px;cursor:pointer;top:${(r-o.height)/2-25}px;left:${(e-o.width)/2+o.width-8}px;font-size:20px;color:rgba(255,255,255,1);text-shadow:-1px -1px 1px rgba(0,0,0,1);z-index:100000;`,l.appendChild(s),s.addEventListener("click",(()=>{document.body.removeChild(l),document.querySelector("head").removeChild(n)})),null!=t.elContent?(d.innerHTML=t.elContent,document.body.insertBefore(l,document.body.firstChild)):null!=t.imgGallery?this.loadGallery(l,s,d,t,[o.height,o.width]):null!=t.iframeUrl?(d.innerHTML=`<iframe height="${o.height}" width="${o.width}" frameBorder= "0"   src="${t.iframeUrl}" ></iframe>`,document.body.insertBefore(l,document.body.firstChild)):(l.appendChild(d),this.ajaxContent(d,t,[o.height,o.width]),document.body.insertBefore(l,document.body.firstChild)),window.addEventListener("resize",(()=>this.adjustOverlay(l,d,s,[i,a])))}adjustOverlay(t,e,r,i){let a=window.innerWidth+1,o=window.innerHeight+1,n=(e.querySelector("#content-loading"),t.querySelector("#img-loading")),l=this.getOptimizedElSize(window.innerWidth,window.innerHeight,i[1],i[0]);t.style.width=a+"px",t.style.height=o+"px",r.style.left=(a-l.width)/2+l.width-8+"px",r.style.top=(o-l.height)/2-25+"px";let d=e.querySelector("img");if(null!=d){let t=parseInt(d.getAttribute("data-img-count")),r=e.querySelector("#img-title"),i=new Image;i.src=d.src;let a=this.getOptimizedElSize(l.width-60,l.height-60,i.width,i.height,1),o=1<t?(l.width-a.width)/2-26:(l.width-a.width)/2;d.style.height=a.height+"px",d.style.width=a.width+"px",d.style.marginLeft=o+"px",d.style.marginTop=(l.height-a.height)/2+"px",r.style.marginTop=l.height-25+"px",r.style.width=l.width+"px",2<=t&&(e.querySelector("#next-btn").style.marginTop=(l.height-25)/2+"px",e.querySelector("#prev-btn").style.marginTop=(l.height-25)/2+"px")}e.style.left=(a-5-l.width)/2+"px",e.style.top=(o-l.height)/2+"px",e.style.height=l.height+"px",e.style.width=l.width+"px",null!=n&&(n.style.marginTop=(window.innerHeight-46)/2+"px",n.style.marginLeft=(window.innerWidth-46)/2+"px")}ajaxContent(t,e,r){let i=null!=e.ajaxMethod?e.ajaxMethod.toUpperCase():"GET",a=null!=e.ajaxData?e.ajaxData:"",o=t.querySelector("#content-loading");if(null==o){o=document.createElement("div"),o.id="content-loading",o.style=`margin-left:${(r[1]-46)/2}px;margin-top:${(r[0]-46)/2}px;height:40px;width:40px;border-radius:50%;border-color:rgba(0,0,0,1);border-style: solid; border-width: 3px;z-index:1100; `,o.setAttribute("data-wait","left"),t.appendChild(o);var n=setInterval((()=>{switch(o.getAttribute("data-wait")){case"left":o.setAttribute("data-wait","top"),o.style.borderColor="rgba(0,0,0,0.5)",o.style.borderTop="3px solid  rgba(0,0,0,1)";break;case"top":o.setAttribute("data-wait","right"),o.style.borderColor="rgba(0,0,0,0.5)",o.style.borderRight="3px solid  rgba(0,0,0,1)";break;case"right":o.setAttribute("data-wait","bottom"),o.style.borderColor="rgba(0,0,0,0.5)",o.style.borderBottom="3px solid  rgba(0,0,0,1)";break;case"bottom":o.setAttribute("data-wait","left"),o.style.borderColor="rgba(0,0,0,0.5)",o.style.borderLeft="3px solid  rgba(0,0,0,1)"}}),400)}var l=new XMLHttpRequest;l.open(i,e.ajaxUrl,!0),l.responseType="text",l.setRequestHeader("Content-Type","application/x-www-form-urlencoded;"),l.addEventListener("load",(e=>{e.target.status>=200&&e.target.status<400?(clearInterval(n),t.innerHTML=e.target.response):console.log(e.target.statusText)})),l.send(a)}loadGallery(t,e,r,i,a){Array.from(document.querySelectorAll(i.imgGallery)).forEach(((i,a)=>{let o=Array.from(i.querySelectorAll("img"));o.forEach(((i,a)=>{i.addEventListener("click",(n=>{null==document.querySelector("#js-modal-overlay")&&document.body.insertBefore(t,document.body.firstChild),this.loadImg(t,e,r,i,a,o,[r.offsetHeight,r.offsetWidth])}))}))}))}loadImg(t,e,r,i,a,o,n){let l=o.length-1>a?a+1:0,d=0<a?a-1:o.length-1,s=1<o.length?`<font style="font-size:11px;" > (${a+1}/${o.length})</font>`:"",u=0<i.title.length?i.title+s:""+s;e.style.display="none",r.style.display="none";let c=new Image;if(c.setAttribute("data-img-count",o.length),c.src=i.src,null==r.querySelector("#img-title")){let t=document.createElement("span");t.id="img-title",t.style=`overflow:auto;font-size:15px;color:rgba(0,0,0,1);line-height:1.5;font-family:'Courier New', Courier, monospace;text-align:center;position:absolute;left:0px;height:25px;width:${.97*n[1]}px;margin-top:${.98*n[0]-25}px;z-index:100;`,t.innerHTML=u,r.appendChild(t)}else r.querySelector("#img-title").innerHTML=u;if(2<=o.length){if(null==r.querySelector("#prev-btn")){let i=document.createElement("span");i.id="prev-btn",i.title="Previous Image",i.innerHTML="<",i.setAttribute("data-img-num",d),i.style=`color:rgba(0,0,0,1);border:1px solid rgba(0,0,0,1);font-size:20px;cursor:pointer;font-family:'Courier New', Courier, monospace;text-align:center;line-height: 1.1;margin-left:2px;margin-top:${(n[0]-25)/2}px;width:20px;height:20px;float:left;z-index:100;`,i.addEventListener("mouseover",(t=>t.target.style.boxShadow="1px 1px 5px 1px rgba(0,0,0,1)")),i.addEventListener("mouseleave",(t=>t.target.style.boxShadow="")),i.addEventListener("click",(i=>this.loadImg(t,e,r,o[parseInt(i.target.getAttribute("data-img-num"))],parseInt(i.target.getAttribute("data-img-num")),o,[r.offsetHeight,r.offsetWidth]))),r.appendChild(i)}else r.querySelector("#prev-btn").setAttribute("data-img-num",d);if(null==r.querySelector("#next-btn")){let i=document.createElement("span");i.id="next-btn",i.innerHTML=">",i.title="Next Image",i.style=`color:rgba(0,0,0,1);border:1px solid rgba(0,0,0,1);font-size:20px;cursor:pointer;font-family:'Courier New', Courier, monospace;text-align:center;line-height: 1.1;margin-right:2px;margin-top:${(n[0]-25)/2}px;width:20px;height:20px;float:right;z-index:100;`,i.setAttribute("data-img-num",l),i.addEventListener("mouseover",(t=>t.target.style.boxShadow="1px 1px 5px 1px rgba(0,0,0,1)")),i.addEventListener("mouseleave",(t=>t.target.style.boxShadow="")),i.addEventListener("click",(i=>this.loadImg(t,e,r,o[parseInt(i.target.getAttribute("data-img-num"))],parseInt(i.target.getAttribute("data-img-num")),o,[r.offsetHeight,r.offsetWidth]))),r.appendChild(i)}else r.querySelector("#next-btn").setAttribute("data-img-num",l)}null!=r.querySelector("img")&&r.removeChild(r.querySelector("img"));let h=r.querySelector("#content-loading");if(null==h){h=document.createElement("div"),h.id="img-loading",h.style=`display:inline-block;float:left;position:relative;margin-left:${(window.innerWidth-46)/2}px;margin-top:${(window.innerHeight-46)/2}px;height:40px;width:40px;border-radius:50%;border-color:rgba(255,255,255,1);border-style: solid; border-width: 3px;z-index:1100; `,h.setAttribute("data-wait","left"),t.appendChild(h);var p=setInterval((()=>{switch(h.getAttribute("data-wait")){case"left":h.setAttribute("data-wait","top"),h.style.borderColor="rgba(255,255,255,1)",h.style.borderTop="3px solid  rgba(0,0,0,1)";break;case"top":h.setAttribute("data-wait","right"),h.style.borderColor="rgba(255,255,255,1)",h.style.borderRight="3px solid  rgba(0,0,0,1)";break;case"right":h.setAttribute("data-wait","bottom"),h.style.borderColor="rgba(255,255,255,1)",h.style.borderBottom="3px solid  rgba(0,0,0,1)";break;case"bottom":h.setAttribute("data-wait","left"),h.style.borderColor="rgba(255,255,255,1)",h.style.borderLeft="3px solid  rgba(0,0,0,1)"}}),400)}c.addEventListener("load",(i=>{t.removeChild(h),clearInterval(p),e.style.display="",r.style.display="";let a=this.getOptimizedElSize(n[1]-80,n[0]-60,i.target.width,i.target.height,.995),l=1<o.length?(n[1]-a.width)/2-26:(n[1]-a.width)/2;i.target.style=`position:relative;border:1px solid rgba(0,0,0,1);float:left;height:${a.height}px;width:${a.width}px;margin-left:${l}px;margin-top:${(n[0]-a.height)/2}px;`,r.appendChild(i.target)}))}getOptimizedElSize(t,e,r,i,a){let o=0,n=0,l=0,d=0,s=null!=a?a:.9,u=1-s;if(r>=t&&i>=e)r>=i?r>i?(n=r/t,d=r/n-u*t,l=i*(d/r),l>=s*e&&(o=e/i,l=i*o-u*e,d=r*(l/i))):t>e?(l=s*e,d=l):e>t?(d=s*t,l=d):(o=e/i,l=i*o-u*e,d=r*(l/i)):(o=i/e,l=i/o-u*e,d=r*(l/i));else if(r>=t&&i<e)n=t/r,d=r*n-u*t,l=i*(d/r);else if(i>=e&&r<t)o=e/i,l=i*o-u*e,d=r*(l/i),l=i*(d/r);else{let a=s*t,n=s*e;r>=a&&i>=n?(d=a*(a/r),l=e*o):r>=a&&i<n?(d=r*(a/r),l=i*(d/r)):i>=n&&r<a?(l=i*(n/i),d=r*(l/i)):(d=r,l=i),l=i*(d/r)}return d>s*t&&(d=s*t,l=i*(d/r)),{width:d,height:l}}}window.addEventListener("DOMContentLoaded",(()=>{const e=new t;let r=document.querySelector(".ctcItemRating"),i=JSON.parse(r.getAttribute("data-ctcr-param"));const a=(t,e)=>{let r,i,a,n;switch(e){case"thumbsUp":r=document.querySelector("#ctcThumbUpCount-"+t),a=parseInt(r.getAttribute("data-type-thumupcount"))+1,r.innerHTML=o(a),r.setAttribute("data-type-thumupcount",a);break;case"thumbsDown":i=document.querySelector("#ctcThumbDownCount-"+t),n=parseInt(i.getAttribute("data-type-thumdowncount"))+1,i.innerHTML=o(n),i.setAttribute("data-type-thumdowncount",n);break;case"thumbsUpReversed":r=document.querySelector("#ctcThumbUpCount-"+t),i=document.querySelector("#ctcThumbDownCount-"+t),a=parseInt(r.getAttribute("data-type-thumupcount"))-1,n=parseInt(i.getAttribute("data-type-thumdowncount"))+1,r.innerHTML=o(a),r.setAttribute("data-type-thumupcount",a),i.innerHTML=o(n),i.setAttribute("data-type-thumdowncount",n);break;case"thumbsDownReversed":r=document.querySelector("#ctcThumbUpCount-"+t),i=document.querySelector("#ctcThumbDownCount-"+t),a=parseInt(r.getAttribute("data-type-thumupcount"))+1,n=parseInt(i.getAttribute("data-type-thumdowncount"))-1,r.innerHTML=o(a),r.setAttribute("data-type-thumupcount",a),i.innerHTML=o(n),i.setAttribute("data-type-thumdowncount",n);break;case"unThumbsUp":r=document.querySelector("#ctcThumbUpCount-"+t),a=parseInt(r.getAttribute("data-type-thumupcount"))-1,r.innerHTML=o(a),r.setAttribute("data-type-thumupcount",a);break;case"unThumbsDown":i=document.querySelector("#ctcThumbDownCount-"+t),n=parseInt(i.getAttribute("data-type-thumdowncount"))-1,i.innerHTML=o(n),i.setAttribute("data-type-thumdowncount",n)}},o=t=>{let e=[],r="",i="";e=(t+="").split("."),r=e[0],i=e.length>1?"."+e[1]:"";for(var a=/(\d+)(\d{3})/;a.test(r);)r=r.replace(a,"$1,$2");return r+i};Array.from(document.querySelectorAll([".ctcThumbUp",".ctcThumbDown",".ctcUserThumbUp",".ctcUserThumbDown"])).map((t=>t.addEventListener("click",(t=>(t=>{let e=t.getAttribute("data-type-id"),r="action=ctcUserRating&rating_data="+JSON.stringify({postId:e,ratingType:t.getAttribute("data-type-rating")});var o=new XMLHttpRequest;o.open("POST",i.ctcRatingAjaxUrl,!0),o.responseType="text",o.setRequestHeader("Content-Type","application/x-www-form-urlencoded;"),o.addEventListener("load",(r=>{if(!(r.target.status>=200&&r.target.status<400))return!1;"notLoggedIn"==r.target.response?alert(i.notLoggedIn):((t,e,r)=>{let o,n=r.getAttribute("data-type-scenario");switch(t){case"thumbsUp":r.title=i.alreadyThumbedUp,r.classList.remove("ctcThumbDown"),r.classList.add("ctcUserThumbUp"),a(e,"thumbsUp");break;case"thumbsDown":r.title=i.alreadyThumbedDown,r.classList.remove("ctcThumbUp"),r.classList.add("ctcUserThumbDown"),r.style.fontSize="25px",a(e,"thumbsDown");break;case"thumbsUpReversed":r.title=i.alreadyThumbedDown,r.classList.add("ctcUserThumbDown"),r.style.fontSize="25px",o=document.querySelector("#ctcThumbUp-"+e),o.title=i.thumbUp,o.classList.remove("ctcUserThumbUp"),o.classList.add("ctcThumbUp"),o.style.fontSize="20px",a(e,"thumbsUpReversed");break;case"thumbsDownReversed":r.title=i.alreadyThumbedUp,r.classList.remove("ctcThumbUp"),r.classList.add("ctcUserThumbUp"),r.style.fontSize="25px",o=document.querySelector("#ctcThumbDown-"+e),o.title=i.thumbDown,o.classList.remove("ctcUserThumbDown"),o.classList.add("ctcThumbDown"),o.style.fontSize="20px",a(e,"thumbsDownReversed",n);break;case"unThumbsUp":r.title=i.thumbUp,r.classList.remove("ctcUserThumbUp"),r.classList.add("ctcThumbUp"),r.style.fontSize="20px",a(e,"unThumbsUp");break;case"unThumbsDown":r.title=i.thumbDown,r.classList.remove("ctcUserThumbDown"),r.classList.add("ctcThumbDown"),r.style.fontSize="20px",a(e,"unThumbsDown")}})(r.target.response,e,t)})),o.send(r)})(t.target))))),Array.from(document.querySelectorAll(".ctcThumbsUpStat,.ctcThumbsDownStat")).map((t=>t.addEventListener("click",(t=>{var r;"0"!=("thumb-up-count"==t.target.getAttribute("data-get")?t.target.getAttribute("data-type-thumupcount"):t.target.getAttribute("data-type-thumdowncount"))&&(r=t.target,e.createOverlay({ajaxUrl:i.ctcRatingAjaxUrl,ajaxData:"action=ctcGetUsers&post_id="+r.getAttribute("data-post-id")+"&user_to_get="+r.getAttribute("data-get"),ajaxMethod:"POST",containerHt:350,containerWd:200}))}))))}))})();