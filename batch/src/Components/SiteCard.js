import React, { Component } from 'react';
import { Card, CardTitle, CardContent, CardFooter, CardLinkButton } from './Card';
import { uriSubDir } from '../Data/globalVars'
import { Clipboard, Plus } from 'react-feather';

export default class SiteCard extends Component {

  render(){
    return (
      <div>
        <Card>
          <CardTitle text={this.props.data.name}></CardTitle>
          <CardContent text={'Site ID:'}>
            <p> {this.props.data.street} <br/>
            {this.props.data.city + ', ' + this.props.data.state + ' ' + this.props.data.zip}
            </p>
          </CardContent>
          <CardFooter buttons={[
            <CardLinkButton
              key={0}
              icon={<Clipboard size={18}/>}
              link={uriSubDir + '/equip/' + this.props.id}
              text={'View Equipment'}
            />,
            <CardLinkButton
              key={1}
              icon={<Plus size={18}/>}
              link={uriSubDir + '/add_equipment/' + this.props.id}
              text={'Add Equipment'}
            />
          ]}/>
        </Card>
      </div>
    );
  }
}
