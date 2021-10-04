import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Subscription } from 'rxjs';
import { UpdateLightAction } from '../model/action';
import { connection } from '../model/hardware-connection';
import { Light } from '../model/lights';

const globalStyle: React.CSSProperties = {
	display: "grid",
	placeContent: "center",
	fontSize: "2em",
}

interface Properties {
	name: string;
	light: Light;
}

interface State {
	state: boolean;
	pwm: number;
}

export class Room extends React.Component<Properties, State> {

	private lightSubscription?: Subscription;

	constructor(props: Properties) {
		super(props)
		this.state = { state: false, pwm: 0 }
	}

	render() {
		const { light, name } = this.props;
		const { state, pwm } = this.state;
		console.log('render room', light, name, state, pwm);
		let style: React.CSSProperties = {
			gridArea: name,
			backgroundColor: state ? 'yellow' : 'white',
			color: state ? "black" : "gray",
			...globalStyle
		}
		return <div style={style} onClick={() => connection.dispatch(new UpdateLightAction(light, !state, pwm))}>
			<FontAwesomeIcon icon={faLightbulb} />
		</div>
	}

	componentDidMount() {
		this.lightSubscription = connection.lights$
			.subscribe(({ state, pwm }) => {
				let { light: idx } = this.props;
				let { state: oldState, pwm: oldPwm } = this.state;
				let newState = state.get(idx);
				let newPwm = pwm[idx];
				if (newState !== oldState || newPwm !== oldPwm) {
					this.setState({
						state: newState,
						pwm: newPwm
					})
				}
			});
	}

	componentWillUnmount() {
		this.lightSubscription?.unsubscribe();
	}

}
