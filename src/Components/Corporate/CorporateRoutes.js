import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Corporate_main from './Corporate_main'
import Corporate_Add from './Corporate'
const Routes = () => (
  <Router history='' >
    <div>
      <Route exact path="/Dashboard/Corporate" component={Corporate_main} />
      <Route path="/Dashboard/Corporate_main/Corporate_Add" component={Corporate_Add} /> 
     
    </div>
  </Router>
);



export default Routes;