import React, { Component } from 'react';
import { Card, CardContent, CardFooter, CardFuncButton } from './Card';
import { Clipboard, Send } from 'react-feather';
import { Redirect } from 'react-router-dom';
import { uriSubDir } from '../Data/globalVars';

export default class AddEquipment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      site_id: this.props.match.params.id
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    var currentState = this.state;
    currentState[name] = value;
    this.setState(currentState);
  }

  submit() {
    let url = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api/add_equipment';
    // const url = 'http://localhost:5000/add_equipment';
    var data  = this.state;
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
					data: data
				}),
      headers: {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json'
    }
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        this.setState({
          redirect: true
        })
      });
  }

  render(){
    if (this.state.redirect) {
      return <Redirect to={uriSubDir + '/equip/' + this.state.site_id} />
    }
    return (
      <Card>
        <CardContent>
          <table>
            <tbody>
              <tr>
                <td>Equipment Name</td>
                <td><input name="name" onChange={this.handleChange} type="text"/></td>
              </tr>
              <tr>
                <td>Manufacturer</td>
                <td><input name="manufacturer" onChange={this.handleChange} type="text"/></td>
              </tr>
              <tr>
                <td>Model</td>
                <td><input name="model" onChange={this.handleChange} type="text"/></td>
              </tr>
              <tr>
                <td>Serial Number</td>
                <td><input name="serial" onChange={this.handleChange} type="text"/></td>
              </tr>
              <tr>
                <td>Description</td>
                <td><textarea name="description" onChange={this.handleChange}/></td>
              </tr>
            </tbody>
          </table>
        </CardContent>
        <CardFooter>
          <CardFuncButton
            icon={<Send size={18} />}
            clickHandle={() => {this.submit()}}
            text="Submit"/>
        </CardFooter>
      </Card>
    );
  }
}
