import{A as o}from"./config-XSboSa-d.js";feather.replace();let h,b,g;var f,m=!1;const L=async(i,s)=>{const t=f.filter(l=>l.hallName===i),e=[];t[0].reservations&&t[0].reservations.forEach(l=>e.push(l.reservedOn.split("-").reverse().join("-")));let a=[];const r={altInput:!0,minDate:"today",maxDate:new Date().fp_incr(15),inline:!0,dateFormat:"d-m-Y",onChange:(l,p,j)=>{a=[],console.log(p),m=l.length>0,p.includes(",")?(a=p.split(", "),a=a.map(c=>c.split("-").reverse().join("-").trim())):a.push(p.split("-").reverse().join("-").trim());const u=document.getElementById("login-btn");if(s){async function c(){await fetch(o+"/managementprebook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({EMAIL:y,HALL:h,SEATS:g,DATES:a}),credentials:"include"}).then(v=>{v.status===200&&u.setAttribute("href","/managementbook/")})}c()}else{b=a[0];async function c(){await fetch(o+"/prebook",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({EMAIL:y,HALL:h,SEATS:g,DATE:b}),credentials:"include"}).then(v=>{v.status===200&&u.setAttribute("href","/book/")})}c()}t[0].isAvailable&&m?u.classList.remove("disabled"):u.classList.add("disabled")}};s?(r.mode="multiple",delete r.maxDate):r.disable=e,flatpickr("#calendar",r)};window.addEventListener("DOMContentLoaded",async()=>{const i=window.location.search,s=i.slice(1,i.length),t=decodeURIComponent(s);try{f=await(await fetch(o+"/venues",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hallName:t}),credentials:"include"})).json(),console.log(f),$(f)}catch(e){console.error("Error fetching venue data:",e)}});function $(i){document.querySelector(".cards-container"),i.forEach(s=>{w+=`<div class="hall-card">
            <div class="hall-img">
                <img src="${s.imgUrl}" alt="${s.hallName}">
            </div>
            <div class="hall-info ff-inter">
                <div class="hall-name-star">
                    <h3 class="hall-name"> ${s.hallName} </h3>
                    <h3 class="hall-rating">⭐ ${s.rating}</h3>
                </div>
                <p>Seating Capacity: ${s.seatingCapacity}</p>
                <p>${s.location}</p>
            </div>
            <a href="#" class="butt-main details-btn ff-inter fs-s" data-venue="${s.hallName}" style="letter-spacing:1px;">DETAILS</a>
        </div>
`}),N.innerHTML=`<div class="overlay overlay-hidden"></div>
    <div class="popup-modal-wrapper popup-hidden"></div>`+w,document.querySelectorAll(".details-btn").forEach(s=>{s.addEventListener("click",t=>{t.preventDefault(),e();async function e(){await fetch(o+"/profile",{credentials:"include",headers:{"Content-Type":"application/json"}}).then(a=>{a.status===401&&(location.href="/login/")})}A(t.target.dataset.venue)})})}const E=document.querySelector(".user-menu"),N=document.querySelector(".cards-container");document.querySelector(".user-nav").addEventListener("click",i=>{E.classList.toggle("user-menu-hidden")});var w="",d,S;function A(i){d=document.querySelector(".popup-modal-wrapper"),S=document.querySelector(".overlay"),screen.width<=500&&document.body.classList.toggle("body-noscroll"),S.classList.toggle("overlay-hidden"),d.classList.toggle("popup-hidden"),d.innerHTML="",d.classList.contains("popup-hidden")||T(i)}let n,k,y;C();async function C(){if(n=await(await fetch(o+"/profile",{credentials:"include",headers:{"Content-Type":"application/json"}})).json(),k=n.name,y=n.email,n.blockStatus){location.href="/block/";return}else if(n){let s;n.role=="MANAGEMENT"?s='<a class="ff-inter fs-2s user-menu-link" href="/management/">Profile</a>':n.role=="USER"?s='<a class="ff-inter fs-2s user-menu-link" href="/profile/">Profile</a>':n.role=="ADMIN"?location.href="/admin/":location.href="/login/";const t=document.querySelector(".user-menu");t.innerHTML=`
        <h3 class="ff-inter">Welcome, ${k}</h3>
        ${s}
        <a class="ff-inter fs-2s user-menu-link" href="/contactus/">Contact</a>
        <a class="ff-inter fs-2s user-menu-link log-out"  style="color:red; font-weight:bold; cursor:pointer;">Log out</a>
        `,document.querySelector(".log-out").addEventListener("click",async e=>{const a=await fetch(o+"/logout",{credentials:"include",headers:{"Content-Type":"application/json"}}),r=await a.json();console.log(a,r),a.status==200&&(location.href="/login/")})}}function T(i){m=!1;const t=f.filter(e=>e.hallName===i).map(e=>(h=e.hallName,g=e.seatingCapacity,`
            <div class="close-btn-wrapper">
                <a href="#" class="close-btn ff-inter fs-2s fw-500"><i data-feather="x"></i></a></div>
                <div class="popup-modal">
                    <div class="swiper">
                        <div class="swiper-wrapper">
                        ${e.carouselPics.map(a=>`<div class="swiper-slide"><img src="${a}"></div>`).join(`
`)}
                        <div class="swiper-slide"><img src="/images/sigma1.jpeg"></div>
                        <div class="swiper-slide"><img src="/images/sigma2.jpeg"></div>
                        <div class="swiper-slide"><img src="/images/sigma3.jpeg"></div>
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-pagination"></div>
                    </div>
    
                    <div class="popup-details">
                        <div class="venue-info">
                            <h2 class="ff-inter fw-600">${e.hallName}, ${e.campus}</h2>
                            <hr class="hr-venue"/>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Number of seats: ${e.seatingCapacity}</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Has AC? ${e.hasAC?"Yes":"No"}</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Is projector available? ${e.projectorAvailable?"Yes":"No"}</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Is the hall reserved? ${e.isReserved?"Yes":"No"}</p>
                            ${e.isReserved?`<p class="ff-inter fs-2s"><i data-feather="info"></i> Hall reserved by: ${e.reservedBy}</p>`:""}
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Distance from main gate: ${e.distFromGate}</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Location: ${e.location}</p>
                        </div>
                        <div class="venue-calendar ff-inter">
                            <input id="calendar" type="text" placeholder="Select a date">
                            <p class="ff-inter fs-2s"><strong>NOTE</strong>: If dates cannot be selected then they are already reserved</p>
                        </div>
                        <div class="venue-card">
                        <div class="venue-card-details">
                            <!--hall is commonly available for everyone to book ahillaya nu oru field-->
                            <div>
                                ${e.isAvailable?`<i data-feather="check-circle"></i>
                                <p class="ff-inter fs-2s">This hall is in working condition to reserve.</p>`:`<i data-feather="x-circle"></i>
                                <p class="ff-inter fs-2s">This hall is not in working condition to reserve.</p>`}
                                ${e.isAvailable?`<br><p class="ff-inter fs-s fw-600">Select a date to enable Book Button</p> <p class="ff-inter fs-s" style="margin-top:1rem;">Proceed to book as ${n.name} to confirm time, by clicking the button below</p>`:'<p class="ff-inter fs-s" style="margin-top:1rem;">Contact admin for further help</p>'}
                            </div>
                        </div>
                        <a id="login-btn" href="#" class="ff-inter butt-main sign-in fs-s ${e.isAvailable&&m?"":"disabled"}" >Book Now</a>
                    </div>
                    
                </div>
            </div>
        `)).join("");d.innerHTML=t,feather.replace(),document.querySelector(".close-btn").addEventListener("click",e=>{e.preventDefault(),A(" ")}),new Swiper(".swiper",{pagination:{el:".swiper-pagination",type:"progressbar"},loop:!0,navigation:{nextEl:".swiper-button-next",prevEl:".swiper-button-prev"}}),L(i,n.role=="MANAGEMENT")}localStorage.setItem("x",1);
