import React, { Component } from 'react';
import { Card, CardTitle, CardContent, CardFooter, CardLinkButton } from './Card';
import { uriSubDir } from '../Data/globalVars';
import { FileText, CheckSquare } from 'react-feather';

export default class EquipmentCard extends Component {

  render(){
    return (
      <div>
        <Card>
          <CardTitle text={ this.props.name } />
          <CardContent text={ this.props.serial }>
            <CardContent text={ this.props.manufacturer } />
            <CardContent text={ this.props.description } />
          </CardContent>
          <CardFooter buttons={[
            <CardLinkButton
              key={0}
              icon={<FileText size={18}/>}
              link={uriSubDir + '/build_form/' + this.props.equipment_id}
              text={'Checklist'}
            />
          ]}/>
        </Card>
      </div>
    );
  }
}
