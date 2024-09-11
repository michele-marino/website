document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".toggable-section");

  sections.forEach((section) => {
    const header = section.querySelector(".header");
    const content = section.querySelector(".toggable-section-content");
    const icon = section.querySelector(".toggle-icon");

    header.addEventListener("click", () => {
      content.classList.toggle("open");
      icon.classList.toggle("open");
      sendHeight();

      if (content.classList.contains("open")) {
        // Get all chart canvases in the section
        //console.log("Section opened:", section);

        const canvases = content.querySelectorAll(".chartjs-canvas canvas");
        //console.log('Found canvases:', canvases);
        // Set the width and height of each canvas
        canvases.forEach((canvas) => {
          canvas.style.width = "300px";
          canvas.style.height = "300px";
        });

        // Optionally, you can re-render the chart if needed
        canvases.forEach((canvas) => {
          const chart = Chart.getChart(canvas);
          if (chart) {
            chart.resize(); // Resize the chart to fit the new dimensions
          }
        });
      }

    });

    function sendHeight() {
      var height = document.documentElement.scrollHeight;
      window.parent.postMessage(height, "*");
    }

    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);
  });


  function getJsonUrlFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const jsonUrl = urlParams.get("jsonurl");
    return jsonUrl || "content.json"; // Default to 'content.json' if no URL is specified
  }

  // Get JSON URL from URL or default to 'content.json'
  const jsonUrl = getJsonUrlFromUrl();


    // Function to dynamically load the script files
    function loadScripts(scriptFiles) {
      return scriptFiles.reduce((promiseChain, scriptObj) => {
          return promiseChain.then(() => {
              return new Promise((resolve, reject) => {
                  const script = document.createElement('script');
                  script.src = scriptObj.scriptFile;
                  script.async = false; // Ensures scripts load in the order they're appended
                  script.onload = () => {
                      console.log(`Script loaded: ${scriptObj.scriptFile}`);
                      resolve();
                  };
                  script.onerror = () => {
                      console.error(`Failed to load script: ${scriptObj.scriptFile}`);
                      reject();
                  };
                  document.body.appendChild(script);
              });
          });
      }, Promise.resolve()); // Start with a resolved promise to chain the script loading
  }



// Fetch JSON data and process it once scripts are loaded
fetch(jsonUrl)
.then(response => response.json())
.then(data => {
    if (data.scriptFiles) {
        // Load the scripts from the scriptFiles array first
        loadScripts(data.scriptFiles).then(() => {
            // Once all scripts are loaded, now process the JSON
            processJsonData(data);
        }).catch(error => {
            console.error("Error loading scripts:", error);
        });
    } else {
        // If there are no external scripts, directly process the JSON
        processJsonData(data);
    }
})
.catch(error => {
    console.error("Error fetching JSON:", error);
});

// Function to process JSON data
function processJsonData(data) {
const mainText = document.querySelector(".main-text");
if (mainText) {
    mainText.textContent = data.mainSection.Text;
}

data.sections.forEach(section => {
    const scrollSection = document.querySelector(`#${section.id}`);
    const scrollContent = scrollSection.querySelector(".toggable-section-content");

    const fixedPart = scrollSection.querySelector(".header");
    if (!fixedPart) {
        console.error(`Header not found in section with ID ${section.id}.`);
        return;
    }

    fixedPart.querySelector(".title").textContent = section.title;
    fixedPart.querySelector(".subtitle").textContent = section.subtitle;

    section.contents.forEach((content, index) => {
        const scrollingPart = scrollContent.children[index];
        scrollingPart.querySelector(".left-content .text").textContent = content.text;

        if (content.isImage) {
            const imageElement = document.createElement("img");
            imageElement.src = content.image;
            scrollingPart.querySelector(".right-content .media").appendChild(imageElement);
        } else if (content.canvasType === "chart") {
            const canvasElement = document.createElement("div");
            canvasElement.classList.add("chartjs-canvas");
            scrollingPart.querySelector(".right-content .media").appendChild(canvasElement);

            if (content.contentFunction && typeof window[content.contentFunction] === "function") {
                window[content.contentFunction](canvasElement);
            }
        } else if (content.canvasType === "babylon") {
            const canvasElement = document.createElement("div");
            canvasElement.classList.add("babylon-canvas");
            scrollingPart.querySelector(".right-content .media").appendChild(canvasElement);

            if (content.contentFunction && typeof window[content.contentFunction] === "function") {
                window[content.contentFunction](canvasElement);
            }
        } else {
            const divElement = document.createElement("div");
            divElement.classList.add("generic-content");
            scrollingPart.querySelector(".right-content .media").appendChild(divElement);

            if (content.contentFunction && typeof window[content.contentFunction] === "function") {
                window[content.contentFunction](divElement);
            }
        }
    });
});
}
});