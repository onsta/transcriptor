import Head from "next/head";
import * as React from "react";

interface IProps {
  title: string;
  children: React.ReactNode;
}

class Title extends React.Component<IProps> {
  public render() {
    const { title, children } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>{title} - Trint</title>
        </Head>
        {children}
      </React.Fragment>
    );
  }
}

export default Title;
