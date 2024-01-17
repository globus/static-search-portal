# `static-search`

**🧪 EXPERIMENTAL 🧪**

This is a working proof-of-concept of a Globus Search client using [`static`](https://github.com/from-static).

### `static.json`

```json
{
  // Base configuration for the `static` build system.
  "_static": {
    // Reference **this** repository as the application to build.
    "application": "git@github.com:globus/static-search.git",
  },
  "metadata": {
    // Used as the `<title>` and `<meta name="description">` tags.
    "title": "Search | Globus",
    "description": "This is an example of a basis Globus Search interface generated from a static.json file"
  },
  "contents": {
    "globus": {
      "search": {
        // The Globus Search Index that will be used to power the interface.
        "index": "6d222eba-980f-410c-9a58-52a785d660ea"
      }
    }
  }
}
```


----

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
