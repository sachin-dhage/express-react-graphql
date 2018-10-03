import React from "react";
import { BrowserRouter as Router, Route} from "react-router-dom";
import Candidate_main from '../Corp-CandidateRegistration/Candidate_main'
import CandidateRegistration from '../Corp-CandidateRegistration/CandidateRegistration'
const Routes = () => (
  <Router history='' >
    <div>
      <Route exact path="/Dashboard/Candidate" component={Candidate_main} />
      <Route path="/Dashboard/Candidate/CandidateRegistration" component={CandidateRegistration} /> 
    </div>
  </Router>
);



export default Routes;