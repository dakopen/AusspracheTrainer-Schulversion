import React, { Component, useEffect } from 'react';
import Joyride, { STATUS, ACTIONS } from 'react-joyride';

class Tutorial extends Component {
    constructor(props) {
        super(props);
        this.state = {
            run: false,
            steps: [
                {
                    target: '#textarea',
                    content: 'Den Satz, der in diesem Textfeld steht sollst du vorlesen.',
                    placement: 'top',
                },
                {
                    target: '.player-button',
                    content: 'Wenn du dir erstmal die korrekte Aussprache anhören möchtest, drücke auf diesen Button.',
                    placement: 'top',
                    spotlightClicks: true,
                },
                {
                    target: '.recording-button-container',
                    content: 'Drücke diesen Button und lese den Satz vor. Drücke ihn erneut, um die Aufnahme zu beenden.',
                    placement: 'bottom',
                    title: 'Jetzt bist du dran',
                    spotlightClicks: true,
                    disableOverlay: true,
                    styles: {
                        tooltip: {
                            marginTop: -10,
                        },
                    },
                }
            ],
        };
    }

    
    handleJoyrideCallback = (data) => {
        const { status, action } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status) || action === ACTIONS.CLOSE) {
            this.setState({ run: false });
        }
    };

    startTour = () => {
        this.setState({ run: true });
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
                />
                <button onClick={this.startTour}>Tour starten</button>
            </div>
        );
    }
}

export default Tutorial;
