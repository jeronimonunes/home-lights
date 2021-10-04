import React from "react";
import { Room } from "./Room";

const rooms = [
	"lavanderia",
	"cozinha",
	"joicce",
	"copa",
	"sala",
	"jeronimo",
	"celsli",
	"varanda"
]

export class House extends React.Component {

	render() {
		console.log('render house')
		return <div className="house">
			{rooms.map((name, i) => (<Room key={i} name={name} light={i}></Room>))}
		</div>
	}

}
