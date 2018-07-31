import React, { Component } from 'react';
import SiteCard from './SiteCard';
import { url } from '../Data/globalVars';

export default class Site extends Component {
	constructor(props){
		super(props);
		this.state = {
			sites: null,
		};
		this.api = url + '/test_sites';
	}
	componentDidMount(){
	    fetch(this.api)
	      .then((results) => results.json())
	      .then((responseJson) => {
	        this.setState({
	          sites: responseJson.map((data,index)=> (
				  <SiteCard key={index} name={data.name} id={data.id} data={data}/>
			  )),
	        });
	    });
	}

	render(){
		return (
			<div>
				{this.state.sites}
			</div>
		);
	}
}
