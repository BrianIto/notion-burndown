# Notion-Burndown

A scrum-like database driven Burndown chart created for Notion. It's interactive and reacts to changes in the database of the project. It uses Notion API, D3.js and SvelteKit.

## 1. How to run...

Clone this project and...

create a new Integration (you can call whatever you want, I will refer it as `Burndown`) add this new Integration to the page your database is inside, go to your Notion page and set get your API key. Place it in an `.env` file like this:

```
API_SECRET=<YOUR_API_SECRET_CODE>
PUBLIC_NOTION_API=https://api.notion.com/v1/
```

run this project using `npm run dev`.

## 2. How to show it on Notion?

**You must have runned it first, you cannot show in Notion without running.** After the server is running,
you can simply create a embbed on a webpage straight to your link. But some considerations should be done:

- This is a straight MVP and first-version, some things are really, really static for now.

1. The link should follow this template: `<YOUR_LOCALHOST>/?start=<START_DATE>&finish=<END_DATE>` for example: `http://localhost:5173/?start=2023-08-01&finish=2023-08-30`. Because start and finish will limit the X domain of the chart.
2. The database can have anything you want, but **should** have:
   1. A column named `Peso` (that means weight in Portuguese)
   2. A column named `Finish`
   3. A column named `Nome` (that means weight in Portuguese)

And then you're set to go!

## 3. How about deploying it online so my team can see it?

Simply send it online using a serverless platform. I would recommend Vercel. After that, just update your
Notion embbed URL.
