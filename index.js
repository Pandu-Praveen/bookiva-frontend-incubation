import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
const token =  Cookies.get("jwt");
const currlocation = location.href;
if (
  !(
    currlocation == "http://www.mybookiva.com/" ||
    currlocation == "http://mybookiva.com/" ||
    currlocation == "http://mybookiva.com/index.html" ||
    currlocation == "http://mybookiva.com/index" ||
    currlocation == "http://localhost:5173/" ||
    currlocation == "http://localhost:5173/index.html" ||
    currlocation == "http://localhost:5173/index" ||
    currlocation == "https://bookiva-incubation.vercel.app/" ||
    currlocation == "https://bookiva-incubation.vercel.app/index.html" ||
    currlocation == "https://bookiva-incubation.vercel.app/index"
  )
) {
  location.href = "/404/index.html";
}

feather.replace();
function initializeUserMenu() {
  let x = parseInt(localStorage.getItem("x"));
  if (x == 1) {
    localStorage.setItem("x", 0);
    location.reload();
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

  fetchProfile();
}

async function fetchProfile() {
  try {
    const response = await fetch(API_LOCAL + "/profile", {
      credentials: "include",
      headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const { name, role } = await response.json();

    if (name) {
      renderUserMenu(name, role);
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}

function renderUserMenu(name, role) {
  function updateButtonHref() {
    var reserveBtn = document.getElementById("reserveBtn");
    var BrowseBtn = document.getElementById("BrowseBtn");
    if (role == "MANAGEMENT") {
      //console.log(role);
      reserveBtn.setAttribute("href", "/management/");
      BrowseBtn.setAttribute("href", "/management/");
    } else if (role == "ADMIN") {
      // console.log(role);
      reserveBtn.setAttribute("href", "/admin/");
      BrowseBtn.setAttribute("href", "/admin/");
    } else if (role == "USER") {
      //console.log(role);
      reserveBtn.setAttribute("href", "/venues/");
      BrowseBtn.setAttribute("href", "/venues/");
    }
  }
  updateButtonHref();
  let profile;
  if (role == "MANAGEMENT") {
    profile = `<a class="ff-inter fs-2s user-menu-link" href="/management/">Profile</a>`;
  } else if (role == "ADMIN") {
    profile = `<a class="ff-inter fs-2s user-menu-link" href="/admin/">Profile</a>`;
  } else if (role == "USER") {
    profile = `<a class="ff-inter fs-2s user-menu-link" href="/profile/">Profile</a>`;
  }
  const userMenu = document.querySelector(".user-menu");
  userMenu.innerHTML = `
    <h3 class="ff-inter">Welcome, ${name}</h3>
    ${profile}
    <a class="ff-inter fs-2s user-menu-link" href="/contactus/">Contact</a>
    <a class="ff-inter fs-2s user-menu-link log-out" href="#" style="font-weight:bold;color:red;">Log out</a>
  `;

  document
    .querySelector(".log-out")
    .addEventListener("click", async (event) => {
      event.preventDefault();
      try {
        await fetch(API_LOCAL + "/logout", {
          credentials: "include",
          headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        Cookies.remove('jwt', { path: '/' });
        location.href = "/login/"; // Simplified redirection logic
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
}

document.addEventListener("DOMContentLoaded", initializeUserMenu);
