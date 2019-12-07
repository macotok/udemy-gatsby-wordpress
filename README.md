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
        "**/menus",
      ],
      excludedRoutes: [],
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
  const { createPage, createRedirect } = actions;
  createRedirect({ fromPath: '/', toPath: '/home', redirectInBrowser: true, isPermanent: true })
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

- `context: edge.node,`と指定するとpropsにdataが入る

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

- pageでredirect処理
- root pathで`/home(slug)`にredirect

```javascript
const { createRedirect } = actions;
createRedirect({ fromPath: '/', toPath: '/home', redirectInBrowser: true, isPermanent: true })
```

## 制作

### ツール

- ダミーテキスト生成用のfaker [https://hipsum.co/](https://hipsum.co/)
- メニューのAPIを生成プラグイン「WP REST API Menus」(WordPress) http://localhost:8888/myawesomeportfolio.io/wp-json/wp-api-menus/v2/menus

### GraphQLで取得したdataにLinkを設定

- GatsbyのLink componentを使用

```javascript
import { graphql, StaticQuery, Link } from 'gatsby';

<StaticQuery query={graphql`
  {
    allWordpressWpApiMenusMenusItems{
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
  <div>
    {props.allWordpressWpApiMenusMenusItems.edges[0].node.items.map(item => (
      <Link to={`/${item.object_slug}`} key={item.title}>
        {item.title}
      </Link>
    ))}
  </div>
)} />
```

### styled-componentsを使用

```terminal
$ yarn add gatsby-plugin-styled-components styled-components babel-plugin-styled-components
```

- `gatsby-config.js`のpluginに設定

```javascript:gatsby-config.js
plugins: [
    `gatsby-plugin-styled-components`,
],
```

- globalに設定

```javascript
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i&display=swap');
  body, html {
    font-family: 'Open Sans', san-serif;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const Layout = ({ children }) => (
 <div>
   <GlobalStyles />
 </div>
);
```

- Linkにstyled-componentsを使用

```javascript
import { graphql, StaticQuery, Link } from 'gatsby';
import styled from 'styled-components';

const ManuItem = styled(Link)`
  color: white;
  display: block;
  padding: 8px 16px;
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
      {props.allWordpressWpApiMenusMenusItems.edges[0].node.items.map(item => (
        <ManuItem to={`/${item.object_slug}`} key={item.title}>
          {item.title}
        </ManuItem>
      ))}
    </MainMenuWrapper>
  )} />
);
```

### カスタム投稿タイプ「portfolio」を追加

- REST-APIのurl http://localhost:8888/myawesomeportfolio.io/wp-json/wp/v2/portfolio
- `gatsby-config.js`、`gatsby-source-wordpress`、optionsに追加
- `gatby-node.js`に「portfolio」のtemplateを追加

```javascript:gatsby-config.js
includedRoutes: [
  "**/categories",
  "**/posts",
  "**/pages",
  "**/media",
  "**/tags",
  "**/taxonomies",
  "**/users",
  "**/menus",
  "**/portfolio",
]
```

```javascript:gatby-node.js
// ==== PORTFOLIO (WORDPRESS NATIVE AND ACF) ====
.then(() => {
  graphql(
    `
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
      }
    `
  ).then(result => {
    if (result.errors) {
      console.log(result.errors)
      reject(result.errors)
    }
    const portfolioTemplate = path.resolve("./src/templates/portfolio.js")
    // We want to create a detailed page for each
    // post node. We'll just use the WordPress Slug for the slug.
    // The Post ID is prefixed with 'POST_'
    _.each(result.data.allWordpressWpPortfolio.edges, edge => {
      createPage({
        path: `/portfolio/${edge.node.slug}/`,
        component: slash(portfolioTemplate),
        context: edge.node,
      })
    })
    resolve()
  })
})
// ==== END PORTFOLIO ====
```

### templateの選択によってレイアウトを変える

- WordPressの固定ページにTemplate選択機能を追加、投稿ページに適用
- `gatsby-node.js`にtemplateの種類を追加、その分岐処理

```php:wp-content/themes/wp-gatsby-js-theme-starter-master/portfolio_under_content.php
<?php /* Template name: Portfolio items below content */ ?>
```

```javascript:gatsby-node.js
const pageTemplate = path.resolve("./src/templates/page.js")
const portfolioUnderContentTemplate = path.resolve("./src/templates/portfolioUnderContent.js")
_.each(result.data.allWordpressPage.edges, edge => {
  createPage({
    path: `/${edge.node.slug}/`,
    component: slash(edge.node.template === 'portfolio_under_content.php' ? portfolioUnderContentTemplate : pageTemplate),
    context: edge.node,
  })
})
```

### 「Advanced Custom Fields」を扱う

- WordPressのプラグイン「Advanced Custom Fields」「ACF to REST API」をinstall
- `gatsby-node.js`でGraphQLで取得するdataにacfを追加

```javascript:gatsby-node.js
graphql(
  `
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
            acf{
              portfolio_url
            }
          }
        }
      }
    }
  `
)
```

### 投稿一覧画面にページネーション実装

- `gatsby-node.js`でGraphQLで展開したdataを元に`CreatePage`を設定
- `CreatePage`の中身を設定
    - component(templateの場所)
    - context(templateの引数で受け取るvalue)
    - path(Routing)

```javascript:gatsby-node.js
const posts = result.data.allWordpressPost.edges;
const postsPerPage = 2;
const numberOfPages = Math.ceil(posts.length / postsPerPage);
const blogPostListTemplate = path.resolve('./src/templates/blogPostList.js');

Array.from({ length: numberOfPages }).forEach((page, index) => {
  createPage({
    component: slash(blogPostListTemplate),
    path: index === 0 ? '/blog' : `/blog/${index + 1}`,
    context: {
      posts: posts.slice(index * postsPerPage, (index * postsPerPage) + postsPerPage),
      numberOfPages,
      currentPage: index + 1
    },
  });
});
```

- `CreatePage`のdataをtemplatesで画面制作
- `pageContext.posts`はcontextで設定した`posts`で、GraphQLから取得したdata
- `Array.from({ length: pageContext.numberOfPages})`でページャの番号を生成

```javascript:src/templates/blogPostList.js
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
    {
      Array.from({ length: pageContext.numberOfPages}).map((page, index) => (
        <div key={index}>
          <Link to={index === 0 ? '/blog' : `/blog/${index + 1}`}>
            {index + 1}
          </Link>
        </div>
      ))
    }
  </Layout>
);

export default blogPostList;
```

### 一覧画面のページネーションでCurrentPageかを判定

- style-componentsでpropsを受け取って判定
- `pageContext.currentPage`は`gatsby-node.js`のcontextで設定した値


```javascript
import styled from 'styled-components';

const PageNumberWrapper = styled.div`
  border: 1px solid #eee;
  background-color: ${props => props.isCurrentPage ? '#eee' : 'white'};
`;

<PageNumberWrapper key={index} isCurrentPage={index + 1 === pageContext.currentPage}>
```

### GraphQLで日付フォーマットを指定

- `formatString`で指定

```
{
  allWordpressPost{
    edges{
      node{
        excerpt
        date(formatString: "YYYY/MM/DD hh:mm")
      }
    }
  }
}
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
);

export default Hoge;
```

### 投稿ページ

```
{
  allWordpressPost{
    edges{
      node{
        wordpress_id
        title
        content
        excerpt
        date(formatString: "YYYY/MM/DD hh:mm")
      }
    }
  }
}
```

### 固定ページ

```
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
```

### メニュー

```
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
```

### サイトタイトルとディスクリプション

```
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
```

### カスタム投稿タイプ「portfolio」

```
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
}
```

### Advanced Custom Fieldsのdataを取得

- WordPressのプラグイン「Advanced Custom Fields」「ACF to REST API」をinstall

```
{
  allWordpressWpPortfolio{
    edges{
      node{
        title
        acf {
          portfolio_url
        }
      }
    }
  }
}
```


## その他

### WordPressにカスタム投稿タイプ「portfolio」を追加

- WordPressのthemeで管理しているfunctions.phpに記述

```php:functions.php
<?php
add_theme_support( 'custom-logo' );
add_theme_support( 'menus' );
add_theme_support('post-thumbnails');

function create_custom_portfolio_post_type() {
	register_post_type('portfolio', 
					  array(
						  'labels' => array(
						  		'name' => __('portfolio'),
							  'singular_name' => __('portfolio')
						  ),
						  'public' => true,
						  'show_in_admin_bar' => true,
						  'show_in_rest' => true,
					  ));
	add_post_type_support('portfolio', array('thumbnail', 'excerpt'));
}

add_action('init', 'create_custom_portfolio_post_type');
```
