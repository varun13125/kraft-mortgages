import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // For now, return a sample strategy response
    // This would normally fetch from your strategy database/collection
    
    const sampleStrategy = {
      weekId: `${new Date().getFullYear()}-W${Math.ceil((Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000))}`,
      actions: [
        {
          title: "Optimize BC First-Time Buyer Content",
          description: "Update existing first-time buyer guides with 2025 program changes and current rates",
          priority: "high",
          estimated_hours: 4
        },
        {
          title: "Create Construction Loan Calculator Content",
          description: "Develop comprehensive guide around the construction loan calculator tool",
          priority: "medium", 
          estimated_hours: 6
        },
        {
          title: "SEO Audit for Self-Employed Pages",
          description: "Review and optimize self-employed mortgage content for better rankings",
          priority: "medium",
          estimated_hours: 3
        }
      ],
      metrics: {
        total_opportunities: 8,
        high_priority: 1,
        medium_priority: 2,
        low_priority: 5
      },
      createdAt: new Date().toISOString()
    };

    return NextResponse.json(sampleStrategy);
    
  } catch (error) {
    console.error('Strategy fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch strategy' }, { status: 500 });
  }
}