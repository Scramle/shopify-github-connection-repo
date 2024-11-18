// This script is loaded by main-product.liquid through the treeoftales.liquid component
// we use defer on this script

document.addEventListener("DOMContentLoaded", function () {
  console.warn("Starting DOMContentLoaded");

  function sanitizeClassName(className) {
    // Ersätt alla ogiltiga tecken (inklusive mellanslag) med "_"
    return className.toLowerCase().replace(/[^\w-]/g, "_");
  }

  const classGenerator = (color, type) => {
    return `preview_${color}_${type}`;
  };

  const missingColor = "#00000030";

  const colorLib = {
    white: "#FFFFFF",
    black: "#000000",
    light_blue: "#A3D8E1",
    blue: "#0078BF",
    army_blue: "#042F56",
    army_green: "#68724D",
    green: "#61C680",
    dark_red: "#BB3D43",
    red: "#DE4343",
    dark_purple: missingColor,
    purple: missingColor,
    light_purple: "#AE96D4",
    pink: "#E8AFCF",
    orange: "#F99963",
    yellow: "#F7D959",
    brown: "#7D6556",
    light_brown: "#D3B7A7",
    gold: missingColor,
    silver: missingColor,
    copper: missingColor,
    neon_pink: missingColor,
    neon_green: missingColor,
    cyan: missingColor,
    grey: "#9B9EA0",
    dark_grey: missingColor,
  };

  const svgClasses = Object.keys(colorLib).map((key) =>
    classGenerator(key, "svg")
  );
  svgClasses.push(classGenerator("default", "svg"));
  const backgroundClasses = Object.keys(colorLib).map((key) =>
    classGenerator(key, "background")
  );
  backgroundClasses.push(classGenerator("default", "background"));

  const updateSvgChildrenColors = (parentElement, color) => {
    [...parentElement.children].forEach((child) => {
      if (child?.nodeName !== "svg") return;
      child.children[0]?.style.setProperty("fill", colorLib[color]);
      child.children[0]?.style.setProperty("stroke", colorLib[color]);
      child.style.setProperty("fill", colorLib[color]);
      child.style.setProperty("stroke", colorLib[color]);
    });
  };

  const observer = new MutationObserver(() => {
    console.warn("Running MutationObserver");
    const lidPreview = document.querySelector("#lid");
    const boxPreview = document.querySelector("#box");
    const tokenPreview = document.querySelectorAll("#token");
    const selects = document.querySelectorAll("select");

    selects.forEach((select) => {
      select.onchange = (e) => {
        const targetValue = sanitizeClassName(e.target.value);
        const currentSelectElement = sanitizeClassName(select.name);

        switch (currentSelectElement) {
          case "properties_box_-_base_color_":
            console.log("Setting Box Base Color to: ", targetValue);
            updateSvgChildrenColors(boxPreview, targetValue);
            lidPreview.style.setProperty("background", colorLib[targetValue]);
            break;
          case "properties_box_-_accent_color_":
            console.log("Setting Box Accent Color to: ", targetValue);
            updateSvgChildrenColors(lidPreview, targetValue);
            break;
          case "properties_token_-_base_color_":
            console.log("Setting Token Base Color to: ", targetValue);
            tokenPreview.forEach((token) =>
              token.style.setProperty("background", colorLib[targetValue])
            );
            break;
          case "properties_token_-_accent_color_":
            console.log("Setting Token Accent Color to: ", targetValue);
            tokenPreview.forEach((token) =>
              token.style.setProperty("color", colorLib[targetValue])
            );
            break;
          default:
            console.warn("deafault - returning");
            return;
        }
      };
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });
});
