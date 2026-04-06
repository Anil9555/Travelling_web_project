document.addEventListener("DOMContentLoaded", function () {
  const toggle = document.getElementById("themeToggle");
  const theme = localStorage.getItem("theme") === "dark" ? "dark" : "light";

  document.body.classList.toggle("dark-mode", theme === "dark");

  if (!toggle) {
    return;
  }

  function updateToggleText(isDarkMode) {
    toggle.innerText = isDarkMode ? "Light mode" : "Dark mode";
    toggle.setAttribute("aria-pressed", isDarkMode ? "true" : "false");
  }

  updateToggleText(theme === "dark");

  toggle.addEventListener("click", function () {
    const isDarkMode = document.body.classList.toggle("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    updateToggleText(isDarkMode);
  });
});
