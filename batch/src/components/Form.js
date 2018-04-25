import React, { Component } from 'react';
import { Card, CardTitle, CardContent } from './Card';

export default class Form extends Component {
  constructor(props) {
    super(props);
    this.api = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api/';
    this.endpoint = 'endpoint'
    this.state = props.formStructure;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    const formObject = {
      value: value,
      type: this.state[name].type
    }

    let state = this.state;
    state[name] = formObject;

    this.setState(state);
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + JSON.stringify(this.state.value));
    event.preventDefault();

    fetch(this.api + this.endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(this.state.value)
    })
    console.log(JSON.stringify(this.state.value));
  }

  buildFormStructure() {
    let inputs=[];
    let TagName;
    for (let key in this.state) {
      if (this.state[key].type === 'FormShortText') {
        TagName = FormShortText;
      }
      else if (this.state[key].type === 'FormLongText') {
        TagName = FormLongText;
      }
      else if (this.state[key].type === 'FormCheckBox') {
        TagName = FormCheckBox;
      }
      else {
        TagName = FormShortText;
      }
      inputs.push(<CardContent key={key}><TagName title={key} value={this.state[key].value} handleChange={this.handleChange} /></CardContent>)
    }
    return inputs;
  }

  render() {
    return (
      <Card>
        <CardTitle text="Input Form" />
          <form onSubmit={this.handleSubmit}>
            {this.buildFormStructure()}
            <input type="submit" value="Submit" />
          </form>
      </Card>
    );
  }
}

function FormShortText(props) {
  return (
    <label>
      {props.title}
      <input type="text" name={props.title} value={props.value} onChange={props.handleChange} />
    </label>
  );
}

function FormLongText(props) {
  return (
    <label>
      {props.title}
      <textarea name={props.title} value={props.value} onChange={props.handleChange} />
    </label>
  );
}

function FormCheckBox(props) {
  return (
    <label>
    {props.title}
    <input type="checkbox" name={props.title} value={props.value} onChange={props.handleChange} />
    </label>
  );
}