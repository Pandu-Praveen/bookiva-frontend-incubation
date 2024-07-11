import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
const token =  Cookies.get("jwt");
feather.replace();
const userMenu = document.querySelector(".user-menu");
document.querySelector(".user-nav").addEventListener("click", (e) => {
  // e.preventDefault();
  userMenu.classList.toggle("user-menu-hidden");
});
let response, NAME;
checkuser();
async function checkuser() {
  response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  NAME = await response.json();
  console.log(NAME.name);
  const Name = NAME.name;
  const EMAIL = NAME.email;
  if (NAME.role != "USER") {
    location.href = "/login/";
  }
  if (response.status == 200) {
    console.log("200");
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
      event.preventDefault();
      // Perform the logout logic here, such as removing the user token or redirecting to the login page
      // Function to delete a cookie
      const logout = fetch(API_LOCAL + "/logout", {
        credentials: "include", // Include cookies with the request
        headers: {
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      ClearHistory();
      function ClearHistory() {
        var backlen = history.length;
        history.go(-backlen);
        Cookies.remove('jwt', { path: '/' });
        window.location.href = "/login/";
      }
    });
  }
}
// console.log(response.status)

// Retrieve the URL query string
const queryString = window.location.search;
const encryptedFormData = queryString.slice(1, queryString.length);

// Function to decrypt data (example implementation using AES decryption)
function decryptData(encryptedData) {
  // Use the same encryption algorithm and secret key used for encryption
  // For demonstration purposes, we'll use the same mock key as the encryption example
  const mockKey = "tamper-shouldnot-allowed";
  const decryptedData = CryptoJS.AES.decrypt(encryptedData, mockKey).toString(
    CryptoJS.enc.Utf8
  );
  return decryptedData;
}
// Decrypt the encrypted form data
const bookingId = decryptData(encryptedFormData);

// Now you can use these variables to display or manipulate the data as needed
console.log("bookingId:", bookingId);

let getdatail, user;
getdetail();
async function getdetail() {
  getdetail = await fetch(API_LOCAL + "/completedform", {
    method: "POST",
    credentials: "include", // Include cookies with the request
    headers: {
      'Authorization': `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ bookingId }),
  });
  user = await getdetail.json();
  const date = new Date(user.date).toLocaleDateString();
  const startTime = `${new Date(user.starttime).getUTCHours() % 12 || 12}:${
    (new Date(user.starttime).getUTCMinutes() < 10 ? "0" : "") +
    new Date(user.starttime).getUTCMinutes()
  } ${new Date(user.starttime).getUTCHours() < 12 ? "AM" : "PM"}`;
  const endTime = `${new Date(user.endtime).getUTCHours() % 12 || 12}:${
    (new Date(user.endtime).getUTCMinutes() < 10 ? "0" : "") +
    new Date(user.endtime).getUTCMinutes()
  } ${new Date(user.endtime).getUTCHours() < 12 ? "AM" : "PM"}`;
  console.log(user.starttime);
  localStorage.setItem("x", 1);
  document.querySelector("#date").value = date;
  document.querySelector("#email").value = user.email;
  document.querySelector("#Event").value = user.eventname;
  document.querySelector("#hall").value = user.hallname;
  document.querySelector("#starttime").value = startTime;
  document.querySelector("#endtime").value = endTime;
}

var uploadBtn = document.getElementById("upload");
document.querySelector(".form").addEventListener("submit", async function (e) {
  e.preventDefault();
  const fileInput = document.getElementById("proof");
  const file = fileInput.files[0];
  uploadBtn.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
  uploadBtn.classList.add("disabled");
  if (!file) {
    alert("Please select a file.");
    uploadBtn.innerHTML = `<span class="butt-main sign-in ff-inter fs-2s submit">Upload</span>`;
    uploadBtn.classList.remove("disabled");
  }
  const formData = new FormData();
  formData.append("file", file);

  const otherData = {
    bookingId: bookingId,
    // email: document.getElementById('email').value,
    // date: document.getElementById('date').value,
    // eventname: document.getElementById('Event').value,
    // hallname: document.getElementById('hall').value,
    // startTime: document.getElementById('starttime').value,
    // endTime: document.getElementById('endtime').value
  };

  // // Append other form data to FormData
  for (const key in otherData) {
    formData.append(key, otherData[key]);
  }
  if (file) {
    try {
      const response = await fetch(API_LOCAL + "/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // Include cookies with the request
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
          }
      });

      if (response.ok) {
        alert("File uploaded successfully.");
        location.href = "/profile/";
      } else {
        uploadBtn.innerHTML = `<span class="butt-main sign-in ff-inter fs-2s submit">Upload</span>`;
        uploadBtn.classList.remove("disabled");
        throw new Error("Failed to upload file.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to upload file.");
      uploadBtn.innerHTML = `<span class="butt-main sign-in ff-inter fs-2s submit">Upload</span>`;
      uploadBtn.classList.remove("disabled");
    }
  }
});
