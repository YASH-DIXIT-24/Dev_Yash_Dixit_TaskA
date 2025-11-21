# FAQ Search Interface

A simple search interface built with Next.js that helps you find answers in a FAQ database. No complex setup needed - just straightforward keyword search.

## What It Does

- Searches through FAQs and shows you the top 3 most relevant results
- Combines top answers into a quick summary
- Validates inputs and handles errors properly

## Built With

- Next.js 15, React 19, TypeScript
- Tailwind CSS for styling
- Next.js API Routes for the backend
- Local JSON file for data storage

## Getting Started

You'll need Node.js 18 or newer installed on your machine.

1. Go to the project folder:
```bash
cd Dev_Yash_Dixit_TaskA
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm run dev
```

4. Open your browser to:
```
http://localhost:3000
```

## API Documentation

### POST /api/search

Searches the FAQ database and returns the best matches.

**Request:**
```json
{
  "query": "trust badges"
}
```

**Success Response:**
```json
{
  "results": [
    {
      "id": "1",
      "title": "Trust badges near CTA",
      "body": "Adding trust badges near the primary CTA increased signups by 12%."
    }
  ],
  "summary": "Adding trust badges near the primary CTA increased signups by 12%.",
  "sources": ["1"]
}
```

**No Results:**
```json
{
  "results": [],
  "message": "No matches found for your query."
}
```

**Error:**
```json
{
  "error": "Query parameter is required and must be a non-empty string"
}
```

## Project Structure

```
search-interface/
├── app/
│   ├── api/search/route.ts    # Search API endpoint
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main search UI
│   └── globals.css            # Global styles
├── data/
│   └── faqs.json              # FAQ database
└── README.md                  # Documentation
```

## How Search Works

The search looks for your keywords in FAQ titles and descriptions. Title matches are considered more important than body matches. Results are ranked by relevance and the top 3 are returned.

## Example Searches

- "trust badges" - returns the trust badge FAQ
- "form" - returns the above-the-fold form tip
- "funnel" - returns conversion funnel information
- "test" - returns multiple results about testing

## Available Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Run production server
- `npm run lint` - Check code quality

## Things to Know

- Search is case-insensitive
- Partial word matching works
- Title matches rank higher than body matches
- No spell checking currently available
- Works with English content only

## Error Handling

- Empty searches return an error message
- No matches return a alert
- API errors are handled gracefully
- All inputs are validated before searching

## Testing

Try these to verify everything works:

1. Search "trust badges" - should return FAQ #1 first
2. Submit an empty search - should show an error
3. Search "xyzsearch" - should show no results message
4. Search "test" - should return multiple ranked results
