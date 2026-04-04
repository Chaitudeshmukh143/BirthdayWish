# Birthday Wish App

Animated birthday surprise website built with React and Vite.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy to Netlify

1. Push this project to GitHub.
2. In Netlify, create a new site from that repository.
3. Use these settings:

```txt
Build command: npm run build
Publish directory: dist
```

The project already includes:

- `netlify.toml` for Netlify build settings
- `public/_redirects` so React Router works on refresh and direct links

## Notes

- Videos are served from `public/videos`
- Images are served from `public/images`
- Background music uses a hidden YouTube embed, so some browsers may require one user click before audio starts
