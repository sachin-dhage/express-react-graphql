import React from "react";
import { execGql } from "../apolloClient/apolloClient";
import ReactTable from "react-table";
import "react-table/react-table.css";


import { searchProposalCategories } from '../Queries/queries';
import { cloneDeep } from "apollo-utilities";
import { forEach } from "async";

export default class ProposalCategoriesList extends React.Component {

    constructor() {
        super();
        this.state = {
            dataList: '',
            showModal: 'none',
            showLoadingComp: 'none',
            Attribute: '',
            Count: '',
            showSearchForm: false,
            exactMatch: 'false'
        };
    };

    async componentDidMount() {
        if (this.props.location.data) {
            await this.setState({
                Attribute: this.props.location.data.Attribute,
                exactMatch: this.props.location.data.exactMatch
            })
        }
        this.populateList()
    };


    async populateList() {
        var result = '', errorMessage = '', errors = [];
        try {
            // console.log('result1');
            result = await execGql('query', searchProposalCategories, this.setSearchParams())
            // console.log(result);
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
            await this.setState({ dataList: result.data.searchProposalCategories })
        }

    };

    setSearchParams() {
        var parameters = {
            "client": "1002",
            "lang": "EN",
            "attribute": this.state.Attribute,
            "count": this.state.Count,
            "exactMatch": (this.state.exactMatch == "true") ? true : false
        }
        return parameters
    };




    async clearscreen() {
        await this.setState({ Attribute: '', Count: '', exactMatch: 'false' })
        this.populateList()
    }



    render() {

        const { dataList } = this.state
        if (dataList) {
            return (
                <div>
                    <div className="ui one column grid">
                        <div className="three column row">
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <h1 id="title_header"> Proposal Categories </h1>

                                <div className="icode" id="title_header">
                                    <i id="iconbar" className="plus icon"></i>
                                    <i id="iconbar" className="arrow down icon"></i>
                                    <i id="iconbar" className="search icon" onClick={() => this.setState({ showSearchForm: !this.state.showSearchForm })}></i>
                                </div>

                                {this.state.showSearchForm ? <div className="field">
                                    <div className="ui segment">
                                        <i id="closeicon" className="window close outline icon" onClick={() => this.setState({ showSearchForm: !this.state.showSearchForm })}></i>
                                        <div className="ui form">
                                            <div className="ui three column stackable grid">

                                                <div className="row">
                                                    <div className="five wide column">
                                                        <div className="field">
                                                            <label > Attribute</label>
                                                            <input type="text" name="Attribute" placeholder=" Attribute" value={this.state.Attribute} onChange={e => this.setState({ Attribute: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className="five wide column">
                                                        <div className="field">
                                                            <label > Count</label>
                                                            <input type="text" name="Count" placeholder="Count" value={this.state.Count} onChange={e => this.setState({ Count: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="row">
                                                    <div className="ten wide column">
                                                        <button className="ui primary button" type="submit" onClick={() => this.populateList()}>Search</button>
                                                        <button className="ui button" type="submit" onClick={() => this.clearscreen()} >Clear</button>
                                                    </div>

                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div> : null}

                            </div>
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                        </div>
                        <div className="three column row">
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <div id="cus_segment" className="ui segment">
                                    <div className="ui form">
                                        <div>

                                            <ReactTable
                                                data={dataList}
                                                columns={[
                                                    {
                                                        Header: "Attribute",
                                                        accessor: "attribute",
                                                    },
                                                    {
                                                        Header: "Count",
                                                        accessor: "count",
                                                    }
                                                ]}
                                                defaultPageSize={10}

                                                className="-highlight"



                                            />
                                            {/* -- The loading Modal -- */}
                                            <div className="modal" style={{ display: this.state.showLoadingComp }} >
                                                <div className="modal-content">
                                                    <div className="ui icon header">
                                                        <div className="ui active inverted loader"> </div>
                                                        <br /><br /><br /><p style={{ color: "#fff" }}>Processing...</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* -- The delete Modal -- */}
                                            <div className="modal" style={{ display: this.state.showModal }}>
                                                <div className="modal-content">

                                                    <div className="ui icon header " style={{ color: "white", textAlign: "Center" }}>
                                                        <i className="archive icon"></i>
                                                        Delete Unknown Category
                                                    </div>


                                                    <p style={{ color: "white" }}>  Are you sure you want to delete this Unknown Category ?</p>
                                                    <div style={{ textAlign: "right" }}>
                                                        <div className="ui red basic cancel inverted button" onClick={() => this.setState({ showModal: 'none', })} >
                                                            <i className="remove icon"></i>
                                                            No
                                                    </div>
                                                        <div className="ui green ok inverted button" >
                                                            <i className="checkmark icon"></i>
                                                            Yes
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>
                </div>

            );
        }
        else {
            return (
                <div className="ui icon header">
                    <div className="ui active loader"></div>
                </div>
            );
        }
    }
}