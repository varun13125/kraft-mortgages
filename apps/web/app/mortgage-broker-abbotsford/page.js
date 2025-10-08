import Head from 'next/head';
import Layout from '../../components/Layout';

const AbbotsfordPage = () => {
  return (
    <Layout>
      <Head>
        <title>Expert Mortgage Broker in Abbotsford | Kraft Mortgages</title>
        <meta name="description" content="Your local mortgage broker in Abbotsford and the Fraser Valley. Kraft Mortgages offers specialized financing for residential, agricultural, and self-employed clients." />
      </Head>
      <div className="container mx-auto px-4 py-12">
        <h1>Abbotsford's Trusted Mortgage Experts</h1>
        <div className="prose prose-invert max-w-none">
            <p>Nestled in the heart of the Fraser Valley, Abbotsford is a community rich in opportunity. Kraft Mortgages is proud to provide expert mortgage services to its residents, from farmers and entrepreneurs to growing families. We understand the local market and are committed to your success.</p>
            <h2>Our Mortgage Services in Abbotsford</h2>
            <h3>Residential Mortgages</h3>
            <p>Whether you're looking for a home in the city or a property with more space, we offer mortgage solutions tailored to the diverse Abbotsford real estate landscape.</p>
            <h3>Mortgages for Self-Employed Professionals</h3>
            <p>The Fraser Valley's economy is built by entrepreneurs. We offer specialized mortgage products designed for the self-employed, helping you leverage your business income to achieve your property goals.</p>
            <h3>Agricultural and Acreage Mortgages</h3>
            <p>We have experience with lenders who specialize in financing for agricultural properties and large acreages, a unique need for many clients in the Abbotsford area.</p>
        </div>
      </div>
    </Layout>
  );
};

export default AbbotsfordPage;