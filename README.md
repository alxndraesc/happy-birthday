# WONABABE.EXE

A small, responsive, retro-lavender Y2K birthday website built with static HTML, CSS, and vanilla JavaScript.

## Preview locally
1. Download and unzip the project.
2. Open `index.html` in a browser.
3. For the best local development experience, use VS Code with the Live Server extension.

No build step, database, or API is required. Google Fonts load from the internet; the page uses fallback fonts if unavailable.

## Personalize before sharing
Search the files for `TODO`, `PLACEHOLDER`, and bracketed text such as `[YOUR NAME / NICKNAME]`.

### Photos
- Add your images to the `images/` folder.
- Open `script.js` and edit the `memories` array near the top.
- Set each `image` to a relative path, for example `images/memory-01.jpg`.
- Change the `title`, `caption`, and `alt` values to match your actual memories.
- For the profile photo, replace the `.avatar-placeholder` block in `index.html` with:
  `<img class="profile-photo" src="images/wonababe-01.jpg" alt="Wonababe">`
  Then add this to `style.css`:
  `.profile-photo { width: 100%; height: 150px; object-fit: cover; border: 2px solid var(--ink); }`

### Personal copy
- Replace `[INSERT HER TYPICAL DELAY]` in `index.html` with an inside-joke number or phrase.
- Replace `[YEAR OF FRIENDSHIP]` with the year you became friends (or change the phrase entirely).
- Edit the birthday letter in `index.html`.
- Replace `[YOUR NAME / NICKNAME]` with your name or nickname.
- Make the memory captions specific. One real, oddly specific detail will land better than a generic roast.

## Deploy to Vercel
1. Put the project folder in a Git repository, or upload it through your preferred Vercel workflow.
2. Import the repository into Vercel.
3. Use the default static deployment settings; no build command is needed.
4. Deploy and test the link on a phone before sharing it privately.

## Included interactions
- Welcome screen with Enter button
- Responsive profile and character stats
- Three clickable memory archive cards with dialog viewer
- Birthday letter reveal / close
- Hidden Easter egg button
- Current year in the footer
- Reduced-motion support and keyboard-accessible controls

## Notes
All text and photos are placeholders until you personalize them. The visitor/status labels are decorative and do not track visitors.
