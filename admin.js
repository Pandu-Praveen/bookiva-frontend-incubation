// var ctx = document.querySelector(".chart");
// var myChart = new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["CS", "IT", "ECE", "EE", "ME", "BE"],
//     datasets: [
//       {
//         label: "# of students",
//         data: [105, 124, 78, 91, 62, 56],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],

import { API_LOCAL } from "./config";

//         borderColor: [
//           "rgba(255,99,132,1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//   },
// });

// var ctx = document.getElementById("mychart");
// var myChart = new Chart(ctx, {
//   type: "bar",
//   data: {
//     labels: ["CS", "IT", "ECE", "EE", "ME", "BE"],
//     datasets: [
//       {
//         label: "# of students",
//         data: [105, 124, 78, 91, 62, 56],
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(255, 206, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//         ],

//         borderColor: [
//           "rgba(255,99,132,1)",
//           "rgba(54, 162, 235, 1)",
//           "rgba(255, 206, 86, 1)",
//           "rgba(75, 192, 192, 1)",
//           "rgba(153, 102, 255, 1)",
//           "rgba(255, 159, 64, 1)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       yAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//           },
//         },
//       ],
//     },
//   },
// });

let NAME, Name, EMAIL;
menu();
async function menu() {
  const response = await fetch(API_LOCAL + "/profile", {
    credentials: "include", // Include cookies with the request
    headers: {
      "Content-Type": "application/json",
    },
  });
  // if(response.status==401){
  //   location.href='/login/'
  // }
  NAME = await response.json();
  Name = NAME.name;
  EMAIL = NAME.email;
  if (NAME) {
    let profile;

    if (NAME.role == "USER") {
      location.href = "/venues/";
    } else if (NAME.role == "MANAGEMENT") {
      location.href = "/management/";
    }
  }
}

$(document).ready(function () {
  $(".data-table").each(function (_, table) {
    $(table).DataTable();
  });
});

var allUsers;
var dataCancelled;

var dataPending;
var dataAllowed;
var dataDenied;

var acceptButtonStyle =
  "background-color: #009150; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
var rejectButtonStyle =
  "background-color: #CF1020; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

var userButtonStyle =
  "background-color: #007FFF; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

// Function to accept a booking
const updateUserStatus = async (index, tableId, currData) => {
  currData = allUsers;
  // console.log(currData)

  const name = currData[index].name;
  const dept = currData[index].dept;
  const college = currData[index].college;
  const email = currData[index].email;
  const blockStatus = currData[index].blockStatus;

  try {
    // Send request to update the status to accepted
    const response = await fetch(API_LOCAL + "/updateUserStatus", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blockStatus: blockStatus,
        updateStatus: blockStatus == false ? true : false,
        email,
        name,
        dept,
        college,
      }),
      credentials: "include",
    });
    if (response.status == 401) {
      location.href = "/login/";
      return;
    }
    if (response.ok) {
      if (currentState == "cancelled") {
        fetchAndDisplayData();
        // createTable(dataCancelled,currentState)
      } else if (currentState == "allUsers") {
        getUsers();
      }
      console.log("status is updated");
    } else {
      console.error("Failed to update User status.");
    }
  } catch (error) {
    console.error("Error while updating user status:", error);
  }
};

const createUsers = (userData, type) => {
  const tableId = `admin-${type}-records`;

  if (!userData || userData.length === 0) {
    // const hideFilterOptions = $(`.filter-options`).css({"display":"none"})
    const message = `There is no ${type} data.`;
    const messageDiv = $(`<div>${message}</div>`).css({
      "text-align": "center",
    });
    return messageDiv;
  }
  $(`.filter-options`).css({ display: "none" });

  const table = $("<table>")
    .attr("id", `admin-${type}-records`)
    .addClass("display data-table")
    .css("width", "100%", "overflowX", "auto");

  const thead = $("<thead>").appendTo(table);
  $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Name</th>")
    .append("<th>Dept</th>")
    .append("<th>College</th>")
    .append("<th>Email</th>")
    .append("<th>Status</th>");

  const tbody = $("<tbody>").appendTo(table);

  userData.forEach((user, index) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${index + 1}</td>`);
    newRow.append(`<td>${user.name}</td>`);
    newRow.append(`<td>${user.dept}</td>`);
    newRow.append(`<td>${user.college}</td>`);
    newRow.append(`<td>${user.email}</td>`);

    if (user.blockStatus) {
      newRow.css("color", "red"); // Fading the row if block status is true
      userButtonStyle =
        "background-color: #FF0800; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

      newRow.append(
        `<td><button style="${userButtonStyle}"  onclick="updateUserStatus(${index}, '${tableId}', '${allUsers}')" >Unblock</button></td>`
      );
    } else {
      userButtonStyle =
        "background-color: #007FFF; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

      newRow.append(
        `<td><button style="${userButtonStyle}"  onclick="updateUserStatus(${index}, '${tableId}', '${allUsers}')" >Block</button></td>`
      );
    }

    tbody.append(newRow);
  });

  return table;
};

// Function to create a new table element with the provided bookings data and type
const createTable = (bookings, type) => {
  // $(".table-responsive").empty();

  const tableId = `admin-${type}-records`;
  $("#animation-table").remove();

  if (!bookings || bookings.length === 0) {
    const hideFilterOptions = $(`.filter-options`).css({ display: "none" });
    const message = `There is no ${type} data.`;
    const messageDiv = $(`<div>${message}</div>`).css({
      "text-align": "center",
    });
    return messageDiv;
  }
  $(`.filter-options`).css({ display: "flex" });

  // Create a new table element
  const table = $("<table>")
    .attr("id", `admin-${type}-records`)
    .addClass("display data-table")
    .css("width", "100%", "overflowX", "auto");

  // Create the table header
  const thead = $("<thead>").appendTo(table);
  $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Name</th>")
    .append("<th>Dept</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Seats</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>Refresh For</th>")
    .append("<th>Refresh Type</th>")
    .append("<th>Food</th>");

  if (type === "pending") {
    thead.find("tr").append("<th>Accept</th>").append("<th>Reject</th>");
  } else if (type === "accepted") {
    thead.find("tr").append("<th>Reject</th>");
  } else if (type === "denied") {
    thead.find("tr").append("<th>Accept</th>");
  } else if (type === "cancelled") {
    thead.find("tr").append("<th>Reason</th>");
  }

  // Create the table body
  const tbody = $("<tbody>").appendTo(table);

  // Populate table with fetched data
  bookings.forEach((booking, index) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${index + 1}</td>`); // Index starts from 0
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(`<td>${booking.name}</td>`);
    newRow.append(`<td>${booking.dept}</td>`);
    newRow.append(
      `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
      `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
      } ${new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"}</td>`
    );
    newRow.append(
      `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
      } ${new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"}</td>`
    );
    newRow.append(`<td>${booking.seating}</td>`);
    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmentfor.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmenttype.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.food.join(" ")}</td>`);

    if (type === "pending") {
      if (booking.status === "denied_temp") {
        acceptButtonStyle =
          "background-color: #009150; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;opacity: 0.5;cursor: not-allowed;";
      } else {
        acceptButtonStyle =
          "background-color: #009150; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
      }

      newRow.append(
        `<td><button style="${acceptButtonStyle}" onclick="acceptBooking(${index}, '${tableId}', '${dataPending}')" >Accept</button></td>`
      );
      newRow.append(
        `<td><button style="${rejectButtonStyle}" onclick="rejectBooking(${index}, '${tableId}', '${dataPending}')">Reject</button></td>`
      );
    } else if (type === "accepted") {
      newRow.append(
        `<td><button style="${rejectButtonStyle}" onclick="rejectBooking(${index}, '${tableId}', '${dataAllowed}')">Reject</button></td>`
      );
    } else if (type === "denied") {
      newRow.append(
        `<td><button style="${acceptButtonStyle}" onclick="acceptBooking(${index}, '${tableId}','${dataDenied}')">Accept</button></td>`
      );
    } else if (type === "cancelled") {
      let viewDetailsButtonStyle =
        "background-color: #ffaf00; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
      newRow.append(
        `<td><button style="${viewDetailsButtonStyle}" id="view" >View</button></td>`
      );

      // allUsers.forEach((currUser)=>{
      //   if(currUser['name']==booking.name){
      //     const originalIndex = allUsers.findIndex(item => item === currUser);

      //     let viewDetailsButtonStyle = "background-color: #ffaf00; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
      //     newRow.append(`<td><button style="${viewDetailsButtonStyle}" id="view" >View</button></td>`);

      //     console.log(currUser,currUser.blockStatus)
      //     // if (currUser.blockStatus==true) {
      //     //   console.log("fffffff")
      //     //   newRow.css("color", "red"); // Fading the row if block status is true
      //     //   userButtonStyle = "background-color: #FF0800; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

      //     //   newRow.append(`<td><button style="${userButtonStyle}"  onclick="updateUserStatus(${originalIndex}, '${tableId}', '${allUsers}')">Unblock</button></td>`);

      //     // } else {
      //     //   console.log("eeeee")
      //     //   userButtonStyle = "background-color: #007FFF; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";

      //     //   newRow.append(`<td><button style="${userButtonStyle}"  onclick="updateUserStatus(${originalIndex}, '${tableId}', '${allUsers}')">Block</button></td>`);
      //     // }
      //       // console.log(originalIndex)
      //   }

      // })
    }

    tbody.append(newRow);
  });

  return table;
};

const getUsers = async () => {
  try {
    const userRecords = await fetch(API_LOCAL + "/allUsers/", {
      credentials: "include",
    });
    if (userRecords.status == 401) {
      location.href = "/login/";
      return;
    }
    const userData = await userRecords.json();
    $("#animation-table").remove();
    allUsers = userData;

    const newTable = createUsers(userData, currentState);
    // Clear existing table data
    $(".table-responsive").empty();

    // Append the new table to the table-responsive div
    $(".table-responsive").append(newTable);

    // Initialize DataTable for the new table
    initializeDataTable(`admin-${currentState}-records`);
  } catch (error) {
    console.log(error);
    // Handle errors
  }
};

// Function to fetch and display data in the table
const fetchAndDisplayData = async () => {
  try {
    // Fetch data from the API based on the selected type
    const response = await fetch(API_LOCAL + "/admin/", {
      credentials: "include",
    });
    if (response.status == 401) {
      location.href = "/login/";
      return;
    }
    const data = await response.json();
    $("#animation-table").remove();
    // Assuming data structure is consistent
    dataPending = data.pendingBookings;
    dataAllowed = data.acceptedBookings;
    dataDenied = data.deniedBookings;
    dataCancelled = data.cancelledBookings;

    console.log(data);

    // Create a new table with fetched data
    const newTable = createTable(data[`${currentState}Bookings`], currentState);

    // Clear existing table data
    $(".table-responsive").empty();

    // Append the new table to the table-responsive div
    $(".table-responsive").append(newTable);

    // Initialize DataTable for the new table
    initializeDataTable(`admin-${currentState}-records`);
  } catch (error) {
    console.log(error);
    // Handle errors
  }
};

// Initial fetch and display of pending data
$(document).ready(function () {
  fetchAndDisplayData();

  // Fetch and display pending data initially
});

// Click event handlers for navigation links
$(document).ready(function () {
  // Click event handler for pending link
  $("#navbar li:nth-child(6)").click(function () {
    $("#recordsTitle").text("Pending Records");

    if (currentState != "pending") {
      // console.log(currentState)
      setCurrentState("pending");
      fetchAndDisplayData();

      updateTable(dataPending, "pending");
    }
  });

  // Click event handler for accepted link
  $("#navbar li:nth-child(7)").click(function () {
    $("#recordsTitle").text("Accepted Records");

    if (currentState != "accepted") {
      setCurrentState("accepted");
      fetchAndDisplayData();
      // console.log(currentState)
      updateTable(dataAllowed, "accepted");
    }
  });

  // Click event handler for denied link
  $("#navbar li:nth-child(8)").click(function () {
    $("#recordsTitle").text("Denied Records");

    if (currentState != "denied") {
      // console.log(currentState)

      setCurrentState("denied");
      fetchAndDisplayData();
      // updateTable(dataDenied, 'denied');
    }
  });

  $("#navbar li:nth-child(11)").click(function () {
    $("#recordsTitle").text("Users List");

    if (currentState != "allUsers") {
      // console.log(currentState)

      setCurrentState("allUsers");
      getUsers();

      // fetchAndDisplayData();
      // updateTable(allUsers, 'allUsers');
    }
  });

  $("#navbar li:nth-child(12)").click(function () {
    $("#recordsTitle").text("Cancelled Events");

    if (currentState != "cancelled") {
      // console.log(currentState)

      setCurrentState("cancelled");
      fetchAndDisplayData();

      // fetchAndDisplayData();
      updateTable(dataCancelled, "cancelled");
    }
  });
});

// Function to initialize DataTable for the table with given ID
const initializeDataTable = (tableId) => {
  $(`#${tableId}`).DataTable();
};

// // Function to update the table with given data and type
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

    $(`#admin-${type}-records`).DataTable().destroy();
    if (type === "allUsers") {
      // console.log(type)
      const newTable = createUsers(bookings, type);
      $(`#admin-${type}-records`).replaceWith(newTable);
      initializeDataTable(`admin-${type}-records`);
    } else {
      const newTable = createTable(bookings, type);
      $(`#admin-${type}-records`).replaceWith(newTable);
      initializeDataTable(`admin-${type}-records`);
    }
  } else {
    if (type === "allUsers") {
      // console.log(type,bookings)
      const newTable = createUsers(bookings, type);
      $(".table-responsive").empty().append(newTable);
      initializeDataTable(`admin-${type}-records`);
    } else {
      const newTable = createTable(bookings, type);
      $(".table-responsive").empty().append(newTable);
      initializeDataTable(`admin-${type}-records`);
    }

    // console.log(newTable)
  }
};

const filterTableData = () => {
  const hallName = $("#hall-name-filter").val();
  const dept = $("#dept-filter").val();
  const startDate = $("#start-date").val();
  const endDate = $("#end-date").val();
  const selectedFood = [];

  // Get selected food options
  $("#food-dropdown input:checked").each(function () {
    selectedFood.push($(this).val());
  });

  const filteredData = [];
  // console.log(hallName)
  let dataToFilter;
  switch (currentState) {
    case "pending":
      dataToFilter = dataPending;
      break;
    case "accepted":
      dataToFilter = dataAllowed;
      break;
    case "denied":
      dataToFilter = dataDenied;
      break;
    case "cancelled":
      dataToFilter = dataCancelled;
      break;
    default:
      dataToFilter = [];
      break;
  }

  if (dataToFilter) {
    dataToFilter.forEach((booking) => {
      if (
        (hallName === "all" ||
          hallName === null ||
          booking.hallname === hallName) &&
        (dept === "all" || dept === null || booking.dept === dept) &&
        (startDate === "" ||
          startDate === null ||
          new Date(booking.date) >= new Date(startDate)) &&
        (endDate === "" ||
          endDate === null ||
          new Date(booking.date) <= new Date(endDate).setHours(23, 59, 59)) &&
        (selectedFood.length === 0 ||
          selectedFood.some((food) => booking.food.includes(food)))
      ) {
        const originalIndex = dataToFilter.findIndex(
          (item) => item === booking
        );

        filteredData.push({ booking, originalIndex });
      }
    });
    // console.log(filteredData)
  }

  // Clear existing table data
  $(`#admin-${currentState}-records tbody`).empty();

  // Create the table
  const table = $("<table>")
    .attr("id", `admin-${currentState}-records`)
    .addClass("display data-table")
    .css("width", "100%");

  // Create the table header
  const thead = $("<thead>").appendTo(table);
  $("<tr>")
    .appendTo(thead)
    .append("<th>No</th>")
    .append("<th>Hall name</th>")
    .append("<th>Name</th>")
    .append("<th>Dept</th>")
    .append("<th>Date</th>")
    .append("<th>Start Time</th>")
    .append("<th>End Time</th>")
    .append("<th>Seats</th>")
    .append("<th>Event Name</th>")
    .append("<th>Purpose</th>")
    .append("<th>Refresh For</th>")
    .append("<th>Refresh Type</th>")
    .append("<th>Food</th>");

  if (currentState === "pending") {
    thead.find("tr").append("<th>Accept</th>").append("<th>Reject</th>");
  } else if (currentState === "accepted") {
    thead.find("tr").append("<th>Reject</th>");
  } else if (currentState === "denied") {
    thead.find("tr").append("<th>Accept</th>");
  }

  // Create the table body
  const tbody = $("<tbody>").appendTo(table);

  // Populate table with filtered data
  filteredData.forEach(({ booking, originalIndex }) => {
    const newRow = $("<tr>");

    newRow.append(`<td>${originalIndex + 1}</td>`);
    newRow.append(`<td>${booking.hallname}</td>`);
    newRow.append(`<td>${booking.name}</td>`);
    newRow.append(`<td>${booking.dept}</td>`);
    newRow.append(
      `<td>${new Date(booking.date).toLocaleDateString("en-GB")}</td>`
    );
    newRow.append(
      `<td>${new Date(booking.starttime).getUTCHours() % 12 || 12}:${
        (new Date(booking.starttime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.starttime).getUTCMinutes()
      } ${new Date(booking.starttime).getUTCHours() < 12 ? "AM" : "PM"}</td>`
    );
    newRow.append(
      `<td>${new Date(booking.endtime).getUTCHours() % 12 || 12}:${
        (new Date(booking.endtime).getUTCMinutes() < 10 ? "0" : "") +
        new Date(booking.endtime).getUTCMinutes()
      } ${new Date(booking.endtime).getUTCHours() < 12 ? "AM" : "PM"}</td>`
    );
    newRow.append(`<td>${booking.seating}</td>`);
    newRow.append(`<td>${booking.eventname}</td>`);
    newRow.append(`<td>${booking.purpose.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmentfor.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.refreshmenttype.toLowerCase()}</td>`);
    newRow.append(`<td>${booking.food.join(" ")}</td>`);
    // Add other columns
    // ...

    if (currentState === "pending") {
      let acceptButtonStyle = "";
      if (booking.status === "denied_temp") {
        acceptButtonStyle =
          "background-color: #009150; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;opacity: 0.5;cursor: not-allowed;";
      } else {
        acceptButtonStyle =
          "background-color: #009150; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
      }
      newRow.append(
        `<td><button style="${acceptButtonStyle}" onclick="acceptBooking(${originalIndex}, 'admin-${currentState}-records', '${currentState}')">Accept</button></td>`
      );
      newRow.append(
        `<td><button style="${rejectButtonStyle}" onclick="rejectBooking(${originalIndex}, 'admin-${currentState}-records', '${currentState}')">Reject</button></td>`
      );
    } else if (currentState === "accepted") {
      newRow.append(
        `<td><button style="${rejectButtonStyle}" onclick="rejectBooking(${originalIndex}, 'admin-${currentState}-records', '${currentState}')">Reject</button></td>`
      );
    } else if (currentState === "denied") {
      newRow.append(
        `<td><button style="${acceptButtonStyle}" onclick="acceptBooking(${originalIndex}, 'admin-${currentState}-records', '${currentState}')">Accept</button></td>`
      );
    }

    tbody.append(newRow);
  });

  // Append the new table to the table-responsive div
  $(".table-responsive").empty().append(table);

  // Initialize DataTable for the new table
  $(`#admin-${currentState}-records`).DataTable();
};

// Event listener for filter options
$(".table-filter").change(function () {
  filterTableData(); // Filter table data when filter options change
});

// Initial filter of table data
// $(document).ready(function () {
//   filterTableData();
//   // updateTable(dataPending, 'pending');

//    // Filter table data initially
// });

// Initial filter of table data
// $(document).ready(function () {
//   getUsers();
// });

// Function to accept a booking
const acceptBooking = async (index, tableId, currData) => {
  let correctId;
  if (tableId === "admin-pending-records") {
    currData = dataPending;
    correctId = "pendingBookings";
  }
  if (tableId === "admin-denied-records") {
    currData = dataDenied;
    correctId = "deniedBookings";
  }
  // console.log(index)

  const email = currData[index].email;
  const hallName = currData[index].hallname;
  const date = currData[index].date;
  const startTime = currData[index].starttime;
  const endTime = currData[index].endtime;
  const currentStatus = currData[index].status;

  // console.log(index,currData[index])

  // console.log(currData[index].email,currData[index].hallname,currData[index].date)

  try {
    // Send request to update the status to accepted
    const response = await fetch(API_LOCAL + "/modify", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentStatus: currentStatus,
        updateStatus: "accepted",
        email,
        hallName,
        date,
        startTime,
        endTime,
      }),
      credentials: "include",
    });
    if (response.status == 401) {
      location.href = "/login/";
      return;
    }

    if (response.ok) {
      // Find the parent row of the button and remove it
      // const row = $(`#${tableId} tbody tr`).eq(index);
      // console.log(row)
      fetchAndDisplayData();
      // updateTable(originalData,currentStatus)
      console.log("table is updated");

      // Apply fadeOut animation
      // row.fadeOut(120, function() {
      //   // After animation completes, remove the row from the DOM
      //   row.remove();

      // });
    } else {
      console.error("Failed to update booking status.");
    }
    // console.log(got)
    // console.log(originalData)
  } catch (error) {
    console.error("Error while updating booking status:", error);
  }
};

// Function to reject a booking
const rejectBooking = async (index, tableId, currData) => {
  let correctId;
  if (tableId === "admin-pending-records") {
    currData = dataPending;
    correctId = "pendingBookings";
  }
  if (tableId === "admin-accepted-records") {
    currData = dataAllowed;
    correctId = "acceptedBookings";
  }

  const email = currData[index].email;
  const hallName = currData[index].hallname;
  const date = currData[index].date;
  const startTime = currData[index].starttime;
  const endTime = currData[index].endtime;
  const currentStatus = currData[index].status;

  // console.log(index,currData[index])
  // console.log(currData[index].email,currData[index].hallname,currData[index].date)

  try {
    // Send request to update the status to denied
    const response = await fetch(API_LOCAL + "/modify", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currentStatus: currentStatus,
        updateStatus: "denied",
        email,
        hallName,
        date,
        startTime,
        endTime,
      }),
      credentials: "include",
    });
    if (response.status == 401) {
      location.href = "/login/";
      return;
    }
    // const got = await response.json();
    // dataPending = got.pendingBookings;
    // dataAllowed = got.acceptedBookings;
    // dataDenied = got.deniedBookings;
    // const originalData = got[correctId];
    // console.log(dataPending)

    if (response.ok) {
      // Find the parent row of the button and remove it
      // const row = $(`#${tableId} tbody tr`).eq(index);
      fetchAndDisplayData();
      // updateTable(originalData,currentStatus)

      // Apply fadeOut animation
      // row.fadeOut(120, function() {
      //   // After animation completes, remove the row from the DOM
      //   row.remove();

      // });
    } else {
      console.error("Failed to update booking status.");
    }
    // console.log(got)
    // console.log(originalData)
  } catch (error) {
    console.error("Error while updating booking status:", error);
  }
};

$(document).ready(function () {
  // Event listener for list items
  $("#navbar li:not(#dashboardLink, #userLink,#tableLink)").click(function () {
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

$(document).on("click", "#view", async function () {
  const index = $(this).closest("tr").index(); // Get the index of the clicked row
  const booking = dataCancelled[index]; // Get the booking data for the clicked row

  $("#myModalLabel").text("Reason for event failed"); // Update the modal title

  // Update the modal body with the reason from the booking data
  $(".modal-body").html(`Event has been cancelled because ${booking.reason}.`);

  $("#myModal").modal("show"); // Show the modal popup
});

$("#closeModalBtn").click(function () {
  $("#myModal").modal("hide");
});
$("#crossBtnaccepted").click(function () {
  $("#myModal").modal("hide");
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
        "Content-Type": "application/json",
      },
    });
    if (res.status == 200) {
      location.href = "/login/";
    }
    ClearHistory();
    function ClearHistory() {
      var backlen = history.length;
      history.go(-backlen);
      connectFirestoreEmulator.log(history.length);
      window.location.href = "/login/";
    }
  });
});
localStorage.setItem("x", 1);
