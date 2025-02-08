// document.addEventListener('DOMContentLoaded', function() {
//   const sidebar = document.getElementById('sidebarMenu');
//   const sidebarToggle = document.getElementById('sidebarToggle');
//   const body = document.body;

//   sidebarToggle.addEventListener('click', function() {
//     // Toggle sidebar open class
//     sidebar.classList.toggle('open');
//     // Optionally, add a class to body to adjust content when sidebar is open
//     body.classList.toggle('sidebar-open');
//   });
// });


const hamBurger = document.querySelector(".toggle-btn");

hamBurger.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("expand");
});

