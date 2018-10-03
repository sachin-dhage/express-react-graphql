import React from "react";
import { execGql } from "../apolloClient/apolloClient";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";
import { CandidateDeleteQueries, CandidateDetailsQueries, searchCVSummaryQuery } from '../Queries/queries'

const fs = require('fs')
var request = require('request');
let base64 = require('base-64');

// function readAllChunks(readableStream) {
//   console.log('Reading')
//   const reader = readableStream.getReader();
//   const chunks = [];

//   function pump() {
//     return reader.read().then(({ value, done }) => {
//       if (done) {
//         return chunks;
//       }
//       chunks.push(value);
//       return pump();
//     });
//   }

//   return pump();
// }

export default class CaseList extends React.Component {
  constructor() {
    super();
    this.state = {
      dataList: '',
      Firstname: '',
      BusinessOrLowOffice: '',
      Email: '',
      Phoneno: '',
      showModal: 'none',
      rowData: '',
      candidateid: ''

    };

  }

  componentDidMount() {
    this.searchCandidate(this.setSearchParams())

  }

  //..............Code for Search And ClearScreen...........
  async searchCandidate(queryVariables) {
    var result = '', errorMessage = '', errors = [];
    try {
      //   console.log('result1');
      result = await execGql('query', CandidateDetailsQueries, queryVariables)
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
  }

  setSearchParams() {
    var parameterValue = {
      clnt: '1002',
      lang: 'EN',

    }
    return parameterValue;
  }

  async clearScreen() {
    try {
      await this.clearState();
      this.searchContacts();
    }
    catch (err) {
      console.log(err);
    }
  }

  clearState() {
    this.setState({
      Firstname: '',
      BusinessOrLowOffice: '',
      Email: '',
      Phoneno: ''
    });
  }
  //..............End Search And ClearScreen...........



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



  /*-------a random  process srno id generated based on current date and time --------- */
  generateProcessId() {
    var dateTime = new Date().toLocaleString()
    var day = dateTime.slice(0, 2)
    var month = dateTime.slice(3, 5)
    var year = dateTime.slice(6, 10)
    var hr = dateTime.slice(12, 14)
    var mins = dateTime.slice(15, 17)
    var secs = dateTime.slice(18, 20)
    var date_format = year + month + day + hr + mins + secs
    var randomNum = new Date().getTime()
    var processID = randomNum + date_format
    return processID
  }


  //.............function for CV processing..............
  async  processCV(rowData) {

    var candidateid = rowData.candidateid
    var executionid = this.generateProcessId()
    const data = new FormData();

    data.append('raw_text', candidateid);
    data.append('client', "1002");
    data.append('lang', "EN");
    data.append('cvid', candidateid);
    data.append('executionid', executionid);

    //---------request python server to process CV----------------
    let response = await fetch('http://localhost:8001/processresume', {
      method: 'POST',
      // headers: { Accept: '*/*' },
      body: data
    }).then(res => {
      res.body.getReader().read().then(chunk => {
        var string = new TextDecoder("utf-8").decode(chunk.value);
        console.log(string)

      })
    })


    //---------search CV summary----------------
    var result = '', errorMessage = '', errors = [];
    try {
      result = await execGql('query', searchCVSummaryQuery, this.setSearchCVSummaryParams(candidateid, executionid))
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
      this.showCVProcessMsg()
    }
  }



  setSearchCVSummaryParams(candidateid, exeid) {
    var parameterValue = {
      "client": "1002",
      "lang": "EN",
      "cvid": candidateid,
      "executionid": exeid

    }
    return parameterValue;
  }

  //---------shows popup after CV processing----------------
  showCVProcessMsg() {
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
  }

  render() {

    const { dataList } = this.state
   
      if (dataList) {
        return (

          <div>
            <ReactTable
              data={dataList.data.searchCandidates}
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
                  width: 220,
                  style: {
                    cursor: 'pointer',
                  },
                  Cell: row => (
                    <div>
                      {/* ----Process CV button---------- */}
                      <div id="griddeletebutton" className="ui  button" tabIndex="0" onClick={() => { this.processCV(row.original) }}>
                        Process CV
                    </div>
                      {/*----button Edit---------- */}
                      <Link to={{ pathname: '/Dashboard/Candidate/CandidateRegistration', candidateid: { data: row.original.candidateid } }}>
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
            {/* -- popup after processing cv-- */}
            <div id="snackbar">  <i className="info circle icon"></i> CV processed successfully..</div>
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





