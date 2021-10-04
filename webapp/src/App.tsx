import { faLightbulb } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppBar, Box, CircularProgress, Modal, Theme, Toolbar, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';
import { interval, merge, Subscription } from 'rxjs';
import { filter, mapTo } from 'rxjs/operators';
import './App.css';
import { House } from './components/House';
import { Power } from './components/Power';
import { Switches } from './components/Switches';
import { PingAction, UpdateLightAction, UpdateLightsAction } from './model/action';
import { connection } from './model/hardware-connection';

const modalStyle: SxProps<Theme> = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	color: "background.paper",
	outline: 'none'
};

interface State {
	connected: boolean;
	loading: boolean;
}

interface Properties { }

export class App extends React.Component<Properties, State> {

	private connectedSubscription?: Subscription;
	private loadingSubscription?: Subscription;
	private pingSubscription?: Subscription;

	constructor(props: Properties) {
		super(props);
		this.state = { connected: false, loading: false }
	}

	render() {
		const { connected, loading, } = this.state;
		console.log("render app");
		return (
			<div className="layout">
				<AppBar position="static">
					<Toolbar>
						<FontAwesomeIcon icon={faLightbulb} style={{ marginRight: "0.5em" }} />
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							Home Lights
						</Typography>
						<span>{connected ? "CONECTADO" : "DESCONECTADO"}</span>
					</Toolbar>
				</AppBar>
				<Switches></Switches>
				<House></House>
				<Power></Power>
				<Modal open={loading}>
					<Box sx={modalStyle}>
						<CircularProgress size="6em" color="inherit" />
					</Box>
				</Modal>
			</div>
		);
	}

	componentDidMount() {
		this.connectedSubscription = connection.connected$
			.subscribe(connected => this.setState({ connected }));

		this.loadingSubscription = merge(
			connection.outgoingAction$.pipe(
				filter(a => a instanceof UpdateLightAction),
				mapTo(true)
			),
			connection.incomingAction$.pipe(
				filter(a => a instanceof UpdateLightsAction),
				mapTo(false)
			)
		).subscribe(loading => this.setState({ loading }));

		this.pingSubscription = interval(1000)
			.subscribe(() => connection.dispatch(PingAction.INSTANCE));
	}

	componentWillUnmount() {
		this.connectedSubscription?.unsubscribe();
		this.loadingSubscription?.unsubscribe();
		this.pingSubscription?.unsubscribe();
	}
}
