import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface FAQ {
  id: string;
  title: string;
  body: string;
}

interface SearchResult extends FAQ {
  score: number;
}

interface SearchResponse {
  results: FAQ[];
  summary?: string;
  sources?: string[];
  message?: string;
}

function calculateScore(faq: FAQ, query: string): number {
  const queryLower = query.toLowerCase();
  const queryTerms = queryLower.split(/\s+/).filter(term => term.length > 0);
  
  let score = 0;
  const titleLower = faq.title.toLowerCase();
  const bodyLower = faq.body.toLowerCase();
  
  queryTerms.forEach(term => {
    const titleMatches = (titleLower.match(new RegExp(term, 'g')) || []).length;
    const bodyMatches = (bodyLower.match(new RegExp(term, 'g')) || []).length;
    
    // Titles are more important than body text
    score += titleMatches * 3;
    score += bodyMatches * 1;
    
    if (titleLower.includes(queryLower)) {
      score += 10;
    }
    if (bodyLower.includes(queryLower)) {
      score += 5;
    }
  });
  
  return score;
}

// Create a summary from the best matching results
function generateResultSummary(results: FAQ[]): string {
  if (results.length === 0) return '';
  
  const sentences = results.map(r => r.body);
  
  if (sentences.length === 1) {
    return sentences[0];
  } else if (sentences.length === 2) {
    return `${sentences[0]} ${sentences[1]}`;
  } else {
    // Combine the top 3 answers
    return sentences.slice(0, 3).join(' ');
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;
    
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return NextResponse.json(
        { error: 'Query parameter is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    
    // Load up all the FAQs
    const filePath = path.join(process.cwd(), 'data', 'faqs.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const faqs: FAQ[] = JSON.parse(fileContents);
    
    // Score each FAQ to see how well it matches
    const scoredResults: SearchResult[] = faqs.map(faq => ({
      ...faq,
      score: calculateScore(faq, query)
    }));
    
    // Only keep the good matches and show the best ones first
    const matchedResults = scoredResults
      .filter(result => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3); // Top 3 results
    
    // Clean up the results (remove score)
    const results = matchedResults.map(({ score, ...faq }) => faq);
    
    const response: SearchResponse = {
      results,
      summary: results.length > 0 ? generateResultSummary(results) : undefined,
      sources: results.map(r => r.id),
      message: results.length === 0 ? 'No matches found for your query.' : undefined
    };
    
    return NextResponse.json(response, { status: 200 });
    
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
