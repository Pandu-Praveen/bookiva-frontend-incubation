import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
const token =  Cookies.get("jwt");
fetch(API_LOCAL + "/profile", {
  // Include cookies with the request
  headers: {
    'Authorization': `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  credentials: "include",
})
  .then((res) => {
    return res.json();
  })
  .then((data) => {
    console.log(data);
    if (data.blockStatus) {
      location.href = "/block/";
      console.log("blockedddddd");
    } else if (data.role == "MANAGEMENT") {
      location.href = "/management/";
    } else if (data.role == "ADMIN") {
      location.href = "/admin/";
    } else if (data.role == "USER") {
      location.href = `/venues/?${encryptedFormData}`;
    }
  });
const formEl = document.querySelector(".form");
const queryString = window.location.search;
const encryptedFormData = queryString.slice(1, queryString.length);
formEl.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.querySelector("#email").value;
  const name = document.querySelector("#name").value;
  var signBtn = document.getElementById("signin");
  signBtn.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
  signBtn.classList.add("disabled");
  await fetch(API_LOCAL + "/mobileUser", {
    //mode: 'cors',
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, name }),
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data, data.blockStatus);
      if (data.blockStatus) {
        location.href = "/block/";
        console.log("blockedddddd");
      } else if (data.message === "Login successful") {
        Cookies.set("jwt", data.token);
        console.log("Welcome");
        location.href = `/venues/?${encryptedFormData}`;
      } else if (data.message === "Internal server error") {
        alert("Internal server error");
        signBtn.innerHTML = `<span class="sign-in butt-main ff-inter fs-3s">Lets Go</span>`;
        signBtn.classList.remove("disabled");
      }
    })
    .catch((error) => console.log(error));
});
