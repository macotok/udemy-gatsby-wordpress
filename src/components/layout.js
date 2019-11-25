import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import MainMenu from './MainMenu';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i&display=swap');
  body, html {
    font-family: 'Open Sans', san-serif;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const LayoutWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Layout = ({ children }) => (
 <div>
   <GlobalStyles />
   <MainMenu />
   <LayoutWrapper>
    {children}
   </LayoutWrapper>
 </div>
);

export default Layout
