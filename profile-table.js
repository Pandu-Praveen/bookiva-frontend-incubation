import { API_LOCAL } from "./config";
import Cookies from "js-cookie";
const token =  Cookies.get("jwt");
let NAME, Name, EMAIL;
menu();
async function menu() {
const response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
    'Authorization': `Bearer ${token}`,
    "Content-Type": "application/json",
    },
});
if (response.status == 401) {
    location.href = "/login/";
}
}

$(document).ready(function () {
$(".data-table").each(function (_, table) {
    $(table).DataTable();
});
});

var reservationsdata;
var completeddata;
var profiledata;

var pendingButtonStyle =
"background-color: #b8d4ff; color: #3a81eb; padding: 0.1px 10px; border: none; border-radius: 5px;cursor: default;";
var acceptButtonStyle =
"background-color: #ffe4a1; color: #C29C00; padding: 0.1px 10px; border: none; border-radius: 5px; cursor: default;";
var rejectButtonStyle =
"background-color: #ffaaaa; color: #58111A; padding: 0.1px 10px; border: none; border-radius: 5px; cursor: default;";
var completedButtonStyle =
"background-color: #c3faca; color: #3CB371; padding: 0.1px 10px; border: none; border-radius: 5px;cursor: default;";
var uploadedButtonStyle =
"background-color: #1CAC78; color: white; padding: 5px 10px; border: none; border-radius: 5px;cursor: default;";
// // Function to create a new table element with the provided bookings data and type
const createTable = (bookings, type) => {
// console.log(bookings);
// $(".table-responsive").empty();

const tableId = `user-${type}-records`;
$("#animation-table").remove();

// console.log(tableId);
if (!bookings || bookings.length === 0) {
    const hideFilterOptions = $(`.filter-options`).css({
    display: "none",
    });
    const message = `There is no ${type} data.`;
    const messageDiv = $(`<div>${message}</div>`).css({
    "text-align": "center",
    });
    return messageDiv;
}
$(`.filter-options`).css({ display: "flex" });
$(`.input-group`).css({ display: "flex" });

// Create a new table element
const table = $("<table>")
    .attr("id", `user-${type}-records`)
    .addClass("display data-table")
    .css("width", "100%", "overflowX", "auto");

let thead = $("<thead>").appendTo(table);

if (type === "reservations") {
    $(".dropbtn").css({ display: "flex" });
    $("#note").css({ display: "flex" });
    $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Seats</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>Refresh For</th>")
    .append("<th>Refresh Type</th>")
    .append("<th>Food</th>")
    .append("<th>Status</th>")
    .append("<th>Upload</th>")
    .append(`<th>Delete</th>`);

    // Create the table body
    const tbody = $("<tbody>").appendTo(table);

    // Populate table with fetched data
    bookings.forEach((booking, index) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${index + 1}</td>`); // Index starts from 0
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(
        `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
        `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
        } ${
        new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(
        `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
        } ${
        new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(`<td>${booking.seating}</td>`);
    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmentfor.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmenttype.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.food.join(" ")}</td>`);

    if (booking.status === "pending") {
        newRow.append(
        `<td><button style="${pendingButtonStyle}"  >Pending</button></td>`
        );
        newRow.append(`<td>-</td>`);
    } else if (
        booking.status === "denied" ||
        booking.status === "denied_temp"
    ) {
        newRow.append(`<td><button class="original-button" 
    booking-email="${booking.email}"
    booking-hallname="${booking.hallname}"
    booking-date="${new Date(booking.date).toLocaleDateString("en-GB")}"
    booking-startTime="${
        new Date(booking.starttime).getUTCHours() % 12 || 12
    }:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
        } ${new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"}"
    booking-endTime="$${
        new Date(booking.endtime).getUTCHours() % 12 || 12
    }:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
        } ${new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"}"
    booking-chiefguest="${booking.chiefguest}"
    booking-eventname="${booking.eventname}"
    style="${rejectButtonStyle}" >Denied</button></td>`);
        newRow.append(`<td>-</td>`);
    } else if (booking.status === "accepted") {
        newRow.append(
        `<td ><button style="${acceptButtonStyle}" >Accepted</button></td>`
        );
        const currentDate = new Date();
        const bookingDate = new Date(booking.date);

        // Check if booking date is today or in the past
        if (bookingDate <= currentDate) {
        // If booking date is today or in the past, change cursor style to 'pointer'

        newRow.append(
            `<td data-item-_id="${
            booking._id
            }"><button style="${uploadedButtonStyle.replace(
            "cursor: default;",
            "cursor: pointer;"
            )}" class="upload-button">Upload</button></td>`
        );
        } else {
        // If booking date is in the future, keep the cursor style as 'default'

        newRow.append(
            `<td data-item-_id="${booking._id}"><button style="${uploadedButtonStyle}; opacity: 0.5; cursor:not-allowed"  >Upload</button></td>`
        );
        }
    }
    newRow
        .append(
        `<td data-status="${booking.status}" data-item-_id=${booking._id}><span>   <i class="bi bi-trash-fill" style="color: red;cursor:pointer"></i><span></td>`
        )
        .css("text-align", "center");
    tbody.append(newRow);
    });
} else if (type === "completed") {
    $("#note").css({ display: "none" });
    $(".dropbtn").css({ display: "none" });
    $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>File</th>")
    .append("<th>Feedback Link</th>")
    .append("<th>Status</th>");

    // Create the table body
    const tbody = $("<tbody>").appendTo(table);

    // Populate table with fetched data
    bookings.forEach((booking, index) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${index + 1}</td>`); // Index starts from 0
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(
        `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
        `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
        } ${
        new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(
        `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
        } ${
        new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );

    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(
        `<td><a href="${API_LOCAL}/download/${booking.file.fileId}" target="_blank">Uploaded File</a></td>`
    );
    newRow.append(
        `<td><a href="${booking.feedback}" class="copy-link" target="_blank">Share Feedback</a></td>`
    );
    newRow.append(
        `<td><button style="${completedButtonStyle}" >Completed</button></td>`
    );

    tbody.append(newRow);
    });
}

return table;
};

$(document).on("click", ".copy-link", function (event) {
event.preventDefault();
const link = $(this).attr("href");
navigator.clipboard
    .writeText(link)
    .then(() => {
    alert("Link copied to clipboard");
    })
    .catch((err) => {
    console.error("Failed to copy link: ", err);
    });
});

const createProfile = () => {
// Check if the profile section already exists, if yes, then return
$(`.filter-options`).css({ display: "none" });
$("#note").css({ display: "none" });
$(`.input-group`).css({ display: "none" });
$(`#logo`).css({ "margin-right": "-180px" });
if ($("#profileSection").length > 0) return $("#profileSection");

// Create the profile section
const profileSection = $(`
<div id="profileSection" style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
<h3 class="form-title" style="text-align:center;">Profile Details</h3>
<form id="createProfileForm">
<div class="user-input-box">
    <label for="fullName" style="font-weight:bold;">Name</label>
    <input type="text" id="name" name="name" placeholder="Your Name" value="${profiledata.name}" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
</div>
<div class="user-input-box">
    <label for="email" style="font-weight:bold;">Email ID</label>
    <input type="email" id="email" name="email" placeholder="Your Email ID" value="${profiledata.email}" readonly style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px; background-color: #f4f4f4;">
</div>
<div class="user-input-box">
    <label for="college" style="font-weight:bold;">College Name</label>
    <input type="text" id="college" name="college" placeholder="College Name" value="${profiledata.college}" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
</div>
<div class="user-input-box">
    <label for="department" style="font-weight:bold;">Department Ex: (EEE , IT , CSE)</label>
    <input type="text" id="department" name="department" placeholder="Your Department" value="${profiledata.dept}" required style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid #ccc; border-radius: 4px;">
</div>
<div style="text-align: center;">
    <button type="button" id="updateButton" style="padding: 10px 20px; background-color: #009150; color: white; border: none; border-radius: 4px; cursor: pointer;">Update</button>
</div>
</form>   
</div>

`);

// Append the profile section to the body
$("body").append(profileSection);

$("#updateButton").on("click", function () {
    const updatedName = $("#name").val();
    const updatedCollege = $("#college").val();
    const updatedDept = $("#department").val();

    // Perform update request
    const button = $(this);

    button.prop("disabled", true); // Disable the button to prevent multiple clicks
    button.html("Updating..."); // Change button text to Loading...
    button.css({
    transition: "background-color 0.3s ease",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fade the button to a semi-transparent black color
    });
    fetch(API_LOCAL + "/updateprofile", {
    method: "POST",
    credentials: "include",
    headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    body: JSON.stringify({ updatedName, updatedCollege, updatedDept }),
    })
    .then((res) => {
        if (res.status === 200) {
        // Success message
        console.log("Profile updated successfully");
        alert("Profile updated successfully");
        // Redirect or show a message to the user
        } else {
        // Error message
        console.log("Error updating profile");
        alert("Error updating profile");
        // Redirect or show a message to the user
        }
    })
    .catch((error) => {
        console.error("Error:", error);
        // Handle error
    })
    .finally(() => {
        // Revert button style to normal
        button.prop("disabled", false); // Re-enable the button
        button.html("Update"); // Change button text back to Update
        button.css({
        backgroundColor: "#009150", // Restore original background color
        });
    });
});

return profileSection; // Return the profile section
};

// Function to fetch and display data in the table
const fetchAndDisplayData = async () => {
try {
    // Fetch data from the API based on the selected type
    const response = await fetch(API_LOCAL + "/userdata", {
    method: "POST",
    credentials: "include", // Include cookies with the request
    headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    });
    if (response.status == 401) {
    Cookies.remove('jwt', { path: '/' });
    location.href = "/login/";
    return;
    }
    const data = await response.json();
    $("#animation-table").remove();
    // Assuming data structure is consistent
    reservationsdata = data.reservationsdata;
    completeddata = data.completeddata;
    profiledata = data.user;

    // console.log(data,currentState);
    var newTable;
    // Create a new table with fetched data
    if (currentState == "reservations") {
    newTable = createTable(reservationsdata, currentState);
    } else if (currentState == "completed") {
    newTable = createTable(completeddata, currentState);
    } else if (currentState == "profile") {
    newTable = createProfile();
    }

    // Clear existing table data
    $(".table-responsive").empty();

    // Append the new table to the table-responsive div
    $(".table-responsive").append(newTable);

    // Initialize DataTable for the new table
    initializeDataTable(`user-${currentState}-records`);
} catch (error) {
    console.log(error);
    // Handle errors
}
};

$(document).on("click", ".bi-trash-fill", async function () {
var bookingId = $(this).closest("td").data("item-_id");
var bookingStatus = $(this).closest("td").data("status");
// console.log(bookingId, bookingStatus);

if (bookingStatus === "accepted") {
    $("#myModal").modal("show"); // Show the modal popup

    $("#myModal").on(
    "click",
    "#submitCancellationBtn",
    async function () {
        // const bookingId = $(this).closest('.modal-content').find('.bi-trash-fill').closest('td').data('item-_id');
        const cancellationReason = $("#cancellationReason").val(); // Get the reason for cancellation from the textarea
        // console.log(bookingId, cancellationReason);

        // Send the reason for cancellation to the server
        const response = await fetch(API_LOCAL + "/reason", {
        method: "POST",
        credentials: "include",
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, cancellationReason }),
        });

        if (response.ok) {
        // Do something after successful submission, like closing the modal
        $("#myModal").modal("hide");
        setCurrentState("reservations");
        fetchAndDisplayData();
        createTable(reservationsdata, currentState);
        } else {
        alert(
            "Some error occurred while submitting the reason, Please try again!"
        );
        }
    }
    );
} else {
    $("#deleteConfirmationModal").modal("show"); // Show the delete confirmation modal
    $("#deleteConfirmationModal").on(
    "click",
    "#confirmDeleteBtn",
    async function () {
        $("#deleteConfirmationModal").modal("hide"); // Hide the delete confirmation modal
        const response = await fetch(API_LOCAL + "/deleteevent", {
        method: "POST",
        credentials: "include", // Include cookies with the request
        headers: {
            'Authorization': `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ bookingId, bookingStatus }), // Pass the bookingId to the server
        });
        // console.log(response.ok);
        if (response.status) {
        setCurrentState("reservations");
        fetchAndDisplayData();
        createTable(reservationsdata, currentState);
        } else {
        alert(
            "Some error occurred while deleting the Event, Please try again!"
        );
        }
    }
    );
}
});

// Close modal if "Close" button is clicked
$("#closeModalBtn").click(function () {
$("#myModal").modal("hide");
});
$("#crossBtnaccepted").click(function () {
$("#myModal").modal("hide");
});

$("#cancelDeleteBtn").click(function () {
$("#deleteConfirmationModal").modal("hide");
});

$("#crossBtn").click(function () {
$("#deleteConfirmationModal").modal("hide");
});

$(document).on("click", ".upload-button", async function () {
var bookingId = $(this).closest("td").data("item-_id");
const encryptedFormData = encryptData(bookingId);
// console.log("Accepted",bookingId,encryptedFormData);
location.href = `/completedform/index.html?${encryptedFormData}`;
function encryptData(data) {
    const mockKey = "tamper-shouldnot-allowed";
    const encryptedData = CryptoJS.AES.encrypt(data, mockKey).toString();
    return encryptedData;
}
});

// Initial fetch and display of pending data
$(document).ready(function () {
fetchAndDisplayData(); // Fetch and display pending data initially
});

// Click event handlers for navigation links
$(document).ready(function () {
// Click event handler for pending link
$("#navbar li:nth-child(5)").click(function () {
    $("#recordsTitle").text("My Reservations");

    if (currentState != "reservations") {
    // console.log(currentState)
    setCurrentState("reservations");
    fetchAndDisplayData();

    updateTable(reservationsdata, "reservations");
    }
});

// Click event handler for accepted link
$("#navbar li:nth-child(6)").click(function () {
    $("#recordsTitle").text("Completed List");

    if (currentState != "completed") {
    setCurrentState("completed");
    fetchAndDisplayData();
    // console.log(currentState)
    updateTable(completeddata, "completed");
    }
});

// Click event handler for denied link
$("#navbar li:nth-child(7)").click(function () {
    $("#recordsTitle").text("My Profile");

    if (currentState != "profile") {
    // console.log(currentState)

    setCurrentState("profile");
    fetchAndDisplayData();
    // updateTable(dataDenied, 'denied');
    }
});
});

// Function to initialize DataTable for the table with given ID
const initializeDataTable = (tableId) => {
$(`#${tableId}`).DataTable({
    language: {
    paginate: {
        next: ">>",
        previous: "<<",
    },
    },
    dom: '<"top"pfl<"clear">>rt<"bottom"ip<"clear">>',
});
};

// // // Function to update the table with given data and type
const updateTable = (bookings, type) => {
// Check if the table already exists
$("#hall-name-filter").val("all");
$("#dept-filter").val("all");
$("#start-date").val("");
$("#end-date").val("");
$("#food-dropdown input:checked").prop("checked", false);
const tableExists = $(`#admin-${type}-records`).length > 0;

// If the table already exists, replace its contents
if (tableExists) {
    // console.log("if")
    // Destroy the existing DataTable instance
    $(`#user-${type}-records`).DataTable().destroy();

    const newTable = createTable(bookings, type);
    $(`#user-${type}-records`).replaceWith(newTable);
    initializeDataTable(`user-${type}-records`);
} else {
    // If the table doesn't exist, create and initialize it
    // console.log("else")
    const newTable = createTable(bookings, type);
    $(".table-responsive").empty().append(newTable);
    initializeDataTable(`user-${type}-records`);
}
};

const filterTableData = () => {
const hallName = $("#hall-name-filter").val();

const startDate = $("#start-date").val();
const endDate = $("#end-date").val();
const selectedFood = [];

// Get selected food options
$("#food-dropdown input:checked").each(function () {
    selectedFood.push($(this).val());
});

const filteredData = [];

let dataToFilter;
switch (currentState) {
    case "reservations":
    dataToFilter = reservationsdata;
    break;
    case "completed":
    dataToFilter = completeddata;
    break;

    default:
    dataToFilter = [];
    break;
}
// console.log(dataToFilter)
if (dataToFilter) {
    dataToFilter.forEach((booking) => {
    if (
        (hallName === "all" ||
        hallName === null ||
        booking.hallname === hallName) &&
        (startDate === "" ||
        startDate === null ||
        new Date(booking.date) >= new Date(startDate)) &&
        (endDate === "" ||
        endDate === null ||
        new Date(booking.date) <=
            new Date(endDate).setHours(23, 59, 59)) &&
        (selectedFood.length === 0 ||
        selectedFood.some((food) => booking.food.includes(food)))
    ) {
        const originalIndex = dataToFilter.findIndex(
        (item) => item === booking
        );
        // console.log(originalIndex)
        filteredData.push({ booking, originalIndex });
    }
    // console.log(booking)
    });
}

// Clear existing table data
$(`#user-${currentState}-records tbody`).empty();

// Create the table
const table = $("<table>")
    .attr("id", `user-${currentState}-records`)
    .addClass("display data-table")
    .css("width", "100%");

// Create the table header
let thead = $("<thead>").appendTo(table);

if (currentState === "reservations") {
    $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Seats</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>Refresh For</th>")
    .append("<th>Refresh Type</th>")
    .append("<th>Food</th>")
    .append("<th>Status</th>")
    .append(`<th>Delete</th>`);

    // Create the table body
    const tbody = $("<tbody>").appendTo(table);
    // console.log(filteredData)

    // Populate table with fetched data
    filteredData.forEach(({ booking, originalIndex }) => {
    // console.log(booking.hallname)
    const newRow = $("<tr>");

    newRow.append(`<td>${originalIndex + 1}</td>`); // Index starts from 0
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(
        `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
        `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
        } ${
        new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(
        `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
        } ${
        new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(`<td>${booking.seating}</td>`);
    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmentfor.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmenttype.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.food.join(" ")}</td>`);

    if (booking.status === "pending") {
        newRow.append(
        `<td><button style="${pendingButtonStyle}"  >Pending</button></td>`
        );
    } else if (
        booking.status === "denied" ||
        booking.status === "denied_temp"
    ) {
        newRow.append(
        `<td><button class="original-button" style="${rejectButtonStyle}" >Denied</button></td>`
        );
    } else if (booking.status === "accepted") {
        newRow.append(
        `<td data-item-_id="${booking._id}"><button style="${acceptButtonStyle}" class="upload-button">Accepted</button></td>`
        );
    }
    newRow
        .append(
        `<td data-status="${booking.status}" data-item-_id=${booking._id}><span>   <i class="bi bi-trash-fill" style="color: red;cursor:pointer"></i><span></td>`
        )
        .css("text-align", "center");
    tbody.append(newRow);
    });
} else if (currentState === "completed") {
    $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>File</th>")
    .append("<th>Feedback Link</th>")
    .append("<th>Status</th>");

    // Create the table body
    const tbody = $("<tbody>").appendTo(table);

    // Populate table with fetched data
    filteredData.forEach(({ booking, originalIndex }) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${originalIndex + 1}</td>`); // Index starts from 0
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(
        `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
        `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
        } ${
        new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );
    newRow.append(
        `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
        } ${
        new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"
        }</td>`
    );

    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(
        `<td><a href="${API_LOCAL}/download/${booking.file.fileId}" target="_blank">Uploaded File</a></td>`
    );
    newRow.append(
        `<td><a href="${booking.feedback}" class="copy-link" target="_blank">Share Feedback</a></td>`
    );
    newRow.append(
        `<td><button style="${completedButtonStyle}" >Completed</button></td>`
    );

    tbody.append(newRow);
    });
}

// Append the new table to the table-responsive div
$(".table-responsive").empty().append(table);

// Initialize DataTable for the new table
$(`#user-${currentState}-records`).DataTable();
};

// Event listener for filter options
$(".table-filter").change(function () {
filterTableData(); // Filter table data when filter options change
});

// // Initial filter of table data
// $(document).ready(function () {
//   filterTableData(); // Filter table data initially
// });

$(document).ready(function () {
// Event listener for list items
$("#navbar li:not(#dashboardLink)").click(function () {
    // Remove active class from all list items
    $("#navbar li").removeClass("active");

    // Add active class to the clicked list item

    $(this).addClass("active");

    // Apply animation
    $(this).css({ transform: "translateY(3px)" });
    setTimeout(() => {
    $(this).css({ transform: "translateY(0)" });
    }, 200);
});
});

$(document).ready(function () {
$("#logout").on("click", function () {
    var logoutModal = $("#logoutModal");
    logoutModal.modal("show");
});

$("#logoutModal").on("shown.bs.modal", function () {
    $(this)
    .find(".modal-dialog")
    .addClass("animate__animated animate__bounceIn");
});

// Handle confirm logout button click
$("#closelogout").on("click", function () {
    $("#logoutModal").modal("hide"); // Close the modal
});

$("#crosslogout").on("click", function () {
    $("#logoutModal").modal("hide"); // Close the modal
});

$("#confirmLogout").on("click", async function () {
    $("#logoutModal").modal("hide"); // Close the modal
    const res = await fetch(API_LOCAL + "/logout", {
    credentials: "include", // Include cookies with the request
    headers: {
        'Authorization': `Bearer ${token}`,
        "Content-Type": "application/json",
    },
    });
    if (res.status == 200) {
    Cookies.remove('jwt', { path: '/' });
    location.href = "/login/";
    }
});
});