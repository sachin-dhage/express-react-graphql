import React from 'react';
import ReactDOM from 'react-dom';
import './style/custom.css';
import 'semantic-ui-css/semantic.min.css'
 //import CVCategory from './Components/CVCategories/CVCategories'
import Dashboard from './Components/DashBoard/dashBoard'
import ReactModalTest from './Components/reactmodal/reactModalTest'
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render(<Dashboard/>, document.getElementById('root'));
registerServiceWorker();
