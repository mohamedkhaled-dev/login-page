      // Logout to sign in page
      var logoutBtn = document.querySelector(".btn-logout");
      logoutBtn.addEventListener("click", function () {
        localStorage.removeItem("activeUserName");
        window.location.href = "index.html";
      });

      // Get active user name from the storage
      var activeUserName = localStorage.getItem("activeUserName");

      if (activeUserName) {
        document.getElementById("usernameDisplay").textContent = activeUserName;
      } else {
        document.getElementById("usernameDisplay").textContent = "User";
      }