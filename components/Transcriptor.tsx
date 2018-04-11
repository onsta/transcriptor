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
    data: dataType;
}

interface IState {
    currentLanguage: Languages;
}

class Transcriptor extends React.Component<IProps, IState> {
    public state = {
        currentLanguage: Languages.English,
    };
    public render() {
        const { } = this.props;
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

    private handleNext = () => {
    }

    private handleTranslate = () => {
    }

    private renderPanel = () => {
        const pages = R.groupWith((a, b) =>
            R.head(R.split("-", a.para)) === R.head(R.split("-", b.para))
            , this.props.data);

        const splitToParagraphs: ((l: dataType) => dataType[]) = R.groupWith((a, b) =>
            (a.para && b.para) && R.last(R.split("-", a.para)) === R.last(R.split("-", b.para)));

        return (
            <div>
                {
                    R.map((page) => <Card key={shortid.generate()} elevation={Elevation.TWO}>
                        < br />
                        {R.map((paragraph) => <p key={shortid.generate()}>{R.join(" ",
                            R.map(({ name }) => name, paragraph))}</p>,
                            splitToParagraphs(page))}
                    </Card >, pages)
                }
            </div>);
    }

    private renderNavigation = () => {
        return (
            <div>
                <Button icon="arrow-right" text="Next" onClick={this.handleNext} />
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
