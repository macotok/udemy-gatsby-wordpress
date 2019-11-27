import React from 'react';
import { graphql, StaticQuery, Link } from 'gatsby';
import styled from 'styled-components';
import SiteInfo from './SiteInfo';

const MainMenuWrapper = styled.div`
  display: flex;
  background-color: rgb(3, 27, 77);
  padding: 10px 0;
`;

const MainMenuInner = styled.div`
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  width: 960px;
  height: 100%;
`;

const ManuItem = styled(Link)`
  color: white;
  display: block;
  padding: 8px 16px;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MainMenu = () => (
  <StaticQuery query={graphql`
    {
      allWordpressWpApiMenusMenusItems(filter: {
        name: {
          eq: "Main menu"
        }
      }){
        edges{
          node{
            items{
              title
              object_slug
            }
          }
        }
      }
    }
  `} render={props => (
    <MainMenuWrapper>
      <MainMenuInner>
        <SiteInfo />
        {props.allWordpressWpApiMenusMenusItems.edges[0].node.items.map(item => (
          <ManuItem to={`/${item.object_slug}`} key={item.title}>
            {item.title}
          </ManuItem>
        ))};
      </MainMenuInner>
    </MainMenuWrapper>
  )} />
);

export default MainMenu;

