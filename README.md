# Parev: learn Western Armenian

A small, self-contained course for reading, writing and speaking Western Armenian (traditional spelling, Western pronunciation). No account, no ads, no leagues: lessons, a streak, and spaced-repetition review.

**Use it online:** https://carlossgp.github.io/western-armenian-app/ (once GitHub Pages is enabled for this repository)

**Use it offline:** download [`index.html`](index.html) (or use *Settings → Download for offline use* in the app) and double-click it. Everything is in that one file.

## What is in it

- 43 lessons in 11 units: the 38 letters and common letter pairs, then greetings, family, numbers, food, verbs, places, time (present, future, past), descriptions, getting around, and celebrations. About 270 words and 190 sentences.
- Reading (multiple choice, matching, sentence building), writing (letter tracing, an on-screen Armenian keyboard), and speaking (record yourself and play it back).
- Review on a widening schedule: 1, 2, 4, 8, 16, 32 and 64 days. Missed items start over.

## Progress

Progress is saved in your browser. To keep it on GitHub and share it between devices:

1. Create a separate **private** repository for it. Do not use a public one: your progress file and commit email would be visible.
2. Create a fine-grained personal access token limited to that repository with **Contents: read and write**.
3. In the app, open *Settings → Sync progress to GitHub*, enter `username/repository` and the token.

The app then writes `progress.json` to that repository after every lesson and loads it on other devices. The token is stored only in the browser you typed it into. You can also export and import a progress file by hand from Settings.

## Audio

Browsers have no Western Armenian voice. If your browser offers an Armenian (Eastern) voice, the app respells text so the consonants come out close to Western, but the accent stays Eastern. Without one, the listen buttons are hidden.

## Accuracy

Vocabulary, spelling and grammar were cross-checked against the open textbook [Ես ու դուն](https://yes-oo-toon.github.io/), the [Arak29 Western Armenian essentials](https://arak29.org/gotoroot/western-modern-armenian/), Fairbanks' *Spoken West Armenian* (1958), and Wikipedia and Wiktionary conjugation tables. Sentences either come from those sources or follow patterns shown in them. No native speaker has reviewed the course, so corrections are welcome: open an issue.

## Changing the course

The lessons are plain text in `src/curriculum.js`. Edit, then run `./build.sh` to regenerate `index.html`.
