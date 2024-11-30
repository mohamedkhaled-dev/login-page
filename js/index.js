//Global Variables
var wrapper = document.querySelector(".wrapper");
var forms = document.querySelectorAll("form");
var loginToggleBtn = document.querySelector(".login-toggle-btn");
var registerToggleBtn = document.querySelector(".register-toggle-btn");
var registerBtn = document.querySelector(".btn-register");
var loginBtn = document.querySelector(".btn-login");
var newUserName = document.getElementById("newUserName");
var newUserEmail = document.getElementById("newUserEmail");
var newUserPass = document.getElementById("newUserPass");
var userName = document.getElementById("userName");
var userPass = document.getElementById("userPass");
var emailDuplicateInfo = document.querySelector(".email-duplicate-info");
var userDuplicateInfo = document.querySelector(".user-duplicate-info");
var loginInputs = document.querySelectorAll("#userName, #userPass");
var registerInputs = document.querySelectorAll(
  "#newUserName, #newUserEmail, #newUserPass"
);

var regex = {
  newUserName: /^[a-zA-Z0-9]{3,15}(?:\s[a-zA-Z0-9]{3,15})?$/,
  newUserEmail: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  newUserPass:
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,30}$/,
};

// Update the users array value
var users = JSON.parse(localStorage.getItem("userList")) || [];

// Event Listener for registration / login Form Toggle
registerToggleBtn.addEventListener("click", function (e) {
  if (!wrapper.classList.contains("active")) {
    wrapper.classList.add("active");
    clearForm(registerInputs);
    clearForm(loginInputs, true);
  } else {
    wrapper.classList.remove("active");
    clearForm(registerInputs);
    clearForm(loginInputs, true);
  }
});

// Event Listener for Login Form Toggle
loginToggleBtn.addEventListener("click", function (e) {
  wrapper.classList.remove("active");
});

// ###### Registration form validation section ######

// Event listener for validation on sublimation
registerBtn.addEventListener("click", function (e) {
  if (!isFormEmpty(registerInputs, true) && isRegistrationFormValid()) {
    createUser();
  } else {
    return;
  }
});

// Create a new user (Registration)
function createUser() {
  var newUser = {
    name: newUserName.value,
    email: newUserEmail.value,
    pass: newUserPass.value,
  };

  if (isRegistrationDuplicate(newUser)) {
    return;
  }

  users.push(newUser);
  localStorage.setItem("userList", JSON.stringify(users));
  clearForm(registerInputs);
  wrapper.classList.remove("active");
}

// Check for duplicate username or email
function isRegistrationDuplicate(newUser) {
  for (var i = 0; i < users.length; i++) {
    // Check username duplication
    if (users[i].name === newUser.name) {
      userDuplicateInfo.classList.remove("d-none");
      userDuplicateInfo.previousElementSibling.classList.add("d-none");
      return true;
    } else {
      userDuplicateInfo.classList.add("d-none");
      userDuplicateInfo.previousElementSibling.classList.remove("d-none");
    }
    // Check user email duplication
    if (users[i].email === newUser.email) {
      emailDuplicateInfo.classList.remove("d-none");
      emailDuplicateInfo.previousElementSibling.classList.add("d-none");
      return true;
    } else {
      emailDuplicateInfo.classList.add("d-none");
      emailDuplicateInfo.previousElementSibling.classList.remove("d-none");
    }
  }

  return false;
}

// Function to validate the form as whole
function isRegistrationFormValid() {
  for (var i = 0; i < registerInputs.length; i++) {
    var input = registerInputs[i];
    if (!regex[input.id].test(input.value)) {
      return false;
    }
  }
  return true;
}

// Event listeners for real-time validation
for (var i = 0; i < registerInputs.length; i++) {
  registerInputs[i].addEventListener("input", function (e) {
    isRegistrationInputValid(e.target);
  });
}

// Function to validate each input of the form
function isRegistrationInputValid(input) {
  var emptyInfo = input.parentElement.nextElementSibling;
  var invalidInputInfo = emptyInfo.nextElementSibling;
  if (input.value && !regex[input.id].test(input.value)) {
    emptyInfo.classList.add("d-none");
    invalidInputInfo.classList.remove("d-none");
    invalidInputInfo.classList.add("invalid-input");
  } else if (input.value && regex[input.id].test(input.value)) {
    invalidInputInfo.classList.remove("invalid-input");
    invalidInputInfo.classList.add("valid-input");
  } else {
    invalidInputInfo.classList.remove("invalid-input", "valid-input");
  }
}

// Prevent the default behavior of the form
for (var i = 0; i < forms.length; i++) {
  forms[i].addEventListener("submit", function (e) {
    e.preventDefault();
  });
}

// Clear duplication message for username or email
function clearDuplicateMessage(input, duplicateInfo) {
  if (!isRegistrationInputValid(input)) {
    duplicateInfo.classList.add("d-none");
    duplicateInfo.previousElementSibling.classList.remove("d-none");
  }
}

// Event listener to clear real-time duplicate message
newUserName.addEventListener("input", function (e) {
  clearDuplicateMessage(e.target, userDuplicateInfo);
});

newUserEmail.addEventListener("input", function (e) {
  clearDuplicateMessage(e.target, emailDuplicateInfo);
});

// ###### Login form validation section ######

// Event Listener for Login access
loginBtn.addEventListener("click", function (e) {
  if (logInUser(userName, userPass)) {
    window.location.href = "dashboard.html";
    clearForm(loginInputs, true);
  }
});

// Login function to log user or break
function logInUser(userName, userPass) {
  if (!localStorage.getItem("userList")) {
    isFormEmpty(loginInputs);
    isLogInCorrect(userName, userPass, userList);
    return;
  }

  var userList = JSON.parse(localStorage.getItem("userList"));

  if (isFormEmpty(loginInputs)) {
    return;
  }

  if (isLogInCorrect(userName, userPass, userList)) {
    return true;
  }
}

var activeUserName = "";
function isLogInCorrect(userName, userPass, userList) {
  var incorrectInfo =
    userPass.parentElement.nextElementSibling.nextElementSibling;

  // Check if there are users saved in local storage
  if (userList) {
    for (var i = 0; i < userList.length; i++) {
      if (
        userName.value === userList[i].name &&
        userPass.value === userList[i].pass
      ) {
        activeUserName = userList[i].name;
        localStorage.setItem("activeUserName", activeUserName);
        incorrectInfo.classList.add("d-none");
        return true;
      }
    }
    incorrectInfo.classList.remove("d-none");
    return false;
  } else {
    if (userName.value && userPass.value) {
      incorrectInfo.classList.remove("d-none");
    }
    return false;
  }
}

// Function to check if input fields (login inputs or registration inputs) are empty or no
function isFormEmpty(inputArr, isRegistration) {
  for (var i = 0; i < inputArr.length; i++) {
    var input = inputArr[i];
    var emptyInfo = input.parentElement.nextElementSibling;
    var inputRules = emptyInfo.nextElementSibling;
    emptyInfo.classList.add("d-none");

    if (isRegistration) {
      // Registration form
      if (!inputArr[i].value) {
        emptyInfo.classList.remove("d-none");
        inputRules.classList.add("d-none");
        return true;
      } else {
        inputRules.classList.remove("d-none");
      }
    } else {
      // Login form
      if (!inputArr[i].value) {
        emptyInfo.classList.remove("d-none");
        return true;
      }
    }
  }
  return false;
}

// Function to clear the (login or registration) form
function clearForm(inputsArr, isLogin) {
  for (var i = 0; i < inputsArr.length; i++) {
    inputsArr[i].value = "";

    var emptyInfo = inputsArr[i].parentElement.nextElementSibling;
    var inputRules = emptyInfo.nextElementSibling;
    var duplicateInfo = inputRules.nextElementSibling;
    emptyInfo.classList.add("d-none");

    if (isLogin) {
      // Login form
      var invalidInputInfo =
        userPass.parentElement.nextElementSibling.nextElementSibling;
      invalidInputInfo.classList.add("d-none");
    } else {
      // Registration form
      inputRules.classList.remove("d-none");
      if (duplicateInfo) duplicateInfo.classList.add("d-none");
      isRegistrationInputValid(inputsArr[i]);
    }
  }
}
