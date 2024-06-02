import React, { Component, useEffect } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';

class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: this.props.run || false,
            steps: this.props.steps || []  // Ensure there are default steps or it starts empty
        };
    }

    componentDidUpdate(prevProps) {
        // stop the tour if its running

        // Start the tour if steps are updated
        if (this.props.steps !== prevProps.steps) {
            this.handleJoyrideCallback({ status: STATUS.FINISHED });

            this.setState({

                run: true,
                steps: this.props.steps  // Update steps dynamically
            });
        }
        if (this.props.run !== prevProps.run) {
            this.setState({
                run: this.props.run,
            });
        }

        if (this.props.startTour !== prevProps.startTour) {
            console.log("startTour", this.props.startTour, this.props.steps)
            this.setState({
                run: this.props.startTour,
            });
        }
    }

    handleJoyrideCallback = (data) => {
        const { status, action } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
            this.setState({ run: false });
            if (this.props.onTourComplete) {
                this.props.onTourComplete();
            }
        }
    };

    render() {
        const { run, steps } = this.state;

        return (
            <div>
                <Joyride
                    continuous
                    run={run}
                    steps={steps}
                    callback={this.handleJoyrideCallback}
                    styles={{
                        options: {
                            zIndex: 1000,
                        },
                        buttonNext: {
                            backgroundColor: 'var(--rosa)'
                        },
                        buttonBack: {
                            color: 'var(--rosa)'
                        }
                    }}
                    locale={{
                        back: 'Zurück',
                        close: 'Schließen',
                        last: 'Fertig',
                        next: 'Weiter',
                        skip: 'Überspringen',
                    }}
                    disableScrolling={true}
                />
            </div>
        );
    }
}

export default Tutorial;
