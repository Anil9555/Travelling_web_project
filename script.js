"use strict";

const overlay = document.querySelector("[data-overlay]");
const navOpenBtn = document.querySelector("[data-nav-open-btn]");
const navbar = document.querySelector("[data-navbar]");
const navCloseBtn = document.querySelector("[data-nav-close-btn]");
const navLinks = document.querySelectorAll("[data-nav-link]");
const header = document.querySelector("[data-header]");
const goTopBtn = document.querySelector("[data-go-top]");

function toggleNavbar() {
  if (!navbar || !overlay) {
    return;
  }

  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

[navOpenBtn, navCloseBtn, overlay].filter(Boolean).forEach(element => {
  element.addEventListener("click", toggleNavbar);
});

navLinks.forEach(link => {
  link.addEventListener("click", function () {
    if (navbar?.classList.contains("active")) {
      toggleNavbar();
    }
  });
});

window.addEventListener("scroll", function () {
  const isScrolled = window.scrollY >= 200;

  if (header) {
    header.classList.toggle("active", isScrolled);
  }

  if (goTopBtn) {
    goTopBtn.classList.toggle("active", isScrolled);
  }
});

function openAuthModal() {
  const modal = document.getElementById("authModal");
  if (!modal) {
    return;
  }

  modal.style.display = "flex";
  showLogin();
}

function closeAuthModal() {
  const modal = document.getElementById("authModal");
  if (modal) {
    modal.style.display = "none";
  }
}

function showLogin() {
  document.getElementById("loginForm").style.display = "block";
  document.getElementById("signupForm").style.display = "none";
  document.getElementById("loginTab").classList.add("active");
  document.getElementById("signupTab").classList.remove("active");
}

function showSignup() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("signupForm").style.display = "block";
  document.getElementById("signupTab").classList.add("active");
  document.getElementById("loginTab").classList.remove("active");
}

function signupUser() {
  const result = window.travelAuth?.signup({
    name: document.getElementById("signupName").value,
    email: document.getElementById("signupEmail").value,
    password: document.getElementById("signupPassword").value
  });

  if (!result?.ok) {
    alert(result?.message || "Unable to create account.");
    return;
  }

  alert("Signup successful. Please log in.");
  showLogin();
  document.getElementById("loginEmail").value = result.user.email;
  document.getElementById("loginPassword").value = "";
}

function loginUser() {
  const result = window.travelAuth?.login({
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  });

  if (!result?.ok) {
    alert(result?.message || "Invalid credentials.");
    return;
  }

  alert("Login successful.");
  closeAuthModal();
  window.location.reload();
}

function checkLoginBeforeBooking() {
  if (!window.travelAuth?.isLoggedIn()) {
    openAuthModal();
    return false;
  }

  return true;
}

const searchCatalog = [
  {
    title: "Home",
    type: "Section",
    url: "#home",
    keywords: ["home", "landing", "hero", "journey", "explore world"]
  },
  {
    title: "About Us",
    type: "Page",
    url: "aboutus.html",
    keywords: ["about", "about us", "destination story", "discover paradise", "reviews"]
  },
  {
    title: "Contact Us",
    type: "Page",
    url: "contuct.html",
    keywords: ["contact", "contact us", "help", "support", "message", "phone", "email"]
  },
  {
    title: "Book Your Journey",
    type: "Page",
    url: "book.html",
    keywords: ["book", "booking", "reserve", "travel booking", "luxury suite", "payment"]
  },
  {
    title: "Enquiry Form",
    type: "Page",
    url: "enq.html",
    keywords: ["enquiry", "inquire", "inquiry", "trip inquiry", "dates", "pax"]
  },
  {
    title: "Popular Destinations",
    type: "Section",
    url: "#destination",
    keywords: ["destination", "destinations", "popular destination", "places", "travel places"]
  },
  {
    title: "Travel Packages",
    type: "Section",
    url: "#package",
    keywords: ["package", "packages", "holiday package", "tour package"]
  },
  {
    title: "Gallery",
    type: "Section",
    url: "#gallery",
    keywords: ["gallery", "photos", "travellers photos", "pictures"]
  },
  {
    title: "All Packages",
    type: "Page",
    url: "all_pakage.html",
    keywords: ["all packages", "all package", "full packages", "package list"]
  },
  {
    title: "More Destinations",
    type: "Page",
    url: "more_destination.html",
    keywords: ["more destinations", "all destinations", "destination list", "travel spots"]
  },
  {
    title: "San Miguel",
    type: "Destination",
    url: "more_info3.html",
    keywords: ["san miguel", "italy", "san miguel italy", "artistic beauty"]
  },
  {
    title: "Burj Khalifa",
    type: "Destination",
    url: "more_info2.html",
    keywords: ["burj khalifa", "dubai", "tower", "world tallest"]
  },
  {
    title: "Kyoto Temple",
    type: "Destination",
    url: "more_info4.html",
    keywords: ["kyoto", "kyoto temple", "japan", "temple japan"]
  },
  {
    title: "Taj Mahal",
    type: "Destination",
    url: "more_info.html",
    keywords: ["taj mahal", "agra", "india", "monument", "taj"]
  },
  {
    title: "India Gate",
    type: "Destination",
    url: "more_info5.html",
    keywords: ["india gate", "delhi", "beauty of india gate"]
  },
  {
    title: "West Bengal Beauty",
    type: "Destination",
    url: "more_info6.html",
    keywords: ["west bengal", "bengal", "kolkata", "west bengal beauty"]
  },
  {
    title: "Beach Holiday Package",
    type: "Package",
    url: "book.html?package=beach-holiday",
    keywords: ["beach holiday", "beach", "malaysia", "great holiday on beach"]
  },
  {
    title: "River Tour Package",
    type: "Package",
    url: "book.html?package=river-tour",
    keywords: ["river tour", "oxolotan river", "river", "summer holiday"]
  },
  {
    title: "Mountain Trek Package",
    type: "Package",
    url: "book.html?package=mountain-trek",
    keywords: ["mountain trek", "mountain", "trek", "adventure"]
  },
  {
    title: "Santorini Vacation",
    type: "Package",
    url: "all_pakage.html",
    keywords: ["santorini", "island", "weekend vacation", "greece"]
  },
  {
    title: "Lakshadweep Vacation",
    type: "Package",
    url: "all_pakage.html",
    keywords: ["lakshadweep", "island vacation", "island", "beach package"]
  }
];

function normalizeSearchText(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSearchResults(query) {
  const normalizedQuery = normalizeSearchText(query);

  if (!normalizedQuery) {
    return [];
  }

  return searchCatalog
    .map(item => {
      const haystack = normalizeSearchText([item.title, item.type, ...(item.keywords || [])].join(" "));
      let score = 0;

      if (normalizeSearchText(item.title) === normalizedQuery) {
        score += 120;
      }

      if (haystack.includes(normalizedQuery)) {
        score += 70;
      }

      normalizedQuery.split(" ").forEach(token => {
        if (token && haystack.includes(token)) {
          score += 15;
        }
      });

      return { ...item, score };
    })
    .filter(item => item.score > 0)
    .sort((first, second) => second.score - first.score)
    .slice(0, 6);
}

document.addEventListener("DOMContentLoaded", function () {
  const wrapper = document.querySelector(".search-wrapper");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const authTrigger = document.querySelector(".auth-toggle-btn");
  const currentUser = window.travelAuth?.getCurrentUser?.();
  let searchResultsBox = null;

  function closeSearchResults() {
    if (!searchResultsBox) {
      return;
    }

    searchResultsBox.innerHTML = "";
    searchResultsBox.classList.remove("active");
  }

  function goToSearchResult(item) {
    if (!item?.url) {
      return;
    }

    closeSearchResults();
    wrapper?.classList.remove("active");
    searchInput.value = "";

    if (item.url.startsWith("#")) {
      const target = document.querySelector(item.url);

      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }

      return;
    }

    window.location.href = item.url;
  }

  function renderSearchResults(results) {
    if (!searchResultsBox) {
      return;
    }

    if (!results.length) {
      searchResultsBox.innerHTML = '<button class="search-result empty" type="button">No matching result found</button>';
      searchResultsBox.classList.add("active");
      return;
    }

    searchResultsBox.innerHTML = results
      .map(item => (
        '<button class="search-result" type="button" data-url="' + item.url + '">' +
        '<span class="search-result-type">' + item.type + '</span>' +
        '<strong>' + item.title + '</strong>' +
        '</button>'
      ))
      .join("");

    searchResultsBox.classList.add("active");

    searchResultsBox.querySelectorAll(".search-result").forEach((button, index) => {
      if (results[index]?.url) {
        button.addEventListener("click", function () {
          goToSearchResult(results[index]);
        });
      }
    });
  }

  function performSearch() {
    const value = searchInput?.value.trim();

    if (!value) {
      closeSearchResults();
      return;
    }

    const results = getSearchResults(value);

    if (!results.length) {
      renderSearchResults([]);
      return;
    }

    goToSearchResult(results[0]);
  }

  if (wrapper && searchBtn && searchInput) {
    searchResultsBox = document.createElement("div");
    searchResultsBox.className = "search-results";
    wrapper.appendChild(searchResultsBox);

    searchBtn.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      if (!wrapper.classList.contains("active")) {
        wrapper.classList.add("active");
        searchInput.focus();
        return;
      }

      performSearch();
    });

    document.addEventListener("click", function (event) {
      if (!wrapper.contains(event.target)) {
        wrapper.classList.remove("active");
        closeSearchResults();
      }
    });

    searchInput.addEventListener("input", function () {
      const value = searchInput.value.trim();

      if (!value) {
        closeSearchResults();
        return;
      }

      renderSearchResults(getSearchResults(value));
    });

    searchInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        performSearch();
      }

      if (event.key === "Escape") {
        wrapper.classList.remove("active");
        closeSearchResults();
      }
    });
  }

  if (authTrigger && currentUser) {
    authTrigger.textContent = currentUser.name + " / Logout";
    authTrigger.removeAttribute("onclick");
    authTrigger.addEventListener("click", function () {
      if (window.travelAuth?.isLoggedIn()) {
        window.travelAuth.logout();
        window.location.reload();
      }
    });
  }
});
