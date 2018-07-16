import React, { Component } from 'react';
import { FormShortText, FormLongText, FormCheckBox, FormDropDown } from './FormTypes';
import { Card, CardTitle, CardContent, CardFooter, CardFuncButton } from './Card';
import { Edit2, Delete, Plus, Send } from 'react-feather';
import { Form } from './Form';

export default class FormContent extends Form {
  constructor(props) {
    super(props);
    //this.formType = 'template';
    //this.equipId = props.match.params.id;

    this.handleValueChange = this.handleValueChange.bind(this);
    this.handleTypeChange = this.handleTypeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleEditable = this.handleEditable.bind(this);
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

  editForm() {
    return (
      <Card>
        <CardTitle text={this.title} />
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
        <CardTitle text={this.title} />
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
