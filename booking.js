checkuseravailable();
async function checkuseravailable() {
  await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      "Content-Type": "application/json",
    },
  }).then((res) => {
    if (res.status === 401) {
      location.href = "/login/";
    }
  });
}

import { API_LOCAL } from "./config";

// });
let re,
  haLL,
  HALL,
  SEATS,
  DATE,
  startTime = new Date(),
  endTime = new Date(),
  pstartTime = new Date(),
  pendTime = new Date(),
  day,
  month,
  year;
feather.replace();
getprebook();
async function getprebook() {
  re = await fetch(API_LOCAL + "/getprebook", {
    credentials: "include", // Include cookies with the request
    headers: {
      "Content-Type": "application/json",
    },
  });
  haLL = await re.json();
  console.log(haLL);
  const hallName = haLL.HALL;
  const venue = await fetch(API_LOCAL + "/venues", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallName }),
      credentials: "include",
    });
    const data = await venue.json();
  console.log(data);
  if (re.status != 200) {
    //alert("Some error found in selecting hall.Please try again!");
    location.href = "/venues/";
  }
  //console.log(haLL);

  HALL = haLL.HALL;
  SEATS = haLL.SEATS;
  DATE = haLL.DATE;
  startTime = haLL.startTime;
  endTime = haLL.endTime;
  pstartTime = haLL.pstartTime;
  pendTime = haLL.pendTime;
  //console.log(startTime,endTime)
  //console.log(pstartTime,pendTime)
  for (let i = 0; i < pstartTime.length; i++) {
    // Create a new Date object from the dateTimeString
    let pdate = new Date(pstartTime[i]);
    // Get the time components
    let pstarthr = pdate.getUTCHours(); // Get the hours (0-23)
    let pstartmin = pdate.getUTCMinutes(); // Get the minutes (0-59)
    pdate = new Date(pendTime[i]);
    let pendhr = pdate.getUTCHours();
    let pendmin = pdate.getUTCMinutes();
    if (pstarthr > 12) {
      pstarthr -= 12;
    }
    if (pendhr > 12) {
      pendhr -= 12;
    }
    if (pendhr < pstarthr) {
      pendhr += 12;
    }
    //console.log(pstarthr,pendhr)
    for (let j = pstarthr; j <= pendhr; j++) {
      //console.log(j);
      if (j != 7) {
        const s30 = document.querySelector(`#s${j}`);
        // console.log(s30)
        s30.style.color = "#FEBE10";
        s30.style.fontWeight = "bold";
        s30.title = "Already requested by someone";
      }
      // console.log(j,j.length)
      const e30 = document.querySelector(`#e${j}`);
      // console.log(e30)
      e30.style.fontWeight = "bold";
      e30.style.color = "#FEBE10";
      e30.title = "Already requested by someone";

      if (j == 12) {
        j = 0;
        pendhr -= 12;
      }
    }
  }

  // console.log(HALL, SEATS, DATE,startTime,endTime);
  let x = [],
    y = [];
  for (let i = 0; i < startTime.length; i++) {
    // console.log(startTime[i],endTime[i]);

    // Create a new Date object from the dateTimeString
    let date = new Date(startTime[i]);

    // Get the time components
    let starthr = date.getUTCHours(); // Get the hours (0-23)
    let startmin = date.getUTCMinutes(); // Get the minutes (0-59)
    date = new Date(endTime[i]);
    let endhr = date.getUTCHours();
    let endmin = date.getUTCMinutes();
    if (starthr > 12) {
      starthr -= 12;
    }
    if (endhr > 12) {
      endhr -= 12;
    }
    x.push(endhr);
    y.push(starthr);
    // console.log(starthr,startmin,endhr,endmin);
    if (endmin == 0) {
      endhr -= 1;
    }
    // console.log(starthr,endhr);
    if (endhr < starthr) {
      endhr += 12;
    }
    for (let j = starthr; j <= endhr; j++) {
      const s30 = document.querySelector(`#s${j}`);
      // console.log(s30)
      s30.disabled = true;
      s30.style.color = "#EF0107";
      s30.style.fontWeight = "bold";
      s30.title = "Already booked by someone";
      // console.log(j,j.length)
      const e30 = document.querySelector(`#e${j}`);
      // console.log(e30)
      e30.disabled = true;
      e30.style.fontWeight = "bold";
      e30.style.color = "#EF0107";
      e30.title = "Already booked by someone";

      if (j == 12) {
        j = 0;
        endhr -= 12;
      }
    }
  }

  var shourSelect = document.getElementById("start-time-hr");
  var ehourSelect = document.getElementById("end-time-hr");
  // console.log(ehourSelect.value ,"hiad")
  ehourSelect.addEventListener("change", function () {
    // Get the select elements for hours and AM/PM
    var eh = parseInt(document.getElementById("end-time-hr").value);
    var sh = parseInt(document.getElementById("start-time-hr").value);
    for (let i = 0; i < y.length; i++) {
      let z = y[i] < 9 ? y[i] + 12 : y[i];
      sh = sh < 9 ? sh + 12 : sh;
      eh = eh < 9 ? eh + 12 : eh;
      //console.log(sh,z,eh);
      if (z > sh && z < eh) {
        eh = z - 1 > 12 ? z - 13 : z - 1;
      }
    }
    document.getElementById("end-time-hr").value = eh > 12 ? eh - 12 : eh;
  });
  shourSelect.addEventListener("change", function () {
    // Get the select elements for hours and AM/PM
    var sh = parseInt(document.getElementById("start-time-hr").value);
    var sm = parseInt(document.getElementById("start-time-min").value);
    // console.log(eh)
    if (x.includes(parseInt(sh))) {
      document.getElementById("start-time-min").value = 30;
      const s0 = document.querySelector(`#s0`);
      // console.log(e30)
      s0.disabled = true;
      s0.style.fontWeight = "bold";
      s0.style.color = "#F08080";
    } else {
      s0.disabled = false;
      s0.style.fontWeight = "normal";
      s0.style.color = "#000";
    }

    for (let i = 0; i < y.length; i++) {
      let z = y[i] < 9 ? y[i] + 12 : y[i];
      sh = sh < 9 ? sh + 12 : sh;
      //console.log(z,sh);
      if (z == sh + 1) {
        const s30 = document.querySelector(`#s30`);
        // console.log(e30)
        s30.disabled = true;
        s30.style.fontWeight = "bold";
        s30.style.color = "#F08080";
      } else {
        s30.disabled = false;
        s30.style.fontWeight = "normal";
        s30.style.color = "#000";
      }
    }
  });
  document.querySelector(".hall-name").innerHTML = HALL;
  document
    .querySelector(".hall-image")
    .setAttribute("src", data.imgUrl);
  let date = new Date(DATE);

  // Get the year, month, and day
  year = date.getFullYear();
  month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad with leading zero if month is a single digit
  day = date.getDate().toString().padStart(2, "0");

  // Create the desired format
  let formattedDate = year + "-" + month + "-" + day;

  // Log the formatted date
  // console.log(formattedDate);
  document.querySelector("#date").value = formattedDate;
  document.querySelector(
    ".seats-needed"
  ).innerText = `Seats required (Max: ${SEATS}):*`;
  document.querySelector("#seats").setAttribute("max", SEATS);

  const userMenu = document.querySelector(".user-menu");
const userNav = document.querySelector(".user-nav");

userNav.addEventListener("click", (e) => {
  e.stopPropagation();
  userMenu.classList.toggle("user-menu-hidden");
});

document.addEventListener("click", (e) => {
  const isClickedInsideUserNav = userNav.contains(e.target);
  const isClickedInsideUserMenu = userMenu.contains(e.target);

  if (!isClickedInsideUserNav && !isClickedInsideUserMenu) {
    userMenu.classList.add("user-menu-hidden");
  }
});
  let response;
  getprofile();
  async function getprofile() {
    response = await fetch(API_LOCAL + "/profile", {
      credentials: "include", // Include cookies with the request
      headers: {
        "Content-Type": "application/json",
      },
    });
    const NAME = await response.json();
    if (NAME.blockStatus) {
      location.href = "/block/";
      return;
    }
    const Name = NAME.name;
    const Email = NAME.email;
    // console.log(Email);
    document.querySelector("#email").value = Email;
    document.querySelector("#name").value = Name;
    document.querySelector(".user-menu").addEventListener("click", (e) => {
      //e.stopPropagation();
      //e.preventDefault();
      userMenu.classList.toggle("user-menu-hidden");
    });

    if (NAME) {
      // Update the HTML of the user menu with the user's name
      const userMenu = document.querySelector(".user-menu");
      userMenu.innerHTML = `
  <h3 class="ff-inter">Welcome, ${Name}</h3>
  <a class="ff-inter fs-2s user-menu-link" href="/profile/">Profile</a>
  <a class="ff-inter fs-2s user-menu-link" href="/contactus/">Contact</a>
  <a class="ff-inter fs-2s user-menu-link log-out" href="/" style="color:red; font-weight:bold;">Log out</a>
    `;

      // Add a logout click event listener
      document.querySelector(".log-out").addEventListener("click", (event) => {
        //   event.preventDefault();
        // Perform the logout logic here, such as removing the user token or redirecting to the login page
        // Function to delete a cookie
        const logout = fetch(API_LOCAL + "/logout", {
          credentials: "include", // Include cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        });
        // sessionStorage.clear();
        // localStorage.clear();
        // window.history.pushState(null, '', window.location.href);
        // window.onpopstate = function () {
        //     window.history.pushState(null, '', window.location.href);
        // };
        //clears browser history and redirects url
        ClearHistory();
        function ClearHistory() {
          var backlen = history.length;
          history.go(-backlen);
          window.location.href = "/login/";
        }
        // location.href = "/login/";
      });
    }
  }
}
const msgBox = document.querySelector(".msg-box");
var msgContent = "";

// const submitBtn = document.querySelector(".submit");

// flatpickr("#start-time", {
//     enableTime: true,
//     noCalendar: true,
//     time_24hr: true,
//     minTime: "09:00",
//     maxTime: "18:00",
// });

// flatpickr("#end-time", {
//     enableTime: true,
//     noCalendar: true,
//     time_24hr: true,
//     minTime: "09:00",
//     maxTime: "18:00",
// });
let success = false;
const putMsg = (msg, success) => {
  msgBox.innerHTML = `<div style="display:flex; align-items: center; gap: 0.5rem; margin-bottom: 
    1rem;">${
      success
        ? '<i data-feather="check-circle"></i><p class="ff-inter fs-s fw-500">Booking was successful! Check your mail for confirmation:</p>'
        : '<i data-feather="x-circle"></i><p class="ff-inter fs-s fw-500">Something went wrong! Please try after some time or contact admin</p>'
    }
     </div>`;
  msgBox.innerHTML += `${msg}`;
  feather.replace();
  msgBox.classList.remove("msg-box-hidden");
  clearMsg();
};

const clearMsg = () => {
  setTimeout(() => {
    msgBox.classList.add("msg-box-hidden");
  }, 3000);
};

var confirmButton = document.getElementById("ConfirmButton");

confirmButton.addEventListener("click", async (e) => {
  e.preventDefault();
  let guestvalue = [];
  let jsonString = document.querySelector("#guest").value;
  // console.log(jsonString)
  if (jsonString.length != 0) {
    let jsonArray = JSON.parse(jsonString); // Convert string to array of objects
    // Iterate over the array and print the "value" key of each object
    for (let obj of jsonArray) {
      guestvalue.push(obj.value);
      // console.log(obj.value); // Prints "ji", "good", "bad"
    }
  }
  // console.log(guestvalue);
  confirmButton.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
  confirmButton.classList.add("disabled");
  let food = [];
  let shr = document.getElementById("start-time-hr").value;
  let smin = document.getElementById("start-time-min").value;
  let sampm = document.getElementById("start-time-ampm").value;
  let ehr = document.getElementById("end-time-hr").value;
  let emin = document.getElementById("end-time-min").value;
  let eampm = document.getElementById("end-time-ampm").value;
  let refreshmentfor = document.getElementById("Refreshments for").value;
  let refreshmenttype = document.getElementById("Type of Refreshments").value;
  let refreshment = document.querySelector("#refreshments").value;
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');

  //console.log(refreshmentfor,refreshmenttype,food,shr,smin,sampm,ehr,emin,eampm)
  if (refreshment == "no") {
    refreshmentfor = "-";
    refreshmenttype = "-";
    food = "-";
  } else {
    if (refreshmenttype == "Snacks") {
      food = "-";
    } else {
      checkboxes.forEach(function (checkbox) {
        if (checkbox.checked) {
          if (checkbox.id != "agree") food.push(checkbox.id);
        }
      });
    }
  }

  let starttime = new Date();
  shr = shr < 9 ? parseInt(shr) + 12 : shr;
  starttime.setUTCHours(shr, smin);
  let endtime = new Date();
  ehr = ehr < 9 ? parseInt(ehr) + 12 : ehr;
  endtime.setUTCHours(ehr, emin);

  // console.log(startTime, endTime);

  const submissionData = {
    hall: HALL,
    id: document.querySelector("#email").value,
    num: document.getElementById("num").value,
    start: starttime,
    end: endtime,
    eventname: document.querySelector("#eventname").value,
    //date: selectedDate.split("-").reverse().join("-"),
    //name: document.querySelector("#name").value,
    purpose: document.querySelector("#purpose").value,
    refreshment: refreshment, // + get the value from refreshments input and send POST request
    seats: document.querySelector("#seats").value,
    guest: guestvalue,
    refreshmentfor: refreshmentfor,
    refreshmenttype: refreshmenttype,
    food: food,
  };
  // console.log(submissionData);
  // console.log(count);
  book();
  async function book() {
    await fetch(API_LOCAL + "/book", {
      //mode: 'cors',
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(submissionData),
      credentials: "include",
    }).then((res) => {
      if (res.status === 200) {
        msgContent = `<p class="ff-inter fs-2s">Booking was confirmed! Check your email for details</p>`;
        //send mail with smtpJS after confirmation
        putMsg(msgContent, true);
        //console.log("True");
        setTimeout(() => {
          location.href = "/profile/";
        }, 1000);
      } else {
        //console.log("False");
        msgContent = `<p class="ff-inter fs-2s">Error in booking. Try again later!</p>`;
        putMsg(msgContent, false);
        setTimeout(() => {
          location.href = "/venues/";
        }, 1000);
      }
    });
  }
});
document.getElementById("bruh").addEventListener("submit", previewpopup);
document
  .getElementById("PreviewcloseButton")
  .addEventListener("click", closepreviewPopup);
var submitBtn = document.getElementById("Previewbutton");
var elementIds = [
  "agree",
  "additionalOption3",
  "additionalOption2",
  "additionalOption1",
  "refreshments",
  "purpose",
  "guest",
  "end-time-hr",
  "end-time-min",
  "end-time-ampm",
  "start-time-hr",
  "start-time-min",
  "start-time-ampm",
  "seats",
  "num",
];
var guestInput = document.querySelector(".guest");

// Loop through each ID and disable the corresponding element

function previewpopup(e) {
  e.preventDefault();
  submitBtn.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
  submitBtn.classList.add("disabled");
  // const formValues = new FormData();
  let shr = document
    .getElementById("start-time-hr")
    .value.toString()
    .padStart(2, "0");
  let smin = document
    .getElementById("start-time-min")
    .value.toString()
    .padStart(2, "0");
  let sampm = document.getElementById("start-time-ampm").value;
  let ehr = document
    .getElementById("end-time-hr")
    .value.toString()
    .padStart(2, "0");
  let emin = document
    .getElementById("end-time-min")
    .value.toString()
    .padStart(2, "0");
  let eampm = document.getElementById("end-time-ampm").value;
  //console.log(shr,smin,sampm,ehr,emin,eampm)
  // let number = document.getElementById("num").value.toString().trim();
  // let maximum = document.querySelector("#seats").value.toString().trim();
  // let purpose_= document.querySelector("#purpose").value.toString().trim();
  // console.log(shr,smin,sampm,ehr,emin,eampm,",",typeof number,",",maximum,",",purpose_,",");
  document.getElementById("popupName").innerText = HALL;
  document.getElementById("Date").innerText = day + "-" + month + "-" + year;
  document.getElementById("starttime").innerText = `${shr}-${smin}-${sampm}`;
  document.getElementById("endtime").innerText = `${ehr}-${emin}-${eampm}`;
  document.getElementById("eventName").innerText =
    document.querySelector("#eventname").value;
  document.getElementById("Confirmpopup").style.display = "block";
  document.querySelector(".navv-main").style.display = "none";
  document.querySelector(".home-content").style.filter = "blur(8px)";
  elementIds.forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.disabled = true;
    }
  });
  guestInput.style.display = "none";
}
localStorage.setItem("x", 1);
function closepreviewPopup() {
  submitBtn.innerHTML = `<span class="butt-main sign-in ff-inter fs-2s submit">Book the Hall</span>`;
  submitBtn.classList.remove("disabled");
  document.getElementById("Confirmpopup").style.display = "none";
  document.querySelector(".navv-main").style.display = "block";
  document.querySelector(".home-content").style.filter = "none";
  elementIds.forEach(function (id) {
    var element = document.getElementById(id);
    if (element) {
      element.disabled = false;
    }
  });
  guestInput.style.display = "block";
}
