document.addEventListener("DOMContentLoaded", () => {
  const tutorialScroll = document.getElementById("tutorialScroll");
  const previousButton = document.getElementById("tutorialPrevious");
  const nextButton = document.getElementById("tutorialNext");

  if (tutorialScroll && previousButton && nextButton) {
    const getScrollAmount = () => {
      const firstCard = tutorialScroll.querySelector(".tutorial-slide");
      return firstCard
        ? firstCard.offsetWidth + 24
        : tutorialScroll.clientWidth;
    };

    previousButton.addEventListener("click", () => {
      tutorialScroll.scrollBy({
        left: -getScrollAmount(),
        behavior: "smooth"
      });
    });

    nextButton.addEventListener("click", () => {
      tutorialScroll.scrollBy({
        left: getScrollAmount(),
        behavior: "smooth"
      });
    });
  }

  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
});