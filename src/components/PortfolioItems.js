import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

const PortfolioItems = () => (
  <StaticQuery query={graphql`
    {
      allWordpressWpPortfolio{
        edges{
          node{
            id
            title
            slug
            excerpt
            content
            featured_media{
              source_url
            }
          }
        }
      }
    }`} render={props => props.allWordpressWpPortfolio.edges.map(portfolioItem => (
      <div key={portfolioItem.node.id}>
        <h3>{portfolioItem.node.title}</h3>
        <img src={portfolioItem.node.featured_media.source_url} alt="thumbnail" />
        <div dangerouslySetInnerHTML={{ __html: portfolioItem.node.excerpt}} />
        <Link to={`/portfolio/${portfolioItem.node.slug}`}>
          Read more
        </Link>
      </div>
    ))}
  />
);

export default PortfolioItems;
