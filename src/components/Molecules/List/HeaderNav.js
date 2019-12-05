import React from 'react';
import { graphql, StaticQuery, Link } from 'gatsby';
import styled from 'styled-components';

const Nav = styled.nav`
`;

const NavLitem = styled.ul`
  display: flex;
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

const HeaderNav = () => (
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
      <Nav>
        <NavLitem>
          {props.allWordpressWpApiMenusMenusItems.edges[0].node.items.map(item => (
            <li>
              <ManuItem to={`/${item.object_slug}`} key={item.title}>
                {item.title}
              </ManuItem>
            </li>
          ))};
        </NavLitem>
      </Nav>
  )} />
);

export default HeaderNav;

