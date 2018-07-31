import React, { Component } from 'react';
import EquipmentCard from './EquipmentCard';
import { url } from '../Data/globalVars';

export default class Equipment extends Component {
	constructor() {
	    super();
	    this.state = {
	      equipment: null
	    };
	    this.api = url + '/test_equipment?id=';

	}

	componentDidMount(){
	    fetch(this.api + this.props.match.params.id)
	      .then((results) => results.json())
	      .then((responseJson) => {
	        this.setState({
	        	equipment: responseJson.map((value,key)=>(
	        		<EquipmentCard
								key={key}
								serial={value.serial_number}
								manufacturer={value.manufacturer}
								name={value.name}
								description={value.description}
								site_id={this.props.match.params.id}
								equipment_id={value.equipment_id}
							/>
						))
	        });
	    });
	}

	render(){
		return(
			<div>
				<div>
					{this.state.equipment}
				</div>
		  </div>
		);
	}
}
