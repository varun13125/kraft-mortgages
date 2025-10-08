import Head from 'next/head';
import Layout from '../components/Layout';

const KamloopsPage = () => {
  return (
    <Layout>
      <Head>
        <title>Expert Mortgage Broker in Kamloops | Kraft Mortgages</title>
        <meta name="description" content="Kraft Mortgages serves Kamloops, BC, with expert mortgage advice for residential, self-employed, and investment property financing in the Thompson-Nicola region." />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1>Kamloops' Trusted Mortgage Experts</h1>
        <div className="prose prose-invert max-w-none">
            <p>As the Tournament Capital of Canada, Kamloops is a city of action and opportunity. Kraft Mortgages provides clear, strategic mortgage advice to help you achieve your real estate goals in this vibrant community. We understand the local market and are dedicated to finding the perfect financing solution for you.</p>
            <h2>Our Mortgage Services in Kamloops</h2>
            <h3>Residential Mortgages</h3>
            <p>From family homes in Sahali to new developments along the Thompson River, we offer a wide range of mortgage products to suit every need and budget in the Kamloops area.</p>
            <h3>Mortgages for Self-Employed Professionals</h3>
            <p>We support the hardworking entrepreneurs of Kamloops by providing specialized mortgage solutions that recognize the unique income structures of business owners.</p>
            <h3>Investment Property Loans</h3>
            <p>With its strong local economy, Kamloops offers excellent opportunities for real estate investors. We can help you secure the right financing to grow your property portfolio.</p>
        </div>
      </div>
    </Layout>
  );
};

export default KamloopsPage;