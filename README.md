# udemy-gatsby-wordpress

- [Gatsby JS: Build static sites with React Wordpress & GraphQL](https://www.udemy.com/course/gatsby-js-react-wordpress-graphql/)を参考
- wordpressのCMSで投稿したdataをGraghQLで取得してGatsby(React)でサイト表示

## 環境

- MAMPでlocal環境構築
- localのphpmyadminでDB接続

## API

wordpressで提供しているREST APIからdataを取得するのではなく、GraphQLでdata取得

REST API例
http://localhost:8888/myawesomeportfolio.io/wp-json/wp/v2/pages

## install

````terminal
$ npm install -g gatsby-cli
````
