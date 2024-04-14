import { API_LOCAL } from "./config";
const currlocation = location.href;
if (
  !(
    currlocation == "http://localhost:4173/" ||
    currlocation == "http://localhost:4173/index.html" ||
    currlocation == "http://localhost:4173/index"
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
  document.querySelector(".user-nav").addEventListener("click", (e) => {
    e.stopPropagation();
    // e.preventDefault();
    userMenu.classList.toggle("user-menu-hidden");
  });

  fetchProfile();
}

async function fetchProfile() {
  try {
    const response = await fetch(API_LOCAL + "/profile", {
      credentials: "include",
      headers: {
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
            "Content-Type": "application/json",
          },
        });
        location.href = "/login/"; // Simplified redirection logic
      } catch (error) {
        console.error("Error logging out:", error);
      }
    });
}

document.addEventListener("DOMContentLoaded", initializeUserMenu);
