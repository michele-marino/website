document.addEventListener("DOMContentLoaded", () => {
  // Function to get JSON URL from the query parameter
  function getJsonUrlFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonUrl = urlParams.get("jsonurl");
    return jsonUrl || "content.json"; // Default to 'content.json' if no URL is specified
  }

  // Get JSON URL from URL or default to 'content.json'
  const jsonUrl = getJsonUrlFromUrl();

  fetch(jsonUrl)
    .then((response) => response.json())
    .then((data) => {
      const mainText = document.querySelector(".main-text");
      if (mainText) {
        mainText.textContent = data.mainSection.Text; // Set the text content
      }
      // Load the scroll sections and content
      data.sections.forEach((section) => {
        const scrollSection = document.querySelector(`#${section.id}`);
        const scrollContent = scrollSection.querySelector(".scroll-content");

        // Set the title and subtitle in the fixed part
        const fixedPart = scrollSection.querySelector(".fixed-part");
        fixedPart.querySelector(".title").textContent = section.title;
        fixedPart.querySelector(".subtitle").textContent = section.subtitle;

        section.contents.forEach((content, index) => {
          const scrollingPart = scrollContent.children[index];
          scrollingPart.querySelector(".left-content .text").textContent =
            content.text;

          if (content.isImage) {
            const imageElement = document.createElement("img");
            imageElement.src = content.image;
            scrollingPart
              .querySelector(".right-content .media")
              .appendChild(imageElement);
          } else if (content.canvasType === "chart") {
            const canvasElement = document.createElement("div");
            canvasElement.classList.add("chartjs-canvas");
            scrollingPart
              .querySelector(".right-content .media")
              .appendChild(canvasElement);

            // Call the specified function to generate the Chart.js content
            if (
              content.contentFunction &&
              typeof window[content.contentFunction] === "function"
            ) {
              window[content.contentFunction](canvasElement);
            }
          } else if (content.canvasType === "babylon") {
            const canvasElement = document.createElement("div");
            canvasElement.classList.add("babylon-canvas");
            scrollingPart
              .querySelector(".right-content .media")
              .appendChild(canvasElement);

            // Call the specified function to generate the Babylon.js content
            if (
              content.contentFunction &&
              typeof window[content.contentFunction] === "function"
            ) {
              window[content.contentFunction](canvasElement);
            }
          } else {
            const divElement = document.createElement("div");
            divElement.classList.add("generic-content");
            scrollingPart
              .querySelector(".right-content .media")
              .appendChild(divElement);

            // Call the specified function to generate the generic content
            if (
              content.contentFunction &&
              typeof window[content.contentFunction] === "function"
            ) {
              window[content.contentFunction](divElement);
            }
          }
        });
      });

      // Add event listeners to stop scroll propagation on canvas elements
      document
        .querySelectorAll(".scrolling-part .media canvas")
        .forEach((canvas) => {
          canvas.addEventListener("wheel", (event) => {
            if (!event.target.closest(".media")) {
              event.preventDefault();
            }
            event.stopPropagation();
          });
          canvas.addEventListener("touchmove", (event) => {
            if (!event.target.closest(".media")) {
              event.preventDefault();
            }
            event.stopPropagation();
          });
        });
    })
    .catch((error) => console.error("Error fetching JSON:", error));

  function initializeScrollSection(sectionId) {
    const scrollSection = document.querySelector(`#${sectionId}`);
    const scrollContent = scrollSection.querySelector(".scroll-content");
    const contents = scrollContent.querySelectorAll(".scrolling-part");
    const dots = scrollSection.querySelectorAll(".pagination-dots .dot");

    let index = 0;
    let scrollCounter = 0;
    const scrollThreshold = 20; // Adjust as needed to make the scroll less sensitive

    function updateDots(currentIndex) {
      dots.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.classList.add("active");
        } else {
          dot.classList.remove("active");
        }
      });
    }

    scrollSection.addEventListener("wheel", (event) => {
      event.preventDefault();

      // Update scroll counter based on scroll direction
      scrollCounter += event.deltaY;

      if (scrollCounter > scrollThreshold) {
        // Scroll down
        index = (index + 1) % contents.length;
        scrollContent.style.transform = `translateX(-${index * 100}vw)`;
        scrollCounter = 0; // Reset counter
        updateDots(index);
      } else if (scrollCounter < -scrollThreshold) {
        // Scroll up
        index = (index - 1 + contents.length) % contents.length;
        scrollContent.style.transform = `translateX(-${index * 100}vw)`;
        scrollCounter = 0; // Reset counter
        updateDots(index);
      }
    });

    // Handle touch events for mobile
    let touchStartX = 0;

    scrollSection.addEventListener("touchstart", (event) => {
      touchStartX = event.touches[0].clientX;
    });

    scrollSection.addEventListener("touchmove", (event) => {
      const touchEndX = event.touches[0].clientX;
      const touchDeltaX = touchStartX - touchEndX;

      if (touchDeltaX > scrollThreshold) {
        // Swipe left
        index = (index + 1) % contents.length;
        scrollContent.style.transform = `translateX(-${index * 100}vw)`;
        touchStartX = touchEndX; // Reset touch start
        updateDots(index);
      } else if (touchDeltaX < -scrollThreshold) {
        // Swipe right
        index = (index - 1 + contents.length) % contents.length;
        scrollContent.style.transform = `translateX(-${index * 100}vw)`;
        touchStartX = touchEndX; // Reset touch start
        updateDots(index);
      }
    });

    // Initialize dots
    updateDots(index);
  }

  // Initialize all scroll sections
  initializeScrollSection("scroll-section-1");
  initializeScrollSection("scroll-section-2");
  initializeScrollSection("scroll-section-3");
});
