import React from "react";
import { execGql } from "../apolloClient/apolloClient";
import { Link } from "react-router-dom";
import ReactTable from "react-table";
import "react-table/react-table.css";


import { searchUnknownCategoriesDetails, CategoriesDDLQuery, CVProcessUnknownCategory } from '../Queries/queries';
import { cloneDeep } from "apollo-utilities";
import { forEach } from "async";

export default class UnknownCategoriesList extends React.Component {

    constructor() {
        super();
        this.state = {
            dataList: '',
            showModal: 'none',
            showLoadingComp: 'none',
            pageSize: 10,
            pageIndex: 0,
            CID: '',
            Attribute: '',
            Count: '',
            Inferance: '',
            showSearchForm: false,
            CategoriesDDL: [],
            selectAll: 0,
            //select all and then assign categories to all
            categoriesAll: 'Ignore',
            categoriestxtAll: 'Ignore',
            isVisibleAll: "hidden",
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
        this.populateDropdown()
    };

    async populateDropdown() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', CategoriesDDLQuery, this.setDropdownParams())
            //console.log(result);
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
            this.setState({ CategoriesDDL: result.data.Categories })
        }
    };

    setDropdownParams() {
        var parameters = {
            "ddlName": "CATEGORY",
            "clnt": "1002",
            "lang": "EN"
        }
        return parameters

    };

    async populateList() {
        var result = '', errorMessage = '', errors = [];
        try {
            // console.log('result1');
            result = await execGql('query', searchUnknownCategoriesDetails, this.setSearchParams())
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
            const dataList = [];
            for (let key in result.data.searchUnknownCategories) {
                dataList[key] = {
                    attribute: result.data.searchUnknownCategories[key].attribute,
                    count: result.data.searchUnknownCategories[key].count,
                    inferance: result.data.searchUnknownCategories[key].attribute,
                    categories: "Ignore",
                    categoriestxt: "Ignore",
                    isVisible: "hidden",
                    isSelect: false
                }
            }
            await this.setState({ dataList })
        }

    };

    setSearchParams() {
        var parameters = {
            "CLNT": "1002",
            "LANG": "EN",
            "ATTRIBUTE": this.state.Attribute,
            "COUNT": this.state.Count,
            "exactMatch": (this.state.exactMatch == "true") ? true : false

        }
        return parameters

    };



    handleKeyPress(e) {
        if (e.key === 'Enter') {
            this.populateList()
        }
    }

    async  clearscreen() {
        await this.setState({
            Attribute: '',
            Count: '',
            exactMatch: 'false'
        })
        this.populateList()
    }

    //on select of ddl outside grid
    async onSelectDDL(e) {
        if (e.target.value == "") {
            this.state.isVisibleAll = "visible";
        }
        else {
            this.state.isVisibleAll = "hidden";
        }
        await this.setState({
            categoriesAll: e.target.value,
            categoriestxtAll: e.target.value
        })

        //set ddl data to grid ddl
        const dataList = [...this.state.dataList];
        await this.setState({
            dataList: this.state.dataList.forEach(x => {
                if (x.isSelect == true) {
                    x.categories = this.state.categoriesAll;
                    x.categoriestxt = this.state.categoriestxtAll
                    if (this.state.categoriesAll === "") {
                        x.isVisible = "visible"
                    } else {
                        x.isVisible = "hidden"
                    }
                }
            })
        });
        await this.setState({ pageSize: this.state.pageSize })
        await this.setState({ dataList })

    }

    //onBlur Text set text from otside field to grid fields
    async onBlurText() {
        const dataList = [...this.state.dataList];
        await this.setState({
            dataList: this.state.dataList.forEach(x => {
                if (x.isSelect == true) {
                    x.categoriestxt = this.state.categoriestxtAll
                }
            })
        });
        await this.setState({ dataList })
    }

    //handle onchange select box
    handleChange(e, cellInfo) {
        const dataList = [...this.state.dataList];
        dataList[cellInfo.index][cellInfo.column.id] = e.target.value;
        dataList[cellInfo.index].categoriestxt = e.target.value;
        if (e.target.value == "") {
            dataList[cellInfo.index].isVisible = "visible";
        }
        else {
            dataList[cellInfo.index].isVisible = "hidden";
        }
        this.setState({ dataList });
    }

    //handle onchange set input text
    async handleChangeTextInput(e, cellInfo) {
        const dataList = [...this.state.dataList];
        dataList[cellInfo.index].categoriestxt = e.target.value;
        await this.setState({ dataList });
    };

    //......process multiple data
    async processAllData() {
        var result = '', errorMessage = '', errors = [];
        this.setState({ showLoadingComp: "flex" });
        try {
            var queryParameter = await this.setProcessAllParams();
            result = await execGql('mutation', CVProcessUnknownCategory, queryParameter)
            //console.log(result);
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
            this.populateList()
            this.setState({ showLoadingComp: "none" });
        }
    }


    async setProcessAllParams() {
        var arrCvunknowncat = []
        await this.state.dataList.forEach(x => {
            if (x.isSelect === true) {
                arrCvunknowncat.push({
                    "client": "1002",
                    "lang": "EN",
                    "category": x.categoriestxt,
                    "attribute": x.attribute,
                    "inference": x.inferance
                })
            }
        });

        var parameters = {
            "transaction": "PROCESS",
            "cvunknowncat": arrCvunknowncat
        }
        return parameters
    };


    //......process single data

    async processData(data) {

        this.setState({ showLoadingComp: "flex" });
        // console.log(data);

        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('mutation', CVProcessUnknownCategory, this.setProcessDataParams(data))
            //console.log(result);
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
            this.setState({ showLoadingComp: "none" });
            this.populateList();

        }

    }

    setProcessDataParams(data) {
        var parameters = {
            "transaction": "PROCESS",
            "cvunknowncat": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "category": data.categoriestxt,
                    "attribute": data.attribute,
                    "inference": data.inferance
                }
            ]
        }
        return parameters

    };

    async toggleRow(cellInfo) {
        const dataList = [...this.state.dataList];
        console.log(cellInfo);

        dataList[cellInfo.index].isSelect = !dataList[cellInfo.index].isSelect;
        await this.setState({ dataList });
    }

    async toggleSelectAll(tableInfo) {

        let truecount = 0;

        let pageSize = this.state.pageSize;
        let pageIndex = this.state.pageIndex;
        let startIndex = pageSize * pageIndex;

        let indexArray = [];

        for (let index = startIndex; index < (pageSize + startIndex); index++) {
            if (tableInfo.data[index] != undefined)
                indexArray[index] = tableInfo.data[index]._index;
        }
        console.log(indexArray);

        const dataList = [...this.state.dataList];

        for (let index = startIndex; index < (pageSize + startIndex); index++) {

            if (dataList[indexArray[index]].isSelect === true) {
                truecount++;
            }
            //dataList[indexArray[index]].isSelect = !dataList[indexArray[index]].isSelect;
        }

        for (let index = startIndex; index < (pageSize + startIndex); index++) {

            if (truecount >= 1) {
                dataList[indexArray[index]].isSelect = false;
            }
            else if (truecount === 0) {
                dataList[indexArray[index]].isSelect = true
            }
            else if (truecount === pageSize) {
                dataList[indexArray[index]].isSelect = false;
            }
        }
        //dataList[startIndex].isSelect = !dataList[startIndex].isSelect;
        await this.setState({ dataList });


    }

    //unselect all afetr sorting
    async sortUnselectAll(dataList) {
        this.state.dataList.forEach(x => {
            x.isSelect = false;
        });

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
                                <h1 id="title_header"> Unknown Attributes </h1>

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
                                                            <label > Unknown Attribute</label>
                                                            <input type="text" name="Attribute" placeholder=" Attribute" onKeyPress={(e) => this.handleKeyPress(e)}
                                                                value={this.state.Attribute} onChange={e => this.setState({ Attribute: e.target.value })} />
                                                        </div>

                                                    </div>

                                                    <div className=" five wide column">
                                                        <div className="field">
                                                            <label > Count</label>
                                                            <input type="text" name="Count" placeholder="Count" onKeyPress={(e) => this.handleKeyPress(e)}
                                                                value={this.state.Count} onChange={e => this.setState({ Count: e.target.value })} />
                                                        </div>
                                                    </div>

                                                </div>

                                                <div className="row">
                                                    <div className="ten wide column">
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
                                        <div>
                                            <div className="row">
                                                <div className="ten wide column">
                                                    <button className="ui primary button" type="submit" onClick={() => this.processAllData()}>Process</button>
                                                    <select style={{ display: "inline-block", padding: "0.2em", height: "2em", width: "20%" }} value={this.state.categoriesAll} onChange={(e) => this.onSelectDDL(e)} >
                                                        <option key="a" value="Ignore">Ignore</option>
                                                        {this.state.CategoriesDDL.map((data, index) => <option key={index} value={data.code}>{data.desc}</option>)}
                                                        <option key="b" value="">Other</option>
                                                    </select>
                                                    {/* <input style={{ display: "inline-block", width: "20%", visibility: this.state.isVisibleAll }} value={this.state.categoriestxtAll} onChange={e => this.setState({ categoriestxtAll: e.target.value })} /> */}
                                                    <input style={{ display: "inline-block", width: "20%", visibility: this.state.isVisibleAll }} value={this.state.categoriestxtAll} onChange={e => this.setState({ categoriestxtAll: e.target.value })} onBlur={() => this.onBlurText()} />


                                                </div>

                                            </div>
                                            <ReactTable
                                                data={dataList}
                                                columns={[
                                                    {
                                                        id: "checkbox",
                                                        accessor: "isSelect",
                                                        Cell: props => {
                                                            return (
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkbox"
                                                                    checked={props.value}
                                                                    onChange={() => this.toggleRow(props)}
                                                                />
                                                            );
                                                        },
                                                        Header: props => {
                                                            return (
                                                                <input
                                                                    type="checkbox"
                                                                    className="checkbox"
                                                                    checked={this.state.selectAll === 1}
                                                                    ref={input => {
                                                                        if (input) {
                                                                            input.indeterminate = this.state.selectAll === 2;
                                                                        }
                                                                    }}
                                                                    onChange={() => this.toggleSelectAll(props)}
                                                                />
                                                            );
                                                        },
                                                        sortable: false,
                                                        width: 45
                                                    },
                                                    // {
                                                    //     expander: true,
                                                    //     Header: () => <div>More</div>,
                                                    //     width: 65,
                                                    //     Expander: ({ isExpanded, ...rest }) =>
                                                    //         <div>
                                                    //             {isExpanded
                                                    //                 ? <span>&#x2296;</span>
                                                    //                 : <span>&#x2295;</span>}
                                                    //         </div>,
                                                    //     style: {
                                                    //         cursor: "pointer",
                                                    //         fontSize: 12,
                                                    //         //  padding: "0",
                                                    //         textAlign: "center",
                                                    //         userSelect: "none"
                                                    //     }
                                                    // },


                                                    {
                                                        Header: "Unknown Attribute",
                                                        accessor: "attribute",
                                                    },
                                                    {
                                                        Header: "Count",
                                                        accessor: "count",
                                                    },
                                                    {
                                                        Header: "Inference",
                                                        accessor: "inferance",
                                                        Cell: props => <input value={props.value} onChange={(e) => this.handleChange(e, props)} />
                                                    },
                                                    {
                                                        Header: "Categories",
                                                        accessor: "categories",

                                                        Cell: (row, props) => <div>
                                                            <div>
                                                                <select style={{ display: "inline-block", padding: "0.2em", height: "2em", width: "50%" }} value={row.original.categories} onChange={(e) => this.handleChange(e, row)} >

                                                                    <option key="a" value="Ignore">Ignore</option>
                                                                    {this.state.CategoriesDDL.map((data, index) => <option key={index} value={data.code}>{data.desc}</option>)}
                                                                    <option key="b" value="">Other</option>
                                                                </select>
                                                                <input style={{ display: "inline-block", width: "50%", visibility: row.original.isVisible }} value={row.original.categoriestxt} onChange={(e) => this.handleChangeTextInput(e, row)} />
                                                            </div>

                                                        </div>
                                                    },

                                                    {
                                                        Header: 'Action',
                                                        accessor: 'dataList',
                                                        width: 80,
                                                        style: {
                                                            cursor: 'pointer',
                                                            paddingTop: 4,
                                                            paddingBottom: 4
                                                        },
                                                        Cell: row => (
                                                            <div>
                                                                {/*----button Edit---------- */}
                                                                {/* <Link to={{ pathname: '/Dashboard/Leads_Main/tabs', state: { data: row.original } }}> */}
                                                                {/* <div id="gridbutton" className="ui blue button" tabIndex="0" >
                                                                     <i id="gridicon" className="edit icon"></i>
                                                                    </div> */}
                                                                {/* </Link > */}
                                                                {/* ----delete Edit---------- */}
                                                                {/* <div id="griddeletebutton" className="ui red button" tabIndex="0" onClick={() => this.setState({ showModal: 'flex', CID: row.original.CID })}>
                                                                    <i id="gridicon" className="alternate trash icon"></i>
                                                                </div> */}

                                                                <div id="griddeletebutton" className="ui blue button" tabIndex="0" onClick={() => this.processData(row.original)}>
                                                                    Process
                                                                </div>

                                                            </div>)
                                                    },
                                                ]}
                                                defaultPageSize={this.state.pageSize}
                                                onPageChange={(pageIndex) => {
                                                    this.setState({ pageIndex: pageIndex })
                                                }} // Called when the page index is changed by the user
                                                onPageSizeChange={(pageSize, pageIndex) => {
                                                    this.setState({ pageIndex: pageIndex, pageSize: pageSize })
                                                }}
                                                onSortedChange={() => {
                                                    this.sortUnselectAll(dataList)
                                                    this.setState({ pageIndex: 0 })
                                                }}
                                                className="-highlight"

                                                page={this.state.pageIndex}

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


                                                    <p style={{ color: "white" }}> 	Are you sure you want to delete this Unknown Category ?</p>
                                                    <div style={{ textAlign: "right" }}>
                                                        <div className="ui red basic cancel inverted button" onClick={() => this.setState({ showModal: 'none', })} >
                                                            <i className="remove icon"></i>
                                                            No
                                                        </div>
                                                        <div className="ui green ok inverted button"  >
                                                            <i className="checkmark icon"></i>
                                                            Yes
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>


                                            {/* <div className="">
            <pre>
              {
                  
                  JSON.stringify({
                "jhnijhun": this.state.dataList,
                // "Email": this.state.email,
                // "PhoneNo": this.state.phoneNo,
                // "FaxNo": this.state.faxNo,
                // "Address": this.state.address,
                // "City": this.state.city,
                // "State": this.state.state,
                // "ZipCode": this.state.zipCode,
                // "BestMethodOfCntct": this.state.bestMethodOfCntct,
                // "BestTimeToCall": this.state.bestTimeToCall
              })}
            </pre>
          </div> */}
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