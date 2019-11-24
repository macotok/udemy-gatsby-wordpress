import React from "react"
import Layout from "../components/layout"
import { graphql, StaticQuery } from "gatsby";

const IndexPage = () => (
  <Layout>
    <StaticQuery query={graphql`
      {
        allWordpressPage{
          edges{
            node{
              id
              title
              content
            }
          }
        }
      }
    `} render={props => (
      <>
        {props.allWordpressPage.edges.map(page => (
          <div key={page.node.id}>
            <h1>{page.node.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.node.content }} />
          </div>
        ))}
      </>
    )} />
  </Layout>
)

export default IndexPage
