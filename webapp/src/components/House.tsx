import React from "react";
import { Room } from "./Room";

const rooms = [
	"copa",
	"celsli",
	"sala",
	"joicce",
	"cozinha",
	"meio",
	"jeronimo",
	"varanda",
	"lavanderia",
]

export class House extends React.Component {

	render() {
		console.log('render house')
		return <div className="house">
			{rooms.map((name, i) => (<Room key={i} name={name} light={i}></Room>))}
		</div>
	}

}
