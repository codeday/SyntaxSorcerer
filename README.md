This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run `npm install`

Then, run `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

## How to Use
Each user may upload one codebase to the app's local storage at a time by pasting a link in the topmost input box. This link must be a link to download a .zip file and must be a [valid URL](https://dev.w3.org/html5/spec-LC/urls.html). An existing codebase may be removed at any time during the user session in order to upload another one. Currently, only JavaScript files are supported.\
To send a regular message to the ChatGPT interface, press 'Enter.' Pressing 'Query codebase' will process your prompt, use cosine similarity to find the three most relevant code segments in your codebase, and display an answer to your prompt that considers the files containing these segments.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
