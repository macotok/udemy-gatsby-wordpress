import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';

const PortfolioItemsWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

const PortfolioItemm = styled.div`
  width: 300px;
  border: 1px solid #efefef;
  margin: 16px;
  padding: 16px;
`;

const PortfolioImage = styled.img`
  max-width: 100%;
`;


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
    }`} render={props => (
      <PortfolioItemsWrapper>
        {props.allWordpressWpPortfolio.edges.map(portfolioItem => (
          <PortfolioItemm key={portfolioItem.node.id}>
            <h3>{portfolioItem.node.title}</h3>
            <PortfolioImage src={portfolioItem.node.featured_media.source_url} alt="thumbnail" />
            <div dangerouslySetInnerHTML={{ __html: portfolioItem.node.excerpt}} />
            <Link to={`/portfolio/${portfolioItem.node.slug}`}>
              Read more
            </Link>
          </PortfolioItemm>
        ))}
      </PortfolioItemsWrapper>
    )}
  />
);

export default PortfolioItems;
