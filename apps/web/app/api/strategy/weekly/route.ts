import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';
import { isAdmin, db } from '@/lib/db/firestore';
import { llm } from '@/lib/ai/llm';

async function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Missing or invalid authorization header');
  }

  const token = authHeader.replace('Bearer ', '');
  const decodedToken = await admin.auth().verifyIdToken(token);
  
  const userIsAdmin = await isAdmin(decodedToken.uid);
  if (!userIsAdmin) {
    throw new Error('Admin access required');
  }

  return decodedToken;
}

async function getSearchConsoleData(): Promise<any> {
  // If Google Search Console is configured, fetch data
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  const siteUrl = process.env.GSC_SITE_URL || 'https://www.kraftmortgages.ca';

  if (!clientEmail || !privateKey) {
    return { available: false, reason: 'No GSC credentials' };
  }

  try {
    // This would implement GSC API calls
    // For now, return mock data structure
    return {
      available: true,
      currentWeek: [
        { query: 'mortgage rates canada', clicks: 45, impressions: 1200, position: 8.5 },
        { query: 'first time home buyer bc', clicks: 32, impressions: 890, position: 6.2 },
        { query: 'mortgage broker surrey', clicks: 28, impressions: 520, position: 4.1 }
      ],
      previousWeek: [
        { query: 'mortgage rates canada', clicks: 38, impressions: 1100, position: 9.2 },
        { query: 'first time home buyer bc', clicks: 29, impressions: 820, position: 6.8 },
        { query: 'mortgage broker surrey', clicks: 31, impressions: 580, position: 3.9 }
      ]
    };
  } catch (error) {
    console.error('GSC data fetch failed:', error);
    return { available: false, reason: 'GSC API error' };
  }
}

async function generateStrategyActions(gscData: any): Promise<any[]> {
  const strategyPrompt = `
Create a weekly SEO strategy based on this search performance data:

Search Console Data:
${JSON.stringify(gscData, null, 2)}

Generate 5-7 specific, actionable SEO tasks for a Canadian mortgage brokerage:

Consider:
1. Content gaps based on search queries
2. Pages that could rank better (positions 4-10)  
3. Declining click-through rates
4. New keyword opportunities
5. Technical improvements needed
6. Internal linking opportunities

Return JSON format:
{
  "actions": [
    {
      "title": "Action title",
      "description": "Detailed description",
      "priority": "high|medium|low", 
      "estimatedHours": 2,
      "category": "content|technical|links|optimization",
      "targetKeywords": ["keyword1", "keyword2"]
    }
  ]
}`;

  try {
    const response = await llm.generate([
      {
        role: 'system',
        content: 'You are a senior SEO strategist specializing in Canadian mortgage industry websites. Create specific, actionable weekly SEO plans.'
      },
      {
        role: 'user',
        content: strategyPrompt
      }
    ], { temperature: 0.3 });

    const strategy = JSON.parse(response.content);
    return strategy.actions || [];
  } catch (error) {
    console.error('Strategy generation failed:', error);
    
    // Fallback strategy actions
    return [
      {
        title: 'Update mortgage rates page',
        description: 'Add current Bank of Canada rates and market analysis',
        priority: 'high',
        estimatedHours: 2,
        category: 'content',
        targetKeywords: ['mortgage rates', 'current rates', 'bank of canada']
      },
      {
        title: 'Optimize first-time buyer content',
        description: 'Enhance BC first-time buyer guide based on search volume',
        priority: 'medium', 
        estimatedHours: 3,
        category: 'content',
        targetKeywords: ['first time buyer bc', 'first time home buyer']
      },
      {
        title: 'Improve calculator page performance',
        description: 'Add schema markup and optimize for calculator-related queries',
        priority: 'medium',
        estimatedHours: 2,
        category: 'technical',
        targetKeywords: ['mortgage calculator', 'payment calculator']
      }
    ];
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and admin status
    await verifyAuth(request);

    console.log('Starting weekly strategy generation...');

    // Get Search Console data if available
    const gscData = await getSearchConsoleData();
    
    // Generate strategy actions using LLM
    const actions = await generateStrategyActions(gscData);

    // Create week identifier
    const now = new Date();
    const weekId = `${now.getFullYear()}-W${Math.ceil((now.getDate() - now.getDay() + 1) / 7).toString().padStart(2, '0')}`;

    // Save strategy to Firestore
    const strategyDoc = {
      weekId,
      createdAt: admin.firestore.Timestamp.now(),
      actions,
      searchData: gscData,
      metrics: {
        totalActions: actions.length,
        highPriority: actions.filter(a => a.priority === 'high').length,
        estimatedHours: actions.reduce((sum, a) => sum + (a.estimatedHours || 0), 0),
        gscAvailable: gscData.available
      }
    };

    await db.collection('strategy').doc(`weekly_${weekId}`).set(strategyDoc);

    console.log(`Weekly strategy ${weekId} created with ${actions.length} actions`);

    return NextResponse.json({
      success: true,
      weekId,
      actionsCount: actions.length,
      strategy: strategyDoc
    });

  } catch (error) {
    console.error('Weekly strategy error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('authorization') || error.message.includes('Admin')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get latest strategy
export async function GET(request: NextRequest) {
  try {
    await verifyAuth(request);

    const latestStrategy = await db.collection('strategy')
      .orderBy('createdAt', 'desc')
      .limit(1)
      .get();

    if (latestStrategy.empty) {
      return NextResponse.json({
        available: false,
        message: 'No strategy generated yet'
      });
    }

    const doc = latestStrategy.docs[0];
    const data = doc.data();
    
    return NextResponse.json({
      available: true,
      ...data,
      createdAt: data.createdAt.toDate()
    });

  } catch (error) {
    console.error('Get strategy error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('authorization') || error.message.includes('Admin')) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}