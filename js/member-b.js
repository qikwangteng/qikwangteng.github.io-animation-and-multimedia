/* Tutorial Data & Configuration */
const tutorialData = [
  { session: "SESSION 01", icon: "bi bi-play-circle", category: "Animation Fundamentals", title: "Timing & Spacing", description: "Understand how timing and spacing affect weight, speed and personality in animated movement.", video: "https://youtu.be/6UXjRCORV44?si=C7zT4BpFZVD85gS4" },
  { session: "SESSION 02", icon: "bi bi-magic", category: "Post Production", title: "Introduction to VFX", description: "Learn the basic workflow for compositing, masking and creating simple visual effects in a video project.", video: "https://youtu.be/CZBKH-8lMEc?si=_mBjJHxHKgbyn1yr" },
  { session: "SESSION 03", icon: "bi bi-lightbulb", category: "Lighting & Mood", title: "Lighting for Storytelling", description: "Explore how light direction, contrast and colour can shape emotion and guide attention in a scene.", video: "https://youtu.be/yppbK86LZ_g?si=N7BYOpqXmuJKw9tb" },
  { session: "SESSION 04", icon: "bi bi-paint-bucket", category: "Character Design", title: "Shape Language Basics", description: "Build memorable characters by using silhouette, proportion and expression to communicate personality quickly.", video: "https://youtu.be/v6n9OYtaWZs?si=mkUjVZemPDVhqYZt" },
  { session: "SESSION 05", icon: "bi bi-box-seam", category: "3D Modelling", title: "Low Poly Modelling Workflow", description: "Learn a simple 3D modelling pipeline for creating clean, stylised props and environment assets.", video: "https://youtu.be/6mT4XFJYq-4?si=DdiKYde0W2HSCba2" },
  { session: "SESSION 06", icon: "bi bi-volume-up", category: "Audio & Editing", title: "Sound Design for Motion", description: "Discover how layered sound, transitions and rhythm can improve pacing and bring motion graphics to life.", video: "https://youtu.be/tzfzkTAQsnE?si=wCTvQDpU0t2Kj_XX" }
];

/* localStorage-backed "saved for later" events (persists across browser sessions) */
const savedEventsStore = {
  KEY: "savedEvents",
  getAll() {
    try {
      return JSON.parse(localStorage.getItem(this.KEY) || "[]");
    } catch (error) {
      console.error("Could not read saved events from localStorage:", error);
      return [];
    }
  },
  toggle(eventName) {
    const saved = this.getAll();
    const index = saved.indexOf(eventName);
    if (index === -1) {
      saved.push(eventName);
    } else {
      saved.splice(index, 1);
    }
    localStorage.setItem(this.KEY, JSON.stringify(saved));
    return saved;
  }
};

function initSavedEvents() {
  const savedCountLabel = document.getElementById("savedCountNum");

  function refreshBookmarkUI() {
    const saved = savedEventsStore.getAll();
    if (savedCountLabel) savedCountLabel.textContent = saved.length;
    document.querySelectorAll(".save-btn").forEach((button) => {
      const isSaved = saved.includes(button.dataset.event);
      button.classList.toggle("active", isSaved);
      button.setAttribute("aria-pressed", String(isSaved));
      button.innerHTML = isSaved
        ? '<i class="bi bi-bookmark-fill"></i>'
        : '<i class="bi bi-bookmark"></i>';
    });
  }

  document.querySelectorAll(".save-btn").forEach((button) => {
    button.addEventListener("click", () => {
      savedEventsStore.toggle(button.dataset.event);
      refreshBookmarkUI();
      const activeFilterBtn = document.querySelector(".filter-btn.active");
      if (activeFilterBtn && activeFilterBtn.dataset.filter === "saved") {
        applyFilter("saved");
      }
    });
  });

  refreshBookmarkUI();
}

const cookie = {
  set(name, value, days) {
    const expiry = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expiry}; path=/; SameSite=Lax`;
  },
  get(name) {
    const target = `${encodeURIComponent(name)}=`;
    const match = document.cookie.split(";").map((item) => item.trim()).find((item) => item.indexOf(target) === 0);
    return match ? decodeURIComponent(match.substring(target.length)) : null;
  }
};

/* Tutorial Rendering & Animations */
function renderTutorialCards() {
  const container = document.getElementById("tutorialList");
  if (!container) return;
  container.innerHTML = tutorialData.map(({ session, icon, category, title, description, video }) => `
    <div class="col-lg-6 reveal">
      <article class="tutorial-card h-100" data-video="${video}">
        <div class="tutorial-thumb">
          <i class="${icon}"></i>
          <span>${session}</span>
        </div>
        <div class="p-4">
          <span class="event-category">${category}</span>
          <h3>${title}</h3>
          <p>${description}</p>
          <button class="btn btn-accent tutorial-btn" data-title="${title}" data-video="${video}">Watch Workshop <i class="bi bi-play-fill"></i></button>
        </div>
      </article>
    </div>
  `).join("");
  revealOnIntersect();
}

function revealOnIntersect() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

/* Media Processing & Preview Injection */
function getYouTubeVideoId(url) {
  if (!url) return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  return match ? match[1] : "";
}

function injectTutorialPreview() {
  document.querySelectorAll(".tutorial-card").forEach((card) => {
    const videoId = getYouTubeVideoId(card.dataset.video || "");
    const thumb = card.querySelector(".tutorial-thumb");
    if (!videoId || !thumb || thumb.querySelector("img.tutorial-preview")) return;
    const previewImage = document.createElement("img");
    previewImage.className = "tutorial-preview";
    previewImage.src = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    previewImage.alt = "Tutorial preview";
    previewImage.loading = "lazy";
    thumb.appendChild(previewImage);
  });
}

/* Event Filtering & Display Control */
function applyFilter(filter) {
  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
  const savedList = filter === "saved" ? savedEventsStore.getAll() : null;
  const eventItems = document.querySelectorAll(".event-item");
  let visibleCount = 0;
  eventItems.forEach((item) => {
    let shouldShow;
    if (filter === "saved") {
      const saveBtn = item.querySelector(".save-btn");
      shouldShow = !!saveBtn && savedList.includes(saveBtn.dataset.event);
    } else {
      shouldShow = filter === "all" || item.dataset.category === filter;
    }
    item.style.display = shouldShow ? "" : "none";
    if (shouldShow) visibleCount += 1;
  });
  const emptyState = document.getElementById("emptyEvents");
  if (emptyState) {
    emptyState.textContent = filter === "saved"
      ? "You haven't saved any events yet. Click the bookmark icon on an event to save it for later."
      : "No events are available in this category yet.";
    emptyState.classList.toggle("d-none", visibleCount !== 0);
  }
}

/* Page Initialization & Event Handlers */
function initEventsPage() {
  const savedFilter = cookie.get("eventFilter") || "all";
  const validFilter = document.querySelector(`.filter-btn[data-filter="${savedFilter}"]`) ? savedFilter : "all";
  applyFilter(validFilter);
  injectTutorialPreview();
  initSavedEvents();

  document.querySelectorAll(".filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      applyFilter(filter);
      cookie.set("eventFilter", filter, 7);
    });
  });

  let selectedEvent = "";
  const interestModal = document.getElementById("interestModal") ? bootstrap.Modal.getOrCreateInstance(document.getElementById("interestModal")) : null;

  document.querySelectorAll(".register-btn").forEach((button) => {
    button.addEventListener("click", () => {
      selectedEvent = button.dataset.event;
      const selectedText = document.getElementById("selectedEventText");
      if (selectedText) selectedText.textContent = `Selected event: ${selectedEvent}`;
      if (interestModal) interestModal.show();
    });
  });

  const interestForm = document.getElementById("interestForm");
  if (interestForm) {
    interestForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const studentName = document.getElementById("studentName")?.value.trim();
      const studentEmail = document.getElementById("studentEmail")?.value.trim();
      if (!studentName || !studentEmail) return;
      if (document.getElementById("eventReminder")?.checked) {
        cookie.set("rememberedEvent", selectedEvent, 3);
      }
      interestForm.reset();
      if (interestModal) interestModal.hide();
      const toastElement = document.getElementById("successToast");
      if (toastElement) {
        new bootstrap.Toast(toastElement).show();
      }
    });
  }

  document.addEventListener("click", (event) => {
    const button = event.target.closest(".tutorial-btn");
    if (!button) return;
    const tutorialTitle = button.dataset.title || "tutorial";
    const tutorialVideo = button.dataset.video || `https://www.youtube.com/results?search_query=${encodeURIComponent(`${tutorialTitle} tutorial`)}`;
    window.open(tutorialVideo, "_blank", "noopener,noreferrer");
  });
}

function initMemberScroll() {
  const memberScroll = document.getElementById("memberScroll");
  const leftButton = document.querySelector(".scroll-left");
  const rightButton = document.querySelector(".scroll-right");
  if (!memberScroll || !leftButton || !rightButton) {
    console.warn("Committee member carousel elements are missing.");
    return;
  }
  const getScrollAmount = () => {
    const firstCard = memberScroll.querySelector(".member-slide");
    return firstCard ? firstCard.offsetWidth + 25 : memberScroll.clientWidth * 0.8;
  };
  rightButton.addEventListener("click", () => {
    memberScroll.scrollBy({ left: getScrollAmount(), behavior: "smooth" });
  });
  leftButton.addEventListener("click", () => {
    memberScroll.scrollBy({ left: -getScrollAmount(), behavior: "smooth" });
  });
}

/* Application Entry Point */
document.addEventListener("DOMContentLoaded", () => {
  const currentPage = document.body.dataset.page;
  if (currentPage) {
    cookie.set("memberBLastPage", currentPage, 7);
  }
  if (document.body.dataset.page === "events") {
    renderTutorialCards();
    initEventsPage();
  } else {
    revealOnIntersect();
  }
  initMemberScroll();
});
