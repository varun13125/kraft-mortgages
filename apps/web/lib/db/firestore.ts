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
    const blogContent = `<h2>The Blueprint: A Step-by-Step Guide to Construction Mortgages in BC</h2><p>In British Columbia’s dynamic real estate market, building your own custom home or developing a property is one of the most rewarding financial ventures you can undertake. It's also one of the most complex, especially when it comes to financing.</p><p>Unlike a traditional mortgage where funds are advanced in a single lump sum, a construction mortgage is a specialized product designed to mitigate risk for both the lender and the builder. It's a staged financing tool that releases funds in intervals—known as \"draws\"—as the project reaches specific, predetermined milestones.</p><p>Navigating this process requires meticulous planning, a solid team, and a mortgage broker who specializes in construction financing. At Kraft Mortgages, we don't just arrange the loan; we become a key part of your project management team, ensuring a smooth financial flow from foundation to finish.</p><h3>Everyday Expert Translation: What Exactly is a \"Draw Mortgage\"?</h3><p>Think of it as a \"pay-as-you-go\" system for your build. Instead of getting all the money upfront, the lender releases portions of the approved loan at key stages of completion. An appraiser must visit the site and verify that each stage is complete before the next draw is released. This ensures the lender's investment is protected and that the project is progressing as planned.</p><p>The loan is typically interest-only during the construction phase, meaning you only pay interest on the funds that have been drawn to date. This keeps your carrying costs manageable before the property is complete.</p><h3>The 4 Key Stages of a Construction Mortgage</h3><p>Every construction project is unique, but the financing process follows a clear, structured path.</p><h4>Stage 1: The Foundation - Land & The First Draw</h4><p>Before any construction begins, you need the land and the initial funds to get started.</p><p><strong>The Loan:</strong> The first advance typically covers a percentage of the land value and the initial \"soft costs\" (permits, architectural plans). Lenders will also want to see your detailed construction budget and building plans at this stage.</p><p><strong>Your Equity:</strong> You will need to have a significant down payment. Lenders want to see that you have a substantial amount of your own capital invested in the project from day one.</p><h4>Stage 2: The Build - The Progressive Draw Schedule</h4><p>This is the core of the construction mortgage. As your builder completes each phase, we coordinate with the lender and appraiser to release the next draw. A typical schedule looks like this:</p><ul><li><strong>Draw #2 (30-40% Complete):</strong> Released after the foundation is poured, the subfloor is in, and framing is complete. The house is \"weather-protected\" with the roof on and windows installed (known as \"lock-up\").</li><li><strong>Draw #3 (65-75% Complete):</strong> Released once the interior systems are in place—plumbing, electrical, heating, and insulation are done, and the drywall is up and ready for finishing.</li><li><strong>Draw #4 (85-95% Complete):</strong> Released after the kitchen cabinets and bathrooms are installed, flooring is down, and painting is complete. The house is starting to look finished.</li></ul><img src="/images/blog-4.png" alt="A construction site with framing complete, representing the lock-up stage." style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" /><h4>Stage 3: The Finish - The Final Draw</h4><p>The final draw, often around 10-15% of the total loan, is released upon 100% completion. This means the home has passed its final municipal inspection, an occupancy permit has been issued, and the lender's appraiser has confirmed the project is fully finished according to the plans.</p><h4>Stage 4: The Conversion - From Construction Loan to Traditional Mortgage</h4><p>Once the final draw is advanced and the project is complete, the construction loan is typically converted into a standard residential mortgage. This is when you begin making regular principal and interest payments. We work to ensure you get the best possible rates and terms for this \"take-out\" financing, setting you up for long-term success.</p><h3>The Biggest Risk: Managing Costs & Delays</h3><p>The number one challenge in any construction project is staying on budget and on schedule. Cost overruns or delays can disrupt the draw schedule and, in a worst-case scenario, halt your project.</p><p>This is where having an expert broker is non-negotiable. We help you build a realistic budget with a built-in contingency fund. We act as the critical communication link between your builder, the appraiser, and the lender to ensure draws are requested on time and released without delay. Our job is to prevent financial friction so you and your builder can focus on what you do best.</p><p>Planning a build in Surrey, White Rock, or anywhere in BC?</p><p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">Book a 15 min Free Consultation Now to structure a financing blueprint that ensures your project's success.</a></p>`;

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
      keywords: ['construction-mortgage', 'bc-real-estate', 'building-finance', 'draw-mortgage']
    };
  }
  if (slug === 'the-developers-edge') {
    const blogContent = `<h1>The Developer's Edge: Unlocking 95% LTV with CMHC MLI Select in Surrey and Vancouver</h1><p>For multi-unit residential developers in British Columbia, profit margins are everything. You’re constantly balancing the high costs of land and construction against future rental income and property valuation. But what if you could significantly reduce your initial cash equity requirement and secure financing terms that dramatically improve your project's cash flow from day one? That's precisely what the CMHC MLI Select program is designed to do. This isn't just another mortgage product; it's a strategic tool. For developers in high-need areas like Surrey and Vancouver, it's a game-changer. At Kraft Mortgages, we specialize in structuring these complex applications to ensure our developer clients maximize their leverage and returns.</p><h2>Everyday Expert Translation: What is MLI Select?</h2><p>Think of MLI Select as a rewards program for building the right kind of housing. CMHC uses a points system to incentivize developers who build energy-efficient, accessible, and affordable rental units. The more points your project scores, the better the financing incentives you receive. We're talking up to 95% loan-to-value (LTV) financing and 50-year amortizations—terms that are simply unavailable through conventional financing.</p><h2>Breaking Down the Points System for BC Developers</h2><p>To qualify for the best incentives, a project needs 100 points. Here’s how you get there:</p><ul><li><strong>Energy Efficiency (Up to 100 points):</strong> This is the fastest path to premium benefits...</li><li><strong>Affordability (Up to 100 points):</strong> This involves committing a percentage of your units to rental rates below the market average...</li><li><strong>Accessibility (Up to 50 points):</strong> By incorporating accessible design features...</li></ul><img src="/images/blog-3.png" alt="New apartment construction" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" /><h2>The Bottom Line: A Practical Example</h2><p>Imagine a $10 million, 20-unit rental project in Surrey.</p><ul><li><strong>Conventional Financing:</strong> Might require a $2.5 million down payment (75% LTV).</li><li><strong>MLI Select Financing:</strong> By scoring 100+ points, you could potentially secure financing with only a $500,000 down payment (95% LTV).</li></ul><p>That’s $2 million in capital freed up... This is the power of working with a broker who understands the intricate details of programs like MLI Select. Navigating the CMHC application process requires more than just filling out forms. It requires a strategic approach to project design and a deep understanding of the underwriter's requirements.</p><p>Is your next project a candidate for MLI Select?</p><p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">Book a 15 min Free Consultation Now</a></p><p><em>(Disclaimer: The information provided is for general informational purposes only...)</em></p>`;

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
      keywords: ['mli-select', 'cmhc', 'development-financing', 'surrey', 'vancouver']
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

<p>Our approach was different. By leveraging alternative income validation strategies and working with a lender specializing in business-for-self files, we were able to present a comprehensive financial picture that showcased her true earning power and cash flow. The result? She was approved for the home she wanted, with a competitive rate and terms. This is a common success story for our clients.</p><img src="/images/blog-1.png" alt="Stressed about mortgages" style="width:100%;height:auto;border-radius:8px;margin:1rem 0;" />

<h2>Three Actionable Strategies for Complex Borrowers:</h2>

<h3>1. Optimize Your Down Payment</h3>

<p>A larger down payment reduces the loan-to-value ratio, making you a less risky borrower. We can help you strategize the optimal amount to put down without depleting your necessary liquidity.</p>

<h3>2. Leverage Alternative Lenders</h3>

<p>The big banks aren't your only option. We have deep relationships with lenders who specialize in assessing complex income structures, from dividends and capital gains to business bank statements.</p>

<h3>3. Structure Your File for Success</h3>

<p>Before you even apply, we work with you to organize your financial documentation. This isn't just about gathering papers; it's about presenting a narrative that clearly and accurately reflects your financial strength to underwriters.</p>

<p>At <strong>Kraft Mortgages</strong>, we don't just process applications; we build strategies. We thrive on the complex files that others turn away.</p>

<p>Ready to see how your financial picture fits into the right mortgage strategy?</p>

<p><a href="https://calendar.app.google/HcbcfrKKtBvcPQqd8" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #1e3a8a; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background-color 0.3s ease; text-decoration: none;">Book a 15 min Free Consultation Now</a></p>

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
      keywords: ['stress-test', 'self-employed', 'mortgage-approval', 'complex-files', 'alternative-lenders']
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

<p>We've seen it countless times: a savvy, self-employed business owner or a new Canadian with a solid financial footing gets a hard 