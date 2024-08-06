import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
// import feather from 'feather-icons';
feather.replace();

document.addEventListener("DOMContentLoaded", function() {
    const token = Cookies.get("jwt");
    localStorage.setItem("x", 1);

    fetch(API_LOCAL + "/profile", {
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
        const atag = document.getElementById("reservebtn");
        if (data.blockStatus) {
            atag.setAttribute('href', '/block/');
            console.log("blockedddddd");
        } else if (data.role == "MANAGEMENT") {
            atag.setAttribute('href', '/management/');
        } else if (data.role == "ADMIN") {
            atag.setAttribute('href', '/admin/');
        } else if (data.role == "USER") {
            atag.setAttribute('href', '/venues/');
        }
    });
});
