import React, {Component} from 'react';
import Home from './home/Home';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { Route, Switch } from 'react-router-dom';

export default class App extends Component {
  render() {
    return (
        <Switch>
          <Route exact path='/' component={Home}/>
        </Switch>
    );
  }
};
