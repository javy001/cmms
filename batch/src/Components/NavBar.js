import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { uriSubDir } from '../Data/globalVars'
import { Menu } from 'react-feather';
import '../Styles/NavBar.css';

export default class NavBar extends Component {
  constructor() {
    super();
    this.state = {
      showMenu: false
    };

    this.toggleMenu = this.toggleMenu.bind(this);
  }

  toggleMenu() {
    var newState;
    if(this.state.showMenu) {
      newState = false;
    } else {
      newState = true;
    }

    this.setState({showMenu: newState});
  }

  render(){
    var menu;
    if(this.state.showMenu){
      menu =
      <div
        onClick={this.toggleMenu}
        className="dropdown"
        onMouseLeave={( ()=>this.setState({showMenu: false}) )}
      >
        <div><Link to={ uriSubDir + '/sites/'}>Sites</Link></div>
        <div><Link to={ uriSubDir + '/add_site'}>Add Site</Link></div>
      </div>;
    } else {
      menu = <div/>;
    }

    return (
      <div className="navbar">
        <div className="menu">
          <Menu onClick={this.toggleMenu} />
          <span>
            <Link to={ uriSubDir }>
              CMMS
            </Link>
          </span>
          {menu}
        </div>
      </div>
    );
  }
}
