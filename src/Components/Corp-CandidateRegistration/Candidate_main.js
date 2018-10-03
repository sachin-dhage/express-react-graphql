import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { execGql } from "../apolloClient/apolloClient";
import ReactTable from "react-table";
import "react-table/react-table.css";
import Slider from 'react-rangeslider' // for range slider element
import 'react-rangeslider/lib/index.css'  // css for range slider element
import Select from 'react-select';  // for multi select element 
import { CandidateDeleteQueries, DLLQueries, CandidateDetailsQueries } from '../Queries/queries'
// const fs = require('fs')
// var request = require('request');
// let base64 = require('base-64');


let CLNT = '1002';
let LANG = 'EN';
export default class Candidate_Main extends Component {
    constructor() {
        super();
        this.state = {
            dataList: '',
            showModal: 'none',
            showLoadingComp: 'none',
            technology: [],
            candidateid: '',
            experience: 0,      // for range slider element
            TechnologyDDL: [],
        };

    }

    async componentDidMount() {
        await this.populateDDL();
        await this.searchCandidate();
    }

    //................populateDDL...................
    async populateDDL() {
        try {
            let result = await execGql('query', DLLQueries, this.setDropdownParams());

            //for unique Technology List
            let TechnologyList = await result.data.TECHNOLOGY.reduce((init, next) => {
                init.add(next.inference)
                return init
            }, new Set())

            //for unique Technology code,desc formate
            let TechnologyArray = await [...TechnologyList].map(item => {
                return {
                    label: item,
                    value: item
                }
            })

            await this.setState({ TechnologyDDL: TechnologyArray });
        } catch (error) {
            console.log(error.errorsGql);
            console.log(error.errorMessageGql);
        }
    }
    setDropdownParams() {
        var parameters = {
            CLNT: CLNT,
            LANG: LANG,
            category: "Technology"
        }
        return parameters
    };

    //..............Code for Search...........
    async searchCandidate() {
      
        var result = '', errorMessage = '', errors = [];
        try {
            //   console.log('result1');
            this.setState({showLoadingComp:'flex'}) 
            let gqlVariables = await this.setSearchParams();
            result = await execGql('query', CandidateDetailsQueries, gqlVariables)
           
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
          
            // console.log(result.data.searchCandidates);
            await this.setState({ dataList: result.data.searchCandidates })
            //filter on experience
            let dataList = await [...this.state.dataList]
            dataList = await dataList.filter(item => {
                if (parseInt(item.experience) >= this.state.experience)
                    return item
            });

            //filter on Technology
            var selectedTechnology = this.state.technology.map(selectedTech => selectedTech.value.toLowerCase())
            // dataList = dataList.filter(it => {
            //     let dataListTechnologys = it.ratings.map(dataListTechnology => dataListTechnology.technology.toLowerCase())
            //     let isAvailable = selectedTechnology.every(chk => dataListTechnologys.indexOf(chk) >= 0)
            //     if (isAvailable) {
            //        return it
            //     }
            // })
            dataList = dataList.filter(it => selectedTechnology.every(chk => it.ratings.map(dataListTechnology => dataListTechnology.technology.toLowerCase()).indexOf(chk) >= 0))
            //sort on experience
            await dataList.sort((a, b) => { return a.experience - b.experience })

            await this.setState({ dataList });
            this.setState({showLoadingComp:'none'}) 
        }
    }

    setSearchParams() {
        var parameterValue = {
            clnt: CLNT,
            lang: LANG,
            exactMatch: false
        }
        return parameterValue;
    }

    //..............Code for Clear Screen...........
    async clearScreen() {
        try {
            await this.clearState();
            this.searchCandidate();
        }
        catch (err) {
            console.log(err);
        }
    }

    clearState() {
        this.setState({
            technology: [],
            experience: 0,
        });
    }
    //..............En Clear Screen...........



    //..............Date Formate Convertion..........
    formatDate(date) {
        var year = date.slice(0, 4)
        var month = date.slice(4, 6)
        var day = date.slice(6, 8)

        var date_format = month + '/' + day + '/' + year
        return date_format
    }

    submitClick(value) {
        alert("Edit-----------------" + value.email);
        //write the further functionality
    }


    //...............for download.................
    getUrl(id) {
        if (id.length != 0) {
            var doc = id[0].documentid;
            return 'http://localhost:5000/hrai/download?documentID=' + doc + ''
        }
    }

    DownlodDoc(id) {
        if (id.length == 0) {
            alert("Document not available")
        }
    }


    //.........code For delete..................
    async deleteClick() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('mutation', CandidateDeleteQueries, this.setDeleteParameterValue())
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
            this.setState({ showModal: 'none' })
            this.componentDidMount();
        }
    }

    setDeleteParameterValue() {
        var parameters = {
            "transaction": "LOGICAL_DELETE",
            "candidates": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "candidateid": this.state.candidateid,
                }
            ]
        }
        return parameters
    }
    //.................End Delete Code..................

    //....................for handle On Change range slider element............
    RangeSlideronChange = async (value) => {
        await this.setState({ experience: value });
        await this.searchCandidate(); //search data 
    }

    //....................for handle On Change multi select element............
    MultiSelectonChange = async (selectedOption) => {
        await this.setState({ technology: selectedOption });
        await this.searchCandidate(); //search data 
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
                                <h1 id="title_header"> Candidate List</h1>
                                <div className="icode" id="title_header">
                                    <Link to={'/Dashboard/Candidate/CandidateRegistration'} style={{ color: '#151515' }}>  <i id="iconbar" className="plus icon"></i></Link>
                                    <i id="iconbar" className="arrow down icon"></i>
                                    <i id="iconbar" className="search icon"></i>
                                </div>


                                {true ? <div className="field">
                                    <div className="ui segment">
                                        <i id="closeicon" className="window close outline icon" onClick={() => this.setState({ showSearchForm: !this.state.showSearchForm })}></i>
                                        <div className="ui form">
                                            <div className="ui three column stackable grid">

                                                <div className="row">
                                                    <div className="five wide column">
                                                        <div className="field slider custom-labels'">
                                                            <div>
                                                                <label>Minimum Experience: </label>
                                                                <label style={{ fontSize: "x-large" }}>{this.state.experience}</label>
                                                            </div>
                                                            <Slider
                                                                value={this.state.experience}
                                                                orientation="horizontal"  //"vertical"
                                                                onChange={this.RangeSlideronChange}
                                                                max={20}
                                                                labels={{ 0: '0', 20: '20' }} />
                                                        </div>
                                                    </div>
                                                    {/* <div className="five wide column">
                                                        <div className="field">
                                                            <label > Technology</label>
                                                            <select value={this.state.technology} onChange={async (e) => { await this.setState({ technology: e.target.value }); this.searchCandidate() }}>
                                                                <option value="">Select</option>
                                                                {this.state.TechnologyDDL.map((data, index) => <option key={index} value={data.code}>{data.desc}</option>)}
                                                            </select>
                                                        </div>
                                                    </div> */}
                                                </div>
                                                <div className="row">
                                                    <div className="five wide column">
                                                        <div className="field">
                                                            <label > Technology</label>
                                                            <Select
                                                                isMulti
                                                                //name={`${idx}`}
                                                                onChange={this.MultiSelectonChange}
                                                                value={this.state.technology}
                                                                options={this.state.TechnologyDDL}
                                                                placeholder="Select Technology"
                                                            />
                                                        </div>
                                                    </div>

                                                </div>


                                                <div className="row">
                                                    <div className="ten wide column">
                                                        {/* <button className="ui primary button" type="submit" onClick={() => this.populateList()}>Search</button> */}
                                                        <button className="ui button" type="submit" onClick={() => this.clearScreen()} >Clear</button>
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
                                                        expander: true,
                                                        Header: (column) => <div onClick={() => console.log(column)}>More</div>,
                                                        width: 50,
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
                                                        Header: "First Name",
                                                        accessor: "firstname",
                                                    },
                                                    {
                                                        Header: "Last Name",
                                                        accessor: "lastname",
                                                    },
                                                    {
                                                        Header: "Email",
                                                        accessor: "emailid",
                                                    },
                                                    {
                                                        Header: "Phone",
                                                        accessor: "mobileno",
                                                        width: 150,
                                                    },
                                                    {
                                                        Header: "Experience",
                                                        accessor: "experience",
                                                        width: 90,
                                                    },
                                                    {
                                                        Header: 'Action',
                                                        accessor: 'dataList',
                                                        width: 130,
                                                        style: {
                                                            cursor: 'pointer',
                                                        },
                                                        Cell: row => (
                                                            <div>

                                                                {/*----button Edit---------- */}
                                                                <Link to={{ pathname: '/Dashboard/Candidate/CandidateRegistration', state: { data: row.original.candidateid, } }}>
                                                                    <div id="gridbutton" className="ui blue button" tabIndex="0" >
                                                                        <i id="gridicon" className="edit icon"></i>
                                                                    </div>
                                                                </Link >
                                                                {/* ----button Delete---------- */}
                                                                <div id="griddeletebutton" className="ui red button" tabIndex="0" onClick={() => this.setState({ showModal: 'flex', candidateid: row.original.candidateid })}>
                                                                    <i id="gridicon" className="alternate trash icon"></i>
                                                                </div>
                                                                {/* ----button Downlod---------- */}

                                                                <div id="gridbutton" className="ui blue button" tabIndex="0" >
                                                                    <a href={this.getUrl(row.original.document)} onClick={() => this.DownlodDoc(row.original.document)} target="_blank" style={{ color: 'white' }}>   <i id="gridicon" className="download icon" style={{ fontSize: 12 }} ></i></a>
                                                                </div>
                                                            </div>)
                                                    },
                                                ]}
                                                defaultPageSize={10}
                                                className="-striped -highlight"
                                                SubComponent={row => {
                                                    const rowData = row.original;
                                                    const Ratings = rowData.ratings;
                                                    console.log(Ratings);
                                                    return (
                                                        <div style={{ padding: "10px" }}>
                                                            <div className="ui list">
                                                                <div className="item" style={{ marginLeft: 50 }}>
                                                                    <div style={{ paddingTop: 5 }}> <strong >ID Proof type :</strong>  <span>{rowData.idprooftype}</span> </div>
                                                                    {/* <div style={{ marginLeft: 350, paddingTop: 5 }}>  <strong >Last Update :</strong>  <span>{this.formatDate(rowData.LSTUPDT)}</span>    </div> */}
                                                                    <div style={{ paddingTop: 5 }}> <strong>ID Proof no :</strong>  <span>{rowData.idproofno}</span>  </div>
                                                                    <div style={{ paddingTop: 5 }}  >   <strong>Country:</strong>  <span>{rowData.country}</span>   </div>
                                                                    <div style={{ paddingTop: 5 }}  >   <strong>Technology :</strong>  <span>{rowData.technology}</span>   </div>
                                                                    <div style={{ paddingTop: 5 }}  >   <strong>Ratings :</strong>
                                                                        <span>
                                                                            <ReactTable
                                                                                data={Ratings}
                                                                                columns={[
                                                                                    {
                                                                                        Header: "Technology",
                                                                                        accessor: "technology",
                                                                                    },
                                                                                    {
                                                                                        Header: "Ratings",
                                                                                        accessor: "rating",
                                                                                    }]
                                                                                }
                                                                                pageSize={Ratings.length}
                                                                                showPagination={false}
                                                                            />
                                                                        </span>
                                                                    </div>
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
                                                        Delete Candidate
                                                      </div>
                                                    {/* <span className="close" onClick={() => this.setState({ showModal: 'none' })}>&times;</span> */}

                                                    <p style={{ color: "white" }}> 	Are you sure you want to delete ?</p>
                                                    <div style={{ textAlign: "right" }}>
                                                        <div className="ui red basic cancel inverted button" onClick={() => this.setState({ showModal: 'none' })} >
                                                            <i className="remove icon"></i>
                                                            No
                                                       </div>
                                                        <div className="ui green ok inverted button" onClick={() => this.deleteClick()}>
                                                            <i className="checkmark icon"></i>
                                                            Yes
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* -- The loading Modal -- */}
                                            <div className="modal" style={{ display: this.state.showLoadingComp }} >
                                                <div className="modal-content">
                                                    <div className="ui icon header">
                                                        <div className="ui active inverted loader"> </div>

                                                    </div>
                                                </div>
                                            </div>


                                        </div>



                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>

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
            );
        }

    }
}