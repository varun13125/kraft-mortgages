import { NextResponse } from 'next/server';

export async function GET() {
  const config = {
    timestamp: new Date().toISOString(),
    firebase: {
      hasServiceAccount: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
      hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    },
    ai: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasAnthropic: !!process.env.ANTHROPIC_API_KEY,
      hasGoogle: !!process.env.GOOGLE_API_KEY,
      hasOpenRouter: !!process.env.OPENROUTER_API_KEY,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) + '...',
      anthropicKeyPrefix: process.env.ANTHROPIC_API_KEY?.substring(0, 7) + '...',
      googleKeyPrefix: process.env.GOOGLE_API_KEY?.substring(0, 7) + '...',
      openRouterKeyPrefix: process.env.OPENROUTER_API_KEY?.substring(0, 7) + '...',
    },
    other: {
      hasAIMode: !!process.env.AI_MODE,
      aiMode: process.env.AI_MODE,
      hasWordPress: !!process.env.WORDPRESS_BASE_URL,
      wordPressUrl: process.env.WORDPRESS_BASE_URL,
    }
  };

  // Check if at least one AI provider is configured
  const hasAnyAI = config.ai.hasOpenAI || config.ai.hasAnthropic || config.ai.hasGoogle || config.ai.hasOpenRouter;
  
  if (!hasAnyAI) {
    return NextResponse.json({
      ...config,
      error: 'No AI provider configured! You need at least one of: OPENAI_API_KEY, ANTHROPIC_API_KEY, GOOGLE_API_KEY, or OPENROUTER_API_KEY',
      status: 'error'
    }, { status: 500 });
  }

  // Try to initialize the LLM router
  try {
    const { LLMRouter } = await import('@/lib/ai/llm');
    const router = new LLMRouter();
    
    config.llmRouter = {
      initialized: true,
      availableProviders: {
        openai: !!router.openai,
        anthropic: !!router.anthropic,
        google: !!router.google,
        openrouter: !!router.openrouter,
      }
    };
  } catch (error) {
    config.llmRouter = {
      initialized: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }

  return NextResponse.json({
    ...config,
    status: 'ok',
    message: hasAnyAI ? 'AI providers configured successfully' : 'No AI providers configured'
  });
}