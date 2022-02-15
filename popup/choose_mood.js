/**
 * Listen for clicks on the buttons, and send the appropriate message to
 * the content script in the page.
 */
function listenForClicks() {
  /**
    Place to contribute:
      Add more moods!
      If you add new moods, add the mood and corresponding colors to the object below.
      Also make sure to add the corresponding title in choose_mood.html!
  **/

  const moods = {
    "Falling in love": setFormat("pink", "#f4c2c2", "pink"),
    "Hungry for Chipotle": setFormat("brown", "#ffddcc", "#ffaa80"),
    "Have an OSSD blog due soon": setFormat("pink", "#ccb3ff", "pink"),
    "Actively crying": setFormat("#00cccc", "#5fa08c", "#ccffff"),
    "Passively crying": setFormat("#0000cc", "#9999ff", "#4d4dff"),
    "Winter morning walks to class": setFormat("black", "#b6e8f2", "#d0efdb"),
    "Having to take the stairs because the Silver elevator line is too long": setFormat(
      "#f04f43",
      "#f7ac94",
      "#cdd4b1"
    ),
    "2FA is failing and you can't complete the daily screener": setFormat(
      "#093b41",
      "#b8c7de",
      "#5074af"
    ),
  };

  // Helper for CSS generation
  function setFormat(borderColor, gradientStart, gradientEnd) {
    return (
      "body { border: 20px inset " +
      borderColor +
      "; background: linear-gradient(" +
      gradientStart +
      "," +
      gradientEnd +
      ");}}"
    );
  }

  document.addEventListener("click", (e) => {
    // Clear all previous CSS
    function removeCSS() {
      for (const mood in moods) {
        browser.tabs.removeCSS({ code: moods[mood] });
      }
    }

    // Insert the mood theme based on moods object
    function moodify(content) {
      removeCSS();
      if (content !== "reset") browser.tabs.insertCSS({ code: moods[content] });
    }

    // Just log the error to the console.
    function reportError(error) {
      console.error(`Could not moodify: ${error}`);
    }

    // Track when mood switches
    browser.tabs
      .query({ active: true, currentWindow: true })
      .then(moodify(e.target.textContent))
      .catch(reportError);
  });
}

/**
 * There was an error executing the script.
 * Display the popup's error message, and hide the normal UI.
 */
function reportExecuteScriptError(error) {
  document.querySelector("#popup-content").classList.add("hidden");
  document.querySelector("#error-content").classList.remove("hidden");
  console.error(`Failed to execute moodify content script: ${error.message}`);
}

/**
 * When the popup loads, inject a content script into the active tab,
 * and add a click handler.
 * If we couldn't inject the script, handle the error.
 */
browser.tabs
  .executeScript({ file: "/content_scripts/moodify.js" })
  .then(listenForClicks)
  .catch(reportExecuteScriptError);
