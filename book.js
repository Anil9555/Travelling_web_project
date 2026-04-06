"use strict";

let currentStep = 0;
let selectedPackage = "";
let selectedDescription = "";
let basePrice = 0;
let stayPrice = 0;
let addonPrice = 0;
let discount = 0;
let selectedAddons = [];

document.addEventListener("DOMContentLoaded", function () {
  const steps = Array.from(document.querySelectorAll(".booking-step"));
  const circles = Array.from(document.querySelectorAll(".booking-circle"));
  const progressBar = document.getElementById("progress");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const stepTitle = document.getElementById("stepTitle");
  const stepCounter = document.getElementById("stepCounter");
  const packageNameEl = document.getElementById("packageName");
  const packagePriceEl = document.getElementById("packagePrice");
  const stayPriceEl = document.getElementById("stayPrice");
  const addonPriceEl = document.getElementById("addonPrice");
  const totalPriceEl = document.getElementById("totalPrice");
  const packageDescriptionEl = document.getElementById("packageDescription");
  const discountLabel = document.getElementById("discountLabel");
  const confirmationCard = document.getElementById("confirmationCard");
  const bookingSuccess = document.getElementById("bookingSuccess");
  const roomType = document.getElementById("roomType");
  const transferType = document.getElementById("transferType");

  if (!window.travelAuth?.isLoggedIn()) {
    alert("Please log in before starting your booking.");
    window.location.href = "index.html";
    return;
  }

  const currentUser = window.travelAuth.getCurrentUser();
  document.getElementById("travelerName").value = currentUser.name || "";
  document.getElementById("travelerEmail").value = currentUser.email || "";

  function formatDate(dateValue) {
    if (!dateValue) {
      return "-";
    }

    return new Date(dateValue).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  }

  function updateStayPrice() {
    const roomPrice = Number(roomType?.selectedOptions?.[0]?.dataset.price || 0);
    const transferPrice = Number(transferType?.selectedOptions?.[0]?.dataset.price || 0);
    stayPrice = roomPrice + transferPrice;
    stayPriceEl.textContent = stayPrice;
    calculateTotal();
  }

  function calculateTotal() {
    let total = basePrice + stayPrice + addonPrice;

    if (discount > 0) {
      total -= Math.round((total * discount) / 100);
    }

    totalPriceEl.textContent = total;
    document.getElementById("reviewTotal").textContent = total;
  }

  function refreshReview() {
    const traveler = document.getElementById("travelerName").value.trim();
    const packageLabel = selectedPackage || "-";
    const checkin = document.getElementById("checkinDate").value;
    const checkout = document.getElementById("checkoutDate").value;
    const roomLabel = roomType.value;
    const transferLabel = transferType.value;

    document.getElementById("reviewTraveler").textContent = traveler || currentUser.name;
    document.getElementById("reviewPackage").textContent = packageLabel;
    document.getElementById("reviewDates").textContent =
      checkin && checkout ? `${formatDate(checkin)} to ${formatDate(checkout)}` : "-";
    document.getElementById("reviewStayPlan").textContent = `${roomLabel} / ${transferLabel}`;
    document.getElementById("reviewAddons").textContent =
      selectedAddons.length > 0 ? selectedAddons.join(", ") : "None selected";
  }

  function updateStepUi() {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === currentStep);
    });

    circles.forEach((circle, index) => {
      circle.classList.toggle("active", index <= currentStep);
    });

    progressBar.style.width = `${(currentStep / (circles.length - 1)) * 100}%`;
    stepTitle.textContent = steps[currentStep].dataset.stepTitle;
    stepCounter.textContent = `Step ${currentStep + 1} of ${steps.length}`;
    prevBtn.disabled = currentStep === 0;

    if (currentStep === steps.length - 1) {
      nextBtn.textContent = "Confirm Booking";
      refreshReview();
    } else {
      nextBtn.textContent = "Continue";
    }
  }

  function validateStep() {
    if (currentStep === 0 && !selectedPackage) {
      alert("Please choose a package to continue.");
      return false;
    }

    if (currentStep === 1) {
      const required = ["travelerName", "travelerEmail", "travelerPhone", "guestCount"];
      const hasEmpty = required.some(id => !document.getElementById(id).value.trim());
      if (hasEmpty) {
        alert("Please complete all traveller details.");
        return false;
      }

      const phone = document.getElementById("travelerPhone").value.trim();
      const guests = Number(document.getElementById("guestCount").value);

      // Indian mobile number validation (starts with 6-9, 10 digits total)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone)) {
        alert("Please enter a valid 10-digit Indian mobile number.");
        return false;
      }

      if (guests > 5) {
        alert("The maximum number of guests allowed is 5 per booking.");
        return false;
      }
    }

    if (currentStep === 2) {
      const checkin = document.getElementById("checkinDate").value;
      const checkout = document.getElementById("checkoutDate").value;

      if (!checkin || !checkout) {
        alert("Please add your check-in and check-out dates.");
        return false;
      }

      if (new Date(checkout) <= new Date(checkin)) {
        alert("Check-out date must be after check-in date.");
        return false;
      }
    }

    if (currentStep === 3) {
      const cardNumber = document.getElementById("cardNumber").value.trim();
      const cardHolder = document.getElementById("cardHolder").value.trim();
      const expiryDate = document.getElementById("expiryDate").value.trim();
      const cvv = document.getElementById("cvv").value.trim();

      if (!cardNumber || !cardHolder || !expiryDate || !cvv) {
        alert("Please complete your payment details.");
        return false;
      }
    }

    return true;
  }

  function confirmBooking() {
    refreshReview();
    confirmationCard.hidden = false;
    bookingSuccess.textContent =
      `${document.getElementById("travelerName").value.trim()}, your ${selectedPackage} reservation is confirmed.`;

    localStorage.setItem(
      "latestBooking",
      JSON.stringify({
        traveler: document.getElementById("travelerName").value.trim(),
        email: document.getElementById("travelerEmail").value.trim(),
        phone: document.getElementById("travelerPhone").value.trim(),
        guests: document.getElementById("guestCount").value,
        packageName: selectedPackage,
        packageDescription: selectedDescription,
        checkin: document.getElementById("checkinDate").value,
        checkout: document.getElementById("checkoutDate").value,
        roomType: roomType.value,
        transferType: transferType.value,
        addons: selectedAddons,
        basePrice,
        stayPrice,
        addonPrice,
        discount,
        total: Number(totalPriceEl.textContent)
      })
    );

    nextBtn.disabled = true;
    prevBtn.disabled = true;
  }

  window.selectPackage = function (card, name, price, description) {
    selectedPackage = name;
    selectedDescription = description;
    basePrice = Number(price);

    document.querySelectorAll(".booking-card").forEach(item => item.classList.remove("active"));
    card.classList.add("active");

    packageNameEl.textContent = name;
    packagePriceEl.textContent = basePrice;
    packageDescriptionEl.textContent = description;

    refreshReview();
    calculateTotal();
  };

  window.updateAddons = function (checkbox) {
    const value = Number(checkbox.value);
    const label = checkbox.dataset.addonLabel;

    if (checkbox.checked) {
      addonPrice += value;
      selectedAddons.push(label);
    } else {
      addonPrice -= value;
      selectedAddons = selectedAddons.filter(item => item !== label);
    }

    addonPriceEl.textContent = addonPrice;
    refreshReview();
    calculateTotal();
  };

  window.applyCoupon = function () {
    const code = document.getElementById("couponInput").value.trim().toUpperCase();

    if (code === "TRAVEL10") {
      discount = 10;
      discountLabel.textContent = "TRAVEL10 / 10% off";
      alert("TRAVEL10 applied successfully.");
    } else if (code === "SUMMER20") {
      discount = 20;
      discountLabel.textContent = "SUMMER20 / 20% off";
      alert("SUMMER20 applied successfully.");
    } else {
      discount = 0;
      discountLabel.textContent = "No coupon";
      alert("Coupon not recognised.");
    }

    calculateTotal();
  };

  roomType.addEventListener("change", function () {
    updateStayPrice();
    refreshReview();
  });

  transferType.addEventListener("change", function () {
    updateStayPrice();
    refreshReview();
  });

  prevBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      currentStep -= 1;
      updateStepUi();
    }
  });

  nextBtn.addEventListener("click", function () {
    if (!validateStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
      currentStep += 1;
      updateStepUi();
      return;
    }

    confirmBooking();
  });

  updateStayPrice();
  refreshReview();
  updateStepUi();
});
