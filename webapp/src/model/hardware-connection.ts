import { asyncScheduler, merge, Observable, Subject } from "rxjs";
import { delay, distinctUntilChanged, filter, groupBy, map, mergeMap, retryWhen, share, tap, throttleTime } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { Action, UpdateLightAction, UpdateLightsAction, UpdateSensorsAction, UpdateSwitchesAction } from "./action";
import { Bitset } from "./bitset";
import { Lights } from "./lights";
import { Sensors } from "./sensors";

class HardwareConnection {

	private webSocket: WebSocketSubject<Action>;

	private actionSubject = new Subject<Action>();

	public outgoingAction$ = this.actionSubject.asObservable();
	public connected$: Observable<boolean>;

	public incomingAction$: Observable<Action>;
	public lights$: Observable<Lights>;
	public switches$: Observable<Bitset>;
	public sensors$: Observable<Sensors>;

	public dispatch = this.actionSubject.next.bind(this.actionSubject);

	constructor() {

		let openObserver = new Subject<Event>();
		let closeObserver = new Subject<CloseEvent>();

		this.webSocket = webSocket({ url: 'ws://192.168.0.117/ws', binaryType: 'arraybuffer', openObserver, closeObserver, serializer: a => a.view.buffer, deserializer: ev => Action.fromData(ev.data) });

		this.connected$ = merge(openObserver, closeObserver).pipe(
			map(ev => ev.type === 'open'),
			distinctUntilChanged()
		)

		this.incomingAction$ = this.webSocket.pipe(
			retryWhen(errors => errors.pipe(
				tap(v => console.log(v)),
				delay(1000)
			)),
			share()
		)

		this.lights$ = this.incomingAction$.pipe(
			filter((a): a is UpdateLightsAction => a instanceof UpdateLightsAction),
			map(v => v.lights)
		)

		this.sensors$ = this.incomingAction$.pipe(
			filter((a): a is UpdateSensorsAction => a instanceof UpdateSensorsAction),
			map(v => v.sensors)
		)

		this.switches$ = this.incomingAction$.pipe(
			filter((a): a is UpdateSwitchesAction => a instanceof UpdateSwitchesAction),
			map(v => v.switches)
		)

		const updateLightAction$ = this.actionSubject.pipe(
			filter((a): a is UpdateLightAction => a instanceof UpdateLightAction),
			groupBy(a => a.light),
			mergeMap(group => group.pipe(
				throttleTime(100, asyncScheduler, { leading: true, trailing: true })
			)),
		)

		const notUpdateLightAction$ = this.actionSubject.pipe(
			filter(a => !(a instanceof UpdateLightAction))
		)

		merge(updateLightAction$, notUpdateLightAction$)
			.subscribe(action => {
				try {
					this.webSocket.next(action);
				} catch (e) {
					console.error(e);
				}
			})
	}

}

export const connection = new HardwareConnection();
