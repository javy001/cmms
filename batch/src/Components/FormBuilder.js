import React, { Component } from 'react';
import '../Styles/FormBuilder.css';
import { Card, CardFooter, CardFuncButton } from './Card';
import { Save, Edit2, PlusCircle, Delete, CornerDownRight } from 'react-feather';
import Modal from './Modal';
import { Redirect } from 'react-router-dom';
import { uriSubDir } from '../Data/globalVars'

export default class FormBuilder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      numSteps: 1,
      steps:[],
      formData: {},
      id: null,
      showModal: false,
      redirect: false,
      frequency: 90,
      nextDate: '2020-01-01'
    };

    this.addStep = this.addStep.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.removeStep = this.removeStep.bind(this);
    this.changeStep = this.changeStep.bind(this);
    this.submitData = this.submitData.bind(this);
    this.changeFreq = this.changeFreq.bind(this);
    this.api = 'http://ec2-34-217-104-207.us-west-2.compute.amazonaws.com/api';
    // this.api = 'http://localhost:5000';
    this.endpoint = '/check_lists';
    this.equipId = props.match.params.id;
  }

  componentDidMount() {
    fetch(this.api + '/form_data?equipId=' + this.equipId)
      .then(response => response.json())
      .then(resJson => {
        console.log(resJson);
        const data = resJson[0];
        var steps = []
        var i = 1;
        var newData = {};
        for(var key in data.form_data) {
          steps.push(
            <Step
              key={i}
              stepNum={i}
              removeStep={this.removeStep}
              handleChange={this.changeStep}
              data={data.form_data[key]}
              canEdit={false}
            />
          );
          newData[i] = data.form_data[key];
          i++;
        }

        this.setState({
          id: data.id,
          numSteps: steps.length,
          formData: newData,
          steps: steps,
          frequency: data.frequency,
          nextDate: data.nextDate
        });

      })
      .catch(error => console.log(error));
  }

  addStep(){
    var steps = this.state.steps;
    const num = this.state.numSteps + 1;
    var formData = this.state.formData;
    const data = {
      instruction: '',
      type: 'checkBox'
    }
    steps.push(
      <Step
        key={num}
        stepNum={num}
        removeStep={this.removeStep}
        handleChange={this.changeStep}
        data={data}
        canEdit={true}
      />);
    this.setState({
      numSteps: num,
    }) ;
  }

  removeStep(i) {
    const steps = this.state.steps;
    var data = this.state.formData;
    delete data[i];
    var newSteps = []
    for(var t = 0; t < steps.length; t++) {
      if(steps[t].props.stepNum !== i){
        newSteps.push(steps[t]);
      }
    }
    this.setState({steps: newSteps, formData: data});
  }

  changeStep(data) {
    var state = this.state.formData;
    state[data.stepNum] = {
      instruction: data.instruction,
      type: data.type
    };
    this.setState({formData: state});
  }

  submitData() {
    var id;
    if(this.state.id === null){
      id = 'none';
    } else {
      id = this.state.id;
    }

    const data = {
      equipmentId: this.equipId,
      data: this.state.formData,
      id: id,
      frequency: this.state.frequency,
      nextDate: this.state.nextDate
    };
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
      console.log(data);
    })
    .catch((error) => { this.setState({ hasError: true })})
  }

  hideModal() {
    this.setState({redirect: true});
  }

  changeFreq(e) {
    this.setState({
      frequency: e.target.value * 1
    });
  }

  changeDate(e) {
    var year;
    if (this.state.frequency === 7) {
      this.setState({nextDate: e.target.value})
    } else {
      const selectedMonth = e.target.value;
      const d = new Date();
      const month = d.getMonth() + 1;
      if (selectedMonth < month) {
        year = d.getFullYear() + 1;
      } else {
        year = d.getFullYear();
      }
      var zero;
      if (selectedMonth < 10) {
        zero = '0';
      } else {
        zero = '';
      }
      const day = new Date(year, selectedMonth, 0);
      const ds =  year + '-' + zero + selectedMonth + '-' + day.getDate();
      this.setState({nextDate: ds })
      console.log(ds);

    }
  }

  render() {
    if(this.state.redirect) {
      return <Redirect to={uriSubDir + "/equip/" + this.props.match.params.id } />;
    }
    var modal;
    if(this.state.showModal) {
      modal = <Modal text="Data Saved!" hideFunc={this.hideModal}/>;
    } else {
      modal = <div/>;
    }

    var dateSelect;
    if(this.state.frequency === 7) {
      dateSelect = <input
                    type="date"
                    name="maintDate"
                    value={this.state.nextDate}
                    onChange={(e) => this.changeDate(e)}
                  />;
    } else {
      const d = new Date(this.state.nextDate);
      dateSelect = (
        <select
          name="maintDate"
          onChange={(e) => this.changeDate(e)}
          value={d.getMonth() + 1}
          >
          <option value={1}>Jan</option>
          <option value={2}>Feb</option>
          <option value={3}>Mar</option>
          <option value={4}>Apr</option>
          <option value={5}>May</option>
          <option value={6}>Jun</option>
          <option value={7}>Jul</option>
          <option value={8}>Aug</option>
          <option value={9}>Sep</option>
          <option value={10}>Oct</option>
          <option value={11}>Nov</option>
          <option value={12}>Dec</option>
        </select>
      );
    }
    return (
      <div>
        {modal}
        <div>
          <span className="hspacer">Frequency</span>
          <select name="frequency"
            onChange={(event) => this.changeFreq(event)}
            value={this.state.frequency}
            >
            <option value={30}>Monthly</option>
            <option value={90}>Quarterly</option>
            <option value={7}>Weekly</option>
          </select>
        </div>
        <div className="topspacer">
          <span className="hspacer">Next Maintenance:</span>
          {dateSelect}
        </div>
        <div>
          {this.state.steps}
        </div>
        <div className='add-btn'>
          <span className='btn' onClick={this.addStep}>Add Step</span>
          <span className='hspacer-big'/>
          <span className='btn' onClick={this.submitData} >Submit</span>
        </div>
      </div>
    );
  }
}

class Step extends Component {
  constructor() {
    super();
    this.state = {
      instruction: '',
      type: 'checkBox',
      canEdit: true
    };
    this.updateStep = this.updateStep.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.editStep = this.editStep.bind(this);
  }

  componentDidMount() {

    this.setState({
      instruction: this.props.data.instruction,
      type: this.props.data.type,
      canEdit: this.props.canEdit
    });
  }

  updateStep(event) {
    const value = event.target.value;
    const name = event.target.name;
    var currentState = this.state;
    currentState[name] = value;
    this.setState(currentState);
  }

  saveStep() {
    this.setState({canEdit: false});
    var data = this.state;
    data['stepNum'] = this.props.stepNum;
    this.props.handleChange(data);
  }

  editStep() {
    this.setState({canEdit: true});
  }

  render() {
    const inputType = {
      'checkBox': <input type="checkbox"/>,
      'text': <input type="text" />
    };

    var formCard;
    if(this.state.canEdit){
      formCard =
      <Card key={0}>
        <div className='form-card'>
          <div>
            <textarea
              rows="3"
              cols="35"
              id="test"
              placeholder="Enter step intructions"
              name="instruction"
              onChange={this.updateStep}
              value={this.state.instruction}
            />
            <div className="spacer" />
            <div>Choose input type</div>
            <select name="type" onChange={this.updateStep} value={this.state.type}>
              <option value="checkBox">Check Box</option>
              <option value="text">Text</option>
            </select>
            <div className="spacer" />
          </div>
        </div>
        <CardFooter
          buttons={[
            <CardFuncButton
              key={0}
              icon={<Save size={18} />}
              text='Save'
              clickHandle={this.saveStep}
            />
          ]}
        />
      </Card>;
    } else {
      formCard =
      <Card key={0}>
        <div className='form-card'>
          <div>
            {this.state.instruction}
            <span className="hspacer" />
            {inputType[this.state.type]}
            <div className="spacer" />
          </div>
        </div>
        <CardFooter
          buttons={[
            <CardFuncButton
              key={0}
              icon={<Edit2 size={18} />}
              text='Edit'
              clickHandle={this.editStep}
            />,
            <CardFuncButton
              key={1}
              icon={<Delete size={18} />}
              text=''
              clickHandle={()=> this.props.removeStep(this.props.stepNum)}
            />
          ]}
        />
      </Card>;;
    }
    return (
      formCard
    );
  }
}
