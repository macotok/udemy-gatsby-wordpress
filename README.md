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
