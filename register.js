import { API_LOCAL } from "./config";
    feather.replace();
    localStorage.setItem("x", 1);
    const formEl = document.querySelector(".form");
    var signBtn = document.getElementById("register");
    function enableButton() {
      signBtn.innerHTML = `<span class="sign-in butt-main ff-inter fs-3s">Register</span>`;
      signBtn.classList.remove("disabled");
    }
    function disableButton() {
      signBtn.innerHTML = `<span class="loader" style="border-top: 3px solid #fff;height: 24px; width: 24px;"></span>`;
      signBtn.classList.add("disabled");
    }
    formEl.addEventListener("submit", (event) => {
      event.preventDefault();
      disableButton();
      // const formData = new FormData(formEl);

      // // console.log(formData.get('user-login'))

      // const data = Object.fromEntries(formData);
      // // console.log(data)
      const name = document.querySelector("#name").value;
      const dept = document.querySelector("#dept").value;

      // const fff= document.forms.loginform;
      // const opt = fff.elements.college;

      // let college = opt.options[opt.selectedIndex].value;
      const college = document.querySelector("#college").value;

      // opt.addEventListener("change", (event)=>{

      //   college =  event.target.options[event.target.selectedIndex].text;
      //   // console.log(college )
      // })
      // console.log(college)
      // console.log(typeof college)

      const email = document.querySelector("#email").value;
      const password = document.querySelector("#password").value;
      const cpassword = document.querySelector("#cpassword").value;

      //     const isValidEmail  = validateEmail(email);
      //   if(!isValidEmail){
      //     alert('Invalid email');
      //   }

      // function validateEmail(email) {
      //   // Simple email validation regex
      //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      //   return emailRegex.test(email);
      // }
      if (password.length < 6) {
        alert("Password Must contain atleast 6 characters!");

      } else if (!(password === cpassword)) {
        alert("Confirm Password Must be same as Password");
        disableButton();
      } else {
        fetch(API_LOCAL + "/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, dept, college, email, password }),
        })
          .then((res) => {
            if (res.status === 500) {
              alert("Internal Server Error");
            } else if (res.status === 404) {
              alert("Page not Found");
            } else if (res.status === 400) {
              alert("This email is already exists,try the new one!");
            } else if (res.status === 200) {
              alert("Registration is completed successfully, kindly login");
              location.href = "/login/index.html";
            }
            return res.json();
          })
          .then((data) => console.log(data))
          .catch((error) => console.log(error))
          .finally(() => {
            enableButton();
          })
      }
    });