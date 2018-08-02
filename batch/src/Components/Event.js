import React, { Component } from 'react';
import { Card, CardTitle, CardContent, CardFooter, CardLinkButton } from './Card';
import { FileText, CheckSquare, Edit2 } from 'react-feather';
import { uriSubDir } from '../Data/globalVars';

export class Event extends Component {
  render(){
    return (
      <Card>
        <CardTitle text={this.props.equipment_name + ' ' + this.props.frequency} />
        <CardContent text={
          <div>
            <div>
              {'Due date: ' + this.props.due_date}
            </div>
          </div>
          } />
        <CardFooter
          buttons={[
            <CardLinkButton
              key={0}
              icon={<FileText size={18}/>}
              link={ uriSubDir + '/'}
              text={'View'}
            />
        ]}/>
      </Card>
    );
  }
}
