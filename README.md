# udemy-gatsby-wordpress

- [Gatsby JS: Build static sites with React Wordpress & GraphQL](https://www.udemy.com/course/gatsby-js-react-wordpress-graphql/)を参考
- WordPressのCMSで投稿したdataをGraghQLで取得してGatsby(React)でサイト表示

## Set Up

### 環境

- MAMPでlocal環境構築
- localのphpmyadminでDB接続

### API

WordPressで提供しているREST APIからdataを取得するのではなくGraphQLでdata取得

REST API例
http://localhost:8888/myawesomeportfolio.io/wp-json/wp/v2/pages

### gatsbyをinstall

````terminal
$ npm install -g gatsby-cli
````


### WordPressのREST APIをGatsbyにデータをpullさせるプラグインを設定

````terminal
$ npm install --save gatsby-source-wordpress
````

``` javascript:gatsby-config.js
plugins: [
    {
      resolve: "gatsby-source-wordpress",
      options: {
        baseUrl: "localhost:8888/myawesomeportfolio.io", // wordpressのurl
        protocol: "http",
        hostingWPCOM: false,
        useACF: true,
        acfOptionPageIds: [],
        auth: {
          htaccess_user: "your-htaccess-username",
          htaccess_pass: "your-htaccess-password",
          htaccess_sendImmediately: false,
          wpcom_app_clientSecret: process.env.WORDPRESS_CLIENT_SECRET,
          wpcom_app_clientId: "54793",
          wpcom_user: "gatsbyjswpexample@gmail.com",
          wpcom_pass: process.env.WORDPRESS_PASSWORD,
          jwt_user: process.env.JWT_USER,
          jwt_pass: process.env.JWT_PASSWORD,
          jwt_base_path: "/jwt-auth/v1/token",
        },
        cookies: {},
        verboseOutput: false,
        perPage: 100,
        searchAndReplaceContentUrls: {
          sourceUrl: "https://source-url.com",
          replacementUrl: "https://replacement-url.com",
        },
        concurrentRequests: 10,
        includedRoutes: [
          "**/categories",
          "**/posts",
          "**/pages",
          "**/media",
          "**/tags",
          "**/taxonomies",
          "**/users",
        ],
        excludedRoutes: ["**/posts/1456"],
        keepMediaSizes: false,
        normalizer: function({ entities }) {
          return entities
        },
      },
    },
  ],
```

### WordPressのdataをNode.jsで読み込みRouting処理

```javascript:gatsby-node.js
const _ = require(`lodash`)
const Promise = require(`bluebird`)
const path = require(`path`)
const slash = require(`slash`)

// Implement the Gatsby API “createPages”. This is
// called after the Gatsby bootstrap is finished so you have
// access to any information necessary to programmatically
// create pages.
// Will create pages for WordPress pages (route : /{slug})
// Will create pages for WordPress posts (route : /post/{slug})
exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  return new Promise((resolve, reject) => {
    // The “graphql” function allows us to run arbitrary
    // queries against the local WordPress graphql schema. Think of
    // it like the site has a built-in database constructed
    // from the fetched data that you can run queries against.

    // ==== PAGES (WORDPRESS NATIVE) ====
    graphql(
      `
        {
          allWordpressPage {
            edges {
              node {
                id
                slug
                status
                template
                title
                content
                template
              }
            }
          }
        }
      `
    )
      .then(result => {
        if (result.errors) {
          console.log(result.errors)
          reject(result.errors)
        }

        // Create Page pages.
        const pageTemplate = path.resolve("./src/templates/page.js")
        // We want to create a detailed page for each
        // page node. We'll just use the WordPress Slug for the slug.
        // The Page ID is prefixed with 'PAGE_'
        _.each(result.data.allWordpressPage.edges, edge => {
          // Gatsby uses Redux to manage its internal state.
          // Plugins and sites can use functions like "createPage"
          // to interact with Gatsby.

          createPage({
            // Each page is required to have a `path` as well
            // as a template component. The `context` is
            // optional but is often necessary so the template
            // can query data specific to each page.
            path: `/${edge.node.slug}/`,
            component: slash(pageTemplate),
            context: edge.node,
          })
        })
      })
      // ==== END PAGES ====

      // ==== POSTS (WORDPRESS NATIVE AND ACF) ====
      .then(() => {
        graphql(
          `
            {
              allWordpressPost {
                edges{
                  node{
                    id
                    title
                    slug
                    excerpt
                    content
                  }
                }
              }
            }
          `
        ).then(result => {
          if (result.errors) {
            console.log(result.errors)
            reject(result.errors)
          }
          const postTemplate = path.resolve("./src/templates/post.js")
          // We want to create a detailed page for each
          // post node. We'll just use the WordPress Slug for the slug.
          // The Post ID is prefixed with 'POST_'
          _.each(result.data.allWordpressPost.edges, edge => {
            createPage({
              path: `/post/${edge.node.slug}/`,
              component: slash(postTemplate),
              context: edge.node,
            })
          })
          resolve()
        })
      })
    // ==== END POSTS ====
  })
}
```

`context: edge.node,`と指定するとpropsにdataが入る

```javascript:src/templates/page.js
import React from 'react';

export default ({ pageContext }) => (
  <div>
    <h1>
      {pageContext.title}
    </h1>
  </div>
)
```

## WordPressのdataをGraphQLで取得

### GraphQLで取得したdataを展開

```javascript
import React from 'react';
import { graphql, StaticQuery } from 'gatsby';

const Hoge = () => (
  <>
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
  </>
)

export default Hoge;
```

### 固定ページ

```
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
```
