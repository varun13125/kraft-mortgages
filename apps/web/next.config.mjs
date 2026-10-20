import createMDX from '@next/mdx';
const withMDX = createMDX({ extension: /\.mdx?$/ });

// Content-Security-Policy in REPORT-ONLY mode (BUG-011): nothing is blocked; violations
// are POSTed to /api/csp-report. Review the logs for 1–2 weeks (Thinkrr/LiveKit runtime
// origins are not documented), extend the allowlists, then switch the header name to
// `Content-Security-Policy` to enforce. 'unsafe-inline'/'unsafe-eval' stay until nonces
// are added via middleware.
const cspReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://cdn.segment.com https://vercel.live https://d2cqc7yqzf8c8f.cloudfront.net https://*.cloudfront.net https://connect.facebook.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' data: https://fonts.gstatic.com",
  "img-src 'self' data: blob: https:",
  "media-src 'self' data: blob: https:",
  "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://*.google-analytics.com https://api.segment.io https://cdn.segment.com https://vercel.live wss://*.pusher.com https://*.cloudfront.net https://live-api.thinkrr.ai https://*.livekit.cloud wss://*.livekit.cloud wss:",
  "frame-src 'self' https://vercel.live https://www.google.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "upgrade-insecure-requests",
  'report-uri /api/csp-report',
].join('; ');

// Baseline security headers (applied to every route, incl. /api and public/).
// Deliberately NOT included here:
//  - microphone in Permissions-Policy: voice features (Thinkrr, SalesCloser
//    iframe, ChatWidget VoiceInput) need it, so it keeps the browser default
//    (self + iframes that declare allow="microphone").
//  - HSTS includeSubDomains/preload: Vercel already sends
//    `max-age=63072000`; only widen it once every *.kraftmortgages.ca host
//    (blog., varun., crm/webhook hosts) is confirmed HTTPS-only.
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), payment=(), usb=(), browsing-topics=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
  { key: 'Content-Security-Policy-Report-Only', value: cspReportOnly },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
    serverComponentsExternalPackages: ['farmhash-modern']
  },
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['ts','tsx','mdx'],
  eslint: {
    // Lint is enforced in CI (.github/workflows/ci.yml, blocking; 0 errors since
    // 2026-10-12). Kept off during Vercel builds so a lint-only issue can't block
    // a production deploy; type errors still fail the build.
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
  // Redirect old URLs to new structure
  async redirects() {
    return [
      {
        source: '/pages/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/index',
        destination: '/',
        permanent: true,
      },
      // Application/consult redirects
      {
        source: '/apply',
        destination: 'https://r.mtg-app.com/varun-chaudhry',
        permanent: false,
      },
      {
        source: '/consult',
        destination: 'https://r.mtg-app.com/varun-chaudhry',
        permanent: false,
      },
      // Calculator URL fixes (blog posts used wrong slugs)
      {
        source: '/calculators/payment-calculator',
        destination: '/calculators/payment',
        permanent: true,
      },
      {
        source: '/calculators/affordability-calculator',
        destination: '/calculators/affordability',
        permanent: true,
      },

      {
        source: '/calculators/pre-approval-calculator',
        destination: '/calculators/pre-approval',
        permanent: true,
      },
      {
        source: '/calculators/renewal-calculator',
        destination: '/calculators/renewal',
        permanent: true,
      },
      {
        source: '/calculators/self-employed-calculator',
        destination: '/calculators/self-employed',
        permanent: true,
      },
      {
        source: '/calculators/investment-calculator',
        destination: '/calculators/investment',
        permanent: true,
      },
      // Misc calculator redirects from blog posts
      {
        source: '/calculators/debt-consolidation',
        destination: '/equity-lending/calculators/debt-consolidation',
        permanent: true,
      },
      {
        source: '/calculators/heloc-calculator',
        destination: '/equity-lending/calculators/heloc',
        permanent: true,
      },
      {
        source: '/calculators/refinance-calculator',
        destination: '/calculators/refinance-break-even',
        permanent: true,
      },
      {
        source: '/residential/calculators/stress-test',
        destination: '/calculators/stress-test',
        permanent: true,
      },
      {
        source: '/mortgage-calculator',
        destination: '/calculators/payment',
        permanent: true,
      },
      {
        source: '/affordability-calculator',
        destination: '/calculators/affordability',
        permanent: true,
      },
      {
        source: '/refinance-calculator',
        destination: '/calculators/refinance-break-even',
        permanent: true,
      },
      {
        source: '/investment-calculator',
        destination: '/calculators/investment',
        permanent: true,
      },
      // Service page calculator redirects
      {
        source: '/equity-lending/calculators/cash-out-refinance',
        destination: '/equity-lending/calculators/home-equity',
        permanent: true,
      },
      {
        source: '/equity-lending/calculators/investment-opportunity',
        destination: '/equity-lending/calculators/home-equity',
        permanent: true,
      },
      {
        source: '/private-lending/calculators/asset-based',
        destination: '/private-lending/calculators/alternative-income',
        permanent: true,
      },
      {
        source: '/private-lending/calculators/bridge-financing',
        destination: '/private-lending/calculators/alternative-income',
        permanent: true,
      },
      {
        source: '/private-lending/calculators/quick-approval',
        destination: '/private-lending/calculators/alternative-income',
        permanent: true,
      },
      {
        source: '/calculators/construction-draw',
        destination: '/construction/calculators/construction-draw',
        permanent: true,
      },
      // Blog slug redirects ( Firestore slug != URL slug )
      {
        source: '/blog/private-mortgage-bc-spring-2026',
        destination: '/blog/private-mortgage-bc',
        permanent: true,
      },
      {
        source: '/blog/b-lending-bc-complete-guide-spring-2026',
        destination: '/blog/b-lending-bc-alternative-mortgage-guide-2026',
        permanent: true,
      },
      // Legal policy alias redirects
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    // Handle WebAssembly modules
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle WASM files properly
    config.module.rules.push({
      test: /\.wasm$/,
      type: 'webassembly/async',
    });

    // Don't parse farmhash-modern WASM files
    config.module.noParse = /farmhash.*\.wasm$/;

    return config;
  },
};
export default withMDX(nextConfig);
