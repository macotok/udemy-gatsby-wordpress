import { css } from 'styled-components';

const LinkAnimation = css`
  position: relative;
  display: inline-block;
  text-decoration: none;
  &:before {
    position: absolute;
    top: 1.4em;
    left: 0;
    content: "";
    display: inline-block;
    width: 0;
    height: 1px;
    background: white;
    transition: .3s;
  }
  &:hover:before {
    width: 100%;
  }
`;

export default LinkAnimation;
