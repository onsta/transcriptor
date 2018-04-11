import { Button, Card, Elevation, Tab, Tabs } from "@blueprintjs/core";
import * as R from "ramda";
import * as React from "react";
import shortid from "shortid";
import { container, padding } from "../consts/styles";
import { dataType } from "../pages/index";

enum Languages {
    English = "English",
    French = "French",
}

interface IProps {
    initialData: dataType;
    numberOfPages: number;
}

interface IState {
    currentLanguage: Languages;
    currentPage: number;
    data: dataType;
    loading: boolean;
}

class Transcriptor extends React.Component<IProps, IState> {
    public state = {
        currentLanguage: Languages.English,
        currentPage: 0,
        data: this.props.initialData,
        loading: false,
    };
    public componentDidMount() {
        window.addEventListener("scroll", this.onScroll, false);
        this.onScroll();
    }

    public componentWillUnmount() {
        window.removeEventListener("scroll", this.onScroll, false);
    }

    /**
     * Should be throttled
     */
    private onScroll = () => {
        if (
            (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 300) &&
            this.state.currentPage < this.props.numberOfPages - 1 && !this.state.loading
        ) {
            this.handleNext();
        }
    }

    public render() {
        return (
            <section>
                <Tabs id="TranscriptorLanguages" onChange={this.handleLanguageChange}
                    selectedTabId={this.state.currentLanguage}>
                    <Tab id={Languages.English} title={Languages.English} panel={this.renderPanel()} />
                    <Tab id={Languages.French} title={Languages.French} panel={this.renderPanel()} />
                </Tabs>
                {this.renderNavigation()}
                <style jsx>{`
                section {
                    width: ${container.width}
                }
                `}
                </style>
            </section>
        );
    }

    private handleLanguageChange = (currentLanguage: Languages) => {
        this.setState({
            currentLanguage,
        });
    }

    private loadMore = async () => {
        const res: {
            statusCode?: number;
            json: () => Promise<any>
        } = await fetch(`http://localhost:3000/api/${this.state.currentPage + 1}`);
        let statusCode = res.statusCode > 200 ? res.statusCode : false;
        const data = await res.json();
        if (data.statusCode) {
            statusCode = data.statusCode;
        }
        return { statusCode, data };
    }

    private handleNext = async () => {
        if (this.state.currentPage < this.props.numberOfPages - 1 && !this.state.loading) {
            this.setState({
                loading: true,
            });
            const data = await this.loadMore();
            this.setState((prevState) => ({
                currentPage: prevState.currentPage + 1,
                data: R.concat(prevState.data, data.data.transcript.words),
                loading: false,
            }));
        }
    }

    private handleTranslate = () => {
        return false;
    }

    private renderPanel = () => {
        const pages = R.groupWith((a, b) =>
            R.head(R.split("-", a.para)) === R.head(R.split("-", b.para))
            , this.state.data);

        return (
            <div>
                {this.renderPages(pages)}
            </div>);
    }

    private renderPages = (pages) => {
        const splitToParagraphs: ((l: dataType) => dataType[]) = R.groupWith((a, b) =>
            (a.para && b.para) && R.last(R.split("-", a.para)) === R.last(R.split("-", b.para)));
        return (
            <React.Fragment>
                {
                    R.map((page) => <Card key={shortid.generate()} elevation={Elevation.TWO}>
                        {this.renderParagraphs(splitToParagraphs(page))}
                    </Card >, pages)
                }
            </React.Fragment>
        );
    }

    private renderParagraphs = (praragraphs) => {
        return (
            <React.Fragment>
                {
                    R.map((paragraph) => <p key={shortid.generate()}>{R.join(" ",
                        R.map(({ name }) => name, paragraph))}</p>,
                        praragraphs)
                }
            </React.Fragment>
        );
    }

    private renderNavigation = () => {
        return (
            <div>
                <Button icon="arrow-right" text="Next" onClick={this.handleNext}
                    disabled={this.state.currentPage === this.props.numberOfPages - 1 || this.state.loading === true} />
                <Button icon="translate" text="Translate" onClick={this.handleTranslate} />
                <style jsx>{`
                div {
                    display: flex;
                    justify-content: space-between;
                    margin-top: ${padding.small}
                }
                `}
                </style>
            </div>
        );
    }
}

export default Transcriptor;
