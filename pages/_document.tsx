import Document, { Head, Main, NextScript } from "next/document";
import flush from "styled-jsx/server";

type RenderPage = () => {
  html: HTMLElement;
  head: HTMLElement;
  errorHtml: HTMLElement;
  chunks: any;
  styles: CSSStyleDeclaration;
};

export default class MyDocument extends Document {
  public static getInitialProps({ renderPage }: { renderPage: RenderPage }) {
    const { html, head, errorHtml, chunks } = renderPage();
    const styles = flush();
    return { html, head, errorHtml, chunks, styles };
  }

  public render() {
    return (
      <html lang="en">
        <Head>
          <link href="/static/normalize.css" rel="stylesheet" />
          <link href="/static/blueprint.css" rel="stylesheet" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <title>Trint</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
