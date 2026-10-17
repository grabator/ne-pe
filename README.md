# Pastry chef website

Website for a pastry chef from Mostar.

**Live:** https://ne-pe.grabafaceit.workers.dev

## What's inside

- A short showcase homepage
- Separate pages for the story and awards, signature desserts, weddings, the pastry academy (dates and a waiting list), partnerships for restaurants and hotels, and recipes
- Every page ends with an enquiry form
- Bosnian, English and German

## Tech

Plain HTML, CSS and JavaScript, no framework and no build step. Hosted on Cloudflare Workers. All text and data is in `data/np.js`.

## Run locally

```
node serve.mjs
```

Then open http://localhost:8080. Language can be set with `?lang=en` or `?lang=de`.

Made by [Ahmed Grabus (Graba)](https://graba-portofolio.grabafaceit.workers.dev)
