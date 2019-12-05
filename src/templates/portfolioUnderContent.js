import React from 'react';
import Layout from '../components/Layout/Layout';
import PortfolioItems from '../components/Organisms/PortfolioItems';

export default ({ pageContext }) => (
  <Layout>
    <h1 dangerouslySetInnerHTML={{ __html: pageContext.title}} />
    <div dangerouslySetInnerHTML={{ __html: pageContext.content }} />
    <PortfolioItems />
  </Layout>
)

