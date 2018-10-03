import React from "react";
import { BrowserRouter as Router, Route,Link } from "react-router-dom";
import IgnoreCategories from './IgnoreCategories'
import UnknownCategories from '../Unknown/UnknownCategories'
const Routes = () => (
  <Router history='' >
  <div>
  <div>
  <Link to={"/IgnoreCategories"}>IgnoreCategories</Link>  <br/><br/> <Link to={"/UnknownCategories"} >UnknownCategories</Link>
  </div>
    <div>
      <Route exact path="/IgnoreCategories" component={IgnoreCategories} />
      <Route path="/UnknownCategories" component={UnknownCategories} /> 
     
    </div>
    </div>
  </Router>
);



export default Routes;