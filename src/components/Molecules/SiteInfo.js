import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';

const SiteInfoWrapper = styled.div`
  flex-grow: 1;
  color: white;
  margin: auto 0;
`;

const SiteTitle = styled.h1`
  font-weight: bold;
  font-size: 1.2rem;
  line-height: 1.4;
  margin-bottom: .2rem;
`;

const SiteDescription = styled.p`
  font-size: .8rem;
`

const SiteInfo = () => (
  <StaticQuery query={graphql`
    {
      allWordpressSiteMetadata{
        edges{
          node{
            name
            description
          }
        }
      }
    }
  `} render={props => (
    <SiteInfoWrapper>
      <SiteTitle>
        {props.allWordpressSiteMetadata.edges[0].node.name}
      </SiteTitle>
      <SiteDescription>
        {props.allWordpressSiteMetadata.edges[0].node.description}
      </SiteDescription>
    </SiteInfoWrapper>
  )} />
);

export default SiteInfo;
