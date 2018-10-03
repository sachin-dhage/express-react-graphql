import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//....Menu Links........................
import Corporate from '../Corporate/CorporateRoutes';
import Candidate from '../Corp-CandidateRegistration/CandidateRoutes'
import Candi_regis from '../CandidateRegistration/CorpCandidateRegistration'
import CVCategory from '../CVCategories/CVCategory_Routes'

//...Dashboard Home Page..............
import DashboardHomePage from '../DashBoard/dashboardHomePage'
//...Dashboard Pages .................
import ProposalCategory from '../ProposalCategory/ProposalCategoryList'

import KnownTags from '../CVCategories/CVCategory_main'
import KnownTagsAdd from '../CVCategories/CVCategories'

import UnknownTags from '../Unknown/UnknownCategories'
import IgnoreTags from '../Ignore/IgnoreCategories'

const homePage = () => (
    <div>
        <DashboardHomePage />
    </div>
);

export default class DashBoard extends Component {
    render() {
        return (
            <Router>
                <div>
                    <div className="ui fixed borderless menu">
                        <div className="ui container grid">
                            <div className="computer only row">
                                <Link to={'/'}>
                                    <a style={{ marginLeft: 0 }} className=" item">HR</a>
                                </Link>
                                <div className="right menu">
                                    <a className="ui  dropdown item">MENU<i className="dropdown icon" />
                                        <div className=" menu" >

                                            <Link to={'/Dashboard/Corporate'}>
                                                <div className="item">
                                                    Corporate
                                      </div>
                                            </Link >
                                            <Link to={'/Dashboard/Candi_regis'}>
                                                <div className="item">
                                                    Candidate Registartion
                                   </div>
                                            </Link >
                                            <Link to={'/Dashboard/Candidate'}>
                                                <div className="item">
                                                    Corp-Candidate Registartion
                                  </div>
                                            </Link>

                                            <Link to={'/Dashboard/CVCategory'}>
                                                <div className="item">
                                                    CVCategory
                                  </div>
                                            </Link>
                                        </div>

                                    </a>
                                </div>
                            </div>
                            <div className="tablet mobile only row">
                                <a className=" item">HR</a>

                                <div className="right menu">
                                    <a className="menu item">
                                        <div className="ui basic icon toggle button">
                                            <i className="content icon"></i>
                                        </div>
                                    </a>
                                </div>
                                <div className="ui vertical accordion borderless fluid menu">
                                    <div className="item">
                                        <div className="title">
                                            MENU<i className="dropdown icon"></i>
                                        </div>
                                        <div className=" content" >

                                            <Link to={'/Dashboard/Corporate'}>
                                                <div className="item">
                                                    Corporate
                                            </div>
                                            </Link>

                                            <Link to={'/Dashboard/Candi_regis'}>
                                                <div className="item">
                                                    Candidate Registartion
                                  </div>
                                            </Link>

                                            <Link to={'/Dashboard/Candidate'}>
                                                <div className="item">
                                                    Corp-Candidate Registartion
                                     </div>
                                            </Link>

                                            <Link to={'/Dashboard/CVCategory'}>
                                                <div className="item">
                                                    CVCategory
                                  </div>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <Route exact path="/" component={homePage} />
                        <Route path="/Dashboard/Corporate" component={Corporate} />
                        <Route path="/Dashboard/Candidate" component={Candidate} />
                        <Route path="/Dashboard/Candi_regis" component={Candi_regis} />
                        <Route path="/Dashboard/CVCategory" component={CVCategory} />
                        <Route path="/ProposalCategory" component={ProposalCategory} />
                        <Route path="/KnownTags" component={KnownTags} />
                        <Route path="/UnknownTags" component={UnknownTags} />
                        <Route path="/IgnoreTags" component={IgnoreTags} />
                        <Route path="/KnownTagsAdd" component={KnownTagsAdd} />
                        
                        
                    </div>
                </div>
            </Router>
        );
    }

}