(function () {
  const colorLabel = document.getElementById("color-label");
  const minInput = document.getElementById("minInput");
  const maxInput = document.getElementById("maxInput");
  const label = document.getElementById("label");

  const sliderEl = document.getElementById("slider");

  if (!window.noUiSlider) {
    console.error("noUiSlider missing. Check the CDN script tag.");
    return;
  }
  if (!window.DaisyDualRange) {
    console.error("DaisyDualRange missing. Build the library and load dist/index.iife.js.");
    return;
  }

  let currentColor = "primary";
  let instance = null;

  function mount(color) {
    if (instance) instance.destroy();

    instance = window.DaisyDualRange.createDaisyDualRange(sliderEl, {
      min: 0,
      max: 1000,
      value: [100, 700],
      step: 1,
      color: color
    });

    let isUpdatingFromSlider = false;

    function sync([a, b]) {
      isUpdatingFromSlider = true;
      minInput.value = String(a);
      maxInput.value = String(b);
      label.textContent = a + " – " + b;
      isUpdatingFromSlider = false;
    }

    sync(instance.get());
    instance.on("update", sync);

    minInput.onchange = function () {
      if (!isUpdatingFromSlider) {
        const next = Number(minInput.value || 0);
        instance.set([next, null]);
      }
    };

    maxInput.onchange = function () {
      if (!isUpdatingFromSlider) {
        const next = Number(maxInput.value || 0);
        instance.set([null, next]);
      }
    };
  }

  const currentTheme = document.documentElement.getAttribute("data-theme") || "light";
  const themeButtons = document.querySelectorAll("button[data-theme]");
  
  themeButtons.forEach(function (button) {
    const theme = button.getAttribute("data-theme");
    
    if (theme === currentTheme) {
      button.setAttribute("data-active", "true");
    }
    
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const selectedTheme = button.getAttribute("data-theme");
      
      document.documentElement.setAttribute("data-theme", selectedTheme);
      
      themeButtons.forEach(function (btn) {
        btn.setAttribute("data-active", btn === button ? "true" : "false");
      });
      
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    });
  });

  document.querySelectorAll("[data-color]").forEach(function (item) {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      const color = this.getAttribute("data-color");
      currentColor = color;
      colorLabel.textContent = color;
      mount(color);
      const dropdown = this.closest('.dropdown');
      if (dropdown) {
        const trigger = dropdown.querySelector('[role="button"]');
        if (trigger) trigger.blur();
      }
    });
  });

  document.getElementById("randomize").addEventListener("click", function () {
    const a = Math.floor(Math.random() * 600);
    const b = a + 100 + Math.floor(Math.random() * 300);
    instance.set([a, Math.min(b, 1000)]);
  });

  const CHECK_ICON = `<svg class="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>`;
  const RESET_DELAY = 2000;

  document.querySelectorAll(".copy-btn").forEach(function (button) {
    const originalHTML = button.innerHTML;
    
    button.addEventListener("click", async function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      const textToCopy = button.getAttribute("data-copy-text");
      
      if (!textToCopy) {
        console.error("No text to copy found in data-copy-text attribute");
        return;
      }
      
      try {
        await navigator.clipboard.writeText(textToCopy);
        button.innerHTML = CHECK_ICON;
        button.classList.add("text-success");
        
        setTimeout(function () {
          button.innerHTML = originalHTML;
          button.classList.remove("text-success");
        }, RESET_DELAY);
      } catch (err) {
        console.error("Failed to copy text:", err);
      }
    });
  });

  mount(currentColor);
})();
