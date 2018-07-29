import React, { Component } from 'react';
import { FormShortText, FormLongText, FormCheckBox, FormDropDown } from './FormTypes';
import { Card, CardTitle, CardContent, CardFooter, CardFuncButton } from './Card';
import { Edit2, Delete, Plus, Send, X } from 'react-feather';

export default class FormContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      formStructure: [],
      isEditable: false,
      hasError: false,
      id: null
    };
    //this.formType = 'template';
    //this.equipId = props.match.params.id;

    this.api = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api/';
    this.endpoint = 'check_lists';
    this.equipId = props.match.params.id;
    this.inputTypes = ['FormShortText', 'FormLongText', 'FormCheckBox'];

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditable = this.handleEditable.bind(this);
    this.cancelEdit = this.cancelEdit.bind(this);
  }

  componentDidMount() {
    fetch(this.api + '/form_data?equipId=' + this.equipId)
      .then((results) => results.json())
      .then((resJson) => {
        if(resJson.length > 0) {
          console.log(resJson);
          this.setState({
            id: resJson[0].id,
            formStructure: resJson[0].form_data
          });
      }
      });
  }

  handleInstructionChange(e, idx) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let new_state = this.state.formStructure;
    const formObject = {
      type: this.state.formStructure[idx].type,
      instruction: value,
      value: this.state.formStructure[idx].value,
    }
    new_state[idx] = formObject;
    this.setState({ formStructure: new_state });
  }

  handleRemove(idx) {
    this.setState({
      formStructure: this.state.formStructure.filter((s, sidx) => idx !== sidx)
    });
  }

  handleAdd() {
    this.setState({
      formStructure: this.state.formStructure.concat([{
        instruction: '',
        value: '',
        type: 'FormShortText'
      }])
    });
  }

  formError() {
    if(this.state.hasError) {
      return (
        <div className="form_container">Submit Error
        </div>
      );
    }
  }

  daysToFrequencyName(days){
    switch(days){
      case '7':
        return 'Weekly';
      case '30':
        return 'Monthly';
      case '90':
        return 'Quarterly';
      case '365':
        return 'Yearly';
      default:
        return days;
    }
  }

  handleEditable() {
    this.setState({
      isEditable: !this.state.isEditable
    })
  }

  handleSubmit() {
    var id;
    if(this.state.id === null){
      id = 'none';
    } else {
      id = this.state.id;
    }

    const data = {
      equipmentId: this.equipId,
      data: this.state.formStructure,
      id: id
    }

    console.log(data);
    // 'http://127.0.0.1:5000'
    fetch(this.api + this.endpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((resJson) => {
      this.setState({
        id: resJson.id
      });
      this.setState({showModal: true});
    })
    .catch((error) => { this.setState({ hasError: true })})
    if(!this.state.hasError){
      this.handleEditable()
    }
    console.log(JSON.stringify(data));
  }

  handleTypeChange(e, idx) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let new_state = this.state.formStructure;
    const formObject = {
      type: value,
      instruction: this.state.formStructure[idx].instruction,
      value: this.state.formStructure[idx].value,
    }
    new_state[idx] = formObject;
    this.setState({ formStructure: new_state });
  }

  handleValueChange(e, idx) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let new_state = this.state.formStructure;
    const formObject = {
      type: this.state.formStructure[idx].type,
      instruction: this.state.formStructure[idx].instruction,
      value: value,
    }
    new_state[idx] = formObject;
    this.setState({ formStructure: new_state });
  }


  buildFormStructure() {
    if(this.state.formStructure !== null) {
      var inputs = this.state.formStructure.map((item, idx) => {
        return (
          <Card key={idx}>
            <CardContent>
              <div>
                <FormShortText
                  title='Input Name'
                  value={item.instruction}
                  handleChange={(e) => {this.handleInstructionChange(e, idx)}}
                />
                <FormDropDown
                  title={'Input Type'}
                  value={item.type}
                  optionArray={this.inputTypes}
                  handleChange={(e) => {this.handleTypeChange(e, idx)}}
                />
              </div>
            </CardContent>
            <CardFooter buttons={
              <CardFuncButton
                text='Delete'
                clickHandle={() => {(this.handleRemove(idx))}}
                icon={<Delete size={18}/>}
              />
            }/>
          </Card>
        );
      });
    } else {
      var inputs = '';
    }
    return inputs;
  }

  cancelEdit() {
    this.setState({isEditable: false});
  }

  editForm() {
    return (
      <Card>
        <CardContent>
            <FormShortText title='Frequency' value={this.daysToFrequencyName(this.frequency)} readOnly='true'/>
            { this.buildFormStructure() }
            <div className="form_container">
              { this.formError() }
            </div>
        </CardContent>
        <CardFooter buttons={
          <div>
            <CardFuncButton
              text='Add'
              clickHandle={() => {(this.handleAdd())}}
              icon={<Plus size={18}/>}
            />
            <CardFuncButton
              text='Submit'
              clickHandle={this.handleSubmit}
              icon={<Send size={18}/>}
            />
            <CardFuncButton
              text='Cancel'
              clickHandle={this.cancelEdit}
              icon={<X size={18}/>}
              />
          </div>
        }/>
      </Card>
    )
  }

  viewForm(formData) {
    function typeConversion(i){
      if (i.type === 'FormShortText') {
        return <FormShortText title={i.instruction} readOnly='true'/>
      }
      else if (i.type === 'FormLongText') {
        return <FormLongText title={i.instruction} readOnly='true'/>
      }
      else if (i.type === 'FormCheckBox') {
        return <FormCheckBox title={i.instruction} readOnly='true'/>
      }
    }

    if(this.state.formStructure === null) {
      var formData = <div/>
    } else {
      var formData = this.state.formStructure.map((i, idx) => {
        return (
          <div key={idx}>
            {typeConversion(i)}
          </div>
        )
      });
    }

    return (
      <Card>
        <CardTitle text={this.state.title} />
        <CardContent>
          <FormShortText title='Frequency' value={this.daysToFrequencyName(this.frequency)} readOnly='true'/>
          {formData}
        </CardContent>
        <CardFooter buttons={
          <CardFuncButton
            text='Edit'
            clickHandle={this.handleEditable}
            icon={<Edit2 size={18}/>}
          />
        }/>
      </Card>
    )
  }

  render() {
    if (this.state.isEditable || this.state.hasError) {
      return this.editForm();
    }
      return this.viewForm();
  }
}
