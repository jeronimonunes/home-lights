import * as React from 'react';
import { Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { connection } from '../model/hardware-connection';

interface State {
	voltage: number;
	current: number;
}

export class Power extends React.Component<{}, State> {

	private stateSubscription?: Subscription;

	constructor(props: {}) {
		super(props)
		this.state = { voltage: 0, current: 0 }
	}

	render() {
		const { voltage, current } = this.state;
		return <div>{voltage.toFixed(2)}V {current.toFixed(2)}A</div>
	}

	componentDidMount() {
		this.stateSubscription = connection.sensors$
			.pipe(distinctUntilChanged((a, b) => a.voltage === b.voltage && a.current === b.current))
			.subscribe(({ voltage, current }) => {
				this.setState({ voltage, current });
			});
	}

	componentWillUnmount() {
		this.stateSubscription?.unsubscribe();
	}

}
