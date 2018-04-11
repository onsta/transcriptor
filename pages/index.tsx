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
        numberOfPages: number,
        transcript: {
            words: dataType;
        };
    };
}

class Home extends React.Component<IProps> {
    /**
     * Get the initial data
     */
    public static async getInitialProps() {
        const res: {
            statusCode?: number;
            json: () => Promise<any>
        } = await fetch("http://localhost:3000/api/0");
        let statusCode = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (data.statusCode) {
            statusCode = data.statusCode;
        }
        return { statusCode, data };
    }

    public render() {
        if (this.props.statusCode) {
            return <Error statusCode={this.props.statusCode} />;
        }
        return (
            <Layout><Title title="Home"><h1>Home</h1>
                <Transcriptor initialData={this.props.data.transcript.words}
                    numberOfPages={Number(this.props.data.numberOfPages)} /></Title></Layout>
        );
    }
}

export default Home;
