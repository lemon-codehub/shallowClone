# GitHub Shallow Clone Button

A lightweight Chrome extension that adds a **Shallow clone** button next to GitHub's **Code** button.

Click once to copy:

```bash
git clone --depth=1 https://github.com/<owner>/<repo>.git
```

## Features

- Adds a button beside the repository **Code** button on GitHub pages.
- Copies shallow clone command with one click.
- Supports GitHub dynamic navigation (PJAX/Turbo).
- Works with modern GitHub UI and has fallback logic for older layouts.
- Minimal permissions (`clipboardWrite` only).

## Installation (Chrome / Edge)

1. Download this repository as ZIP, or clone it locally.
2. Open `chrome://extensions/` (Edge: `edge://extensions/`).
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select this project folder.

## Usage

1. Open any GitHub repository page, for example:
   `https://github.com/owner/repo`
2. Find **Shallow clone** next to the **Code** button.
3. Click it.
4. Paste command in your terminal.

## Example

```bash
git clone --depth=1 https://github.com/octocat/Hello-World.git
```

## Files

- `manifest.json`: Chrome extension manifest (MV3)
- `content.js`: Injects the button and handles copy logic
- `README.md`: Documentation

## Troubleshooting

- Button does not appear:
  - Make sure you are on a repository page (`https://github.com/<owner>/<repo>`).
  - Refresh the page after extension reload.
  - Confirm extension is enabled in `chrome://extensions/`.
- Copy failed:
  - Retry once after clicking the page body to ensure clipboard permission context.

## Development

After changing code:

1. Go to `chrome://extensions/`
2. Click **Reload** on this extension
3. Refresh GitHub page

## License

MIT
