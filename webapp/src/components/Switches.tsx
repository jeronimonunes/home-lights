import { Switch } from "@mui/material";
import React from 'react';
import { Subscription } from "rxjs";
import { Bitset } from "../model/bitset";
import { connection } from "../model/hardware-connection";

interface State {
	switches: Bitset
}

export class Switches extends React.Component<{}, State> {

	private stateSubscription?: Subscription;

	constructor(props: {}) {
		super(props);
		this.state = { switches: new Bitset(new Uint32Array(1), 0) }
	}

	render() {
		console.log('render switches');
		const { switches } = this.state;
		let result: JSX.Element[] = [];
		for (let i = 0; i < switches.size; i++) {
			result.push(<Switch
				key={i}
				checked={switches.get(i)}
			></Switch>)
		}
		return (<div>{result}</div>);
	}

	componentDidMount() {
		this.stateSubscription = connection.switches$
			.subscribe(switches => this.setState({ switches }));
	}

	componentWillUnmount() {
		this.stateSubscription?.unsubscribe();
	}

}
