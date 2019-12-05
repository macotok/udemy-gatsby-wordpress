import { createGlobalStyle } from 'styled-components';

const LayoutStyled = createGlobalStyle`
  /*
  html5doctor.com Reset Stylesheet
  v1.6.1
  Last Updated: 2010-09-17
  Author: Richard Clark - http://richclarkdesign.com
  Twitter: @rich_clark
  */
  
  html, body, div, span, object, iframe,
  h1, h2, h3, h4, h5, h6, p, blockquote, pre,
  abbr, address, cite, code,
  del, dfn, em, img, ins, kbd, q, samp,
  small, strong, sub, sup, var,
  b, i,
  dl, dt, dd, ol, ul, li,
  fieldset, form, label, legend,
  table, caption, tbody, tfoot, thead, tr, th, td,
  article, aside, canvas, details, figcaption, figure,
  footer, header, hgroup, menu, nav, section, summary,
  time, mark, audio, video {
    margin:0;
    padding:0;
    border:0;
    outline:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
  }
  
  body {
    line-height:1;
  }
  
  article,aside,details,figcaption,figure,
  footer,header,hgroup,menu,nav,section {
    display:block;
  }
  
  nav ul {
    list-style:none;
  }
  
  blockquote, q {
    quotes:none;
  }
  
  blockquote:before, blockquote:after,
  q:before, q:after {
    content:'';
    content:none;
  }
  
  a {
    margin:0;
    padding:0;
    font-size:100%;
    vertical-align:baseline;
    background:transparent;
  }
  
  ins {
    background-color:#ff9;
    color:#000;
    text-decoration:none;
  }
  
  mark {
    background-color:#ff9;
    color:#000;
    font-style:italic;
    font-weight:bold;
  }
  
  del {
    text-decoration: line-through;
  }
  
  abbr[title], dfn[title] {
    border-bottom:1px dotted;
    cursor:help;
  }
  
  table {
    border-collapse:collapse;
    border-spacing:0;
  }
  
  input, select {
    vertical-align:middle;
  }
  @import url('https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i,800,800i&display=swap');
  @font-face {
    font-family: 'Noto Sans JP';
    font-style: normal;
    font-weight: 400;
    src:
            url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.woff2) format('woff2'),
            url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.woff) format('woff'),
            url(//fonts.gstatic.com/ea/notosansjp/v5/NotoSansJP-Regular.otf) format('opentype');
  }
  body, html {
    font-family: 'Noto Sans JP', 'Open Sans', san-serif;
    margin: 0 !important;
    padding: 0 !important;
  }
`;

export default LayoutStyled;
