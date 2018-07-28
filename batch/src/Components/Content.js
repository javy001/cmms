import React, { Component } from 'react';
import Site from './Site';
import Equipment from './Equipment';
import { Route, Switch } from 'react-router-dom';
import FormInput from './FormInput';
import FormContent from './FormContent';
import FormBuilder from './FormBuilder';
import FormViewer from './FormViewer';
import AddSite from './AddSite';
import Callback from './Callback';
import SettingsCard from './SettingsCard';
import { formData, formTitle } from '../Data/FormData';
import { uriSubDir } from '../Data/globalVars'

export default class Content extends Component {

  render() {
  	return (
  	<div className="body-content">
  		<Switch>
              <Route exact path={uriSubDir + '/test/'} component={Site} />
              <Route exact path={uriSubDir + '/sites'} component={Site} />
              <Route path={uriSubDir + '/equip/:id'} component={Equipment} />
              <Route path={uriSubDir + '/FormInput/:id'} render={(props) => {
                return <FormInput {...props} title={formTitle} formStructure={formData} frequency='365'/>
              }} />
              <Route path={uriSubDir + '/FormContent/:id'} render={(props) => {
                return <FormContent {...props} title={formTitle} formStructure={formData} frequency='365'/>
              }} />
              <Route path={uriSubDir + '/build_form/:id'} component={FormBuilder}/>
              <Route path={uriSubDir + '/settings'} component={SettingsCard} />
              <Route path={uriSubDir + '/view_form/:id'} component={FormViewer}/>
              <Route path={uriSubDir + '/add_site'} component={AddSite}/>
              <Route component={Site} />
      </Switch>
    </div>
    )
  }
}
