import React, { Component } from 'react';
import { FormShortText, FormLongText, FormCheckBox } from './FormTypes';
import { Card, CardTitle, CardContent, CardButton, CardFooter, CardFuncButton } from './Card';
import { Edit2, Delete, Plus, Send } from 'react-feather';
import { Form } from './Form';

export default class FormInput extends Form {
  constructor(props) {
    super(props);
    //this.formType = 'value';

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
          this.setState({
            id: resJson[0].id,
            formStructure: resJson[0].form_data
          });
      }
      });
  }

  buildFormStructure() {
    let TagName;
    const inputs = this.state.formStructure.map( (item, idx) => {
      if (item.type === 'FormShortText') {
        TagName = FormShortText;
      }
      else if (item.type === 'FormLongText') {
        TagName = FormLongText;
      }
      else if (item.type === 'FormCheckBox') {
        TagName = FormCheckBox;
      }
      else {
        TagName = FormShortText;
      }
      return (
        <div key={idx}>
          <TagName
            title={item.instruction}
            value={item.value}
            handleChange={(e) => {this.handleValueChange(e, idx)}}
           />
        </div>
      );
    });
    return inputs;
  }

  editForm() {
    return(
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
          <CardFuncButton
            text='Submit'
            clickHandle={this.handleSubmit}
            icon={<Send size={18}/>}
          />
        }/>
      </Card>
    );
  }

  viewForm() {
    if(this.state.formStructure === null) {
      var formData = <div/>
    } else {
      var formData = this.state.formStructure.map((i, idx) => {
        return (
          <div key={idx}>
            <p>{i.instruction}: {i.value}</p>
          </div>
        )
      });
    }

    return(
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
    );
  }

  render() {
    if (this.state.isEditable) {
      return this.editForm();
    }
      return this.viewForm();
  }
}