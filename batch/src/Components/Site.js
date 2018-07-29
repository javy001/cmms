import React, { Component } from 'react';
import SiteCard from './SiteCard';

export default class Site extends Component {
	constructor(props){
		super(props);
		this.state = {
			sites: null,
		};
		this.api = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api/test_sites';
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
