import { API_LOCAL } from "./config";

feather.replace();
let HALL, DATE, SEATS;

var data;
var isDateSelected = false;

const renderCalendar = async (venue, isManagement) => {
  const dummyData = data.filter((hall) => hall.hallName === venue);
  const disabledDates = [];
  if (dummyData[0].reservations) {
    dummyData[0].reservations.forEach((date) =>
      disabledDates.push(date.reservedOn.split("-").reverse().join("-"))
    );
  }
  let formattedDates = [];
  const calendarConfig = {
    altInput: true,
    minDate: "today",
    maxDate: new Date().fp_incr(15),
    inline: true,
    dateFormat: "d-m-Y",
    onChange: (selectedDates, date, instance) => {
      formattedDates = [];
      console.log(date);
      isDateSelected = selectedDates.length > 0; // Check if at least one date is selected
      if (date.includes(",")) {
        formattedDates = date.split(", ");
        formattedDates = formattedDates.map((value) =>
          value.split("-").reverse().join("-").trim()
        );
      } else {
        formattedDates.push(date.split("-").reverse().join("-").trim());
      }
      const loginBtn = document.getElementById("login-btn");
      loginBtn.innerText = "Loading...";
      loginBtn.classList.add("faded");
      loginBtn.disabled = true;
      if (isManagement) {
        async function managementprebook() {
          await fetch(API_LOCAL + "/managementprebook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EMAIL, HALL, SEATS, DATES: formattedDates }),
            credentials: "include",
          }).then((res) => {
            if (res.status === 200) {
              loginBtn.innerText = "Book Now";
              loginBtn.classList.remove("faded");
              loginBtn.disabled = false; 
              loginBtn.setAttribute("href", "/managementbook/");
            }
          });
        }
        managementprebook();
      } else {
        DATE = formattedDates[0];
        async function userprebook() {
          await fetch(API_LOCAL + "/prebook", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ EMAIL, HALL, SEATS, DATE }),
            credentials: "include",
          }).then((res) => {
            if (res.status === 200) {
              loginBtn.innerText = "Book Now";
              loginBtn.classList.remove("faded");
              loginBtn.disabled = false;
              loginBtn.setAttribute("href", "/book/");
            }
          });
        }
        userprebook();
      }

      if (dummyData[0].isAvailable && isDateSelected) {
        // Check if at least one date is selected
        loginBtn.classList.remove("disabled");
      } else {
        loginBtn.classList.add("disabled");
      }
    },
  };

  if (isManagement) {
    calendarConfig.mode = "multiple";
    delete calendarConfig.maxDate;
  } else {
    calendarConfig.disable = disabledDates;
  }

  flatpickr("#calendar", calendarConfig);
};

// Make a GET request to fetch venue data when the page loads
window.addEventListener("DOMContentLoaded", async () => {
  const queryString = window.location.search;
  const encryptedFormData = queryString.slice(1, queryString.length);
  const hallName = decodeURIComponent(encryptedFormData);
  const token = localStorage.getItem('jwt');
  // console.log(encryptedFormData, hallName);
  try {
    const response = await fetch(API_LOCAL + "/venues", {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ hallName }),
      credentials: "include",
    });
    data = await response.json();
    console.log(data);
    // Process the data and generate HTML elements to display it
    renderVenues(data);
  } catch (err) {
    console.error("Error fetching venue data:", err);
  }
});

function renderVenues(venues) {
  // Assuming you have a container element to display the venue cards
  const container = document.querySelector(".cards-container");
  // Clear previous content
  venues.forEach((cardData) => {
    renderedCards += `<div class="hall-card">
            <div class="hall-img">
                <img src="${cardData.imgUrl}" alt="${cardData.hallName}" 
                     style="width: 100%; height:200px; object-fit: cover; object-position: center;">  
            </div>
            <div class="hall-info ff-inter">
                <div class="hall-name-star">
                    <h3 class="hall-name"> ${cardData.hallName} </h3>
                    <h3 class="hall-rating">⭐ ${cardData.rating}</h3>
                </div>
                <p>Seating Capacity: ${cardData.seatingCapacity}</p>
                <p>${cardData.location}</p>
            </div>
            <a href="#" class="butt-main details-btn ff-inter fs-s" data-venue="${cardData.hallName}" style="letter-spacing:1px;">DETAILS</a>
        </div>\n`;
  });

  cardsContainer.innerHTML =
    `<div class="overlay overlay-hidden"></div>
    <div class="popup-modal-wrapper popup-hidden"></div>` + renderedCards;

  document.querySelectorAll(".details-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
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
      openModal(e.target.dataset.venue);
    });
  });
}

const cardsContainer = document.querySelector(".cards-container");
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

var renderedCards = "";
var modal;
var overlay;

function openModal(venue) {
  modal = document.querySelector(".popup-modal-wrapper");
  overlay = document.querySelector(".overlay");

  if (screen.width <= 500) document.body.classList.toggle("body-noscroll");

  overlay.classList.toggle("overlay-hidden");
  modal.classList.toggle("popup-hidden");
  modal.innerHTML = "";
  if (!modal.classList.contains("popup-hidden")) {
    renderModal(venue);
  }
}

let NAME, Name, EMAIL;
menu();
async function menu() {
  const response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      "Content-Type": "application/json",
    },
  });
  NAME = await response.json();
  Name = NAME.name;
  EMAIL = NAME.email;
  if (NAME.blockStatus) {
    location.href = "/block/";
    return;
  } else if (NAME) {
    let profile;
    if (NAME.role == "MANAGEMENT") {
      profile = `<a class="ff-inter fs-2s user-menu-link" href="/management/">Profile</a>`;
    } else if (NAME.role == "USER") {
      profile = `<a class="ff-inter fs-2s user-menu-link" href="/profile/">Profile</a>`;
    } else if (NAME.role == "ADMIN") {
      location.href = "/admin/";
    } else {
      location.href = "/login/";
    }
    // Update the HTML of the user menu with the user's name
    const userMenu = document.querySelector(".user-menu");
    userMenu.innerHTML = `
        <h3 class="ff-inter">Welcome, ${Name}</h3>
        ${profile}
        <a class="ff-inter fs-2s user-menu-link" href="/contactus/">Contact</a>
        <a class="ff-inter fs-2s user-menu-link log-out"  style="color:red; font-weight:bold; cursor:pointer;">Log out</a>
        `;

    // Add a logout click event listener
    document.querySelector(".log-out").addEventListener("click", async (e) => {
      // Function to delete a cookie
      const res = await fetch(API_LOCAL + "/logout", {
        credentials: "include", // Include cookies with the request
        headers: {
          "Content-Type": "application/json",
        },
      });
      const val = await res.json();
      console.log(res, val);
      if (res.status == 200) {
        location.href = "/login/";
      }
    });
  }
}
function renderModal(venue) {
  //for login button flatpickr la ndhu dates edhu select panromo adha choose panni, URL param ah anupanum
  isDateSelected = false;
  const hallData = data.filter((hall) => hall.hallName === venue);
  const hallMarkup = hallData
    .map((hall) => {
      HALL = hall.hallName;
      SEATS = hall.seatingCapacity;
      //let set="public";
      return `
            <div class="close-btn-wrapper">
                <a href="#" class="close-btn ff-inter fs-2s fw-500"><i data-feather="x"></i></a></div>
                <div class="popup-modal">
                    <div class="swiper">
                        <div class="swiper-wrapper">
                        ${hall.carouselPics
                          .map(
                            (img) =>
                              `<div class="swiper-slide"><img src="${img}"></div>`
                          )
                          .join("\n")}
                  
                        </div>
                        <div class="swiper-button-next"></div>
                        <div class="swiper-button-prev"></div>
                        <div class="swiper-pagination"></div>
                    </div>
    
                    <div class="popup-details">
                        <div class="venue-info">
                            <h2 class="ff-inter fw-600">${hall.hallName}, ${
        hall.campus
      }</h2>
                            <hr class="hr-venue"/>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Number of seats -${
                              hall.seatingCapacity
                            }</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Has AC? - ${
                              hall.hasAC ? "Yes" : "No"
                            }</p>
                            
                           
                            ${
                              hall.isReserved
                                ? `<p class="ff-inter fs-2s"><i data-feather="info"></i> Hall reserved by: ${hall.reservedBy}</p>`
                                : ""
                            }
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Distance from main gate - ${
                              hall.distFromGate
                            } Meters</p>
                            <p class="ff-inter fs-2s"><i data-feather="info"></i> Location: ${
                              hall.location
                            }</p>
                        </div>
                        <div class="venue-calendar ff-inter">
                            <input id="calendar" type="text" placeholder="Select a date">
                            <p class="ff-inter fs-2s"><strong>NOTE</strong>: If dates cannot be selected then they are already reserved</p>
                        </div>
                        <div class="venue-card">
                        <div class="venue-card-details">
                            <!--hall is commonly available for everyone to book ahillaya nu oru field-->
                            <div>
                                ${
                                  hall.isAvailable
                                    ? `<i data-feather="check-circle"></i>
                                <p class="ff-inter fs-2s">This hall is in working condition to reserve.</p>`
                                    : `<i data-feather="x-circle"></i>
                                <p class="ff-inter fs-2s">This hall is not in working condition to reserve.</p>`
                                }
                                ${
                                  hall.isAvailable
                                    ? `<br><p class="ff-inter fs-s fw-600">Select a date to enable Book Button</p> <p class="ff-inter fs-s" style="margin-top:1rem;">Proceed to book as ${NAME.name} to confirm time, by clicking the button below</p>`
                                    : `<p class="ff-inter fs-s" style="margin-top:1rem;">Contact admin for further help</p>`
                                }
                            </div>
                        </div>
                        <a id="login-btn" href="#" class="ff-inter butt-main sign-in fs-s ${
                          hall.isAvailable && isDateSelected ? `` : `disabled`
                        }" >Book Now</a>
                    </div>
                    
                </div>
            </div>
        `;
    })
    .join("");

  modal.innerHTML = hallMarkup;
  feather.replace();

  document.querySelector(".close-btn").addEventListener("click", (e) => {
    e.preventDefault();
    openModal(" ");
  });

  var swiper = new Swiper(".swiper", {
    pagination: {
      el: ".swiper-pagination",
      type: "progressbar",
    },
    loop: true,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
  renderCalendar(venue, NAME.role == "MANAGEMENT");
}
localStorage.setItem("x", 1);
