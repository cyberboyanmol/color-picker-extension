//
const ColorPickerBtn = document.querySelector(".changeColorBtn");
const ColorGrid = document.querySelector(".colorGrid");
const colorValue = document.querySelector(".colorValue");

ColorPickerBtn.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  console.log(tab);
  chrome.scripting.executeScript(
    {
      target: {
        tabId: tab.id,
      },
      function: pickColor,
    },
    async (injectionResults) => {
      const [data] = injectionResults;
      console.log(injectionResults);
      if (data.result) {
        const color = data.result.sRGBHex;
        ColorGrid.style.backgroundColor = color;
        colorValue.innerHTML = color;
        try {
          await navigator.clipboard.writeText(color);
        } catch (err) {
          console.error(err);
        }
      }
    }
  );
});

async function pickColor() {
  try {
    const eyeDropper = new EyeDropper();
    const selectedColor = await eyeDropper.open();
    return selectedColor;
  } catch (err) {
    console.error(err);
  }
}
