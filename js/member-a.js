/* Member A: Home + Contact page interactions only */
(function ($) {
  "use strict";

  function setCurrentYear() {
    $("[data-current-year]").text(new Date().getFullYear());
  }

  function initMobileNavigation() {
    const navElement = document.getElementById("memberANavbar");
    if (!navElement || typeof bootstrap === "undefined") return;

    $(navElement).on("click", "a.nav-link", function () {
      const toggler = document.querySelector(".ma-navbar .navbar-toggler");
      if (toggler && window.getComputedStyle(toggler).display !== "none") {
        bootstrap.Collapse.getOrCreateInstance(navElement, { toggle: false }).hide();
      }
    });
  }

  function initScrollReveal() {
    const revealItems = document.querySelectorAll(".ma-reveal");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealItems.forEach(function (item) {
        item.classList.add("is-visible");
      });
      return;
    }

    revealItems.forEach(function (item) {
      item.classList.add("will-reveal");
    });

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -32px" });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  }

  function initContactForm() {
    const $form = $("#contactForm");
    if (!$form.length) return;

    const $message = $("#contactMessage");
    const $counter = $("#messageCount");
    const maxLength = Number($message.attr("maxlength")) || 1000;

    function updateMessageCount() {
      $counter.text($message.val().length + " / " + maxLength);
    }

    $message.on("input", updateMessageCount);
    updateMessageCount();

    $form.on("submit", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const form = this;
      const $name = $("#contactName");
      const $email = $("#contactEmail");

      $name.val($.trim($name.val()));
      $email.val($.trim($email.val()));
      $message.val($.trim($message.val()));
      updateMessageCount();

      $form.addClass("was-validated");

      if (!form.checkValidity()) {
        const firstInvalid = form.querySelector(":invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const firstName = $name.val().split(/\s+/)[0];
      $("#contactToastMessage").text(
        "Thanks, " + firstName + ". Your demo message passed validation. No data was sent to a server."
      );

      const toastElement = document.getElementById("contactSuccessToast");
      if (toastElement && typeof bootstrap !== "undefined") {
        bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 5200 }).show();
      }

      form.reset();
      $form.removeClass("was-validated");
      updateMessageCount();
    });
  }

  $(function () {
    setCurrentYear();
    initMobileNavigation();
    initScrollReveal();
    initContactForm();
  });
})(jQuery);
