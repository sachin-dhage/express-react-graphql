import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CVCategory_main from './CVCategory_main'
import CVCategory_Add from './CVCategories'
const Routes = () => (
  <Router history='' >
    <div>
      <Route exact path="/Dashboard/CVCategory" component={CVCategory_main} />
      <Route path="/KnownTagsAdd" component={CVCategory_Add} /> 
     
    </div>
  </Router>
);



export default Routes;