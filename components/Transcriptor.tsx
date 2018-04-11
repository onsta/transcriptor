import { Button, Card, Elevation, Tab, Tabs } from "@blueprintjs/core";
import * as React from "react";
import { container, padding } from "../consts/styles";

enum Languages {
    English = "English",
    French = "French",
}

interface IProps {
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
        return (
            <Card elevation={Elevation.TWO}>
                Current language is {this.state.currentLanguage}
            </Card>
        );
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
