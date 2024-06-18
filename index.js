const nameField = document.getElementById("name");
const rollNo = document.getElementById("rollNo");
const email = document.getElementById("email");
const phone = document.getElementById("phoneNo");
const tableContainer = document.getElementById("table-container");
const errorMessages = document.getElementById("errorMessages");

const button = document.querySelector(".buttoninput");

button.addEventListener("click", studentDetails);

const table = document.createElement("table");
table.className = "table-auto w-full text-left";

tableContainer.appendChild(table);

const headerRow = document.createElement("tr");
const headers = ["Name", "Roll No.", "Email", "Phone No.", "Actions"];

headers.forEach((headerText) => {
  const th = document.createElement("th");
  th.textContent = headerText; // Set the text content of the header cell
  headerRow.appendChild(th); // Append the header cell to the header row
});
table.appendChild(headerRow); // Append the header row to the table

let editingRow = null;

// Load data from local storage on page load
document.addEventListener("DOMContentLoaded", loadTableFromLocalStorage);

function loadTableFromLocalStorage() {
  const storedData = JSON.parse(localStorage.getItem("details")) || [];
  storedData.forEach((student, index) => {
    appendToTable(student, index);
  });
}

function studentDetails() {
  errorMessages.innerHTML = "";

  if (!validateEmail(email.value)) {
    errorMessages.innerHTML += "<p>Invalid email format.</p>";
    return;
  }

  if (!validatePhone(phone.value)) {
    errorMessages.innerHTML += "<p>Phone number must contain only numbers.</p>";
    return;
  }

  const existingData = JSON.parse(localStorage.getItem("details")) || [];

  if (
    nameField.value === "" ||
    rollNo.value === "" ||
    email.value === "" ||
    phone.value === ""
  ) {
    alert("Please fill out all fields before submitting.");
    return;
  }

  if (editingRow) {
    const index = editingRow.rowIndex - 1; // Adjust for header row
    const updatedData = {
      name: nameField.value,
      roll: rollNo.value,
      email: email.value,
      phone: phone.value,
    };
    existingData[index] = updatedData;
    localStorage.setItem("details", JSON.stringify(existingData));
    updateTable();
    editingRow = null;
  } else {
    const student = {
      name: nameField.value,
      roll: rollNo.value,
      email: email.value,
      phone: phone.value,
    };
    existingData.push(student);
    localStorage.setItem("details", JSON.stringify(existingData));
    appendToTable(student, existingData.length - 1);
  }

  nameField.value = "";
  rollNo.value = "";
  email.value = "";
  phone.value = "";
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^\d+$/;
  return re.test(phone);
}

function appendToTable(student, index) {
  const row = document.createElement("tr");
  table.appendChild(row);

  const nameCell = document.createElement("td");
  nameCell.innerHTML = student.name;
  row.appendChild(nameCell);

  const rollCell = document.createElement("td");
  rollCell.innerHTML = student.roll;
  row.appendChild(rollCell);

  const emailCell = document.createElement("td");
  emailCell.innerHTML = student.email;
  row.appendChild(emailCell);

  const phoneCell = document.createElement("td");
  phoneCell.innerHTML = student.phone;
  row.appendChild(phoneCell);

  const actionsCell = document.createElement("td");

  const deleteButton = document.createElement("button");
  deleteButton.innerHTML = '<i class="fa-solid fa-trash-arrow-up"></i>';
  deleteButton.classList.add("trash-button");
  actionsCell.appendChild(deleteButton);
  deleteButton.style.padding = "3px";

  const resetButton = document.createElement("button");
  resetButton.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  resetButton.classList.add("edit-button");
  actionsCell.appendChild(resetButton);

  row.appendChild(actionsCell);
}

tableContainer.addEventListener("click", deleteItem);

function deleteItem(e) {
  const item = e.target;
  if (
    item.classList.contains("trash-button") ||
    item.closest(".trash-button")
  ) {
    const parentRow = item.closest("tr");
    const index = parentRow.rowIndex - 1; // Adjust for header row
    removeFromLocalStorage(index);
    parentRow.remove();
    updateTable();
  } else if (
    item.classList.contains("edit-button") ||
    item.closest(".edit-button")
  ) {
    const parentRow = item.closest("tr");
    nameField.value = parentRow.children[0].innerText;
    rollNo.value = parentRow.children[1].innerText;
    email.value = parentRow.children[2].innerText;
    phone.value = parentRow.children[3].innerText;
    editingRow = parentRow;
  }
}


// remove the data in local storage 
function removeFromLocalStorage(index) {
  let existingData = JSON.parse(localStorage.getItem("details")) || [];
  if (index > -1) {
    existingData.splice(index, 1); // Remove the element at the specified index
    localStorage.setItem("details", JSON.stringify(existingData));
  }
}

function updateTable() {
  table.innerHTML = "";
  table.appendChild(headerRow);
  loadTableFromLocalStorage();
}
