import Head from 'next/head';
import Layout from '../../components/layout'; // Assuming layout is at this path

const SurreyPage = () => {
  return (
    <Layout>
      <Head>
        <title>Expert Mortgage Broker in Surrey | Kraft Mortgages</title>
        <meta name="description" content="Looking for a mortgage broker in Surrey, BC? Kraft Mortgages specializes in mortgages for self-employed, new builds, and newcomers to Canada. Get local expert advice." />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl mb-6">
          Surrey's Top-Rated Mortgage Brokerage
        </h1>

        <div className="prose prose-lg prose-invert max-w-none">
            <p>
              For over a decade, Kraft Mortgages has been a dedicated partner to the Surrey community, helping families and investors navigate one of Canada's most dynamic real estate markets. We're not just brokers; we're your neighbours. Our deep understanding of the local Surrey market, from the bustling city centre to the quiet streets of Panorama Ridge, ensures you get personalized advice and a mortgage solution that perfectly fits your needs.
            </p>

            <h2>Our Mortgage Services in Surrey</h2>
            <p>
              We offer a full suite of mortgage services, tailored specifically for the unique opportunities and challenges within the Surrey market.
            </p>
            
            <h3>Mortgages for the Self-Employed</h3>
            <p>
              Surrey's entrepreneurial spirit is booming. We specialize in navigating the complexities of stated income loans and crafting applications that showcase the true strength of your business, ensuring you get the financing you deserve.
            </p>

            <h3>Construction Loans for New Builds</h3>
            <p>
              With new developments constantly breaking ground in areas like Cloverdale and South Surrey, building your dream home has never been more accessible. We have established relationships with lenders who specialize in construction financing, ensuring a smooth process from foundation to finishing.
            </p>

            <h3>Mortgages for Newcomers to Canada</h3>
            <p>
              Welcome to Surrey! As one of Canada's most popular cities for new residents, we understand the unique documentation challenges you may face. Our team is expertly trained to guide you through the mortgage process for newcomers, making your transition to homeownership in Canada as simple as possible.
            </p>

            <h2>Why Choose a Local Surrey Mortgage Broker?</h2>
            <p>
              In a competitive market like Surrey, local expertise is your greatest advantage. Unlike a big bank, we have one priority: you. We leverage our strong relationships with a wide network of lenders—including local credit unions and private lenders who understand the nuances of Surrey's property values—to find you the best possible rates and terms. We know what it takes to get deals done here because we live and work here, providing you with a critical edge in your property search.
            </p>

            <h2>Frequently Asked Questions</h2>

            <h3>1. What is the minimum down payment for a home in Surrey?</h3>
            <p>
              For most properties in Surrey, the minimum down payment is 5% of the purchase price for homes under $500,000. For homes between $500,000 and $999,999, it's 5% on the first $500,000 and 10% on the remainder. We can help you explore programs like the First-Time Home Buyer Incentive to assist with your down payment.
            </p>

            <h3>2. How can I compete in popular Surrey neighbourhoods like Fleetwood or Guildford?</h3>
            <p>
              In high-demand areas, a mortgage pre-approval is essential. It shows sellers you are a serious, qualified buyer. As your broker, we can get you pre-approved quickly, allowing you to make a firm, confident offer, which gives you a significant advantage over other potential buyers.
            </p>

            <h3>3. Are there special mortgage considerations for properties in agricultural or rural zones of Surrey?</h3>
            <p>
              Yes, properties in areas like Cloverdale or parts of South Surrey that are on agricultural land or have unique zoning require specialized financing. We have experience with lenders who are comfortable with these types of properties and can secure mortgages that traditional banks might decline.
            </p>
        </div>
      </div>
    </Layout>
  );
};

export default SurreyPage;
