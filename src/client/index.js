import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';

import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'react-circular-progressbar/dist/styles.css';

ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);
