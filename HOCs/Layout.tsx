import * as React from "react";
import { font, padding } from "../consts/styles";

interface IProps {
  children: React.ReactNode;
}

class Layout extends React.Component<IProps> {
  public render() {
    const { children } = this.props;
    return (
      <React.Fragment>
        <main>
          {children}
        </main>
        <style jsx global>
          {`
              html {
                font-size: ${font.remSize};
              }
              body {
                // I will us 1 rem 5px units all over my styles
                font-size:  ${font.size} !important;
                line-height:  ${font.height} !important;
                display: flex;
                justify-content: center;
                padding: 0  ${padding.big};
              }
              h1 {
                margin-bottom: ${padding.small}
              }
              .pt-card {
                margin-bottom: ${padding.small}
              }
              .pt-card:last-child {
                margin-bottom: 0
              }
            `}
        </style>
      </React.Fragment>
    );
  }
}

export default Layout;
