import React from 'react';
import { execGql } from '../apolloClient/apolloClient';
import {DLLQueries,CRUDOrgQuery,SearchOrganizationQuery} from '../Queries/queries'
var DropdownCorporateList = [];
var errorval = false
export default class Corporate extends React.Component {
    constructor(props) {
        super(props)
        this.onSubmit = this.onSubmit.bind(this)
        this.state = {
            Legal_name: "",
            Tan_no: "",
            Pan_no: "",
            Gst_no: "",
            Country: "",
            Web_url: "",
            HR_Head_fname: "",
            HR_Head_lname: "",
            HR_Head_empid: "",
            HR_Head_email: "",
            ALT_Person_fname: "",
            ALT_Person_lname: "",
            ALT_Person_empid: "",
            ALT_Person_email: "",
            CEO_fname: "",
            CEO_lname: "",
            CEO_empid: "",
            CEO_email: "",
            CFO_fname: "",
            CFO_lname: "",
            CFO_empid: "",
            CFO_email: "",
            No_of_emp: "",
            Emp_turnover: "",
            Technology_Used: "",
            DropdownCorporateListArr: [],
            tcode: "CREATE",
            Dispalycomp: true,
            errorceoemailid:"",
            errorceofirstname:"",
            errorcfoemailid:"",
            errorcfofirstname:"",
            errorcountry:"",
            errorgstno:"",
            errorhrheademailid:"",
            errorhrheadfirstname:"",
            errorname:"",
            errorpanno:"",
            errortanno:"",
            errortechnology:"",
            errorwebsite:"",
        }
    };


    componentDidMount() {

        this.DropdownCountry()
        if (this.props.location.data) {
            console.log(this.props.location.data.data);
            this.setState({ Dispalycomp: !this.state.Dispalycomp })
            this.populateData();
        }

    };

    async populateData() {
        console.log('in edit')
        var result = '', errorMessage = '', errors = [];
        try {
            // console.log('result1');
            result = await execGql('query', SearchOrganizationQuery, this.setSearchParams())
            console.log(result);
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
            this.setState({
                Legal_name: result.data.searchOrganizations[0].name,
                Tan_no: result.data.searchOrganizations[0].tanno,
                Pan_no: result.data.searchOrganizations[0].panno,
                Gst_no: result.data.searchOrganizations[0].gstno,
                Country: result.data.searchOrganizations[0].country,
                Web_url: result.data.searchOrganizations[0].website,
                HR_Head_fname: result.data.searchOrganizations[0].hrheadfirstname,
                HR_Head_lname: result.data.searchOrganizations[0].hrheadlastname,
                HR_Head_empid: result.data.searchOrganizations[0].hrheademployeeid,
                HR_Head_email: result.data.searchOrganizations[0].hrheademailid,
                ALT_Person_fname: result.data.searchOrganizations[0].alternatecontactfirstname,
                ALT_Person_lname: result.data.searchOrganizations[0].alternatecontactlastname,
                ALT_Person_empid: result.data.searchOrganizations[0].alternatecontactemployeeid,
                ALT_Person_email: result.data.searchOrganizations[0].alternatecontactemailid,
                CEO_fname: result.data.searchOrganizations[0].ceofirstname,
                CEO_lname: result.data.searchOrganizations[0].ceolastname,
                CEO_empid: result.data.searchOrganizations[0].cfoemployeeid,
                CEO_email: result.data.searchOrganizations[0].ceoemailid,
                CFO_fname: result.data.searchOrganizations[0].cfofirstname,
                CFO_lname: result.data.searchOrganizations[0].cfolastname,
                CFO_empid: result.data.searchOrganizations[0].cfoemployeeid,
                CFO_email: result.data.searchOrganizations[0].cfoemailid,
                No_of_emp:result.data.searchOrganizations[0].noofemployees,
                Emp_turnover: result.data.searchOrganizations[0].employeeturnover,
                Technology_Used: result.data.searchOrganizations[0].technology,
                tcode: 'UPDATE',
                Dispalycomp: !this.state.Dispalycomp

            })


        }

    };

    setSearchParams() {
        var parameters = {
            "client": "1002",
            "lang": "EN",
            "organizationid": this.props.location.data.data,
            "exactMatch": true
        }
        return parameters

    };

    async DropdownCountry() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', DLLQueries, this.setDropdownParams())
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
            DropdownCorporateList = [];
            DropdownCorporateList.push({
                "COUNTRY": result.data.COUNTRY,
            })

            this.setState({ DropdownCorporateListArr: DropdownCorporateList })

        }

    };

    setDropdownParams() {
        var parameters = {
            "CLNT": "1002",
            "LANG": "EN"
        }
        return parameters

    };


    async CreateCorporations() {
        var result = '', errorMessage = '';
        try {
            result = await execGql('mutation', CRUDOrgQuery, this.setCreateParams())
            // console.log(result);
        }
        catch (err) {
            // errors = err.errorsGql;
            errorMessage = err.errorMessageGql;

        }

        if (!result) {
             errorval = true
            errorMessage = JSON.parse(errorMessage);
            console.log(errorMessage)
            for (let key in errorMessage) {
                console.log(errorMessage[key]);
                this.setState({
                   
                    errorceoemailid: errorMessage[key].errorceoemailid,
                    errorceofirstname: errorMessage[key].errorceofirstname,
                    errorcfoemailid: errorMessage[key].errorcfoemailid,
                    errorcfofirstname: errorMessage[key].errorcfofirstname,
                    errorcountry: errorMessage[key].errorcountry,
                    errorgstno: errorMessage[key].errorgstno,
                    errorhrheademailid: errorMessage[key].errorhrheademailid,
                    errorhrheadfirstname: errorMessage[key].errorhrheadfirstname,
                    errorname: errorMessage[key].errorname,
                    errorpanno: errorMessage[key].errorpanno,
                    errortanno: errorMessage[key].errortanno,
                    errortechnology: errorMessage[key].errortechnology,
                    errorwebsite: errorMessage[key].errorwebsite,
                });
            }

        }
        else {

            console.log(result);
            this.navigateToCorporateList()
            this.OnClear()

        }

    };


    setCreateParams() {
        var parameters = {
            "transaction": "CREATE",
            "organization": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "name": this.state.Legal_name,
                    "tanno": this.state.Tan_no,
                    "panno": this.state.Pan_no,
                    "gstno": this.state.Gst_no,
                    "country": this.state.Country,
                    "website": this.state.Web_url,
                    "hrheadfirstname": this.state.HR_Head_fname,
                    "hrheadlastname": this.state.HR_Head_lname,
                    "hrheademailid": this.state.HR_Head_email,
                    "hrheademployeeid": this.state.HR_Head_empid,
                    "alternatecontactfirstname": this.state.ALT_Person_fname,
                    "alternatecontactlastname": this.state.ALT_Person_lname,
                    "alternatecontactemailid": this.state.ALT_Person_email,
                    "alternatecontactemployeeid": this.state.ALT_Person_empid,
                    "ceofirstname": this.state.CEO_fname,
                    "ceolastname": this.state.CEO_lname,
                    "ceoemailid": this.state.CEO_email,
                    "ceoemployeeid": this.state.CEO_empid,
                    "cfofirstname": this.state.CFO_fname,
                    "cfolastname": this.state.CFO_lname,
                    "cfoemailid": this.state.CFO_email,
                    "cfoemployeeid": this.state.CFO_empid,
                    "noofemployees": this.state.No_of_emp,
                    "employeeturnover": this.state.Emp_turnover,
                    "technology": this.state.Technology_Used
                }
            ]
        }
        return parameters

    };

    async UpdateCorporations() {
        var result = '', errorMessage = '';
        try {
            result = await execGql('mutation',CRUDOrgQuery , this.setUpdateParams())
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
            // for (let key in errorMessage) {
            //     console.log(errorMessage[key]);
            //     this.setState({
            //         errorEMAILID: errorMessage[key].errorEMAILID,
            //         errorFRSTNM: errorMessage[key].errorFRSTNM,
            //         errorPHONE: errorMessage[key].errorPHONE
            //     });
            // }

        }
        else {

            console.log(result);
            this.navigateToCorporateList()
            // this.OnClear()

        }

    };


    setUpdateParams() {
        var parameters = {
            "transaction": "UPDATE",
            "organization": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "organizationid": this.props.location.data.data,
                    "name": this.state.Legal_name,
                    "tanno": this.state.Tan_no,
                    "panno": this.state.Pan_no,
                    "gstno": this.state.Gst_no,
                    "country": this.state.Country,
                    "website": this.state.Web_url,
                    "hrheadfirstname": this.state.HR_Head_fname,
                    "hrheadlastname": this.state.HR_Head_lname,
                    "hrheademailid": this.state.HR_Head_email,
                    "hrheademployeeid": this.state.HR_Head_empid,
                    "alternatecontactfirstname": this.state.ALT_Person_fname,
                    "alternatecontactlastname": this.state.ALT_Person_lname,
                    "alternatecontactemailid": this.state.ALT_Person_email,
                    "alternatecontactemployeeid": this.state.ALT_Person_empid,
                    "ceofirstname": this.state.CEO_fname,
                    "ceolastname": this.state.CEO_lname,
                    "ceoemailid": this.state.CEO_email,
                    "ceoemployeeid": this.state.CEO_empid,
                    "cfofirstname": this.state.CFO_fname,
                    "cfolastname": this.state.CFO_lname,
                    "cfoemailid": this.state.CFO_email,
                    "cfoemployeeid": this.state.CFO_empid,
                    "noofemployees": this.state.No_of_emp,
                    "employeeturnover": this.state.Emp_turnover,
                    "technology": this.state.Technology_Used
                }
            ]
        }
        return parameters

    };
    OnClear() {
        this.setState({
            Legal_name: "",
            Tan_no: "",
            Pan_no: "",
            Gst_no: "",
            Country: "",
            Web_url: "",
            HR_Head_fname: "",
            HR_Head_lname: "",
            HR_Head_empid: "",
            HR_Head_email: "",
            ALT_Person_fname: "",
            ALT_Person_lname: "",
            ALT_Person_empid: "",
            ALT_Person_email: "",
            CEO_fname: "",
            CEO_lname: "",
            CEO_empid: "",
            CEO_email: "",
            CFO_fname: "",
            CFO_lname: "",
            CFO_empid: "",
            CFO_email: "",
            No_of_emp: "",
            Emp_turnover: "",
            Technology_Used: "",
        })
    };

    navigateToCorporateList() {
        return this.props.history.push('/Dashboard/Corporate')
    };


    CRUD_operation() {
        if (this.state.tcode == 'CREATE') {
            this.CreateCorporations()
        }
        else if (this.state.tcode == 'UPDATE') {
            this.UpdateCorporations()

        }
    };

    onSubmit() {
        alert(JSON.stringify(
            {
                "Legal_name": this.state.Legal_name,
                "Tan_no": this.state.Tan_no,
                "Pan_no": this.state.Pan_no,
                "Gst_no": this.state.Gst_no,
                "Country": this.state.Country,
                "Web_url": this.state.Web_url,
                "HR_Head_fname": this.state.HR_Head_fname,
                "HR_Head_lname": this.state.HR_Head_lname,
                "HR_Head_empid": this.state.HR_Head_empid,
                "HR_Head_email": this.state.HR_Head_email,
                "ALT_Person_fname": this.state.ALT_Person_fname,
                "ALT_Person_lname": this.state.ALT_Person_lname,
                "ALT_Person_empid": this.state.ALT_Person_empid,
                "ALT_Person_email": this.state.ALT_Person_email,
                "CEO_fname": this.state.CEO_fname,
                "CEO_lname": this.state.CEO_lname,
                "CEO_empid": this.state.CEO_empid,
                "CEO_email": this.state.CEO_email,
                "CFO_fname": this.state.CFO_fname,
                "CFO_lname": this.state.CFO_lname,
                "CFO_empid": this.state.CFO_empid,
                "CFO_email": this.state.CFO_email,
                "No_of_emp": this.state.No_of_emp,
                "Emp_turnover": this.state.Emp_turnover,
                "Technology_Used": this.state.Technology_Used
            }
        )
        );
    };


    render() {

        if (this.state.Dispalycomp) {
            return (

                <div>
                    <div className="ui one column grid">
                        <div className=" row">
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <h1 id="title_header">Corporate Registration</h1>
                            </div>
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                        </div>
                        <div className=" row">
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                            <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                                <div id="cus_segment" className="ui segment " >
                                    <div className="ui form">
                                        <div style={{ fontSize: 15, color: "black" }}>Company</div>
                                        <hr />
                                        <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">
                                                <div className="ten wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorname ? 'brown' : null }}>Legal Name</label>
                                                        <input style={{ borderColor: this.state.errorname ? 'brown' : null, backgroundColor: this.state.errorname ? '#f3ece7' : null }} type="text" name="Legal_Name" placeholder="Legal Name" value={this.state.Legal_name} onChange={e => this.setState({ Legal_name: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorname}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className=" row">
                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorpanno ? 'brown' : null }}>Tan No.</label>
                                                        <input style={{ borderColor: this.state.errortanno ? 'brown' : null, backgroundColor: this.state.errortanno ? '#f3ece7' : null }} type="text" name="Tan_No" placeholder="Tan No" value={this.state.Tan_no} onChange={e => this.setState({ Tan_no: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errortanno}</span> : null}
                                                </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorpanno ? 'brown' : null }}>Pan No.</label>
                                                        <input style={{ borderColor: this.state.errorpanno ? 'brown' : null, backgroundColor: this.state.errorpanno ? '#f3ece7' : null }} type="text" name="Pan_No" placeholder="Pan No" value={this.state.Pan_no} onChange={e => this.setState({ Pan_no: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorpanno}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className=" row">
                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorgstno ? 'brown' : null }}>GST No.</label>
                                                        <input style={{ borderColor: this.state.errorgstno? 'brown' : null, backgroundColor: this.state.errorgstno ? '#f3ece7' : null }} type="text" name="GST_No" placeholder="GST No" value={this.state.Gst_no} onChange={e => this.setState({ Gst_no: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorgstno}</span> : null}
                                                </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorcountry? 'brown' : null }}>Country</label>
                                                        <select style={{ borderColor: this.state.errorcountry ? 'brown' : null, backgroundColor: this.state.errorcountry ? '#f3ece7' : null }} value={this.state.Country} onChange={e => this.setState({ Country: e.target.value })}>
                                                            <option value="">Country</option>
                                                            {this.state.DropdownCorporateListArr.map((data) => data.COUNTRY.map((data, idx) => <option key={idx} value={data.code}>{data.desc}</option>))}
                                                        </select>
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorcountry}</span> : null}
                                                </div>
                                                </div>
                                            </div>

                                            <div className=" row">
                                                <div className="ten wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorwebsite ? 'brown' : null }}>Web Site Url</label>
                                                        <input style={{ borderColor: this.state.errorwebsite ? 'brown' : null, backgroundColor: this.state.errorwebsite ? '#f3ece7' : null }} type="text" name="Web_Site_Url" placeholder="Web Site Url" value={this.state.Web_url} onChange={e => this.setState({ Web_url: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorwebsite}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                        <br />
                                        <div style={{ fontSize: 15, color: "black" }}> HR Head</div>
                                        <hr />
                                        <br />
                                         <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorhrheadfirstname ? 'brown' : null }}>First Name</label>
                                                        <input style={{ borderColor: this.state.errorhrheadfirstname? 'brown' : null, backgroundColor: this.state.errorhrheadfirstname ? '#f3ece7' : null }} type="text" name="First_Name" placeholder="First Name" value={this.state.HR_Head_fname} onChange={e => this.setState({ HR_Head_fname: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorhrheadfirstname}</span> : null}
                                                </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Last Name</label>
                                                        <input type="text" name="Last_Name" placeholder="Last Name" value={this.state.HR_Head_lname} onChange={e => this.setState({ HR_Head_lname: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Employee Id</label>
                                                        <input type="text" name="Employee_Id" placeholder="Employee Id" value={this.state.HR_Head_empid} onChange={e => this.setState({ HR_Head_empid: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorhrheademailid? 'brown' : null }}>Email Id</label>
                                                        <input style={{ borderColor: this.state.errorhrheademailid? 'brown' : null, backgroundColor: this.state.errorhrheademailid ? '#f3ece7' : null }} type="text" name="Email_Id" placeholder="Email Id" value={this.state.HR_Head_email} onChange={e => this.setState({ HR_Head_email: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorhrheademailid}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                        <br />
                                        <div style={{ fontSize: 15, color: "black" }}> Alternate Person</div>
                                        <hr />
                                        <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>First Name</label>
                                                        <input type="text" name="First_Name" placeholder="First Name" value={this.state.ALT_Person_fname} onChange={e => this.setState({ ALT_Person_fname: e.target.value })} />
                                                    </div>
                                                    
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Last Name</label>
                                                        <input type="text" name="Last_Name" placeholder="Last Name" value={this.state.ALT_Person_lname} onChange={e => this.setState({ ALT_Person_lname: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Employee Id</label>
                                                        <input type="text" name="Employee_Id" placeholder="Employee Id" value={this.state.ALT_Person_empid} onChange={e => this.setState({ ALT_Person_empid: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Email Id</label>
                                                        <input type="text" name="Email_Id" placeholder="Email Id" value={this.state.ALT_Person_email} onChange={e => this.setState({ ALT_Person_email: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>

                                        <br />
                                        <div style={{ fontSize: 15, color: "black" }}> CEO</div>
                                        <hr />
                                        <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorceofirstname ? 'brown' : null }}>First Name</label>
                                                        <input style={{ borderColor: this.state.errorceofirstname ? 'brown' : null, backgroundColor: this.state.errorceofirstname? '#f3ece7' : null }} type="text" name="First_Name" placeholder="First Name" value={this.state.CEO_fname} onChange={e => this.setState({ CEO_fname: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorceofirstname}</span> : null}
                                                </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Last Name</label>
                                                        <input type="text" name="Last_Name" placeholder="Last Name" value={this.state.CEO_lname} onChange={e => this.setState({ CEO_lname: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Employee Id</label>
                                                        <input type="text" name="Employee_Id" placeholder="Employee Id" value={this.state.CEO_empid} onChange={e => this.setState({ CEO_empid: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorceoemailid ? 'brown' : null }}>Email Id</label>
                                                        <input style={{ borderColor: this.state.errorceoemailid? 'brown' : null, backgroundColor: this.state.errorceoemailid? '#f3ece7' : null }} type="text" name="Email_Id" placeholder="Email Id" value={this.state.CEO_email} onChange={e => this.setState({ CEO_email: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorceoemailid}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>

                                        <br />
                                        <div style={{ fontSize: 15, color: "black" }}>  CFO</div>
                                        <hr />
                                        <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorcfofirstname ? 'brown' : null }}>First Name</label>
                                                        <input style={{ borderColor: this.state.errorcfofirstname ? 'brown' : null, backgroundColor: this.state.errorcfofirstname? '#f3ece7' : null }} type="text" name="First_Name" placeholder="First Name" value={this.state.CFO_fname} onChange={e => this.setState({ CFO_fname: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorcfofirstname}</span> : null}
                                                </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label >Last Name</label>
                                                        <input type="text" name="Last_Name" placeholder="Last Name" value={this.state.CFO_lname} onChange={e => this.setState({ CFO_lname: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Employee Id</label>
                                                        <input type="text" name="Employee_Id" placeholder="Employee Id" value={this.state.CFO_empid} onChange={e => this.setState({ CFO_empid: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errorcfoemailid? 'brown' : null }}>Email Id</label>
                                                        <input style={{ borderColor: this.state.errorcfoemailid ? 'brown' : null, backgroundColor: this.state.errorcfoemailid ? '#f3ece7' : null }} type="text" name="Email_Id" placeholder="Email Id" value={this.state.CFO_email} onChange={e => this.setState({ CFO_email: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errorcfoemailid}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                        <br />

                                        <div style={{ fontSize: 15, color: "black" }}> General Information </div>
                                        <hr />
                                        <br />
                                        <div className="ui  stackable grid" title="Company">
                                            <div className=" row">

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Number of Employees</label>
                                                        <input type="text" name="Number_of_Employees" placeholder="Number of Employees" value={this.state.No_of_emp} onChange={e => this.setState({ No_of_emp: e.target.value })} />
                                                    </div>
                                                </div>

                                                <div className="five wide column">
                                                    <div className="field">
                                                        <label>Employee Turnover</label>
                                                        <input type="text" name="Employee_Turnover" placeholder="Employee Turnover" value={this.state.Emp_turnover} onChange={e => this.setState({ Emp_turnover: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" row">

                                                <div className="ten wide column">
                                                    <div className="field">
                                                        <label style={{ color: this.state.errortechnology ? 'brown' : null }}>Technology Used</label>
                                                        <textarea style={{ borderColor: this.state.errortechnology ? 'brown' : null, backgroundColor: this.state.errortechnology ? '#f3ece7' : null }} type="text" rows="3" name="Technology_Used" placeholder="Technology Used" value={this.state.Technology_Used} onChange={e => this.setState({ Technology_Used: e.target.value })} />
                                                    </div>
                                                    <div className="field">
                                                    {errorval ? <span id="errorspan">{this.state.errortechnology}</span> : null}
                                                </div>
                                                </div>
                                            </div>
                                            <div className="one wide computer one wide tablet one wide mobile column">
                                            </div>
                                            <div>
                                            </div>
                                        </div>
                                        <br />
                                        <div className="three row">
                                            <div className="ten wide column">
                                                <button className="ui primary button" type="submit" onClick={() => this.CRUD_operation()}>Save</button>
                                                <button className="ui  button" type="submit" onClick={() => this.OnClear()}>Clear</button>
                                                <button className="ui  button" type="submit" onClick={() => this.navigateToCorporateList()}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="one wide computer one wide tablet one wide mobile column">
                            </div>
                        </div>
                        <div className="one wide computer one wide tablet one wide mobile column">
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