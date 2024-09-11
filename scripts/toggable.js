document.addEventListener("DOMContentLoaded", () => {
    // Function to add event listeners for toggle functionality
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
  
    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage(height, "*");
    }
  
    window.addEventListener("load", sendHeight);
    window.addEventListener("resize", sendHeight);
  
    // Fetch JSON data and process it once scripts are loaded
    fetch(jsonUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.scriptFiles) {
          loadScripts(data.scriptFiles).then(() => {
            processJsonData(data);
            addToggleFunctionality(); // Add toggle functionality to newly created sections
          }).catch((error) => {
            console.error("Error loading scripts:", error);
          });
        } else {
          processJsonData(data);
          addToggleFunctionality(); // Add toggle functionality to newly created sections
        }
      })
      .catch((error) => {
        console.error("Error fetching JSON:", error);
      });
  
    // Function to dynamically load the script files
    function loadScripts(scriptFiles) {
      return scriptFiles.reduce((promiseChain, scriptObj) => {
        return promiseChain.then(() => {
          return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = scriptObj.scriptFile;
            script.async = false;
            script.onload = () => resolve();
            script.onerror = () => reject();
            document.body.appendChild(script);
          });
        });
      }, Promise.resolve());
    }
  
    // Function to process JSON data and create sections dynamically
    function processJsonData(data) {
      const pageWrapper = document.querySelector('.page-wrapper');
      data.sections.forEach(section => {
        const sectionDiv = document.createElement('div');
        sectionDiv.id = section.id;
  
        const toggableSectionDiv = document.createElement('div');
        toggableSectionDiv.classList.add('toggable-section');
  
        const headerDiv = document.createElement('div');
        headerDiv.classList.add('header');
        headerDiv.innerHTML = `
          <div>
            <div class="title">${section.title}</div>
            <div class="subtitle">${section.subtitle}</div>
          </div>
          <div class="toggle-icon">&#x25BC;</div>
        `;
        toggableSectionDiv.appendChild(headerDiv);
  
        const toggableSectionContent = document.createElement('div');
        toggableSectionContent.classList.add('toggable-section-content');
  
        section.contents.forEach((content) => {
          const scrollingPart = document.createElement('div');
          scrollingPart.classList.add('scrolling-part');
  
          const leftContentDiv = document.createElement('div');
          leftContentDiv.classList.add('left-content');
          leftContentDiv.innerHTML = `<div class="text">${content.text}</div>`;
  
          const rightContentDiv = document.createElement('div');
          rightContentDiv.classList.add('right-content');
          const mediaDiv = document.createElement('div');
          mediaDiv.classList.add('media');
  
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
  
          rightContentDiv.appendChild(mediaDiv);
          scrollingPart.appendChild(leftContentDiv);
          scrollingPart.appendChild(rightContentDiv);
  
          toggableSectionContent.appendChild(scrollingPart);
        });
  
        toggableSectionDiv.appendChild(toggableSectionContent);
        sectionDiv.appendChild(toggableSectionDiv);
        pageWrapper.appendChild(sectionDiv);
      });
    }
  });