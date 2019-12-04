import React from 'react';
import Layout from '../components/layout';
import { Link } from 'gatsby';
import styled from 'styled-components';

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const PageNumberWrapper = styled.div`
  border: 1px solid #eee;
  background-color: ${props => props.isCurrentPage ? '#eee' : 'white'};
`;

const PageNumber = styled(Link)`
  display: block;
  padding: 8px 16px;
`;

const blogPostList = ({ pageContext }) => (
  <Layout>
    {
      pageContext.posts.map(post => (
        <div key={post.node.wordpress_id}>
          <h3 dangerouslySetInnerHTML={{ __html: post.node.title }} />
          <p dangerouslySetInnerHTML={{ __html: post.node.content }} />
        </div>
      ))
    }
    <Pagination>
      {Array.from({ length: pageContext.numberOfPages }).map((page, index) => (
        <PageNumberWrapper key={index} isCurrentPage={index + 1 === pageContext.currentPage}>
          <PageNumber to={index === 0 ? '/blog' : `/blog/${index + 1}`}>
            {index + 1}
          </PageNumber>
        </PageNumberWrapper>
      ))}
    </Pagination>
  </Layout>
);

export default blogPostList;
