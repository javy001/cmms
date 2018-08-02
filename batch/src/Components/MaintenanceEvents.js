import React, { Component } from 'react';
import { Event } from './Event';
import { url } from '../Data/globalVars';

export default class MaintenanceEvents extends Component {
  constructor() {
	    super();
	    this.state = {
	      loading: true,
        events: <div />
	    };
	    this.api = url + '/get_events';

	}

  componentDidMount(){
    fetch(this.api)
      .then((results) => results.json())
      .then((responseJson) => {
        console.log(responseJson);
        const freqMap = {
          7: 'Weekly',
          30: 'Monthly',
          90: 'Quarterly'
        }
        const data = responseJson.map((datum) => {
          return (
            <Event
              key={datum.check_list_id}
              equipment_name={datum.equipment_name}
              frequency={freqMap[datum.frequency]}
              due_date={datum.due_date}
            />
          );
        });

        this.setState({
          events: data,
          loading: false
        });
    });
  }

  render(){
    return (
      <div>
        {this.state.events}
      </div>
    );
  }
}
