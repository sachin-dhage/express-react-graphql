import React from "react";
import { execGql } from "../apolloClient/apolloClient";
import { searchDashboard } from '../Queries/queries'
import { Link } from "react-router-dom";

export default class Dashboard extends React.Component {

    constructor() {
        super();
        this.state = {
            ProposalCount: '',
            KnownCount: '',
            UnknownCount: '',
            IgnoreCount: '',
            Attribute: '',
            exactMatch:false
        };

    }
    componentDidMount() {
        this.setDashboardCount();
    }

    async setDashboardCount() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', searchDashboard, this.setSearchParams())
        }
        catch (err) {
            errors = err.errorsGql;
            errorMessage = err.errorMessageGql;
        }

        if (!result) {
            console.log(errors);
            console.log(errorMessage);
        }
        else {
            console.log(result);
            await this.setState({
                ProposalCount: result.data.searchDashboard.Proposal,
                KnownCount: result.data.searchDashboard.Known,
                UnknownCount: result.data.searchDashboard.Unknown,
                IgnoreCount: result.data.searchDashboard.Ignore
            })
        }
    }

    setSearchParams() {
          
        var parameters = {
            "client": "1002",
            "lang": "EN",
            "attribute": this.state.Attribute,
            "exactMatch":(this.state.exactMatch=="true")?true:false
        }
        return parameters
    }

    async clearscreen() {
        await this.setState({ Attribute: '',exactMatch:false })
        this.setDashboardCount()
    }

    render() {
        if (this.state.IgnoreCount) {
            return (

                <div>
                    <div className="ui one column grid" style={{ marginLeft: 0 }}>

                        <div className="three column row">
                            <div className="one wide computer one wide tablet one wide mobile column" />
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <div className="ui form">
                                    <h1 id="title_header" className="ui header" style={{ marginBottom: "0px" }}>DASHBOARD</h1>
                                    <div >
                                        Welcome back,Last Login on Jun 13,2018 10:48
                                </div>
                                </div>
                            </div>
                            <div className="one wide computer one wide tablet one wide mobile column" />
                        </div>


                        <div className="three column row" >
                            <div className="one wide computer one wide tablet one wide mobile column" />
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <div className="ui form" style={{ marginBottom: 0 }}>
                                    <div className="ui stackable grid">
                                        <div className="row">
                                            <div className="four wide column">
                                                <div className="field">
                                                    <label > Attribute</label>
                                                    <input type="text" name="Attribute" placeholder=" Attribute" value={this.state.Attribute} onChange={e => this.setState({ Attribute: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="three wide column">
                                                <div className="field">
                                                    <label>Matching Criteria</label>
                                                    <select className="" value={this.state.exactMatch} onChange={e => this.setState({ exactMatch: e.target.value })}>
                                                        <option value="false">Phrase Match</option>
                                                        <option value="true">Exact Match</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="ten wide column">
                                                <button className="ui primary button" type="submit" style={{ marginTop: 25 }} onClick={() => this.setDashboardCount()}>Search</button>
                                                <button className="ui button" type="submit" onClick={() => this.clearscreen()} >Clear</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="three column row" >
                            <div className="one wide computer one wide tablet one wide mobile column" />
                            <div className="five wide computer fourteen wide tablet fourteen wide mobile column">
                                <div className="ui form" style={{ marginBottom: 0 }}>
                                    <div className="ui two column stackable grid">
                                        <div className="row">

                                            <Link to={{ pathname: '/KnownTags', data: { Attribute: this.state.Attribute,exactMatch:this.state.exactMatch } }}>
                                                <div className="three wide computer fourteen wide tablet fourteen wide mobile column">
                                                    <div className="ui segment" >
                                                        <h4 className="ui header" style={{ margin: "10px" }}>Known Tags</h4>
                                                        <label style={{ margin: "10px" }} >{this.state.KnownCount}</label>
                                                    </div>
                                                </div>
                                            </Link>

                                            <Link to={{ pathname: '/UnknownTags', data: { Attribute: this.state.Attribute,exactMatch:this.state.exactMatch } }}>
                                                <div className="three wide computer fourteen wide tablet fourteen wide mobile column">
                                                    <div className="ui segment" >
                                                        <h4 className="ui header" style={{ margin: "10px" }}>Unknown Tags</h4>
                                                        <label style={{ margin: "10px" }} >{this.state.UnknownCount}</label>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row " >
                            <div className="one wide computer one wide tablet one wide mobile column" />
                            <div className="five wide computer fourteen wide tablet fourteen wide mobile column">
                                <div className="ui form" style={{ marginBottom: 0 }}>
                                    <div className="ui two column stackable grid">
                                        <div className="row">
                                            <Link to={{ pathname: '/IgnoreTags', data: { Attribute: this.state.Attribute,exactMatch:this.state.exactMatch } }}>
                                                <div className="eight wide computer fourteen wide tablet fourteen wide mobile column">
                                                    <div className="ui segment">
                                                        <h4 className="ui header" style={{ margin: "10px" }}>Ignore Tags</h4>
                                                        <label style={{ margin: "10px" }} >{this.state.IgnoreCount}</label>
                                                    </div>
                                                </div>
                                            </Link>
                                            <Link to={{ pathname: '/ProposalCategory', data: { Attribute: this.state.Attribute,exactMatch:this.state.exactMatch } }}>
                                                <div className="eight wide computer fourteen wide tablet fourteen wide mobile column">
                                                    <div className="ui segment" >
                                                        <h4 className="ui header" style={{ margin: "10px" }}>Proposal Tags</h4>
                                                        <label style={{ margin: "10px" }} >{this.state.ProposalCount}</label>
                                                    </div>
                                                </div>
                                            </Link>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                    </div>
                </div>
            )
        }
        else {
            return (
                <div className="ui icon header">
                    <div className="ui active loader"></div>
                </div>
            )
        }
    }
}
