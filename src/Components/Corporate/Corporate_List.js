import React from "react";
import { execGql } from "../apolloClient/apolloClient";
// Import React Table
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import {CRUDOrgQuery,SearchOrganizationQuery} from '../Queries/queries'
export default class CorporateList extends React.Component {

    constructor() {
        super();
        this.state = {
            dataList: '',
            showModal: 'none',
            organizationid: ''
        };
    };

    componentDidMount() {
        this.populateList()
    };


    async populateList() {
        var result = '', errorMessage = '', errors = [];
        try {
            // console.log('result1');
            result = await execGql('query', SearchOrganizationQuery, this.setSearchParams())
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
            "exactMatch": true
        }
        return parameters

    };

    async deleteOrganization() {
        var result = '', errorMessage = '', errors = [];
        try {
            //   console.log('result1');
            result = await execGql('mutation', CRUDOrgQuery, this.setDeleteParams())

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
            this.setState({ showModal: 'none', })
            this.componentDidMount()

        }

    }


    setDeleteParams() {

        var parameters = {
            "transaction": "LOGICAL_DELETE",
            "organization": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "organizationid": this.state.organizationid
                }
            ]

        }
        return parameters

    }


    render() {
        const { dataList } = this.state
        var srno = 1

        if (dataList) {
            return (


                <div>
                    <ReactTable
                        data={dataList.data.searchOrganizations}
                        columns={[

                            {
                                expander: true,
                                Header: () => <div>More</div>,
                                width: 65,
                                Expander: ({ isExpanded, ...rest }) =>
                                    <div>
                                        {isExpanded
                                            ? <span>&#x2296;</span>
                                            : <span>&#x2295;</span>}
                                    </div>,
                                style: {
                                    cursor: "pointer",
                                    fontSize: 12,
                                    //  padding: "0",
                                    textAlign: "center",
                                    userSelect: "none"
                                }
                            },
                            {
                                Header: "Organization Name",
                                accessor: "name",
                                width: 200,
                            },
                            {
                                Header: "Country",
                                accessor: "country",
                                width: 90,
                            },
                            {
                                Header: "HR Name",
                                accessor: "hrheadfirstname",
                            },
                            {
                                Header: "CEO Name",
                                accessor: "ceofirstname",
                            },
                            {
                                Header: "CFO Name",
                                accessor: "cfofirstname",
                            },

                            {
                                Header: "Status",
                                accessor: "status",
                                width: 90,
                            },
                            {
                                Header: 'Action',
                                accessor: 'dataList',
                                width: 130,
                                style: {
                                    cursor: 'pointer',
                                    paddingTop: 4,
                                    paddingBottom: 4
                                },
                                Cell: row => (
                                    <div>
                                        {/*----button Edit---------- */}

                                        <Link to={{ pathname: '/Dashboard/Corporate_main/Corporate_Add', data: { data: row.original.organizationid } }} >  <div id="gridbutton" className="ui blue button" tabIndex="0" >
                                            <i id="gridicon" className="edit icon"></i>
                                        </div>
                                        </Link>
                                        {/* ----Delete button---------- */}
                                        <div id="griddeletebutton" className="ui red button" tabIndex="0" onClick={() => this.setState({ showModal: 'flex', organizationid: row.original.organizationid })}>
                                            <i id="gridicon" className="alternate trash icon"></i>
                                        </div>
                                        {/* ----Approve button---------- */}

                                        <div className="ui green button" id="gridapprovedbutton" >
                                            <input className="ui fitted checkbox" type="checkbox" />
                                            <label id="gridicon" ></label>
                                        </div>

                                    </div>
                                )
                            },
                        ]}
                        defaultPageSize={10}
                        className="-highlight"

                        SubComponent={row => {
                            const rowData = row.original;
                            return (
                                <div style={{ padding: "10px" }}>
                                    <div className="ui list">

                                        <div className="item" style={{ marginLeft: 50 }}>

                                            <div style={{ float: 'left', paddingTop: 5 }}> <strong >Website URL :</strong>  <span>{rowData.website}</span> </div>
                                            <div style={{ marginLeft: 350, paddingTop: 5 }}>  <strong >Technology :</strong>  <span>{rowData.technology}</span>    </div>
                                            <div style={{ paddingTop: 5 }}> <strong>Employee Turnover :</strong>  <span>{rowData.employeeturnover}</span>  </div>
                                            <div style={{ paddingTop: 5 }}> <strong>No Of Employee  :</strong>  <span>{rowData.noofemployees}</span>  </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        }}

                    />

                    {/* -- The Modal -- */}
                    <div className="modal" style={{ display: this.state.showModal }} >
                        <div className="modal-content">

                            <div className="ui icon header " style={{ color: "white", textAlign: "Center" }}>
                                <i className="archive icon"></i>
                                Delete Corporate
               </div>
                            {/* <span className="close" onClick={() => this.setState({ showModal: 'none' })}>&times;</span> */}

                            <p style={{ color: "white" }}> 	Are you sure you want to delete this Corporate ?</p>
                            <div style={{ textAlign: "right" }}>
                                <div className="ui red basic cancel inverted button" onClick={() => this.setState({ showModal: 'none', })} >
                                    <i className="remove icon"></i>
                                    No
            </div>
                                <div className="ui green ok inverted button" onClick={() => this.deleteOrganization()} >
                                    <i className="checkmark icon"></i>
                                    Yes
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