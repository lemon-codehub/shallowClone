(() => {
  const BUTTON_ID = "gh-shallow-clone-btn";
  const STYLE_ID = "gh-shallow-clone-style";
  const RESERVED_OWNERS = new Set([
    "about",
    "account",
    "codespaces",
    "collections",
    "contact",
    "customer-stories",
    "enterprise",
    "events",
    "explore",
    "features",
    "gist",
    "login",
    "marketplace",
    "mobile",
    "new",
    "notifications",
    "orgs",
    "organizations",
    "pricing",
    "pulls",
    "search",
    "security",
    "sessions",
    "settings",
    "showcases",
    "site",
    "sponsors",
    "team",
    "teams",
    "topics",
    "trending"
  ]);

  let lastHref = location.href;
  let renderQueued = false;

  function ensureStyle() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      #${BUTTON_ID} {
        margin-left: 8px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid var(--button-default-borderColor-rest, rgba(31, 35, 40, 0.15));
        border-radius: 6px;
        background: var(--button-default-bgColor-rest, #f6f8fa);
        color: var(--fgColor-default, #24292f);
        font-size: 12px;
        font-weight: 500;
        line-height: 20px;
        padding: 5px 12px;
        cursor: pointer;
        white-space: nowrap;
      }

      #${BUTTON_ID}:hover {
        background: var(--button-default-bgColor-hover, #f3f4f6);
      }
    `;

    document.head.appendChild(style);
  }

  function getRepositoryFullName() {
    const meta = document.querySelector(
      'meta[name="octolytics-dimension-repository_nwo"]'
    );
    const nwo = meta?.getAttribute("content")?.trim();
    if (nwo && nwo.includes("/")) return nwo;

    const parts = location.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const owner = parts[0];
    const repo = parts[1];

    if (RESERVED_OWNERS.has(owner.toLowerCase())) return null;

    return `${owner}/${repo}`;
  }

  function normalizedText(el) {
    return el?.textContent?.replace(/\s+/g, " ").trim() || "";
  }

  function findModernCodeButton() {
    const iconButton = document
      .querySelector('main button[aria-haspopup="true"] svg.octicon-code')
      ?.closest("button");
    if (iconButton) return iconButton;

    const labelNodes = document.querySelectorAll(
      'main button[aria-haspopup="true"] span[data-component="text"]'
    );

    for (const label of labelNodes) {
      if (normalizedText(label) !== "Code") continue;
      const button = label.closest("button");
      if (button) return button;
    }

    return null;
  }

  function findLegacyCodeControl() {
    const getRepo = document.querySelector("main get-repo");
    if (getRepo) return getRepo;

    const candidates = document.querySelectorAll(
      'main summary[aria-haspopup="true"], main button[aria-haspopup="true"]'
    );

    for (const candidate of candidates) {
      if (candidate.id === BUTTON_ID) continue;
      if (normalizedText(candidate) !== "Code") continue;
      return candidate.closest("details, get-repo") || candidate;
    }

    return null;
  }

  function findCodeAnchor() {
    return findModernCodeButton() || findLegacyCodeControl();
  }

  function buildCloneCommand(repoFullName) {
    return `git clone --depth=1 https://github.com/${repoFullName}.git`;
  }

  async function copyText(text) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function removeButton() {
    const button = document.getElementById(BUTTON_ID);
    if (button) button.remove();
  }

  function createButton() {
    const button = document.createElement("button");
    button.id = BUTTON_ID;
    button.type = "button";
    button.className = "btn btn-sm";
    button.textContent = "Shallow clone";
    return button;
  }

  function renderButton() {
    const repoFullName = getRepositoryFullName();
    const codeAnchor = findCodeAnchor();

    if (!repoFullName || !codeAnchor || !codeAnchor.parentElement) {
      removeButton();
      return;
    }

    ensureStyle();

    let button = document.getElementById(BUTTON_ID);
    if (!button) {
      button = createButton();
    }

    if (
      button.parentElement !== codeAnchor.parentElement ||
      button.previousElementSibling !== codeAnchor
    ) {
      codeAnchor.insertAdjacentElement("afterend", button);
    }

    const command = buildCloneCommand(repoFullName);
    button.title = command;
    button.onclick = async () => {
      const originalText = button.textContent;
      try {
        await copyText(command);
        button.textContent = "Copied";
      } catch (err) {
        button.textContent = "Copy failed";
        console.error("Failed to copy command:", err);
      }

      setTimeout(() => {
        button.textContent = originalText;
      }, 1200);
    };
  }

  function queueRender() {
    if (renderQueued) return;
    renderQueued = true;

    requestAnimationFrame(() => {
      renderQueued = false;
      renderButton();
    });
  }

  function updateIfNeeded() {
    if (location.href !== lastHref) {
      lastHref = location.href;
    }
    queueRender();
  }

  const observer = new MutationObserver(() => {
    if (location.href !== lastHref) {
      lastHref = location.href;
    }
    queueRender();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("popstate", updateIfNeeded);
  window.addEventListener("hashchange", updateIfNeeded);
  document.addEventListener("pjax:end", updateIfNeeded);
  document.addEventListener("turbo:render", updateIfNeeded);

  updateIfNeeded();
})();
