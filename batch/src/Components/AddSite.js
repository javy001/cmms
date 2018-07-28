import React, { Component } from 'react';
import { Card, CardTitle, CardContent, CardFooter, CardFuncButton } from './Card';
import { Edit2, Delete, Plus, Send } from 'react-feather';
import Modal from './Modal';

export default class AddSite extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      street: '',
      city: '',
      state: '',
      zip: '',
      showModal: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.hideModal = this.hideModal.bind(this);
  }

  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    var currentState = this.state;
    currentState[name] = value;
    this.setState(currentState);
  }

  submit() {
    let url = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api/add_site';
    // const url = 'http://localhost:5000/add_site';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
					data: this.state
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
          name: '',
          street: '',
          city: '',
          state: '',
          zip: '',
          showModal: true
        })
      });
  }

  hideModal() {
    this.setState({showModal: false});
  }

  render(){
    var modal;
    if(this.state.showModal) {
      modal = <Modal text="Data Saved" hideFunc={this.hideModal}/>;
    } else {
      modal = <div/>;
    }
    return (
      <div>
        {modal}
        <Card>
          <CardContent>
            <table>
              <tbody>
                <tr>
                  <td>Site Name</td>
                  <td><input name="name" onChange={this.handleChange} type="text"/></td>
                </tr>
                <tr>
                  <td>Street Address</td>
                  <td><input name="street" onChange={this.handleChange} type="text"/></td>
                </tr>
                <tr>
                  <td>City</td>
                  <td><input name="city" onChange={this.handleChange} type="text"/></td>
                </tr>
                <tr>
                  <td>State</td>
                  <td><input name="state" onChange={this.handleChange} type="text"/></td>
                </tr>
                <tr>
                  <td>Zip Code</td>
                  <td><input name="zip" onChange={this.handleChange} type="text"/></td>
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
      </div>
    );
  }
}
