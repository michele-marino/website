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

  function addToggleFunctionality() {
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
          const canvases = content.querySelectorAll(".chartjs-canvas canvas");
          canvases.forEach((canvas) => {
            canvas.style.width = "300px";
            canvas.style.height = "300px";
          });

          // Resize chart
          canvases.forEach((canvas) => {
            const chart = Chart.getChart(canvas);
            if (chart) {
              chart.resize();
            }
          });
        }
      });
    });
  }
  
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
            addToggleFunctionality(); // Add toggle functionality to newly created sections

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
// Select the main wrapper where the sections will be added
const pageWrapper = document.querySelector('.page-wrapper');
data.sections.forEach(section => {
    // Create section element
    const sectionDiv = document.createElement('div');
    sectionDiv.id = section.id;  // Assign ID to section
    //sectionDiv.classList.add('section');
    
    // Create toggable section
    const toggableSectionDiv = document.createElement('div');
    toggableSectionDiv.classList.add('toggable-section');

    // Create header (fixed part)
    const headerDiv = document.createElement('div');
    headerDiv.classList.add('header');
    
    const headerContent = `
        <div>
            <div class="title">${section.title}</div>
            <div class="subtitle">${section.subtitle}</div>
        </div>
        <div class="toggle-icon">&#x25BC;</div>
    `;
    headerDiv.innerHTML = headerContent;

    toggableSectionDiv.appendChild(headerDiv);  // Add header to toggable section

    // Create the content container (scrolling part)
    const toggableSectionContent = document.createElement('div');
    toggableSectionContent.classList.add('toggable-section-content');

    // For each content item in the section, create a scrolling part
    section.contents.forEach((content, index) => {
        const scrollingPart = document.createElement('div');
        scrollingPart.classList.add('scrolling-part');

        // Create left content (text)
        const leftContentDiv = document.createElement('div');
        leftContentDiv.classList.add('left-content');
        leftContentDiv.innerHTML = `<div class="text">${content.text}</div>`;

        // Create right content (media)
        const rightContentDiv = document.createElement('div');
        rightContentDiv.classList.add('right-content');
        const mediaDiv = document.createElement('div');
        mediaDiv.classList.add('media');
        
        // Handle media based on content type
        if (content.isImage) {
            const imageElement = document.createElement('img');
            imageElement.src = content.image;
            mediaDiv.appendChild(imageElement);
        } else if (content.canvasType === 'chart') {
            const chartDiv = document.createElement('div');
            chartDiv.classList.add('chartjs-canvas');
            mediaDiv.appendChild(chartDiv);
            if (content.contentFunction && typeof window[content.contentFunction] === 'function') {
                window[content.contentFunction](chartDiv);
            }
        } else if (content.canvasType === 'babylon') {
            const babylonDiv = document.createElement('div');
            babylonDiv.classList.add('babylon-canvas');
            mediaDiv.appendChild(babylonDiv);
            if (content.contentFunction && typeof window[content.contentFunction] === 'function') {
                window[content.contentFunction](babylonDiv);
            }
        } else {
            const genericDiv = document.createElement('div');
            genericDiv.classList.add('generic-content');
            mediaDiv.appendChild(genericDiv);
            if (content.contentFunction && typeof window[content.contentFunction] === 'function') {
                window[content.contentFunction](genericDiv);
            }
        }

        // Append left and right content to scrolling part
        rightContentDiv.appendChild(mediaDiv);
        scrollingPart.appendChild(leftContentDiv);
        scrollingPart.appendChild(rightContentDiv);

        // Append scrolling part to content section
        toggableSectionContent.appendChild(scrollingPart);
    });

    // Append content to toggable section
    toggableSectionDiv.appendChild(toggableSectionContent);

    // Append the entire section to the page wrapper
    sectionDiv.appendChild(toggableSectionDiv);
    pageWrapper.appendChild(sectionDiv);
});

}
});