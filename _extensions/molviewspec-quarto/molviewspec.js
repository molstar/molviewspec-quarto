// MolViewSpec Quarto Extension
// Initializes EditorWithViewer components with MolViewSpec builder code

// Initialize all molviewspec viewers when DOM is ready
async function initializeMolViewSpecViewers() {
  const viewers = document.querySelectorAll(".molviewspec-viewer");

  if (viewers.length === 0) {
    return;
  }

  try {
    // Determine the base path for extension resources
    const scripts = document.getElementsByTagName("script");
    let basePath = "";
    for (let i = 0; i < scripts.length; i++) {
      const src = scripts[i].src;
      if (src && src.indexOf("molviewspec") !== -1) {
        basePath = src.substring(0, src.lastIndexOf("/") + 1);
        break;
      }
    }

    // Dynamically import preact and molstar-components
    const componentsPath = basePath + "assets/molstar-components.js";
    console.log("Loading molstar-components from:", componentsPath);

    const { h, render } = await import("https://esm.sh/preact@10.19.3");
    const { EditorWithViewer } = await import(componentsPath);

    if (!EditorWithViewer) {
      console.error("EditorWithViewer component not found");
      return;
    }

    viewers.forEach((viewerElement) => {
      // Get the story and scene code from script tags
      const viewerId = viewerElement.id.replace("-viewer", "");
      const storyScript = document.getElementById(viewerId + "-story");
      const sceneScript = document.getElementById(viewerId + "-scene");

      if (!sceneScript) {
        console.warn(
          "No MolViewSpec scene code script found for viewer:",
          viewerElement.id,
        );
        return;
      }

      const storyCode = storyScript ? storyScript.textContent : "";
      const sceneCode = sceneScript.textContent;

      console.log(
        "Extracted code for",
        viewerElement.id,
        "- story length:",
        storyCode.length,
        "scene length:",
        sceneCode.length,
      );

      try {
        // Clear the container
        viewerElement.innerHTML = "";

        // Render the EditorWithViewer component using Preact
        render(
          h(EditorWithViewer, {
            initialCode: sceneCode,
            hiddenCode: storyCode,
            layout: "horizontal",
            editorHeight: "400px",
            viewerHeight: "400px",
            autoRun: true,
            autoRunDelay: 500,
            showLog: false,
            showAutoUpdateToggle: false,
            showBottomControlPanel: false,
          }),
          viewerElement,
        );

        console.log("Initialized EditorWithViewer for", viewerElement.id);
      } catch (error) {
        console.error("Error initializing MolViewSpec viewer:", error);
        viewerElement.innerHTML = `
          <div class="molviewspec-error" style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
            <p style="margin: 0 0 10px 0;"><strong>Error loading MolViewSpec:</strong></p>
            <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${error.message}</pre>
            <details style="margin-top: 10px;">
              <summary style="cursor: pointer;">Code</summary>
              <pre style="margin-top: 10px; background: white; padding: 10px; border-radius: 4px; overflow-x: auto; font-family: monospace;">Story: ${storyCode}\n---\n${sceneCode}</pre>
            </details>
          </div>
        `;
      }
    });
  } catch (error) {
    console.error("Failed to load molstar-components:", error);
    viewers.forEach((viewerElement) => {
      viewerElement.innerHTML = `
        <div class="molviewspec-error" style="padding: 20px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 4px;">
          <p style="margin: 0 0 10px 0;"><strong>Error loading molstar-components:</strong></p>
          <pre style="margin: 0; white-space: pre-wrap; word-wrap: break-word;">${error.message}</pre>
          <p style="margin-top: 10px;">The molstar-components library failed to load. Check the console for details.</p>
        </div>
      `;
    });
  }
}

// Run initialization when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeMolViewSpecViewers);
} else {
  initializeMolViewSpecViewers();
}
