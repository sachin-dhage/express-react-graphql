import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { execGql } from '../apolloClient/apolloClient';
import { searchCategories, CVCategoryCRUDOps } from '../Queries/queries'
export default class CVCategory_main extends Component {
    constructor() {
        super();
        this.state = {
            dataList: '',
            showModal: 'none',
            client: "",
            lang: "",
            Category: "",
            Attribute: "",
            Inference: "",
            showSearchComp: false,
            exactMatch: 'false'

        };
    };
    async  componentDidMount() {
        if (this.props.location.data) {
            await this.setState({
                Attribute: this.props.location.data.Attribute,
                exactMatch: this.props.location.data.exactMatch
            })
        }
        this.populateList()
    };

    // To Populate Date
    async populateList() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', searchCategories, this.setSearchParams())
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

            console.log(result);
            this.setState({ dataList: result })
        }

    };

    setSearchParams() {
        var parameters = {
            "client": "1002",
            "lang": "EN",
            "category": this.state.Category,
            "attribute": this.state.Attribute,
            "inference": this.state.Inference,
            "exactMatch": (this.state.exactMatch == "true") ? true : false
        }
        return parameters

    };

    // To Delete CV Category
    async DeleteCVCategory() {
        var result = '', errorMessage = '';
        try {
            result = await execGql('mutation', CVCategoryCRUDOps, this.setDeleteParams())
            // console.log(result);
        }
        catch (err) {
            // errors = err.errorsGql;
            errorMessage = err.errorMessageGql;

        }

        if (!result) {
            // errorval = true
            errorMessage = JSON.parse(errorMessage);
            console.log(errorMessage)
        }
        else {

            console.log(result);
            this.setState({ showModal: 'none', })
            this.clearscreen()
            this.populateList()


        }

    };
    setDeleteParams() {
        var parameters = {
            "transaction": "LOGICAL_DELETE",
            "CVCategory": [
                {
                    "client": this.state.client,
                    "lang": this.state.lang,
                    "category": this.state.Category,
                    "attribute": this.state.Attribute
                }
            ]
        }
        return parameters

    };

    // Clear Search Screen
    async clearscreen() {
        await this.setState({
            Category: "",
            Attribute: "",
            Inference: "",
            exactMatch: 'false'
        })
        this.populateList()
    };

    // Handle Keypress

    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.populateList()
        }
    };

    render() {

        const { dataList } = this.state;

        if (dataList) {
            return (
                <div>
                    <div className="ui one column grid">
                        <div className="three column row">
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <h1 id="title_header"> CV Category List</h1>
                                <div className="icode" id="title_header">
                                    <Link to={'/KnownTagsAdd'} style={{ color: '#151515' }}>
                                        <i id="iconbar" className="plus icon"></i>
                                    </Link>
                                    <i id="iconbar" className="arrow down icon"></i>
                                    <i id="iconbar" className="search icon" onClick={() => this.setState({ showSearchComp: !this.state.showSearchComp })}></i>
                                </div>
                                {this.state.showSearchComp ? <div className="field">
                                    <div className="ui segment">
                                        <i id="closeicon" className="window close outline icon" onClick={() => { this.populateList(), this.clearscreen(), this.setState({ showSearchComp: !this.state.showSearchComp }) }}></i>
                                        <div className="ui form">
                                            <div className="ui three column stackable grid">

                                                <div className="row">
                                                    <div className="five wide column">
                                                        <div className="field">
                                                            <label >Category</label>
                                                            <input type="text" name="Category" placeholder="Category" onKeyPress={(e) => this.handleKeyPress(e)}
                                                                value={this.state.Category} onChange={e => this.setState({ Category: e.target.value })} />
                                                        </div>

                                                    </div>
                                                    <div className=" five wide column">
                                                        <div className="field">
                                                            <label > Attribute</label>
                                                            <input type="text" name="Attribute" placeholder="Last Name" onKeyPress={(e) => this.handleKeyPress(e)}
                                                                value={this.state.Attribute} onChange={e => this.setState({ Attribute: e.target.value })} />
                                                        </div>
                                                    </div>
                                                    <div className=" five wide column">
                                                        <div className="field">
                                                            <label > Inference</label>
                                                            <input type="text" name="Inference" placeholder="Inference" onKeyPress={(e) => this.handleKeyPress(e)}
                                                                value={this.state.Inference} onChange={e => this.setState({ Inference: e.target.value })} />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row">
                                                    <div className="five wide column" style={{ marginTop: 13 }}>
                                                        <button className="ui primary button" type="submit" onClick={() => this.populateList()}>Search</button>
                                                        <button className="ui  button" type="submit" onClick={() => this.clearscreen()} >Clear</button>
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

                                        <ReactTable
                                            data={dataList.data.searchCategories}
                                            columns={[

                                                {
                                                    Header: "Sr.No.",
                                                    width: 60,
                                                    Cell: props => <span>{props.index + 1}</span>
                                                },

                                                {
                                                    Header: "Category",
                                                    accessor: "category",

                                                },
                                                {
                                                    Header: "Attribute",
                                                    accessor: "attribute",

                                                },
                                                {
                                                    Header: "Inference",
                                                    accessor: "inference",

                                                },

                                                {
                                                    Header: 'Action',
                                                    accessor: 'dataList',
                                                    width: 50,
                                                    style: {
                                                        cursor: 'pointer',
                                                        paddingTop: 4,
                                                        paddingBottom: 4
                                                    },
                                                    Cell: row => (
                                                        <div>
                                                            {/* ----Delete button---------- */}
                                                            <div id="griddeletebutton" className="ui red button" tabIndex="0" onClick={() => this.setState({ showModal: 'flex', client: row.original.client, lang: row.original.lang, Category: row.original.category, Attribute: row.original.attribute })}>
                                                                <i id="gridicon" className="alternate trash icon"></i>
                                                            </div>
                                                        </div>
                                                    )
                                                },
                                            ]}
                                            defaultPageSize={10}
                                            className="-highlight"

                                        />

                                        {/* -- The Modal -- */}
                                        <div className="modal" style={{ display: this.state.showModal }} >
                                            <div className="modal-content">

                                                <div className="ui icon header " style={{ color: "white", textAlign: "Center" }}>
                                                    <i className="archive icon"></i>
                                                    Delete CV Category
                                                </div>
                                                {/* <span className="close" onClick={() => this.setState({ showModal: 'none' })}>&times;</span> */}

                                                <p style={{ color: "white" }}> 	Are you sure you want to delete this CV Category ?</p>
                                                <div style={{ textAlign: "right" }}>
                                                    <div className="ui red basic cancel inverted button" onClick={() => this.setState({ showModal: 'none', })} >
                                                        <i className="remove icon"></i>
                                                        No
                                                     </div>
                                                    <div className="ui green ok inverted button" onClick={() => this.DeleteCVCategory()} >
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