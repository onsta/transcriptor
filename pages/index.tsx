import fetch from "isomorphic-unfetch";
import Error from "next/error";
import * as React from "react";
import Transcriptor from "../components/Transcriptor";
import Layout from "../HOCs/Layout";
import Title from "../HOCs/Title";

export type dataType = Array<{ name: string; para: string }>;

interface IProps {
    statusCode?: number;
    data: {
        transcript: {
            words: dataType;
        };
    };
}

class Home extends React.Component<IProps> {
    public static async getInitialProps() {
        const res: {
            statusCode?: number;
            json: () => Promise<any>
        } = await fetch("https://s3.amazonaws.com/com.trint.misc.challenge/transcript.json");
        const statusCode = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        return { statusCode, data };
    }

    public render() {
        if (this.props.statusCode) {
            return <Error statusCode={this.props.statusCode} />;
        }
        return (
            <Layout><Title title="Home"><h1>Home</h1>
                <Transcriptor data={this.props.data.transcript.words} /></Title></Layout>
        );
    }
}

export default Home;
