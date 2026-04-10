import createMDX from '@next/mdx';
const withMDX = createMDX({ extension: /\.mdx?$/ });

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: false,
    serverComponentsExternalPackages: ['farmhash-modern']
  },
  reactStrictMode: true,
  pageExtensions: ['ts','tsx','mdx'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
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
        source: '/calculators/land-transfer-tax',
        destination: '/calculators/payment',
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
        destination: '/calculators/payment',
        permanent: true,
      },
      {
        source: '/calculators/heloc-calculator',
        destination: '/equity-lending/calculators/heloc',
        permanent: true,
      },
      {
        source: '/calculators/refinance-calculator',
        destination: '/calculators/payment',
        permanent: true,
      },
      {
        source: '/calculators/stress-test',
        destination: '/residential/calculators/stress-test',
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
        destination: '/calculators/payment',
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
        source: '/mli-select/calculators',
        destination: '/mli-select',
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
