import React from 'react';
import styled from 'styled-components';
import Header from '../Organisms/Header';
import LayoutStyled from './LayoutStyled';

const LayoutWrapper = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Layout = ({ children }) => (
 <div>
   <LayoutStyled />
   <Header />
   <LayoutWrapper>
    {children}
   </LayoutWrapper>
 </div>
);

export default Layout
