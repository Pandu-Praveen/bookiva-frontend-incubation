// import { db, auth } from './config.js';
// import { onAuthStateChanged, signOut } from "firebase/auth";

import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
const token =  Cookies.get("jwt");
// import printJS from "print-js";
fetch(API_LOCAL + "/profile", {
  credentials: "include", // Include cookies with the request
  headers: {
    'Authorization': `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((res) => {
    if (res.status != 200) {
      sessionStorage.clear();
      localStorage.clear();
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };
      location.href = "/login/";
    }
    return res.json();
  })
  .then((data) => {
    console.log(data);
    if (data.role != "MANAGEMENT") {
      sessionStorage.clear();
      localStorage.clear();
      window.history.pushState(null, "", window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, "", window.location.href);
      };
      location.href = "/login/";
    }
  });
let HALL,
  SEATS,
  DATE,
  startTime = new Date(),
  formattedDate;
feather.replace();
getmanagementprebook();
async function getmanagementprebook() {
  const re = await fetch(API_LOCAL + "/getmanagementprebook", {
    credentials: "include", // Include cookies with the request
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  const haLL = await re.json();

  if (re.status != 200) {
    //alert("Some error found in selecting hall.Please try again!");
    location.href = "/venues/";
  }

  console.log(haLL);
  HALL = haLL.HALL;
  SEATS = haLL.SEATS;
  DATE = haLL.DATE;
  console.log(DATE);
  document.querySelector(".hall-name").innerHTML = HALL;
  document.querySelector(".hall-image").setAttribute("src", "/sigma.jpg");
  formattedDate = [];

  DATE.forEach((element) => {
    let date = new Date(element);

    // Get the year, month, and day
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString().padStart(2, "0"); // Pad with leading zero if month is a single digit
    let day = date.getDate().toString().padStart(2, "0");

    // Create the desired format
    formattedDate.push(day + "-" + month + "-" + year);
  });

  // Log the formatted date
  console.log(formattedDate);
  document.querySelector("#date").value = formattedDate;
  document.querySelector(
    ".seats-needed"
  ).innerText = `Seats required (Max: ${SEATS}):*`;
  document.querySelector("#seats").setAttribute("max", SEATS);
}

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
Profile();
let response, NAME;
async function Profile() {
  response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  NAME = await response.json();
  const Name = NAME.name;
  const Email = NAME.email;

  document.querySelector("#email").value = Email;
  document.querySelector("#name").value = Name;

  document.querySelector(".user-menu").addEventListener("click", (e) => {
    //e.stopPropagation();
    // e.preventDefault(); // Commenting this out to allow anchor tag redirection
    userMenu.classList.toggle("user-menu-hidden");
  });

  if (NAME.role === "MANAGEMENT") {
    const userMenu = document.querySelector(".user-menu");
    userMenu.innerHTML = `
    <h3 class="ff-inter">Welcome, ${Name}</h3>
    <a class="ff-inter fs-2s user-menu-link" href="/management/">Profile</a>
    <a class="ff-inter fs-2s user-menu-link" href="/contactus/">Contact</a>
    <a class="ff-inter fs-2s user-menu-link log-out" href="#" style="color:red; font-weight:bold;">Log out</a>
  `;

    document.querySelector(".log-out").addEventListener("click", (event) => {
      event.preventDefault();
      const logout = fetch(API_LOCAL + "/logout", {
        credentials: "include",
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      Cookies.remove('jwt', { path: '/' });
      location.href = "/login/"; // Simplified redirection logic
    });
  } else {
    fetch(API_LOCAL + "/logout", {
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    Cookies.remove('jwt', { path: '/' });
    location.href = "/login/";
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

  console.log(
    refreshmentfor,
    refreshmenttype,
    food,
    shr,
    smin,
    sampm,
    ehr,
    emin,
    eampm
  );
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
  fetch(API_LOCAL + "/managementbook", {
    //mode: 'cors',
    method: "POST",
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(submissionData),
    credentials: "include",
  }).then((res) => {
    if (res.status === 200) {
      msgContent = `<p class="ff-inter fs-2s">Booking was confirmed! Check your email for details</p>`;
      //send mail with smtpJS after confirmation
      putMsg(msgContent, true);
      console.log("True");
      setTimeout(() => {
        location.href = "/management/";
      }, 1000);
    } else {
      console.log("False");
      msgContent = `<p class="ff-inter fs-2s">Error in booking. Try again later!</p>`;
      putMsg(msgContent, false);
      setTimeout(() => {
        location.href = "/venues/";
      }, 1000);
    }
  });
});

document.getElementById("bruh").addEventListener("submit", previewpopup);
document
  .getElementById("PreviewcloseButton")
  .addEventListener("click", closepreviewPopup);
var submitBtn = document.getElementById("Previewbutton");

// Loop through each ID and disable the corresponding element

function previewpopup(e) {
  e.preventDefault();
  // const formValues = new FormData();
  submitBtn.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
  submitBtn.classList.add("disabled");
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
  console.log(shr, smin, sampm, ehr, emin, eampm);
  // let number = document.getElementById("num").value.toString().trim();
  // let maximum = document.querySelector("#seats").value.toString().trim();
  // let purpose_= document.querySelector("#purpose").value.toString().trim();
  // console.log(shr,smin,sampm,ehr,emin,eampm,",",typeof number,",",maximum,",",purpose_,",");
  document.getElementById("popupName").innerText = HALL;
  document.getElementById("Date").innerHTML =
    "<br><span style='color: brown;'>" +
    formattedDate.join("</span><br><span style='color: brown;'>") +
    "</span>";

  // formattedDate.unshift("\n");
  // document.getElementById("Date").innerText ="<span style='color: brown;'>"+"\n"+formattedDate.join("\n");
  // var formattedText = formattedDate.join("\n");
  // var styledText = "<span style='color: brown;'>"+"\n"+ formattedText + "</span>";
  // document.getElementById("Date").innerHTML = styledText;
  document.getElementById("starttime").innerText = `${shr}-${smin}-${sampm}`;
  document.getElementById("endtime").innerText = `${ehr}-${emin}-${eampm}`;
  document.getElementById("eventName").innerText =
    document.querySelector("#eventname").value;
  document.getElementById("Confirmpopup").style.display = "block";
  document.querySelector(".navv-main").style.display = "none";
  document.querySelector(".home-content").style.filter = "blur(8px)";
}

localStorage.setItem("x", 1);

function closepreviewPopup() {
  submitBtn.innerHTML = `<span class="butt-main sign-in ff-inter fs-2s submit">Book the Hall</span>`;
  submitBtn.classList.remove("disabled");
  document.getElementById("Confirmpopup").style.display = "none";
  document.querySelector(".navv-main").style.display = "block";
  document.querySelector(".home-content").style.filter = "none";
  // elementIds.forEach(function(id) {
  //   var element = document.getElementById(id);
  //   if (element) {
  //       element.disabled = false;
  //   }
  // });
  guestInput.style.display = "block";
}
