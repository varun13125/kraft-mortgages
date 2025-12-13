// Lazy imports and initialization to prevent build-time issues
let admin: any = null;
let getFirestore: any = null;
let isInitialized = false;

// Initialize imports only when needed
async function initializeFirebase() {
  if (!admin) {
    admin = (await import('firebase-admin')).default;
    getFirestore = (await import('firebase-admin/firestore')).getFirestore;
  }
}

// Initialize Firebase Admin - completely lazy
async function initializeAdmin() {
  if (isInitialized || (admin && admin.apps.length > 0)) {
    console.log('Firebase already initialized');
    return;
  }

  console.log('Initializing Firebase Admin...');

  // Skip during build or if no credentials
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON && !process.env.FIREBASE_PROJECT_ID) {
    console.log('No Firebase credentials found, skipping initialization');
    return;
  }

  await initializeFirebase();

  let serviceAccount;

  // Try using complete service account JSON first (recommended)
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    try {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON:', e);
      return;
    }
  }

  // Fallback to individual environment variables
  if (!serviceAccount) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Skip initialization if required env vars are missing
    if (!projectId || !clientEmail || !privateKey) {
      return;
    }

    // Handle different private key formats
    if (privateKey) {
      // If it's base64 encoded, decode it
      if (!privateKey.includes('BEGIN PRIVATE KEY')) {
        try {
          privateKey = Buffer.from(privateKey, 'base64').toString('utf-8');
        } catch (e) {
          console.log('Private key is not base64, using as-is');
        }
      }

      // Replace literal \n with actual newlines
      privateKey = privateKey.replace(/\\n/g, '\n');
    }

    serviceAccount = {
      projectId,
      clientEmail,
      privateKey,
    };
  }

  // Initialize admin
  if (serviceAccount && serviceAccount.projectId) {
    try {
      console.log('Initializing Firebase Admin with project:', serviceAccount.projectId);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.projectId, // Explicitly set project ID
      });
      isInitialized = true;
      console.log('Firebase Admin initialized successfully');
    } catch (initError) {
      console.error('Firebase admin initialization error:', initError);
    }
  } else {
    console.log('Missing serviceAccount or projectId');
  }
}

// Safe database getter with build-time fallback
async function getDb() {
  await initializeAdmin();

  // Debug logging
  console.log('getDb debug:', {
    isInitialized,
    hasAdmin: !!admin,
    hasGetFirestore: !!getFirestore,
    adminAppsLength: admin?.apps?.length || 0
  });

  if (!isInitialized || !admin || !getFirestore) {
    console.log('Using mock database - Firebase not properly initialized');
    // Return a mock object for build time or when Firebase isn't available
    const mockCollection = {
      add: () => Promise.resolve({ id: 'mock' }),
      doc: (id: string) => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        id
      }),
      where: () => mockCollection,
      orderBy: () => mockCollection,
      limit: () => mockCollection,
      get: () => Promise.resolve({ docs: [], empty: true }),
    };

    return {
      collection: () => mockCollection,
    } as any;
  }

  try {
    // Connect to the correct database (default is in nam5 region)
    return getFirestore();
  } catch (error) {
    console.error('Failed to get Firestore instance:', error);
    // Return mock for safety
    const mockCollection = {
      add: () => Promise.resolve({ id: 'mock' }),
      doc: (id: string) => ({
        get: () => Promise.resolve({ exists: false, data: () => null }),
        set: () => Promise.resolve(),
        update: () => Promise.resolve(),
        id
      }),
    };
    return {
      collection: () => mockCollection,
    } as any;
  }
}

// Typed helpers
export interface Run {
  id: string;
  mode: 'auto' | 'manual-topic' | 'manual-idea';
  manualQuery?: string;
  targetProvinces: string[];
  startedAt: Date;
  steps: Step[];
  createdBy: string;
  scout?: any;
  brief?: any;
  draft?: any;
  gate?: any;
  final?: any;
  published?: any;
}

export interface Step {
  agent: string;
  status: 'queued' | 'running' | 'ok' | 'error';
  startedAt?: Date;
  finishedAt?: Date;
  error?: string;
}

export interface Post {
  slug: string;
  title: string;
  markdown: string;
  html: string;
  status: 'published' | 'draft';
  publishedAt: Date;
  author: {
    name: string;
    title: string;
    license: string;
  };
  metaDescription?: string;
  keywords?: string[];
  categories?: string[];
  embeddings?: number[][];
}

// Export db for backward compatibility
export const db = {
  collection: async (name: string) => (await getDb()).collection(name)
};

// Collection helpers
export const runsCol = async () => (await getDb()).collection('runs');
export const postsCol = async () => (await getDb()).collection('posts');
export const adminsCol = async () => (await getDb()).collection('admins');

export const nowTimestamp = async () => {
  await initializeFirebase();
  return admin ? admin.firestore.Timestamp.now() : { toDate: () => new Date() };
};

// CRUD helpers
export async function createRun(data: Omit<Run, 'id'>): Promise<string> {
  const doc = await (await runsCol()).add({
    ...data,
    startedAt: await nowTimestamp(),
  });
  return doc.id;
}

export async function getRun(runId: string): Promise<Run | null> {
  const doc = await (await runsCol()).doc(runId).get();
  if (!doc.exists) return null;

  return {
    id: doc.id,
    ...doc.data(),
    startedAt: doc.data()?.startedAt?.toDate(),
    steps: doc.data()?.steps?.map((s: any) => ({
      ...s,
      startedAt: s.startedAt?.toDate(),
      finishedAt: s.finishedAt?.toDate(),
    })) || [],
  } as Run;
}

export async function updateRun(runId: string, data: Partial<Run>): Promise<void> {
  await (await runsCol()).doc(runId).update(data);
}

export async function updateRunStep(runId: string, stepIndex: number, stepData: Partial<Step>): Promise<void> {
  // Create update data, filtering out undefined values
  const timestampData: any = {
    ...stepData,
  };

  // Only add timestamp fields if they have values
  if (stepData.startedAt) {
    await initializeFirebase();
    if (admin) {
      timestampData.startedAt = admin.firestore.Timestamp.fromDate(stepData.startedAt);
    }
  }

  if (stepData.finishedAt) {
    await initializeFirebase();
    if (admin) {
      timestampData.finishedAt = admin.firestore.Timestamp.fromDate(stepData.finishedAt);
    }
  }

  await (await runsCol()).doc(runId).update({
    [`steps.${stepIndex}`]: timestampData,
  });
}

export async function isAdmin(uid: string): Promise<boolean> {
  // Temporary hardcoded admin bypass - remove once Firestore connection is fixed
  if (uid === 'TQGTUsLoc8RiGYPJ9SEg3h0jWTk2') {
    console.log('Admin bypass: granting admin access to hardcoded UUID');
    return true;
  }

  const doc = await (await adminsCol()).doc(uid).get();
  return doc.exists;
}

export async function savePost(post: Post): Promise<void> {
  await initializeFirebase();
  const timestampData = admin ? admin.firestore.Timestamp.fromDate(post.publishedAt) : post.publishedAt;

  await (await postsCol()).doc(post.slug).set({
    ...post,
    publishedAt: timestampData,
  });
}

export async function getPost(slug: string): Promise<Post | null> {
  // Mock data for our specific blog post
  if (slug === 'the-blueprint-construction-mortgages') {
    const blogContent = `<h2>The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC</h2><p>In British Columbia’s dynamic real estate market, building your own custom home or developing a property is one of the most rewarding financial ventures you can undertake. It's also one of the most complex, especially when it comes to financing.</p><p>Unlike a traditional mortgage where funds are advanced in a single lump sum, a construction mortgage is a specialized product designed to mitigate risk for both the lender and the builder. It's a staged financing tool that releases funds in intervals—known as \"draws\"—as the project reaches specific, predetermined milestones.</p><p>Navigating this process requires meticulous planning, a solid team, and a mortgage broker who specializes in construction financing. At Kraft Mortgages, we don't just arrange the loan; we become a key part of your project management team, ensuring a smooth financial flow from foundation to finish.</p><h3>Everyday Expert Translation: What Exactly is a \"Draw Mortgage\"?</h3><p>Think of it as a \"pay-as-you-go\" system for your build. Instead of getting all the money upfront, the lender releases portions of the approved loan at key stages of completion. An appraiser must visit the site and verify that each stage is complete before the next draw is released. This ensures the lender's investment is protected and that the project is progressing as planned.</p><p>The loan is typically interest-only during the construction phase, meaning you only pay interest on the funds that have been drawn to date. This keeps your carrying costs manageable before the property is complete.</p><h3>The 4 Key Stages of a Construction Mortgage</h3><p>Every construction project is unique, but the financing process follows a clear, structured path.</p><h4>Stage 1: The Foundation - Land & The First Draw</h4><p>Before any construction begins, you need the land and the initial funds to get started.</p><p><strong>The Loan:</strong> The first advance typically covers a percentage of the land value and the initial \"soft costs\" (permits, architectural plans). Lenders will also want to see your detailed construction budget and building plans at this stage.</p><p><strong>Your Equity:</strong> You will need to have a significant down payment. Lenders want to see that you have a substantial amount of your own capital invested in the project from day one.</p><h4>Stage 2: The Build - The Progressive Draw Schedule</h4><p>This is the core of the construction mortgage. As your builder completes each phase, we coordinate with the lender and appraiser to release the next draw. A typical schedule looks like this:</p><ul><li><strong>Draw #2 (30-40% Complete):</strong> Released after the foundation is poured, the subfloor is in, and framing is complete. The house is \"weather-protected\" with the roof on and windows installed (known as \"lock-up\").</li><li><strong>Draw #3 (65-75% Complete):</strong> Released once the interior systems are in place—plumbing, electrical, heating, and insulation are done, and the drywall is up and ready for finishing.</li><li><strong>Draw #4 (85-95% Complete):</strong> Released after the kitchen cabinets and bathrooms are installed, flooring is down, and painting is complete. The house is starting to look finished.</li></ul><img src=\"/images/blog-4.png\" alt=\"A construction site with framing complete, representing the lock-up stage.\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h4>Stage 3: The Finish - The Final Draw</h4><p>The final draw, often around 10-15% of the total loan, is released upon 100% completion. This means the home has passed its final municipal inspection, an occupancy permit has been issued, and the lender's appraiser has confirmed the project is fully finished according to the plans.</p><h4>Stage 4: The Conversion - From Construction Loan to Traditional Mortgage</h4><p>Once the final draw is advanced and the project is complete, the construction loan is typically converted into a standard residential mortgage. This is when you begin making regular principal and interest payments. We work to ensure you get the best possible rates and terms for this \"take-out\" financing, setting you up for long-term success.</p><h3>The Biggest Risk: Managing Costs & Delays</h3><p>The number one challenge in any construction project is staying on budget and on schedule. Cost overruns or delays can disrupt the draw schedule and, in a worst-case scenario, halt your project.</p><p>This is where having an expert broker is non-negotiable. We help you build a realistic budget with a built-in contingency fund. We act as the critical communication link between your builder, the appraiser, and the lender to ensure draws are requested on time and released without delay. Our job is to prevent financial friction so you and your builder can focus on what you do best.</p><p>Planning a build in Surrey, White Rock, or anywhere in BC?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now to structure a financing blueprint that ensures your project's success.</a></p>`;

    return {
      slug: 'the-blueprint-construction-mortgages',
      title: "The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC",
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-10-13T12:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'A comprehensive guide to construction mortgages in BC, demystifying the process and positioning Kraft Mortgages as the essential partner for any building project.',
      keywords: ['construction-mortgage', 'bc-real-estate', 'building-finance', 'draw-mortgage'],
      categories: ['Construction Financing', 'Mortgage Guide']
    };
  }
  if (slug === 'the-developers-edge') {
    const blogContent = `<h1>The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver</h1><p>For multi-unit residential developers in British Columbia, profit margins are everything. You’re constantly balancing the high costs of land and construction against future rental income and property valuation. But what if you could significantly reduce your initial cash equity requirement and secure financing terms that dramatically improve your project's cash flow from day one? That's precisely what the CMHC MLI Select program is designed to do. This isn't just another mortgage product; it's a strategic tool. For developers in high-need areas like Surrey and Vancouver, it's a game-changer. At Kraft Mortgages, we specialize in structuring these complex applications to ensure our developer clients maximize their leverage and returns.</p><h2>Everyday Expert Translation: What is MLI Select?</h2><p>Think of MLI Select as a rewards program for building the right kind of housing. CMHC uses a points system to incentivize developers who build energy-efficient, accessible, and affordable rental units. The more points your project scores, the better the financing incentives you receive. We're talking up to 95% loan-to-value (LTV) financing and 50-year amortizations—terms that are simply unavailable through conventional financing.</p><h2>Breaking Down the Points System for BC Developers</h2><p>To qualify for the best incentives, a project needs 100 points. Here’s how you get there:</p><ul><li><strong>Energy Efficiency (Up to 100 points):</strong> This is the fastest path to premium benefits...</li><li><strong>Affordability (Up to 100 points):</strong> This involves committing a percentage of your units to rental rates below the market average...</li><li><strong>Accessibility (Up to 50 points):</strong> By incorporating accessible design features...</li></ul><img src=\"/images/blog-3.png\" alt=\"New apartment construction\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h2>The Bottom Line: A Practical Example</h2><p>Imagine a $10 million, 20-unit rental project in Surrey.</p><ul><li><strong>Conventional Financing:</strong> Might require a $2.5 million down payment (75% LTV).</li><li><strong>MLI Select Financing:</strong> By scoring 100+ points, you could potentially secure financing with only a $500,000 down payment (95% LTV).</li></ul><p>That’s $2 million in capital freed up... This is the power of working with a broker who understands the intricate details of programs like MLI Select. Navigating the CMHC application process requires more than just filling out forms. It requires a strategic approach to project design and a deep understanding of the underwriter's requirements.</p><p>Is your next project a candidate for MLI Select?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now</a></p><p><em>(Disclaimer: The information provided is for general informational purposes only...)</em></p>`;

    return {
      slug: 'the-developers-edge',
      title: "The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver",
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-10-13T10:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: "For multi-unit residential developers in British Columbia, profit margins are everything. Learn how the CMHC MLI Select program can unlock up to 95% LTV...",
      keywords: ['mli-select', 'cmhc', 'development-financing', 'surrey', 'vancouver'],
      categories: ['Development Financing', 'MLI Select']
    };
  }
  if (slug === 'bank-of-canada-rate-hold-december-2025') {
    const blogContent = `<article>
<h2>The "Wait and See" Is Over: Bank of Canada Holds Rates at 2.25%</h2>
<p><strong>Date:</strong> December 11, 2025 | <strong>Category:</strong> Market Update, Mortgage Strategy | <strong>Reading Time:</strong> 4 Minutes</p>

<p>If you've been sitting on the sidelines waiting for mortgage rates to hit rock bottom, the Bank of Canada just sent a clear signal: <strong>we have arrived</strong>.</p>

<p>On December 10, 2025, the Bank of Canada announced it is holding its key overnight rate at <strong>2.25%</strong>. After a year of aggressive cuts—dropping a full 1.00% in 2025 alone—the Bank has signaled that the easing cycle is likely over for now.</p>

<p>For homeowners and buyers in Surrey and Vancouver, this marks a <strong>critical pivot point</strong>. The era of "rapidly falling rates" is shifting to an era of "stability." Here is what this new reality means for your mortgage strategy in 2026.</p>

<hr/>

<h3>The News Breakdown: Why the Pause?</h3>

<p>Governor Tiff Macklem stated that the current rate of 2.25% is "at about the right level" to keep inflation near the 2% target while supporting the economy.</p>

<p><strong>The Good News:</strong> The economy grew a surprisingly strong 2.6% in Q3. The recession fears that plagued early 2025 have largely subsided.</p>

<p><strong>The Caution:</strong> With global trade uncertainty (specifically potential US tariffs) looming, the Bank is keeping some ammunition in reserve.</p>

<p><strong>The Result:</strong> Prime rates at major banks will remain steady at <strong>4.45%</strong>.</p>

<hr/>

<h3>The "Golden Window" for Vancouver Buyers</h3>

<p>While rates have stabilized, the real estate market is presenting a unique opportunity.</p>

<p>According to the <strong>latest Royal LePage Market Survey Forecast</strong>, home prices in Greater Vancouver are expected to dip approximately <strong>3.5% in 2026</strong>. Why? Because inventory is currently hovering at decade highs.</p>

<p>This creates a rare <strong>"Golden Window"</strong> for buyers:</p>

<ul>
<li><strong>Rates are Accessible:</strong> We are sitting at the bottom of the neutral range (2.25%).</li>
<li><strong>Prices are Softening:</strong> You have negotiating power that hasn't existed in years.</li>
<li><strong>Competition is Low:</strong> Many buyers are still waiting for "lower rates" that likely aren't coming.</li>
</ul>

<img src="/images/blog-boc-rate-hold-2025.png" alt="Bank of Canada rate decision December 2025 - rates holding steady at 2.25%" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>Actionable Advice: Your 2026 Strategy</h3>

<h4>1. For Home Buyers: Don't Time the Absolute Bottom</h4>

<p>The Bank of Canada is expected to hold this 2.25% rate through most of 2026. Waiting for another 0.25% cut might save you $40 a month, but it could cost you the chance to buy while prices are soft. When the market realizes rates have stabilized, buyer confidence will return, and that inventory will vanish.</p>

<h4>2. For Renewals: The Fixed vs. Variable Debate</h4>

<p>With the BoC pausing, variable rates will remain steady at <strong>Prime minus your discount</strong> (currently around 3.45% for many). However, fixed rates are actually starting to creep up. Bond markets are reacting to the economic strength, pushing yields higher.</p>

<p><strong>Strategy:</strong> If you value sleep, a <strong>3-year fixed rate</strong> might be the sweet spot right now before bond yields push them higher.</p>

<p><strong>Opportunity:</strong> Remember, if you have an uninsured mortgage, you can now switch lenders at renewal without passing the stress test. <strong>Do not sign your bank's renewal letter</strong> without letting us shop the market for you.</p>

<h4>3. For Investors: Watch the "Stress Test"</h4>

<p>Rumors are circulating that <strong>OSFI</strong> (the banking regulator) is considering replacing the stress test with a "loan-to-income" limit later in 2026. While this isn't official yet, it could drastically change borrowing power for investors with multiple properties. We are monitoring this closely.</p>

<hr/>

<h3>The Bottom Line</h3>

<p><strong>The falling knife has hit the floor.</strong> Rates are stable, the economy is resilient, and the Vancouver market is on sale.</p>

<p>Unsure if you should lock in or ride the variable wave in 2026?</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Market Strategy Call</a></p>
</article>`;

    return {
      slug: 'bank-of-canada-rate-hold-december-2025',
      title: 'The "Wait and See" Is Over: Bank of Canada Holds Rates at 2.25% (And What It Means for 2026)',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-11T08:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'Bank of Canada announced holding its key overnight rate at 2.25%. After a year of aggressive cuts, the easing cycle is likely over. What this new reality means for your mortgage strategy in 2026.',
      keywords: ['Bank of Canada', 'interest-rates', 'mortgage-strategy', '2026', 'vancouver-real-estate', 'surrey-mortgages', 'fixed-vs-variable'],
      categories: ['Market News', 'Interest Rates']
    };
  }
  if (slug === 'mli-select-infinite-return-alberta') {
    const blogContent = `<article>
<h2>The "Infinite Return" Loop: Why CMHC MLI Select Was Made for Alberta (Not Vancouver)</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Advanced Real Estate Strategy | <strong>Reading Time:</strong> 6 Minutes</p>

<p>If you are a real estate investor, you've heard the buzzwords: <span style="font-size: 1.25em; font-weight: bold; color: #f59e0b;">95% Loan-to-Value</span>. <span style="font-size: 1.25em; font-weight: bold; color: #f59e0b;">50-Year Amortization</span>.</p>

<p>The CMHC MLI Select program is effectively the most powerful leverage tool ever offered to Canadian investors. It allows you to buy multi-family properties with as little as 5% down, spreading payments over half a century to drastically lower your monthly obligations.</p>

<p>But here is the <strong>"mind-blowing"</strong> truth that most brokers won't tell you: <strong style="color: #ef4444;">This program is mathematically broken in Vancouver.</strong></p>

<p>In a market like Surrey or Vancouver, where cap rates hover around 3-4%, maxing out your leverage to 95% usually guarantees one thing: <strong>negative cash flow</strong>. You might own the building with very little money down, but you'll be feeding it cash every month just to keep the lights on.</p>

<p><strong>Enter Alberta.</strong></p>

<p>When you combine MLI Select's massive leverage with Alberta's high cap rates and lack of rent control, you enter the territory of <span style="font-size: 1.25em; font-weight: bold; color: #10b981;">Infinite Returns</span>. Here is why the smart money is moving east.</p>

<hr/>

<h3>The Math: BC vs. Alberta (The "Cash Flow" Test)</h3>

<p>Let's look at a hypothetical <strong>$5 Million Multi-Family</strong> purchase in both provinces to see why geography changes everything.</p>

<!-- Comparison Table -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin: 2rem 0;">
  
  <!-- Vancouver Box -->
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; border: 2px solid #ef4444;">
    <h4 style="color: #ef4444; margin: 0 0 1rem 0; font-size: 1.25rem; text-align: center;">🏙️ Scenario A: Vancouver</h4>
    <p style="text-align: center; color: #9ca3af; font-size: 0.875rem; margin-bottom: 1rem;">"The Equity Trap"</p>
    
    <div style="space-y: 0.5rem;">
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Purchase Price</span>
        <span style="color: #f3f4f6; font-weight: 600;">$5,000,000</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Cap Rate</span>
        <span style="color: #f3f4f6; font-weight: 600;">3.5%</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">NOI (Annual)</span>
        <span style="color: #f3f4f6; font-weight: 600;">$175,000</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Financing</span>
        <span style="color: #f59e0b; font-weight: 600;">95% LTV (MLI)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Mortgage Payment</span>
        <span style="color: #f3f4f6; font-weight: 600;">~$250,000/yr</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; margin-top: 0.5rem; background: rgba(239, 68, 68, 0.2); border-radius: 8px; padding-left: 0.5rem; padding-right: 0.5rem;">
        <span style="color: #fca5a5; font-weight: 600;">Cash Flow</span>
        <span style="color: #ef4444; font-weight: 700; font-size: 1.125rem;">-$75,000/yr</span>
      </div>
    </div>
    
    <p style="color: #f87171; font-size: 0.875rem; margin-top: 1rem; text-align: center; font-style: italic;">❌ You own it, but it's a liability. Betting purely on appreciation.</p>
  </div>
  
  <!-- Edmonton Box -->
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; border: 2px solid #10b981;">
    <h4 style="color: #10b981; margin: 0 0 1rem 0; font-size: 1.25rem; text-align: center;">🏔️ Scenario B: Edmonton</h4>
    <p style="text-align: center; color: #9ca3af; font-size: 0.875rem; margin-bottom: 1rem;">"The Cash Cow"</p>
    
    <div style="space-y: 0.5rem;">
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Purchase Price</span>
        <span style="color: #f3f4f6; font-weight: 600;">$5,000,000</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Cap Rate</span>
        <span style="color: #10b981; font-weight: 600;">5.75%</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">NOI (Annual)</span>
        <span style="color: #10b981; font-weight: 600;">$287,500</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Financing</span>
        <span style="color: #f59e0b; font-weight: 600;">95% LTV (MLI)</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #4b5563;">
        <span style="color: #d1d5db;">Mortgage Payment</span>
        <span style="color: #f3f4f6; font-weight: 600;">~$250,000/yr</span>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0.75rem 0; margin-top: 0.5rem; background: rgba(16, 185, 129, 0.2); border-radius: 8px; padding-left: 0.5rem; padding-right: 0.5rem;">
        <span style="color: #6ee7b7; font-weight: 600;">Cash Flow</span>
        <span style="color: #10b981; font-weight: 700; font-size: 1.125rem;">+$37,500/yr</span>
      </div>
    </div>
    
    <p style="color: #34d399; font-size: 0.875rem; margin-top: 1rem; text-align: center; font-style: italic;">✅ 5% down = immediate positive income. Building pays YOU.</p>
  </div>
  
</div>

<img src="/images/blog-mli-select-infinite-return.jpg" alt="Real Estate Investment Comparison: Vancouver vs Edmonton - MLI Select & 95% LTV Cash Flow Analysis" style="width:100%;height:auto;border-radius:12px;margin:1.5rem 0;box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />

<hr/>

<h3>The "Secret Sauce": No Rent Control</h3>

<p>This is the <strong>multiplier effect</strong>.</p>

<p>In British Columbia, your ability to raise rents is capped by the government (often below inflation). <strong style="color: #10b981;">In Alberta, there is no rent control.</strong></p>

<p>When you buy an older, under-performing building in Edmonton using MLI Select financing:</p>

<ol style="line-height: 1.8;">
  <li><strong>You renovate</strong> to improve energy efficiency (scoring you the points needed for the 50-year amortization).</li>
  <li><strong>You stabilize</strong> the tenant profile.</li>
  <li><strong>You increase rents</strong> to market rates <em>immediately</em>.</li>
</ol>

<p>Because your mortgage payment is fixed and suppressed (thanks to the <span style="font-size: 1.1em; font-weight: bold; color: #f59e0b;">50-Year Amortization</span>), every dollar of rent increase goes straight to your bottom line. In a 95% leverage scenario, a <strong>10% increase in Net Operating Income can double your Cash-on-Cash return</strong>.</p>

<hr/>

<h3>How to Qualify for the "Golden Ticket"</h3>

<p>To get the <span style="font-size: 1.1em; font-weight: bold; color: #f59e0b;">95% LTV</span> and <span style="font-size: 1.1em; font-weight: bold; color: #f59e0b;">50-year amortization</span>, you need to score 100 points on the CMHC scale. In Alberta, this is often easier than in BC:</p>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #f59e0b;">
  <h4 style="color: #f59e0b; margin: 0 0 0.75rem 0;">⚡ Energy Efficiency (The Easiest Path)</h4>
  <p style="color: #d1d5db; margin: 0;">Alberta has an older housing stock. Taking a 1970s walk-up apartment and upgrading the boiler, windows, and insulation often yields a massive efficiency jump (over 40%), instantly qualifying you for the full 100 points.</p>
</div>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
  <h4 style="color: #10b981; margin: 0 0 0.75rem 0;">💰 Affordability</h4>
  <p style="color: #d1d5db; margin: 0;">You can pledge to keep a portion of units "affordable." In Alberta, where market rents are naturally lower, the gap between "market" and "affordable" is smaller, costing you less in potential revenue than it would in Vancouver.</p>
</div>

<hr/>

<h3>The Bottom Line</h3>

<p><strong>MLI Select is a tool.</strong> In Vancouver, it's a tool for speculation. In Alberta, it's a tool for <span style="font-size: 1.15em; font-weight: bold; color: #10b981;">wealth scaling</span>.</p>

<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
  <p style="color: #ffffff; margin: 0 0 0.5rem 0;"><strong>If you have $500,000 to invest:</strong></p>
  <ul style="color: #e0e7ff; margin: 0; padding-left: 1.5rem;">
    <li style="margin-bottom: 0.5rem;"><strong style="color: #fca5a5;">In Vancouver:</strong> That's a 35% down payment on a small, cash-flow-neutral condo.</li>
    <li><strong style="color: #6ee7b7;">In Alberta:</strong> That's the 5% down payment on a <strong>$10 Million apartment complex</strong> that generates positive income from Day 1.</li>
  </ul>
</div>

<p style="font-size: 1.1em; text-align: center; margin: 2rem 0;"><strong>Ready to stop "parking" money and start multiplying it?</strong></p>

<p style="text-align: center;">
  <a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #1f2937; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">📞 Book a Strategy Call</a>
</p>

<p style="text-align: center; color: #9ca3af; font-size: 0.875rem;">We specialize in structuring MLI Select deals for BC investors moving capital into the high-yield Alberta market.</p>
</article>`;

    return {
      slug: 'mli-select-infinite-return-alberta',
      title: 'The "Infinite Return" Loop: Why CMHC MLI Select Was Made for Alberta (Not Vancouver)',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-12T08:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'Discover why CMHC MLI Select creates infinite returns in Alberta but negative cash flow in Vancouver. Compare 95% LTV multi-family deals in BC vs. Edmonton.',
      keywords: ['MLI-Select', 'CMHC', 'Alberta-investing', 'infinite-returns', 'multi-family', '95-LTV', '50-year-amortization', 'Edmonton'],
      categories: ['Real Estate Investing', 'MLI Select']
    };
  }
  if (slug === 'condo-crunch-surrey-vancouver-low-appraisals') {
    const blogContent = `<article>
<h2>The "Condo Crunch" in Surrey & Vancouver: Why Appraisals Are Coming in Low (And How to Close Anyway)</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Solutions, BC Real Estate | <strong>Reading Time:</strong> 5 Minutes</p>

<img src="/images/blog-condo-crunch-appraisal.jpg" alt="Worried couple looking at condo construction site with appraisal gap showing $60K short" style="width:100%;height:auto;border-radius:12px;margin:1.5rem 0;box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />

<p style="font-size: 1.1em; line-height: 1.8;">It's the phone call no condo buyer wants to receive one week before completion.</p>

<blockquote style="border-left: 4px solid #ef4444; padding-left: 1.5rem; margin: 1.5rem 0; font-style: italic; color: #fca5a5; font-size: 1.1em;">
"The appraisal is back. It's <strong>$60,000 short</strong>."
</blockquote>

<p>If you bought a presale condo in Surrey or Vancouver back in 2022 or 2023, you likely bought at the peak of the market. Now, as you prepare to move in, the market reality has shifted. Prices in many condo pockets have softened, and buyers are walking away from their deposits because they simply <strong>can't bridge the gap</strong>.</p>

<div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0;">
  <p style="color: #fecaca; margin: 0; font-size: 1em;"><strong style="color: #ffffff;">⚠️ Warning:</strong> Walking away means losing your deposit (often <strong>15-20%</strong>) and facing potential <strong>lawsuits from developers</strong>.</p>
</div>

<p>At <strong>Kraft Mortgages</strong>, we have a solution that the big banks don't: <span style="font-size: 1.2em; font-weight: bold; color: #10b981;">An exclusive lender willing to finance up to 85% Loan-to-Value (LTV) on condos.</span></p>

<hr/>

<h3>The "Appraisal Trap": Why Buyers Are Scrambling</h3>

<p>Here is the math that is keeping buyers up at night.</p>

<p>When you buy a home, the bank lends based on the <strong>lower</strong> of two numbers: what you paid, or what it's worth today.</p>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #f59e0b;">
  <h4 style="color: #f59e0b; margin: 0 0 1rem 0;">📋 The Scenario</h4>
  <p style="color: #d1d5db; margin: 0 0 0.5rem 0;">You signed a contract for a 2-bedroom condo in Surrey for <strong style="color: #ffffff;">$700,000</strong>.</p>
  <p style="color: #d1d5db; margin: 0;">Today, the appraiser says it's only worth <strong style="color: #ef4444;">$640,000</strong>.</p>
</div>

<ul style="line-height: 2; color: #d1d5db;">
  <li><strong style="color: #f3f4f6;">The Bank's Move:</strong> A traditional bank will give you 80% of the <em>current</em> value ($640k). That's a mortgage of <strong style="color: #ef4444;">$512,000</strong>.</li>
  <li><strong style="color: #f3f4f6;">The Problem:</strong> You still owe the developer <strong>$700,000</strong>.</li>
  <li><strong style="color: #f3f4f6;">The Gap:</strong> You now need to come up with <strong style="color: #ef4444;">$188,000</strong> in cash to close. If you only saved the traditional 20% down payment ($140,000), you are <strong style="color: #ef4444;">$48,000 short</strong>.</li>
</ul>

<p style="color: #fca5a5; font-style: italic; text-align: center; margin: 1.5rem 0;">This is why buyers are "walking away"—they literally cannot find that extra cash.</p>

<hr/>

<h3>The Kraft Solution: The 85% "Rescue" Mortgage</h3>

<p>While the major banks are tightening their belts and capping conventional mortgages at 80%, we have access to a <strong>specialized lending partner</strong> who understands the current BC market.</p>

<p style="font-size: 1.15em; text-align: center; margin: 1.5rem 0;"><strong style="color: #10b981;">They are willing to go up to 85% Loan-to-Value.</strong></p>

<p>Here is how that same scenario looks with our solution:</p>

<!-- Comparison Table -->
<div style="overflow-x: auto; margin: 2rem 0;">
  <table style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; overflow: hidden;">
    <thead>
      <tr style="background: linear-gradient(135deg, #374151 0%, #4b5563 100%);">
        <th style="padding: 1rem; text-align: left; color: #f3f4f6; font-weight: 600; border-bottom: 2px solid #6b7280;">Feature</th>
        <th style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 600; border-bottom: 2px solid #6b7280;">Standard Bank (80%)</th>
        <th style="padding: 1rem; text-align: center; color: #10b981; font-weight: 600; border-bottom: 2px solid #6b7280;">Kraft Partner (85%)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;">Appraised Value</td>
        <td style="padding: 1rem; text-align: center; color: #f3f4f6; border-bottom: 1px solid #4b5563;">$640,000</td>
        <td style="padding: 1rem; text-align: center; color: #f3f4f6; border-bottom: 1px solid #4b5563;">$640,000</td>
      </tr>
      <tr style="background: rgba(0,0,0,0.2);">
        <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;">Max Mortgage Amount</td>
        <td style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 600; border-bottom: 1px solid #4b5563;">$512,000</td>
        <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 700; border-bottom: 1px solid #4b5563;">$544,000</td>
      </tr>
      <tr>
        <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;">Cash You Need to Close</td>
        <td style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 600; border-bottom: 1px solid #4b5563;">$188,000</td>
        <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 700; border-bottom: 1px solid #4b5563;">$156,000</td>
      </tr>
      <tr style="background: rgba(16, 185, 129, 0.15);">
        <td style="padding: 1rem; color: #d1d5db; font-weight: 600;">Cash Saved</td>
        <td style="padding: 1rem; text-align: center; color: #6b7280;">$0</td>
        <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 700; font-size: 1.25em;">$32,000</td>
      </tr>
    </tbody>
  </table>
</div>

<div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
  <p style="color: #ffffff; margin: 0; font-size: 1.1em;"><strong>That $32,000 difference is often the lifeline that allows you to keep your condo and protect your original deposit.</strong></p>
</div>

<hr/>

<h3>Who Is This For?</h3>

<p>This program is specifically designed for:</p>

<ol style="line-height: 2;">
  <li><strong style="color: #f59e0b;">Presale Buyers:</strong> Facing low appraisals upon completion.</li>
  <li><strong style="color: #f59e0b;">Recent Purchasers:</strong> Who bought with a quick closing and are seeing values dip.</li>
  <li><strong style="color: #f59e0b;">High-Ratio Borrowers:</strong> Who have strong income but are "cash poor" regarding the extra down payment funds.</li>
</ol>

<hr/>

<h3>Don't Walk Away From Your Deposit</h3>

<p>The market in Vancouver and Surrey is shifting, but real estate is a long game. <strong>Walking away from a $100,000+ deposit because of a temporary appraisal gap is a tragedy we want to prevent.</strong></p>

<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; padding: 2rem; margin: 2rem 0; text-align: center;">
  <p style="color: #ffffff; font-size: 1.25em; margin: 0 0 1rem 0; font-weight: 600;">Received a low appraisal? Don't panic.</p>
  <a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #1f2937; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">🆘 Book a 15-min Emergency Strategy Call</a>
  <p style="color: #bfdbfe; font-size: 0.9em; margin: 1rem 0 0 0;">Let's run the numbers with our 85% LTV lender and get you the keys to your new home.</p>
</div>
</article>`;

    return {
      slug: 'condo-crunch-surrey-vancouver-low-appraisals',
      title: 'The "Condo Crunch" in Surrey & Vancouver: Why Appraisals Are Coming in Low (And How to Close Anyway)',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-12T10:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'Presale condo appraisal came in low? Learn how Kraft Mortgages 85% LTV rescue mortgage can save your deposit and close your Surrey or Vancouver condo.',
      keywords: ['low-appraisal', 'presale-condo', 'Surrey', 'Vancouver', '85-LTV', 'rescue-mortgage', 'condo-completion', 'appraisal-gap'],
      categories: ['Mortgage Solutions', 'BC Real Estate']
    };
  }
  if (slug === 'renewal-cliff-2026-mortgage-strategy') {
    const blogContent = `<article>
<h2>The "Renewal Cliff" is Coming: 60% of Canadian Mortgages Renew by 2026</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Strategy, Market News | <strong>Reading Time:</strong> 6 Minutes</p>

<img src="/images/blog-renewal-cliff-2026.png" alt="2026 calendar with glasses and calculator on mortgage renewal notice showing 1.99% to 4.49% rate change" style="width:100%;height:auto;border-radius:12px;margin:1.5rem 0;box-shadow: 0 4px 20px rgba(0,0,0,0.3);" />

<p style="font-size: 1.1em; line-height: 1.8;">If you bought your home or renewed your mortgage during the "pandemic lows" of 2020 or 2021, you likely secured an incredible rate—perhaps as low as <strong style="color: #10b981;">1.79%</strong>.</p>

<p><strong>But the clock is ticking.</strong></p>

<p>A new report confirms that <span style="font-size: 1.2em; font-weight: bold; color: #f59e0b;">60% of all outstanding mortgages in Canada</span> will renew between now and the end of 2026. For millions of homeowners in Surrey and Vancouver, this means trading a record-low rate for a market rate that could be <strong style="color: #ef4444;">2% to 3% higher</strong>.</p>

<p>The media calls it the "Renewal Cliff." At <strong>Kraft Mortgages</strong>, we prefer to call it a <strong style="color: #10b981;">"Strategy Pivot."</strong> Here is exactly what you need to know to handle the jump.</p>

<hr/>

<h3>The Math: What Does "Payment Shock" Actually Look Like?</h3>

<p>Let's look at a typical Surrey mortgage to see the real impact.</p>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #f59e0b;">
  <h4 style="color: #f59e0b; margin: 0 0 1rem 0;">📋 The Scenario</h4>
  <p style="color: #d1d5db; margin: 0;">You have a <strong style="color: #ffffff;">$600,000 mortgage balance</strong>.</p>
  <p style="color: #d1d5db; margin: 0.5rem 0 0 0;"><strong>Current Rate (2021):</strong> <span style="color: #10b981;">1.99%</span></p>
  <p style="color: #d1d5db; margin: 0.5rem 0 0 0;"><strong>Renewal Rate (2026 Forecast):</strong> <span style="color: #ef4444;">~4.49%</span></p>
</div>

<!-- Payment Shock Table -->
<div style="background: linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%); border-radius: 12px; padding: 1.5rem; margin: 2rem 0;">
  <h4 style="color: #ffffff; margin: 0 0 1rem 0; text-align: center;">⚡ THE PAYMENT SHOCK REALITY</h4>
  
  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.3); border-radius: 8px; overflow: hidden;">
      <thead>
        <tr>
          <th style="padding: 1rem; text-align: left; color: #fecaca; font-weight: 600; border-bottom: 2px solid #ef4444;">Feature</th>
          <th style="padding: 1rem; text-align: center; color: #10b981; font-weight: 600; border-bottom: 2px solid #ef4444;">Your Old Mortgage</th>
          <th style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 600; border-bottom: 2px solid #ef4444;">Your New Renewal</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 1rem; color: #fecaca; border-bottom: 1px solid #7f1d1d;">Interest Rate</td>
          <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 600; border-bottom: 1px solid #7f1d1d;">1.99%</td>
          <td style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 700; border-bottom: 1px solid #7f1d1d;">4.49%</td>
        </tr>
        <tr style="background: rgba(0,0,0,0.2);">
          <td style="padding: 1rem; color: #fecaca; border-bottom: 1px solid #7f1d1d;">Monthly Payment</td>
          <td style="padding: 1rem; text-align: center; color: #10b981; font-weight: 600; border-bottom: 1px solid #7f1d1d;">~$2,500</td>
          <td style="padding: 1rem; text-align: center; color: #ef4444; font-weight: 700; border-bottom: 1px solid #7f1d1d;">~$3,300</td>
        </tr>
        <tr style="background: rgba(239, 68, 68, 0.3);">
          <td style="padding: 1rem; color: #ffffff; font-weight: 600;">The Increase</td>
          <td style="padding: 1rem; text-align: center; color: #6b7280;">—</td>
          <td style="padding: 1rem; text-align: center; color: #ffffff; font-weight: 700; font-size: 1.25em;">+$800/month</td>
        </tr>
      </tbody>
    </table>
  </div>
  
  <p style="color: #fecaca; text-align: center; margin: 1rem 0 0 0; font-size: 1.1em;">That's an extra <strong style="color: #ffffff;">$9,600 per year</strong> in after-tax income you need to find.</p>
</div>

<hr/>

<h3>Don't Just "Auto-Renew" (The Bank's Trap)</h3>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #ef4444;">
  <p style="color: #d1d5db; margin: 0;">The biggest mistake you can make is waiting for your bank's renewal letter to arrive in the mail and simply signing it out of fear. <strong style="color: #fca5a5;">Banks bank on your inertia.</strong> They often offer existing clients a rate that is <strong>0.10% to 0.20% higher</strong> than what they offer new clients, knowing you probably won't shop around.</p>
</div>

<hr/>

<h3>3 Strategies to Soften the Landing</h3>

<p>If you are facing a renewal in 2025 or 2026, you have options beyond just "paying more."</p>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #10b981;">
  <h4 style="color: #10b981; margin: 0 0 0.75rem 0;">1. The "Amortization Reset"</h4>
  <p style="color: #d1d5db; margin: 0 0 0.5rem 0;">If the new monthly payment destroys your household budget, we can look at <strong style="color: #ffffff;">extending your amortization</strong>.</p>
  <p style="color: #9ca3af; margin: 0 0 0.5rem 0; font-size: 0.9em;"><em>How it works:</em> If you have 20 years left on your mortgage, we might be able to refinance and reset it back to 25 or 30 years.</p>
  <p style="color: #10b981; margin: 0; font-size: 0.9em;"><strong>The Result:</strong> This spreads the payments out, significantly lowering your monthly obligation.</p>
</div>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
  <h4 style="color: #3b82f6; margin: 0 0 0.75rem 0;">2. Shop the "Switch" Market</h4>
  <p style="color: #d1d5db; margin: 0 0 0.5rem 0;">Thanks to new OSFI rules, it is now easier to switch lenders at renewal <strong style="color: #ffffff;">without passing the Stress Test</strong> (for uninsured mortgages).</p>
  <p style="color: #3b82f6; margin: 0; font-size: 0.9em;"><strong>The Opportunity:</strong> We can take your file to 50+ lenders to find who is hungriest for your business, potentially saving you thousands over the term.</p>
</div>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #f59e0b;">
  <h4 style="color: #f59e0b; margin: 0 0 0.75rem 0;">3. Pre-Payment Strategy (Start Now)</h4>
  <p style="color: #d1d5db; margin: 0 0 0.5rem 0;">If your renewal is still 6-12 months away, use your current "low rate" privileges to <strong style="color: #ffffff;">make lump sum payments now</strong>.</p>
  <p style="color: #f59e0b; margin: 0; font-size: 0.9em;"><strong>The Logic:</strong> Every $1,000 you knock off the principal today is $1,000 you won't have to renew at 4.5% later.</p>
</div>

<hr/>

<h3>The Bottom Line</h3>

<p>The "Renewal Cliff" is real, but it doesn't have to push you over the edge. The key is starting the conversation <strong style="color: #f59e0b;">6 months early</strong>, not 2 weeks before your term expires.</p>

<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; padding: 2rem; margin: 2rem 0; text-align: center;">
  <p style="color: #ffffff; font-size: 1.25em; margin: 0 0 1rem 0; font-weight: 600;">Is your renewal coming up in 2026?</p>
  <a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #1f2937; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">📅 Book a 15-min Renewal Review</a>
  <p style="color: #bfdbfe; font-size: 0.9em; margin: 1rem 0 0 0;">Let's run the numbers on an "Amortization Reset" and see how much cash flow we can save you.</p>
</div>
</article>`;

    return {
      slug: 'renewal-cliff-2026-mortgage-strategy',
      title: 'The "Renewal Cliff" is Coming: 60% of Canadian Mortgages Renew by 2026 (Are You Ready?)',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-12T12:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: '60% of Canadian mortgages renew by 2026. Learn 3 strategies to handle payment shock from pandemic-low rates including amortization reset and switch market options.',
      keywords: ['renewal-cliff', 'mortgage-renewal', '2026', 'payment-shock', 'amortization-reset', 'Surrey', 'Vancouver', 'interest-rates'],
      categories: ['Mortgage Strategy', 'Market News']
    };
  }
  if (slug === 'geographic-arbitrage-surrey-to-alberta') {
    const blogContent = `<article>
<h2>The "Geographic Arbitrage": How to Turn Your Surrey Townhouse into a Mortgage-Free Mansion in Alberta</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Relocation Strategy, Market Trends | <strong>Reading Time:</strong> 6 Minutes</p>

<p style="text-align: center; color: #9ca3af; font-size: 0.875rem; margin: 1.5rem 0;">[IMAGE: A split screen photo. Left side: A rainy, expensive townhouse in Vancouver. Right side: A sunny, large detached home in Alberta. Text overlay says: "Trade This... For This + Cash".]</p>

<p style="font-size: 1.1em; line-height: 1.8;">We see the same story in our Surrey office every week. A family is "house rich" but "cash poor." They own a $1.1 million property in the Lower Mainland, but they are drowning in a $700,000 mortgage and struggling with the high cost of living.</p>

<p>They think they are stuck. <strong style="color: #10b981;">They aren't.</strong></p>

<p>In 2025, the smartest financial move for many BC residents isn't a new investment strategy—it's a map change. It's called <span style="font-size: 1.15em; font-weight: bold; color: #f59e0b;">Geographic Arbitrage</span>: taking equity from a high-cost market (Vancouver/Surrey) and <strong>Moving to Alberta</strong>, a high-growth, lower-cost market (Calgary/Edmonton).</p>

<p>At <strong>Kraft Mortgages</strong>, we are licensed in <strong style="color: #10b981;">both British Columbia and Alberta</strong>. This gives us a unique view of the market—and the ability to handle your entire move seamlessly. As your <strong>Mortgage Broker Surrey</strong> and Alberta specialist, we bridge both worlds.</p>

<hr/>

<h3>The Math That Is Changing Lives</h3>

<p>Let's look at a real-world scenario we recently handled for a client moving from Surrey to Edmonton.</p>

<!-- BC Exit Strategy Table -->
<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 2rem 0;">
  <h4 style="color: #f59e0b; margin: 0 0 1.5rem 0; text-align: center;">📊 THE "BC EXIT" STRATEGY</h4>
  
  <div style="overflow-x: auto;">
    <table style="width: 100%; border-collapse: collapse; background: rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden;">
      <thead>
        <tr style="background: linear-gradient(135deg, #374151 0%, #4b5563 100%);">
          <th style="padding: 1rem; text-align: left; color: #f3f4f6; font-weight: 600; border-bottom: 2px solid #6b7280;">Step</th>
          <th style="padding: 1rem; text-align: left; color: #f3f4f6; font-weight: 600; border-bottom: 2px solid #6b7280;">Location</th>
          <th style="padding: 1rem; text-align: right; color: #f3f4f6; font-weight: 600; border-bottom: 2px solid #6b7280;">The Numbers</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;"><strong>1. Sell</strong></td>
          <td style="padding: 1rem; color: #ef4444; font-weight: 600; border-bottom: 1px solid #4b5563;">Surrey, BC (3-Bed Townhouse)</td>
          <td style="padding: 1rem; text-align: right; color: #10b981; font-weight: 600; border-bottom: 1px solid #4b5563;">Sold: $950,000</td>
        </tr>
        <tr style="background: rgba(0,0,0,0.2);">
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;"><strong>2. Payoff</strong></td>
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;">Existing Mortgage</td>
          <td style="padding: 1rem; text-align: right; color: #ef4444; font-weight: 600; border-bottom: 1px solid #4b5563;">-$550,000</td>
        </tr>
        <tr>
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;"><strong>3. Equity</strong></td>
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;">Cash in Hand</td>
          <td style="padding: 1rem; text-align: right; color: #f59e0b; font-weight: 700; font-size: 1.1em; border-bottom: 1px solid #4b5563;">$400,000</td>
        </tr>
        <tr style="background: rgba(0,0,0,0.2);">
          <td style="padding: 1rem; color: #d1d5db; border-bottom: 1px solid #4b5563;"><strong>4. Buy</strong></td>
          <td style="padding: 1rem; color: #10b981; font-weight: 600; border-bottom: 1px solid #4b5563;"><strong>Edmonton Real Estate</strong> (4-Bed Detached)</td>
          <td style="padding: 1rem; text-align: right; color: #d1d5db; border-bottom: 1px solid #4b5563;">$550,000</td>
        </tr>
        <tr style="background: rgba(16, 185, 129, 0.2);">
          <td style="padding: 1rem; color: #ffffff; font-weight: 600;"><strong>5. Result</strong></td>
          <td style="padding: 1rem; color: #10b981; font-weight: 600;">New Mortgage Amount</td>
          <td style="padding: 1rem; text-align: right; color: #10b981; font-weight: 700; font-size: 1.25em;">$150,000</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<div style="background: linear-gradient(135deg, #065f46 0%, #047857 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; text-align: center;">
  <p style="color: #ffffff; margin: 0; font-size: 1.1em;"><strong>The Outcome:</strong> This family went from a <span style="color: #fecaca;">$550,000 mortgage</span> in a cramped townhouse to a <span style="color: #6ee7b7;">$150,000 mortgage</span> in a detached home with a yard. <strong>Monthly payments dropped by over $2,500.</strong></p>
</div>

<p style="text-align: center; font-size: 1.15em; color: #f59e0b; font-weight: 600; margin: 1.5rem 0;">That is life-changing cash flow.</p>

<hr/>

<h3>The Tricky Part: "Bridge Financing" Across Borders</h3>

<p>Moving provinces is stressful. Financing it shouldn't be.</p>

<p>The biggest hurdle is timing. Often, you need to buy your new home in <strong>Calgary Mortgages</strong> territory or <strong>Edmonton Real Estate</strong> <em>before</em> you receive the cash from your sale in Vancouver or Surrey.</p>

<div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.5rem; margin: 1.5rem 0; border-left: 4px solid #3b82f6;">
  <p style="color: #d1d5db; margin: 0;">Most banks struggle with this when the properties are in different provinces. Because <strong style="color: #ffffff;">Kraft Mortgages</strong> operates in both BC and Alberta, we specialize in <strong style="color: #3b82f6;">Bridge Financing</strong>. We can use the equity in your BC home to provide the down payment for your Alberta home, allowing you to move on <em>your</em> schedule, not the bank's.</p>
</div>

<hr/>

<h3>Why Do This in 2026?</h3>

<div style="display: grid; gap: 1rem; margin: 1.5rem 0;">
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #10b981;">
    <h4 style="color: #10b981; margin: 0 0 0.5rem 0;">1. Alberta is Still Affordable (For Now)</h4>
    <p style="color: #d1d5db; margin: 0; font-size: 0.95em;">While Calgary prices have risen, <strong>Edmonton Real Estate</strong> remains undervalued. You can still buy "luxury" for under $650k.</p>
  </div>
  
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #f59e0b;">
    <h4 style="color: #f59e0b; margin: 0 0 0.5rem 0;">2. No Land Transfer Tax</h4>
    <p style="color: #d1d5db; margin: 0; font-size: 0.95em;">When you buy in Alberta, you don't pay the massive Property Transfer Tax (PTT) you are used to in BC. <strong>That saves you another $10,000–$15,000 instantly.</strong></p>
  </div>
  
  <div style="background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 12px; padding: 1.25rem; border-left: 4px solid #3b82f6;">
    <h4 style="color: #3b82f6; margin: 0 0 0.5rem 0;">3. Lower Income Tax</h4>
    <p style="color: #d1d5db; margin: 0; font-size: 0.95em;">Keep more of what you earn. Alberta's income tax rates are among the lowest in Canada.</p>
  </div>
</div>

<hr/>

<h3>Stop Paying for "Potential" and Start Living for Real</h3>

<p>If you are tired of the "BC Grind," let's run the numbers on your property. You might be sitting on a lottery ticket that can buy you financial freedom just one province over.</p>

<p>As your trusted <strong>Mortgage Broker Surrey</strong> with Alberta expertise, we make cross-province moves seamless.</p>

<div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 12px; padding: 2rem; margin: 2rem 0; text-align: center;">
  <p style="color: #ffffff; font-size: 1.25em; margin: 0 0 1rem 0; font-weight: 600;">Thinking of making the move?</p>
  <a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: #1f2937; padding: 16px 32px; border: none; border-radius: 8px; font-size: 18px; font-weight: 700; cursor: pointer; text-decoration: none; box-shadow: 0 4px 14px rgba(245, 158, 11, 0.4);">🏔️ Book a "BC to Alberta" Strategy Call</a>
  <p style="color: #bfdbfe; font-size: 0.9em; margin: 1rem 0 0 0;">We handle the mortgage on both sides of the Rockies so you only deal with one expert team.</p>
</div>
</article>`;

    return {
      slug: 'geographic-arbitrage-surrey-to-alberta',
      title: 'The "Geographic Arbitrage": How to Turn Your Surrey Townhouse into a Mortgage-Free Mansion in Alberta',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-12T14:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'Learn how to turn your Surrey townhouse equity into a mortgage-free home in Alberta. Bridge financing, no PTT, and lower costs. Your Mortgage Broker Surrey to Alberta specialist.',
      keywords: ['geographic-arbitrage', 'mortgage-broker-surrey', 'moving-to-alberta', 'bridge-financing', 'edmonton-real-estate', 'calgary-mortgages', 'BC-to-Alberta'],
      categories: ['Relocation Strategy', 'Market Trends']
    };
  }
  if (slug === 'alberta-advantage-where-to-invest-2026') {
    const blogContent = `<article>
<h2>The "Alberta Advantage" Hasn't Vanished—It Just Moved North</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Real Estate Investing, Market Trends | <strong>Reading Time:</strong> 5 Minutes</p>

<p>We all know someone who has done it. Maybe it was a neighbor in Surrey who sold their townhome to buy a detached house in Calgary cash-free. Maybe it was a colleague who bought a pre-construction condo in Airdrie.</p>

<p>The "Alberta Migration" isn't just a headline; it's a demographic tidal wave. In early 2025 alone, Alberta saw a net gain of <strong>over 17,000 people</strong>, with the vast majority arriving from British Columbia and Ontario.</p>

<p>But for investors sitting in Vancouver today, the question isn't "Should I invest in Alberta?" The question is: <strong>"Did I miss the boat?"</strong></p>

<p>If you're looking at Calgary? Maybe. But if you look just three hours north to Edmonton, <strong>the ship is just coming in</strong>.</p>

<hr/>

<h3>The Tale of Two Cities: Calgary vs. Edmonton in 2026</h3>

<p>At Kraft Mortgages, we help clients finance properties across Western Canada. Here is the shift we are seeing in the data for 2026.</p>

<h4>1. Calgary: The "Balanced" Big Brother</h4>

<p>Calgary has been the darling of the real estate world for three years. Because of this, prices have jumped significantly.</p>

<p><strong>The Reality:</strong> The "easy equity" has been made. Calgary has transitioned into a <strong>balanced market</strong>.</p>

<p><strong>The Numbers:</strong> While prices are stable, the entry point is higher (detached homes averaging $750k+), and finding a property that is "cash flow positive" with 20% down is becoming as difficult as it is in the Fraser Valley.</p>

<h4>2. Edmonton: The "Early Upswing" Opportunity</h4>

<p>While Calgary prices spiked, Edmonton remained relatively quiet—until now.</p>

<p><strong>The Opportunity:</strong> Edmonton is currently trailing Calgary by about <strong>12-18 months</strong> in its market cycle. It is firmly in the "Early Upswing" phase.</p>

<p><strong>The ROI:</strong> You can still find detached homes in good neighborhoods for <strong>$450k - $550k</strong>.</p>

<p><strong>The Cash Flow:</strong> With significantly lower purchase prices and strong rental demand (driven by the same migration trends), Edmonton is one of the last major Canadian cities where a rental property can generate <strong>positive cash flow from Day 1</strong>.</p>

<img src="/images/blog-alberta-advantage-2026.jpg" alt="Alberta real estate investment opportunity - Edmonton vs Calgary market comparison" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>The "Remote Landlord" Strategy: How to Buy Across the Border</h3>

<p>Buying investment property in another province scares many people. It shouldn't. As your mortgage broker, we handle the financing exactly the same way we would if you were buying in Burnaby.</p>

<p>However, there are three <strong>"Golden Rules"</strong> for BC investors buying in Alberta:</p>

<h4>1. The 20% Rule</h4>
<p>Investment properties require a 20% down payment. No exceptions. But in Edmonton, 20% of a $450k house is only <strong>$90,000</strong>. In Vancouver, that same down payment barely gets you a parking spot.</p>

<h4>2. Don't Ignore Property Management</h4>
<p>You cannot manage a tenant from 1,000km away. We can introduce you to reputable local property managers who take 8-10% of the rent but save you 100% of the headache.</p>

<h4>3. Get Pre-Approved for the "Total Picture"</h4>
<p>We need to ensure your BC income and debts can support the new Alberta mortgage. The good news? We can often use <strong>50% of the projected rental income</strong> from the Alberta property to help you qualify.</p>

<hr/>

<h3>The Bottom Line for 2026</h3>

<p>The "Alberta is Calling" campaign worked. The people have moved. Now, the housing demand is following them.</p>

<p>If you are priced out of the Lower Mainland investment market, or if you're tired of feeding a negative cash flow condo every month, it's time to <strong>look east</strong>.</p>

<p>Don't guess on the numbers.</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Investment Strategy Call</a></p>

<p style="font-size: 14px; color: #666;">Let's run the math on an Edmonton rental property vs. a local BC investment and see which one wins for your portfolio.</p>
</article>`;

    return {
      slug: 'alberta-advantage-where-to-invest-2026',
      title: 'The "Alberta Advantage" Hasn\'t Vanished—It Just Moved North (Where to Invest in 2026)',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-12-12T08:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'The Alberta Migration continues but Calgary may be played out. Discover why Edmonton is the 2026 opportunity for BC real estate investors seeking positive cash flow.',
      keywords: ['Alberta-investing', 'Edmonton-real-estate', 'Calgary-vs-Edmonton', '2026', 'investment-property', 'cash-flow', 'BC-investors'],
      categories: ['Real Estate Investing', 'Market Trends']
    };
  }
  if (slug === 'beyond-big-banks-complex-mortgage-approval') {
    const blogContent = `<h1>Beyond the Big Banks: How We Get Complex Files Approved Post-Stress Test</h1>

<p>We've seen it countless times: a savvy, self-employed business owner or a new Canadian with a solid financial footing gets a hard \"no\" from their bank. Why? Because their file doesn't fit neatly into the standard boxes required to pass the mortgage stress test. We know the pain and frustration of feeling like the system isn't designed for you. That's where <strong>Kraft Mortgages</strong> steps in.</p>

<p>Passing the mortgage stress test isn't just about the rate you're offered; it's about proving your ability to handle payments at a significantly higher qualifying rate. For those with non-traditional income, this can feel like an insurmountable hurdle. But it's not. It's a matter of strategy, documentation, and expert navigation.</p>

<h2>Everyday Expert Translation: What the Stress Test Really Means</h2>

<p>In simple terms, the stress test is a financial simulation. Lenders must check if you could still afford your mortgage payments if interest rates were to rise significantly. This is designed to protect both you and the lender. However, the rigid income calculations used by major banks often fail to capture the full financial picture of self-employed individuals, investors, or those new to the Canadian financial system.</p>

<h2>Case Study: The Self-Employed Professional</h2>

<p>We recently worked with a successful consultant in Surrey. Her business was thriving, but because she maximized her business write-offs (a smart tax strategy), her declared income on paper looked modest. Her bank saw only the bottom line and declined her mortgage application.</p>

<p>Our approach was different. By leveraging alternative income validation strategies and working with a lender specializing in business-for-self files, we were able to present a comprehensive financial picture that showcased her true earning power and cash flow. The result? She was approved for the home she wanted, with a competitive rate and terms. This is a common success story for our clients.</p><img src=\"//images/blog-1.png\" alt=\"Stressed about mortgages\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" />

<h2>Three Actionable Strategies for Complex Borrowers:</h2>

<h3>1. Optimize Your Down Payment</h3>

<p>A larger down payment reduces the loan-to-value ratio, making you a less risky borrower. We can help you strategize the optimal amount to put down without depleting your necessary liquidity.</p>

<h3>2. Leverage Alternative Lenders</h3>

<p>The big banks aren't your only option. We have deep relationships with lenders who specialize in assessing complex income structures, from dividends and capital gains to business bank statements.</p>

<h3>3. Structure Your File for Success</h3>

<p>Before you even apply, we work with you to organize your financial documentation. This isn't just about gathering papers; it's about presenting a narrative that clearly and accurately reflects your financial strength to underwriters.</p>

<p>At <strong>Kraft Mortgages</strong>, we don't just process applications; we build strategies. We thrive on the complex files that others turn away.</p>

<p>Ready to see how your financial picture fits into the right mortgage strategy?</p>

<p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now</a></p>

<p><em><small>(Disclaimer: The following is a representative example for illustrative purposes. Your actual rates and payments may vary. For a loan with an interest rate of 4.25% and a term of 5 years, the Annual Percentage Rate (APR) is 4.35%. This APR is calculated based on a representative loan amount and includes applicable fees. All lending is subject to credit approval.)</small></em></p>`;

    return {
      slug: 'beyond-big-banks-complex-mortgage-approval',
      title: 'Beyond the Big Banks: How We Get Complex Files Approved Post-Stress Test',
      markdown: blogContent,
      html: blogContent,
      status: 'published' as const,
      publishedAt: new Date('2025-10-08T10:00:00Z'),
      author: {
        name: 'Varun Chaudhry',
        title: 'Licensed Mortgage Broker',
        license: 'BCFSA #M08001935'
      },
      metaDescription: 'We specialize in helping self-employed business owners and new Canadians get mortgage approval when traditional banks say no. Learn our expert strategies for passing the stress test.',
      keywords: ['stress-test', 'self-employed', 'mortgage-approval', 'complex-files', 'alternative-lenders'],
      categories: ['Mortgage Solutions', 'Self-Employed']
    };
  }

  const doc = await (await postsCol()).doc(slug).get();
  if (!doc.exists) return null;

  const data = doc.data()!;
  return {
    ...data,
    publishedAt: data.publishedAt?.toDate(),
  } as Post;
}

export async function getRecentPosts(limit: number = 20): Promise<Post[]> {
  // Full blog content for the mock post
  const fullBlogContent = `<h1>Beyond the Big Banks: How We Get Complex Files Approved Post-Stress Test</h1>

<p>We've seen it countless times: a savvy, self-employed business owner or a new Canadian with a solid financial footing gets a hard \"no\" from their bank. Why? Because their file doesn't fit neatly into the standard boxes required to pass the mortgage stress test. We know the pain and frustration of feeling like the system isn't designed for you. That's where <strong>Kraft Mortgages</strong> steps in.</p>

<p>Passing the mortgage stress test isn't just about the rate you're offered; it's about proving your ability to handle payments at a significantly higher qualifying rate. For those with non-traditional income, this can feel like an insurmountable hurdle. But it's not. It's a matter of strategy, documentation, and expert navigation.</p>

<h2>Everyday Expert Translation: What the Stress Test Really Means</h2>

<p>In simple terms, the stress test is a financial simulation. Lenders must check if you could still afford your mortgage payments if interest rates were to rise significantly. This is designed to protect both you and the lender. However, the rigid income calculations used by major banks often fail to capture the full financial picture of self-employed individuals, investors, or those new to the Canadian financial system.</p>

<h2>Case Study: The Self-Employed Professional</h2>

<p>We recently worked with a successful consultant in Surrey. Her business was thriving, but because she maximized her business write-offs (a smart tax strategy), her declared income on paper looked modest. Her bank saw only the bottom line and declined her mortgage application.</p>

<p>Our approach was different. By leveraging alternative income validation strategies and working with a lender specializing in business-for-self files, we were able to present a comprehensive financial picture that showcased her true earning power and cash flow. The result? She was approved for the home she wanted, with a competitive rate and terms. This is a common success story for our clients.</p><img src=\"//images/blog-1.png\" alt=\"Stressed about mortgages\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" />

<h2>Three Actionable Strategies for Complex Borrowers:</h2>

<h3>1. Optimize Your Down Payment</h3>

<p>A larger down payment reduces the loan-to-value ratio, making you a less risky borrower. We can help you strategize the optimal amount to put down without depleting your necessary liquidity.</p>

<h3>2. Leverage Alternative Lenders</h3>

<p>The big banks aren't your only option. We have deep relationships with lenders who specialize in assessing complex income structures, from dividends and capital gains to business bank statements.</p>

<h3>3. Structure Your File for Success</h3>

<p>Before you even apply, we work with you to organize your financial documentation. This isn't just about gathering papers; it's about presenting a narrative that clearly and accurately reflects your financial strength to underwriters.</p>

<p>At <strong>Kraft Mortgages</strong>, we don't just process applications; we build strategies. We thrive on the complex files that others turn away.</p>

<p>Ready to see how your financial picture fits into the right mortgage strategy?</p>

<p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now</a></p>`;

  // Return our mock post as part of recent posts
  const mockPost: Post = {
    slug: 'beyond-big-banks-complex-mortgage-approval',
    title: 'Beyond the Big Banks: How We Get Complex Files Approved Post-Stress Test',
    markdown: fullBlogContent,
    html: fullBlogContent,
    status: 'published' as const,
    publishedAt: new Date('2025-10-08T10:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'We specialize in helping self-employed business owners and new Canadians get mortgage approval when traditional banks say no. Learn our expert strategies for passing the stress test.',
    keywords: ['stress-test', 'self-employed', 'mortgage-approval', 'complex-files', 'alternative-lenders'],
    categories: ['Mortgage Solutions', 'Self-Employed']
  };

  const mockPost2: Post = {
    slug: 'the-developers-edge',
    title: "The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver",
    markdown: `<h1>The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver</h1><p>For multi-unit residential developers in British Columbia, profit margins are everything. You’re constantly balancing the high costs of land and construction against future rental income and property valuation. But what if you could significantly reduce your initial cash equity requirement and secure financing terms that dramatically improve your project's cash flow from day one? That's precisely what the CMHC MLI Select program is designed to do. This isn't just another mortgage product; it's a strategic tool. For developers in high-need areas like Surrey and Vancouver, it's a game-changer. At Kraft Mortgages, we specialize in structuring these complex applications to ensure our developer clients maximize their leverage and returns.</p><h2>Everyday Expert Translation: What is MLI Select?</h2><p>Think of MLI Select as a rewards program for building the right kind of housing. CMHC uses a points system to incentivize developers who build energy-efficient, accessible, and affordable rental units. The more points your project scores, the better the financing incentives you receive. We're talking up to 95% loan-to-value (LTV) financing and 50-year amortizations—terms that are simply unavailable through conventional financing.</p><h2>Breaking Down the Points System for BC Developers</h2><p>To qualify for the best incentives, a project needs 100 points. Here’s how you get there:</p><ul><li><strong>Energy Efficiency (Up to 100 points):</strong> This is the fastest path to premium benefits...</li><li><strong>Affordability (Up to 100 points):</strong> This involves committing a percentage of your units to rental rates below the market average...</li><li><strong>Accessibility (Up to 50 points):</strong> By incorporating accessible design features...</li></ul><img src=\"/images/blog-3.png\" alt=\"New apartment construction\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h2>The Bottom Line: A Practical Example</h2><p>Imagine a $10 million, 20-unit rental project in Surrey.</p><ul><li><strong>Conventional Financing:</strong> Might require a $2.5 million down payment (75% LTV).</li><li><strong>MLI Select Financing:</strong> By scoring 100+ points, you could potentially secure financing with only a $500,000 down payment (95% LTV).</li></ul><p>That’s $2 million in capital freed up... This is the power of working with a broker who understands the intricate details of programs like MLI Select. Navigating the CMHC application process requires more than just filling out forms. It requires a strategic approach to project design and a deep understanding of the underwriter's requirements.</p><p>Is your next project a candidate for MLI Select?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now</a></p><p><em>(Disclaimer: The information provided is for general informational purposes only...)</em></p>`,
    html: `<h1>The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver</h1><p>For multi-unit residential developers in British Columbia, profit margins are everything. You’re constantly balancing the high costs of land and construction against future rental income and property valuation. But what if you could significantly reduce your initial cash equity requirement and secure financing terms that dramatically improve your project's cash flow from day one? That's precisely what the CMHC MLI Select program is designed to do. This isn't just another mortgage product; it's a strategic tool. For developers in high-need areas like Surrey and Vancouver, it's a game-changer. At Kraft Mortgages, we specialize in structuring these complex applications to ensure our developer clients maximize their leverage and returns.</p><h2>Everyday Expert Translation: What is MLI Select?</h2><p>Think of MLI Select as a rewards program for building the right kind of housing. CMHC uses a points system to incentivize developers who build energy-efficient, accessible, and affordable rental units. The more points your project scores, the better the financing incentives you receive. We're talking up to 95% loan-to-value (LTV) financing and 50-year amortizations—terms that are simply unavailable through conventional financing.</p><h2>Breaking Down the Points System for BC Developers</h2><p>To qualify for the best incentives, a project needs 100 points. Here’s how you get there:</p><ul><li><strong>Energy Efficiency (Up to 100 points):</strong> This is the fastest path to premium benefits...</li><li><strong>Affordability (Up to 100 points):</strong> This involves committing a percentage of your units to rental rates below the market average...</li><li><strong>Accessibility (Up to 50 points):</strong> By incorporating accessible design features...</li></ul><img src=\"/images/blog-3.png\" alt=\"New apartment construction\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h2>The Bottom Line: A Practical Example</h2><p>Imagine a $10 million, 20-unit rental project in Surrey.</p><ul><li><strong>Conventional Financing:</strong> Might require a $2.5 million down payment (75% LTV).</li><li><strong>MLI Select Financing:</strong> By scoring 100+ points, you could potentially secure financing with only a $500,000 down payment (95% LTV).</li></ul><p>That’s $2 million in capital freed up... This is the power of working with a broker who understands the intricate details of programs like MLI Select. Navigating the CMHC application process requires more than just filling out forms. It requires a strategic approach to project design and a deep understanding of the underwriter's requirements.</p><p>Is your next project a candidate for MLI Select?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now</a></p><p><em>(Disclaimer: The information provided is for general informational purposes only...)</em></p>`,
    status: 'published' as const,
    publishedAt: new Date('2025-10-13T10:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: "For multi-unit residential developers in British Columbia, profit margins are everything. Learn how the CMHC MLI Select program can unlock up to 95% LTV...",
    keywords: ['mli-select', 'cmhc', 'development-financing', 'surrey', 'vancouver'],
    categories: ['Development Financing', 'MLI Select']
  };

  const mockPost3: Post = {
    slug: 'the-blueprint-construction-mortgages',
    title: "The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC",
    markdown: `<h2>The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC</h2><p>In British Columbia’s dynamic real estate market, building your own custom home or developing a property is one of the most rewarding financial ventures you can undertake. It's also one of the most complex, especially when it comes to financing.</p><p>Unlike a traditional mortgage where funds are advanced in a single lump sum, a construction mortgage is a specialized product designed to mitigate risk for both the lender and the builder. It's a staged financing tool that releases funds in intervals—known as \"draws\"—as the project reaches specific, predetermined milestones.</p><p>Navigating this process requires meticulous planning, a solid team, and a mortgage broker who specializes in construction financing. At Kraft Mortgages, we don't just arrange the loan; we become a key part of your project management team, ensuring a smooth financial flow from foundation to finish.</p><h3>Everyday Expert Translation: What Exactly is a \"Draw Mortgage\"?</h3><p>Think of it as a \"pay-as-you-go\" system for your build. Instead of getting all the money upfront, the lender releases portions of the approved loan at key stages of completion. An appraiser must visit the site and verify that each stage is complete before the next draw is released. This ensures the lender's investment is protected and that the project is progressing as planned.</p><p>The loan is typically interest-only during the construction phase, meaning you only pay interest on the funds that have been drawn to date. This keeps your carrying costs manageable before the property is complete.</p><h3>The 4 Key Stages of a Construction Mortgage</h3><p>Every construction project is unique, but the financing process follows a clear, structured path.</p><h4>Stage 1: The Foundation - Land & The First Draw</h4><p>Before any construction begins, you need the land and the initial funds to get started.</p><p><strong>The Loan:</strong> The first advance typically covers a percentage of the land value and the initial \"soft costs\" (permits, architectural plans). Lenders will also want to see your detailed construction budget and building plans at this stage.</p><p><strong>Your Equity:</strong> You will need to have a significant down payment. Lenders want to see that you have a substantial amount of your own capital invested in the project from day one.</p><h4>Stage 2: The Build - The Progressive Draw Schedule</h4><p>This is the core of the construction mortgage. As your builder completes each phase, we coordinate with the lender and appraiser to release the next draw. A typical schedule looks like this:</p><ul><li><strong>Draw #2 (30-40% Complete):</strong> Released after the foundation is poured, the subfloor is in, and framing is complete. The house is \"weather-protected\" with the roof on and windows installed (known as \"lock-up\").</li><li><strong>Draw #3 (65-75% Complete):</strong> Released once the interior systems are in place—plumbing, electrical, heating, and insulation are done, and the drywall is up and ready for finishing.</li><li><strong>Draw #4 (85-95% Complete):</strong> Released after the kitchen cabinets and bathrooms are installed, flooring is down, and painting is complete. The house is starting to look finished.</li></ul><img src=\"/images/blog-4.png\" alt=\"A construction site with framing complete, representing the lock-up stage.\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h4>Stage 3: The Finish - The Final Draw</h4><p>The final draw, often around 10-15% of the total loan, is released upon 100% completion. This means the home has passed its final municipal inspection, an occupancy permit has been issued, and the lender's appraiser has confirmed the project is fully finished according to the plans.</p><h4>Stage 4: The Conversion - From Construction Loan to Traditional Mortgage</h4><p>Once the final draw is advanced and the project is complete, the construction loan is typically converted into a standard residential mortgage. This is when you begin making regular principal and interest payments. We work to ensure you get the best possible rates and terms for this \"take-out\" financing, setting you up for long-term success.</p><h3>The Biggest Risk: Managing Costs & Delays</h3><p>The number one challenge in any construction project is staying on budget and on schedule. Cost overruns or delays can disrupt the draw schedule and, in a worst-case scenario, halt your project.</p><p>This is where having an expert broker is non-negotiable. We help you build a realistic budget with a built-in contingency fund. We act as the critical communication link between your builder, the appraiser, and the lender to ensure draws are requested on time and released without delay. Our job is to prevent financial friction so you and your builder can focus on what you do best.</p><p>Planning a build in Surrey, White Rock, or anywhere in BC?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now to structure a financing blueprint that ensures your project's success.</a></p>`,
    html: `<h2>The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC</h2><p>In British Columbia’s dynamic real estate market, building your own custom home or developing a property is one of the most rewarding financial ventures you can undertake. It's also one of the most complex, especially when it comes to financing.</p><p>Unlike a traditional mortgage where funds are advanced in a single lump sum, a construction mortgage is a specialized product designed to mitigate risk for both the lender and the builder. It's a staged financing tool that releases funds in intervals—known as \"draws\"—as the project reaches specific, predetermined milestones.</p><p>Navigating this process requires meticulous planning, a solid team, and a mortgage broker who specializes in construction financing. At Kraft Mortgages, we don't just arrange the loan; we become a key part of your project management team, ensuring a smooth financial flow from foundation to finish.</p><h3>Everyday Expert Translation: What Exactly is a \"Draw Mortgage\"?</h3><p>Think of it as a \"pay-as-you-go\" system for your build. Instead of getting all the money upfront, the lender releases portions of the approved loan at key stages of completion. An appraiser must visit the site and verify that each stage is complete before the next draw is released. This ensures the lender's investment is protected and that the project is progressing as planned.</p><p>The loan is typically interest-only during the construction phase, meaning you only pay interest on the funds that have been drawn to date. This keeps your carrying costs manageable before the property is complete.</p><h3>The 4 Key Stages of a Construction Mortgage</h3><p>Every construction project is unique, but the financing process follows a clear, structured path.</p><h4>Stage 1: The Foundation - Land & The First Draw</h4><p>Before any construction begins, you need the land and the initial funds to get started.</p><p><strong>The Loan:</strong> The first advance typically covers a percentage of the land value and the initial \"soft costs\" (permits, architectural plans). Lenders will also want to see your detailed construction budget and building plans at this stage.</p><p><strong>Your Equity:</strong> You will need to have a significant down payment. Lenders want to see that you have a substantial amount of your own capital invested in the project from day one.</p><h4>Stage 2: The Build - The Progressive Draw Schedule</h4><p>This is the core of the construction mortgage. As your builder completes each phase, we coordinate with the lender and appraiser to release the next draw. A typical schedule looks like this:</p><ul><li><strong>Draw #2 (30-40% Complete):</strong> Released after the foundation is poured, the subfloor is in, and framing is complete. The house is \"weather-protected\" with the roof on and windows installed (known as \"lock-up\").</li><li><strong>Draw #3 (65-75% Complete):</strong> Released once the interior systems are in place—plumbing, electrical, heating, and insulation are done, and the drywall is up and ready for finishing.</li><li><strong>Draw #4 (85-95% Complete):</strong> Released after the kitchen cabinets and bathrooms are installed, flooring is down, and painting is complete. The house is starting to look finished.</li></ul><img src=\"/images/blog-4.png\" alt=\"A construction site with framing complete, representing the lock-up stage.\" style=\"width:100%;height:auto;border-radius:8px;margin:1rem 0;\" /><h4>Stage 3: The Finish - The Final Draw</h4><p>The final draw, often around 10-15% of the total loan, is released upon 100% completion. This means the home has passed its final municipal inspection, an occupancy permit has been issued, and the lender's appraiser has confirmed the project is fully finished according to the plans.</p><h4>Stage 4: The Conversion - From Construction Loan to Traditional Mortgage</h4><p>Once the final draw is advanced and the project is complete, the construction loan is typically converted into a standard residential mortgage. This is when you begin making regular principal and interest payments. We work to ensure you get the best possible rates and terms for this \"take-out\" financing, setting you up for long-term success.</p><h3>The Biggest Risk: Managing Costs & Delays</h3><p>The number one challenge in any construction project is staying on budget and on schedule. Cost overruns or delays can disrupt the draw schedule and, in a worst-case scenario, halt your project.</p><p>This is where having an expert broker is non-negotiable. We help you build a realistic budget with a built-in contingency fund. We act as the critical communication link between your builder, the appraiser, and the lender to ensure draws are requested on time and released without delay. Our job is to prevent financial friction so you and your builder can focus on what you do best.</p><p>Planning a build in Surrey, White Rock, or anywhere in BC?</p><p><a href=\"https://calendar.app.google/HcbcfrKKtBvcPQqd8\" target=\"_blank\" rel=\"noopener noreferrer\" style=\"display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;\">Book a 15 min Free Consultation Now to structure a financing blueprint that ensures your project's success.</a></p>`,
    status: 'published' as const,
    publishedAt: new Date('2025-10-13T12:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'A comprehensive guide to construction mortgages in BC, demystifying the process and positioning Kraft Mortgages as the essential partner for any building project.',
    keywords: ['construction-mortgage', 'bc-real-estate', 'building-finance', 'draw-mortgage'],
    categories: ['Construction Financing', 'Mortgage Guide']
  };

  const mockPost4: Post = {
    slug: 'bank-of-canada-rate-hold-december-2025',
    title: 'The "Wait and See" Is Over: Bank of Canada Holds Rates at 2.25% (And What It Means for 2026)',
    markdown: `<article>
<h2>The "Wait and See" Is Over: Bank of Canada Holds Rates at 2.25%</h2>
<p><strong>Date:</strong> December 11, 2025 | <strong>Category:</strong> Market Update, Mortgage Strategy | <strong>Reading Time:</strong> 4 Minutes</p>

<p>If you've been sitting on the sidelines waiting for mortgage rates to hit rock bottom, the Bank of Canada just sent a clear signal: <strong>we have arrived</strong>.</p>

<p>On December 10, 2025, the Bank of Canada announced it is holding its key overnight rate at <strong>2.25%</strong>. After a year of aggressive cuts—dropping a full 1.00% in 2025 alone—the Bank has signaled that the easing cycle is likely over for now.</p>

<p>For homeowners and buyers in Surrey and Vancouver, this marks a <strong>critical pivot point</strong>. The era of "rapidly falling rates" is shifting to an era of "stability." Here is what this new reality means for your mortgage strategy in 2026.</p>

<hr/>

<h3>The News Breakdown: Why the Pause?</h3>

<p>Governor Tiff Macklem stated that the current rate of 2.25% is "at about the right level" to keep inflation near the 2% target while supporting the economy.</p>

<p><strong>The Good News:</strong> The economy grew a surprisingly strong 2.6% in Q3. The recession fears that plagued early 2025 have largely subsided.</p>

<p><strong>The Caution:</strong> With global trade uncertainty (specifically potential US tariffs) looming, the Bank is keeping some ammunition in reserve.</p>

<p><strong>The Result:</strong> Prime rates at major banks will remain steady at <strong>4.45%</strong>.</p>

<hr/>

<h3>The "Golden Window" for Vancouver Buyers</h3>

<p>While rates have stabilized, the real estate market is presenting a unique opportunity.</p>

<p>According to the <strong>latest Royal LePage Market Survey Forecast</strong>, home prices in Greater Vancouver are expected to dip approximately <strong>3.5% in 2026</strong>. Why? Because inventory is currently hovering at decade highs.</p>

<p>This creates a rare <strong>"Golden Window"</strong> for buyers:</p>

<ul>
<li><strong>Rates are Accessible:</strong> We are sitting at the bottom of the neutral range (2.25%).</li>
<li><strong>Prices are Softening:</strong> You have negotiating power that hasn't existed in years.</li>
<li><strong>Competition is Low:</strong> Many buyers are still waiting for "lower rates" that likely aren't coming.</li>
</ul>

<img src="/images/blog-boc-rate-hold-2025.png" alt="Bank of Canada rate decision December 2025 - rates holding steady at 2.25%" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>Actionable Advice: Your 2026 Strategy</h3>

<h4>1. For Home Buyers: Don't Time the Absolute Bottom</h4>

<p>The Bank of Canada is expected to hold this 2.25% rate through most of 2026. Waiting for another 0.25% cut might save you $40 a month, but it could cost you the chance to buy while prices are soft. When the market realizes rates have stabilized, buyer confidence will return, and that inventory will vanish.</p>

<h4>2. For Renewals: The Fixed vs. Variable Debate</h4>

<p>With the BoC pausing, variable rates will remain steady at <strong>Prime minus your discount</strong> (currently around 3.45% for many). However, fixed rates are actually starting to creep up. Bond markets are reacting to the economic strength, pushing yields higher.</p>

<p><strong>Strategy:</strong> If you value sleep, a <strong>3-year fixed rate</strong> might be the sweet spot right now before bond yields push them higher.</p>

<p><strong>Opportunity:</strong> Remember, if you have an uninsured mortgage, you can now switch lenders at renewal without passing the stress test. <strong>Do not sign your bank's renewal letter</strong> without letting us shop the market for you.</p>

<h4>3. For Investors: Watch the "Stress Test"</h4>

<p>Rumors are circulating that <strong>OSFI</strong> (the banking regulator) is considering replacing the stress test with a "loan-to-income" limit later in 2026. While this isn't official yet, it could drastically change borrowing power for investors with multiple properties. We are monitoring this closely.</p>

<hr/>

<h3>The Bottom Line</h3>

<p><strong>The falling knife has hit the floor.</strong> Rates are stable, the economy is resilient, and the Vancouver market is on sale.</p>

<p>Unsure if you should lock in or ride the variable wave in 2026?</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Market Strategy Call</a></p>
</article>`,
    html: `<article>
<h2>The "Wait and See" Is Over: Bank of Canada Holds Rates at 2.25%</h2>
<p><strong>Date:</strong> December 11, 2025 | <strong>Category:</strong> Market Update, Mortgage Strategy | <strong>Reading Time:</strong> 4 Minutes</p>

<p>If you've been sitting on the sidelines waiting for mortgage rates to hit rock bottom, the Bank of Canada just sent a clear signal: <strong>we have arrived</strong>.</p>

<p>On December 10, 2025, the Bank of Canada announced it is holding its key overnight rate at <strong>2.25%</strong>. After a year of aggressive cuts—dropping a full 1.00% in 2025 alone—the Bank has signaled that the easing cycle is likely over for now.</p>

<p>For homeowners and buyers in Surrey and Vancouver, this marks a <strong>critical pivot point</strong>. The era of "rapidly falling rates" is shifting to an era of "stability." Here is what this new reality means for your mortgage strategy in 2026.</p>

<hr/>

<h3>The News Breakdown: Why the Pause?</h3>

<p>Governor Tiff Macklem stated that the current rate of 2.25% is "at about the right level" to keep inflation near the 2% target while supporting the economy.</p>

<p><strong>The Good News:</strong> The economy grew a surprisingly strong 2.6% in Q3. The recession fears that plagued early 2025 have largely subsided.</p>

<p><strong>The Caution:</strong> With global trade uncertainty (specifically potential US tariffs) looming, the Bank is keeping some ammunition in reserve.</p>

<p><strong>The Result:</strong> Prime rates at major banks will remain steady at <strong>4.45%</strong>.</p>

<hr/>

<h3>The "Golden Window" for Vancouver Buyers</h3>

<p>While rates have stabilized, the real estate market is presenting a unique opportunity.</p>

<p>According to the <strong>latest Royal LePage Market Survey Forecast</strong>, home prices in Greater Vancouver are expected to dip approximately <strong>3.5% in 2026</strong>. Why? Because inventory is currently hovering at decade highs.</p>

<p>This creates a rare <strong>"Golden Window"</strong> for buyers:</p>

<ul>
<li><strong>Rates are Accessible:</strong> We are sitting at the bottom of the neutral range (2.25%).</li>
<li><strong>Prices are Softening:</strong> You have negotiating power that hasn't existed in years.</li>
<li><strong>Competition is Low:</strong> Many buyers are still waiting for "lower rates" that likely aren't coming.</li>
</ul>

<img src="/images/blog-boc-rate-hold-2025.png" alt="Bank of Canada rate decision December 2025 - rates holding steady at 2.25%" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>Actionable Advice: Your 2026 Strategy</h3>

<h4>1. For Home Buyers: Don't Time the Absolute Bottom</h4>

<p>The Bank of Canada is expected to hold this 2.25% rate through most of 2026. Waiting for another 0.25% cut might save you $40 a month, but it could cost you the chance to buy while prices are soft. When the market realizes rates have stabilized, buyer confidence will return, and that inventory will vanish.</p>

<h4>2. For Renewals: The Fixed vs. Variable Debate</h4>

<p>With the BoC pausing, variable rates will remain steady at <strong>Prime minus your discount</strong> (currently around 3.45% for many). However, fixed rates are actually starting to creep up. Bond markets are reacting to the economic strength, pushing yields higher.</p>

<p><strong>Strategy:</strong> If you value sleep, a <strong>3-year fixed rate</strong> might be the sweet spot right now before bond yields push them higher.</p>

<p><strong>Opportunity:</strong> Remember, if you have an uninsured mortgage, you can now switch lenders at renewal without passing the stress test. <strong>Do not sign your bank's renewal letter</strong> without letting us shop the market for you.</p>

<h4>3. For Investors: Watch the "Stress Test"</h4>

<p>Rumors are circulating that <strong>OSFI</strong> (the banking regulator) is considering replacing the stress test with a "loan-to-income" limit later in 2026. While this isn't official yet, it could drastically change borrowing power for investors with multiple properties. We are monitoring this closely.</p>

<hr/>

<h3>The Bottom Line</h3>

<p><strong>The falling knife has hit the floor.</strong> Rates are stable, the economy is resilient, and the Vancouver market is on sale.</p>

<p>Unsure if you should lock in or ride the variable wave in 2026?</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Market Strategy Call</a></p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-11T08:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'Bank of Canada announced holding its key overnight rate at 2.25%. After a year of aggressive cuts, the easing cycle is likely over. What this new reality means for your mortgage strategy in 2026.',
    keywords: ['Bank of Canada', 'interest-rates', 'mortgage-strategy', '2026', 'vancouver-real-estate', 'surrey-mortgages', 'fixed-vs-variable'],
    categories: ['Market News', 'Interest Rates']
  };

  const mockPost5: Post = {
    slug: 'alberta-advantage-where-to-invest-2026',
    title: 'The "Alberta Advantage" Hasn\'t Vanished—It Just Moved North (Where to Invest in 2026)',
    markdown: `<article>
<h2>The "Alberta Advantage" Hasn't Vanished—It Just Moved North</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Real Estate Investing, Market Trends | <strong>Reading Time:</strong> 5 Minutes</p>

<p>We all know someone who has done it. Maybe it was a neighbor in Surrey who sold their townhome to buy a detached house in Calgary cash-free. Maybe it was a colleague who bought a pre-construction condo in Airdrie.</p>

<p>The "Alberta Migration" isn't just a headline; it's a demographic tidal wave. In early 2025 alone, Alberta saw a net gain of <strong>over 17,000 people</strong>, with the vast majority arriving from British Columbia and Ontario.</p>

<p>But for investors sitting in Vancouver today, the question isn't "Should I invest in Alberta?" The question is: <strong>"Did I miss the boat?"</strong></p>

<p>If you're looking at Calgary? Maybe. But if you look just three hours north to Edmonton, <strong>the ship is just coming in</strong>.</p>

<hr/>

<h3>The Tale of Two Cities: Calgary vs. Edmonton in 2026</h3>

<p>At Kraft Mortgages, we help clients finance properties across Western Canada. Here is the shift we are seeing in the data for 2026.</p>

<h4>1. Calgary: The "Balanced" Big Brother</h4>

<p>Calgary has been the darling of the real estate world for three years. Because of this, prices have jumped significantly.</p>

<p><strong>The Reality:</strong> The "easy equity" has been made. Calgary has transitioned into a <strong>balanced market</strong>.</p>

<h4>2. Edmonton: The "Early Upswing" Opportunity</h4>

<p>While Calgary prices spiked, Edmonton remained relatively quiet—until now.</p>

<p><strong>The Opportunity:</strong> Edmonton is currently trailing Calgary by about <strong>12-18 months</strong> in its market cycle. It is firmly in the "Early Upswing" phase.</p>

<p><strong>The ROI:</strong> You can still find detached homes in good neighborhoods for <strong>$450k - $550k</strong>.</p>

<p><strong>The Cash Flow:</strong> Edmonton is one of the last major Canadian cities where a rental property can generate <strong>positive cash flow from Day 1</strong>.</p>

<img src="/images/blog-alberta-advantage-2026.jpg" alt="Alberta real estate investment opportunity" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>The "Remote Landlord" Strategy: How to Buy Across the Border</h3>

<p>Buying investment property in another province scares many people. It shouldn't. Here are three <strong>"Golden Rules"</strong> for BC investors buying in Alberta.</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Investment Strategy Call</a></p>
</article>`,
    html: `<article>
<h2>The "Alberta Advantage" Hasn't Vanished—It Just Moved North</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Real Estate Investing, Market Trends | <strong>Reading Time:</strong> 5 Minutes</p>

<p>We all know someone who has done it. Maybe it was a neighbor in Surrey who sold their townhome to buy a detached house in Calgary cash-free. Maybe it was a colleague who bought a pre-construction condo in Airdrie.</p>

<p>The "Alberta Migration" isn't just a headline; it's a demographic tidal wave. In early 2025 alone, Alberta saw a net gain of <strong>over 17,000 people</strong>, with the vast majority arriving from British Columbia and Ontario.</p>

<p>But for investors sitting in Vancouver today, the question isn't "Should I invest in Alberta?" The question is: <strong>"Did I miss the boat?"</strong></p>

<p>If you're looking at Calgary? Maybe. But if you look just three hours north to Edmonton, <strong>the ship is just coming in</strong>.</p>

<hr/>

<h3>The Tale of Two Cities: Calgary vs. Edmonton in 2026</h3>

<p>At Kraft Mortgages, we help clients finance properties across Western Canada. Here is the shift we are seeing in the data for 2026.</p>

<h4>1. Calgary: The "Balanced" Big Brother</h4>

<p>Calgary has been the darling of the real estate world for three years. Because of this, prices have jumped significantly.</p>

<p><strong>The Reality:</strong> The "easy equity" has been made. Calgary has transitioned into a <strong>balanced market</strong>.</p>

<h4>2. Edmonton: The "Early Upswing" Opportunity</h4>

<p>While Calgary prices spiked, Edmonton remained relatively quiet—until now.</p>

<p><strong>The Opportunity:</strong> Edmonton is currently trailing Calgary by about <strong>12-18 months</strong> in its market cycle. It is firmly in the "Early Upswing" phase.</p>

<p><strong>The ROI:</strong> You can still find detached homes in good neighborhoods for <strong>$450k - $550k</strong>.</p>

<p><strong>The Cash Flow:</strong> Edmonton is one of the last major Canadian cities where a rental property can generate <strong>positive cash flow from Day 1</strong>.</p>

<img src="/images/blog-alberta-advantage-2026.jpg" alt="Alberta real estate investment opportunity" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<hr/>

<h3>The "Remote Landlord" Strategy: How to Buy Across the Border</h3>

<p>Buying investment property in another province scares many people. It shouldn't. Here are three <strong>"Golden Rules"</strong> for BC investors buying in Alberta.</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">📞 Book a 15-min Investment Strategy Call</a></p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-12T08:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'The Alberta Migration continues but Calgary may be played out. Discover why Edmonton is the 2026 opportunity for BC real estate investors seeking positive cash flow.',
    keywords: ['Alberta-investing', 'Edmonton-real-estate', 'Calgary-vs-Edmonton', '2026', 'investment-property', 'cash-flow', 'BC-investors'],
    categories: ['Real Estate Investing', 'Market Trends']
  };

  const mockPost6: Post = {
    slug: 'mli-select-infinite-return-alberta',
    title: 'The "Infinite Return" Loop: Why CMHC MLI Select Was Made for Alberta (Not Vancouver)',
    markdown: `<article>
<h2>The "Infinite Return" Loop: Why CMHC MLI Select Was Made for Alberta</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Advanced Real Estate Strategy | <strong>Reading Time:</strong> 6 Minutes</p>

<p>The CMHC MLI Select program offers <strong style="color: #f59e0b;">95% LTV</strong> and <strong style="color: #f59e0b;">50-Year Amortization</strong> for multi-family investors. But here's the truth: <strong style="color: #ef4444;">it's mathematically broken in Vancouver</strong>.</p>

<p>When you combine MLI Select's massive leverage with Alberta's high cap rates and no rent control, you achieve <strong style="color: #10b981;">Infinite Returns</strong>.</p>

<h4>Vancouver: -$75,000/yr Cash Flow (The Equity Trap)</h4>
<h4>Edmonton: +$37,500/yr Cash Flow (The Cash Cow)</h4>

<p>Ready to stop parking money and start multiplying it? Book a Strategy Call to structure your Alberta MLI Select deal.</p>
</article>`,
    html: `<article>
<h2>The "Infinite Return" Loop: Why CMHC MLI Select Was Made for Alberta</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Advanced Real Estate Strategy | <strong>Reading Time:</strong> 6 Minutes</p>

<p>The CMHC MLI Select program offers <strong style="color: #f59e0b;">95% LTV</strong> and <strong style="color: #f59e0b;">50-Year Amortization</strong> for multi-family investors. But here's the truth: <strong style="color: #ef4444;">it's mathematically broken in Vancouver</strong>.</p>

<p>When you combine MLI Select's massive leverage with Alberta's high cap rates and no rent control, you achieve <strong style="color: #10b981;">Infinite Returns</strong>.</p>

<h4>Vancouver: -$75,000/yr Cash Flow (The Equity Trap)</h4>
<h4>Edmonton: +$37,500/yr Cash Flow (The Cash Cow)</h4>

<p>Ready to stop parking money and start multiplying it? Book a Strategy Call to structure your Alberta MLI Select deal.</p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-12T08:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'Discover why CMHC MLI Select creates infinite returns in Alberta but negative cash flow in Vancouver. Compare 95% LTV multi-family deals.',
    keywords: ['MLI-Select', 'CMHC', 'Alberta-investing', 'infinite-returns', 'multi-family', '95-LTV', '50-year-amortization'],
    categories: ['Real Estate Investing', 'MLI Select']
  };

  const mockPost7: Post = {
    slug: 'condo-crunch-surrey-vancouver-low-appraisals',
    title: 'The "Condo Crunch" in Surrey & Vancouver: Why Appraisals Are Coming in Low (And How to Close Anyway)',
    markdown: `<article>
<h2>The "Condo Crunch" in Surrey & Vancouver</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Solutions, BC Real Estate | <strong>Reading Time:</strong> 5 Minutes</p>

<p>Presale condo appraisal came in <strong style="color: #ef4444;">$60,000 short</strong>? You're not alone.</p>

<p>At <strong>Kraft Mortgages</strong>, we have a solution: <strong style="color: #10b981;">85% LTV rescue mortgage</strong> that can save you up to $32,000 in cash at closing.</p>

<p><strong>Standard Bank (80%):</strong> $188,000 cash needed</p>
<p><strong>Kraft Partner (85%):</strong> $156,000 cash needed</p>

<p>Don't walk away from your deposit. Book an emergency strategy call today.</p>
</article>`,
    html: `<article>
<h2>The "Condo Crunch" in Surrey & Vancouver</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Solutions, BC Real Estate | <strong>Reading Time:</strong> 5 Minutes</p>

<p>Presale condo appraisal came in <strong style="color: #ef4444;">$60,000 short</strong>? You're not alone.</p>

<p>At <strong>Kraft Mortgages</strong>, we have a solution: <strong style="color: #10b981;">85% LTV rescue mortgage</strong> that can save you up to $32,000 in cash at closing.</p>

<p><strong>Standard Bank (80%):</strong> $188,000 cash needed</p>
<p><strong>Kraft Partner (85%):</strong> $156,000 cash needed</p>

<p>Don't walk away from your deposit. Book an emergency strategy call today.</p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-12T10:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'Presale condo appraisal came in low? Learn how Kraft Mortgages 85% LTV rescue mortgage can save your deposit and close your Surrey or Vancouver condo.',
    keywords: ['low-appraisal', 'presale-condo', 'Surrey', 'Vancouver', '85-LTV', 'rescue-mortgage'],
    categories: ['Mortgage Solutions', 'BC Real Estate']
  };

  const mockPost8: Post = {
    slug: 'renewal-cliff-2026-mortgage-strategy',
    title: 'The "Renewal Cliff" is Coming: 60% of Canadian Mortgages Renew by 2026 (Are You Ready?)',
    markdown: `<article>
<h2>The "Renewal Cliff" is Coming: 60% Renew by 2026</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Strategy, Market News | <strong>Reading Time:</strong> 6 Minutes</p>

<p>If you locked in at <strong style="color: #10b981;">1.99%</strong> in 2021, you're about to renew at <strong style="color: #ef4444;">4.49%</strong>.</p>

<p><strong>Payment Shock:</strong> $2,500/month → $3,300/month = <strong style="color: #ef4444;">+$800/month</strong></p>

<p>We have 3 strategies: Amortization Reset, Shop the Switch Market, Pre-Payment Strategy. Book a 15-min renewal review today.</p>
</article>`,
    html: `<article>
<h2>The "Renewal Cliff" is Coming: 60% Renew by 2026</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Mortgage Strategy, Market News | <strong>Reading Time:</strong> 6 Minutes</p>

<p>If you locked in at <strong style="color: #10b981;">1.99%</strong> in 2021, you're about to renew at <strong style="color: #ef4444;">4.49%</strong>.</p>

<p><strong>Payment Shock:</strong> $2,500/month → $3,300/month = <strong style="color: #ef4444;">+$800/month</strong></p>

<p>We have 3 strategies: Amortization Reset, Shop the Switch Market, Pre-Payment Strategy. Book a 15-min renewal review today.</p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-12T12:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: '60% of Canadian mortgages renew by 2026. Learn 3 strategies to handle payment shock from pandemic-low rates.',
    keywords: ['renewal-cliff', 'mortgage-renewal', '2026', 'payment-shock', 'amortization-reset'],
    categories: ['Mortgage Strategy', 'Market News']
  };

  const mockPost9: Post = {
    slug: 'geographic-arbitrage-surrey-to-alberta',
    title: 'The "Geographic Arbitrage": How to Turn Your Surrey Townhouse into a Mortgage-Free Mansion in Alberta',
    markdown: `<article>
<h2>The "Geographic Arbitrage": Surrey Townhouse → Alberta Mansion</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Relocation Strategy, Market Trends | <strong>Reading Time:</strong> 6 Minutes</p>

<p>Turn your <strong>Mortgage Broker Surrey</strong> equity into a mortgage-free home in Alberta. <strong>Moving to Alberta</strong> with <strong>Bridge Financing</strong> makes it seamless.</p>

<p><strong>BC Exit Result:</strong> $550K mortgage → $150K mortgage. Monthly savings: $2,500+</p>

<p>We handle mortgages in both <strong>Edmonton Real Estate</strong> and <strong>Calgary Mortgages</strong>.</p>
</article>`,
    html: `<article>
<h2>The "Geographic Arbitrage": Surrey Townhouse → Alberta Mansion</h2>
<p><strong>Date:</strong> December 12, 2025 | <strong>Category:</strong> Relocation Strategy, Market Trends | <strong>Reading Time:</strong> 6 Minutes</p>

<p>Turn your <strong>Mortgage Broker Surrey</strong> equity into a mortgage-free home in Alberta. <strong>Moving to Alberta</strong> with <strong>Bridge Financing</strong> makes it seamless.</p>

<p><strong>BC Exit Result:</strong> $550K mortgage → $150K mortgage. Monthly savings: $2,500+</p>

<p>We handle mortgages in both <strong>Edmonton Real Estate</strong> and <strong>Calgary Mortgages</strong>.</p>
</article>`,
    status: 'published' as const,
    publishedAt: new Date('2025-12-12T14:00:00Z'),
    author: {
      name: 'Varun Chaudhry',
      title: 'Licensed Mortgage Broker',
      license: 'BCFSA #M08001935'
    },
    metaDescription: 'Learn how to turn your Surrey townhouse equity into a mortgage-free home in Alberta with bridge financing.',
    keywords: ['geographic-arbitrage', 'mortgage-broker-surrey', 'moving-to-alberta', 'bridge-financing', 'edmonton-real-estate'],
    categories: ['Relocation Strategy', 'Market Trends']
  };

  try {
    const snapshot = await (await postsCol())
      .orderBy('publishedAt', 'desc')
      .limit(limit)
      .get();

    const firestorePosts = snapshot.docs.map((doc: any) => ({
      ...doc.data(),
      publishedAt: doc.data().publishedAt?.toDate(),
    })) as Post[];

    // Combine our mock post with Firestore posts and sort by date
    const allPosts = [mockPost, mockPost2, mockPost3, mockPost4, mockPost5, mockPost6, mockPost7, mockPost8, mockPost9, ...firestorePosts].sort((a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );

    return allPosts.slice(0, limit);
  } catch (error) {
    console.error('Error fetching recent posts:', error);
    // Return only our mock post if Firestore fails
    return [mockPost, mockPost2, mockPost3, mockPost4, mockPost5, mockPost6, mockPost7, mockPost8, mockPost9];
  }
}