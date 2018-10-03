import React, { Component, } from 'react';
import { execGql } from "../apolloClient/apolloClient";
import StarRatingComponent from 'react-star-rating-component';
import { DLLQueries, CandidateRegQueries, CandidateDetailsQueries, searchCVSummaryQuery, fileUploadQuery, fileUpdateQuery } from '../Queries/queries'
var fileArr = [];
var DropdownList = [];
var errorval = false
export default class CandidateRegistration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            Json: [],
            rows: [{}],
            FirstName: "",
            MiddleName: "",
            LastName: "",
            EmailId: "",
            mobile: "",
            password: "",
            IdProofType: "",
            IdProofNo: "",
            Experience: "",
            Country: "",
            Technology: "",
            DropdownListArr: [],
            rating: '',
            showModal: 'none',
            tcode: 'CREATE',
            FirstNameerror: "",
            LastNameerror: "",
            EmailIderror: "",
            mobileerror: "",
            passworderror: "",
            IdProofTypeerror: "",
            IdProofNoerror: "",
            Experienceerror: "",
            Technologyerror: "",
            FileUploadError: "",
            documentid: '',
            candidateid: '',
            showFileProcessing: false


        }
        this.handleChange = this.handleChange.bind(this);
    }


    async  componentDidMount() {
        this.Dropdown();
        if (this.props.location.state) {
            await this.setState({ candidateid: this.props.location.state.data })


            this.populateData()

        }
    }

    async populateData() {
        this.setState({ showModal: 'flex' })
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', CandidateDetailsQueries, this.setDeatilsParams())
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
            var i = 0;
            const rows = [...this.state.rows];
            for (let key in result.data.searchCandidates[0].ratings) {
                rows[i++] = {
                    ratingid: result.data.searchCandidates[0].ratings[key].ratingid,
                    technology: result.data.searchCandidates[0].ratings[key].technology,
                    rating: result.data.searchCandidates[0].ratings[key].rating
                };
            }
            this.setState({
                FirstName: result.data.searchCandidates[0].firstname,
                MiddleName: result.data.searchCandidates[0].middlename,
                LastName: result.data.searchCandidates[0].lastname,
                EmailId: result.data.searchCandidates[0].emailid,
                mobile: result.data.searchCandidates[0].mobileno,
                IdProofType: result.data.searchCandidates[0].idprooftype,
                IdProofNo: result.data.searchCandidates[0].idproofno,
                Experience: result.data.searchCandidates[0].experience,
                Country: result.data.searchCandidates[0].country,
                Technology: result.data.searchCandidates[0].technology,
                documentid: result.data.searchCandidates[0].document[0].documentid,
                rows: rows,
                tcode: "UPDATE",
                showModal: 'none'
            })
        }
    }

    setDeatilsParams() {
        var parameters = {
            "clnt": "1002",
            "lang": "EN",
            "candidateid": this.props.location.state.data,
            "exactMatch": true
        }
        return parameters
    }

    async Dropdown() {
        var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', DLLQueries, this.setDropdownParams())
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
            DropdownList = []
            DropdownList.push({
                "COUNTRY": result.data.COUNTRY,
                "IDPROOF": result.data.IDPROOF,
            })
            this.setState({ DropdownListArr: DropdownList })
        }
    }

    setDropdownParams() {
        var parameters = {
            "CLNT": "1002",
            "LANG": "EN"
        }
        return parameters
    };

    async  onStarClick(nextValue, prevValue, name) {
        // console.log(name)
        await this.setState({ rating: nextValue });
        // console.log(this.state.rating);

        const rows = [...this.state.rows];
        var technologyValue = this.state.rows[name].technology;
        var ratingId = this.state.rows[name].ratingid;
        var ratingValue = this.state.rating;
        rows[name] = {
            ratingid: ratingId,
            technology: technologyValue,
            rating: ratingValue

        };
        await this.setState({
            rows
        });
        console.log(this.state.rows)
    }

    async handleChange(idx, e) {
        const { name, value } = e.target;
        const rows = [...this.state.rows];
        var cname = "";
        cname = name;
        var ratingId = this.state.rows[idx].ratingid;
        var technologyValue = this.state.rows[idx].technology;
        var ratingValue = this.state.rows[idx].rating;
        if (typeof ratingValue == 'undefined') {
            ratingValue = 0;
        }

        if (cname == "technology") {
            technologyValue = value;
        }
        else if (cname == "rating") {
            ratingValue = value;
        } else if (cname == "ratingid") {
            ratingId = this.state.rows[idx].ratingid;
        }

        rows[idx] = {
            ratingid: ratingId,
            technology: technologyValue,
            rating: ratingValue,

        };
        await this.setState({
            rows
        });
        console.log(this.state.rows)
    }

    handleAddRow = () => {

        this.setState({ rows: [...this.state.rows, ''] });

    };

    async handleRemoveRow(idx) {
        //this.setState({ rows: this.state.rows.filter((s, sidx) => idx !== sidx) });
        let rows = [...this.state.rows];
        rows.splice(idx, 1);
        await this.setState({ rows });
        console.log(this.state.rows);
    };



    clearState() {
        this.setState({
            FirstName: "",
            MiddleName: "",
            LastName: "",
            EmailId: "",
            mobile: "",
            password: "",
            IdProofType: "",
            IdProofNo: "",
            Experience: "",
            Country: "",
            Technology: "",
            rows: [{}],
            FirstNameerror: "",
            LastNameerror: "",
            EmailIderror: "",
            mobileerror: "",
            passworderror: "",
            IdProofTypeerror: "",
            IdProofNoerror: "",
            Experienceerror: "",
            Technologyerror: "",
            FileUploadError: ""
        });
        fileArr = []
    }

    // async CreateCandidate() {
    //     this.setState({ showModal: 'flex' })
    //     try {
    //         const formData = new FormData();
    //         const url = 'http://localhost:5000/hrai';

    //         formData.append('query', CandidateRegQueries);
    //         formData.append('variables', JSON.stringify(this.setCreateParams() || {}));

    //         for (let i = 0; i < fileArr.length; i++) {
    //             formData.append(`file${i}`, fileArr[i])
    //         }

    //         let response = await fetch(url, {
    //             method: 'POST',
    //             headers: { Accept: '*/*' },
    //             body: formData
    //         }).then(res => res.json())
    //             .then(res => {
    //                 if (typeof res.errors == 'undefined') {
    //                     console.log(res)
    //                     this.clearState();
    //                     this.navigateToList();
    //                 } else {
    //                     this.setState({ showModal: 'none' })
    //                     var error = ''
    //                     for (let key in res.errors) {
    //                         error = res.errors[key].message
    //                         error = JSON.parse(error);
    //                         console.log(error)
    //                         errorval = true
    //                         this.setState({
    //                             FirstNameerror: error[0].errorfirstname,
    //                             LastNameerror: error[0].errorlastname,
    //                             EmailIderror: error[0].erroremailid,
    //                             mobileerror: error[0].errormobileno,
    //                             passworderror: error[0].errorpassword,
    //                             IdProofTypeerror: error[0].erroridprooftype,
    //                             IdProofNoerror: error[0].erroridproofno,
    //                             Experienceerror: error[0].errorexperience,
    //                             Technologyerror: error[0].errortechnology,
    //                         });
    //                     }

    //                 }
    //             }
    //             )


    //     } catch (err) {
    //     }

    // }


    async CreateCandidate() {
        if (!this.state.candidateid) {
            this.setState({ FileUploadError: "Please Select a file." })

        }
        else {
            var result = '', errorMessage = '', errors = [];
            try {
                console.log(this.setCreateParams());

                result = await execGql('mutation', CandidateRegQueries, this.setCreateParams())

            }
            catch (err) {
                errors = err.errorsGql;
                errorMessage = err.errorMessageGql;
            }

            if (!result) {
                //  console.log(errors);
                //  console.log(errorMessage);
                for (let key in errors) {
                    errorval = true
                    errorMessage = JSON.parse(errorMessage);

                    this.setState({
                        FirstNameerror: errorMessage[0].errorfirstname,
                        LastNameerror: errorMessage[0].errorlastname,
                        EmailIderror: errorMessage[0].erroremailid,
                        mobileerror: errorMessage[0].errormobileno,
                        passworderror: errorMessage[0].errorpassword,
                        IdProofTypeerror: errorMessage[0].erroridprooftype,
                        IdProofNoerror: errorMessage[0].erroridproofno,
                        Experienceerror: errorMessage[0].errorexperience,
                        Technologyerror: errorMessage[0].errortechnology,
                    });
                }
            }
            else {
                console.log(result);
                this.clearState();
                this.navigateToList();

            }
        }
    }


    // ------------function to navigate to list---------------
    navigateToList() {
        return this.props.history.push('/Dashboard/Candidate')
    };


    setCreateParams() {

        if (this.state.tcode == 'CREATE') {
            var parameters = {
                "transaction": "CREATE",
                "candidates": [
                    {
                        "client": "1002",
                        "lang": "EN",
                        "firstname": this.state.FirstName,
                        "middlename": this.state.MiddleName,
                        "lastname": this.state.LastName,
                        "emailid": this.state.EmailId,
                        "mobileno": this.state.mobile,
                        "password": this.state.password,
                        "idprooftype": this.state.IdProofType,
                        "idproofno": this.state.IdProofNo,
                        "experience": this.state.Experience,
                        "country": this.state.Country,
                        "technology": this.state.Technology,
                        "ratings": this.state.rows,
                        "candidateid": this.state.candidateid
                    }
                ]
            }
        } else if (this.state.tcode == 'UPDATE') {
            var parameters = {
                "transaction": "UPDATE",
                "candidates": [
                    {
                        "client": "1002",
                        "lang": "EN",
                        "candidateid": this.state.candidateid,
                        "firstname": this.state.FirstName,
                        "middlename": this.state.MiddleName,
                        "lastname": this.state.LastName,
                        "emailid": this.state.EmailId,
                        "mobileno": this.state.mobile,
                        "password": this.state.password,
                        "idprooftype": this.state.IdProofType,
                        "idproofno": this.state.IdProofNo,
                        "experience": this.state.Experience,
                        "country": this.state.Country,
                        "technology": this.state.Technology,
                        "ratings": this.state.rows,

                    }
                ]
            }
        }

        return parameters
    };

    //------------file type checking before uploading file-------------
    checkFileType(event) {
        fileArr = []
        var file = event.target.files[0]

        if (!(file == undefined)) {
            if (file.type == "application/pdf" ||
                file.type == "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                file.type == "application/msword" ||
                file.type == "text/plain") {
                this.setState({ FileUploadError: "" })
                fileArr.push(file)
                console.log(fileArr)
            }
            else {
                this.setState({ FileUploadError: "Please upload file with extension .doc,.docx,.pdf,.txt only." })
            }
        }
        else {
            this.setState({ FileUploadError: "Please Select a file." })

        }
    }


    //---------search CV summary----------------
    async  searchCVSummary(documentid) {

         var result = '', errorMessage = '', errors = [];
        try {
            result = await execGql('query', searchCVSummaryQuery, this.setSearchCVSummaryParams(documentid))
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

            var newArr = (result.data.searchCVSummary.filter(function (v, n) { return v.category == "Technology"; }))
            const rows = [];
            var tech = ''

            for (let key in newArr) {
                rows[key] = {
                    technology: newArr[key].inference,
                    rating: 0
                };

                if (key == newArr.length - 1)
                    tech = tech + newArr[key].inference

                else
                    tech = tech + newArr[key].inference + ','

            }
            await this.setState({ rows, Technology: tech, showFileProcessing: false })

        }
    }

    //---------set variables for searchCVsummary Query----------------
    setSearchCVSummaryParams(documentid) {
        var parameterValue = {
            "client": "1002",
            "lang": "EN",
            "cvid": documentid
        }
        return parameterValue;
    }

    //---------function for file upload----------------
    uploadfile = () => {
        if (fileArr.length == 0) {
            this.setState({ FileUploadError: "Please Select a file." })
        }
        else {
            this.setState({ showFileProcessing: true })
            const url = 'http://localhost:5000/hrai';
            const formData = new FormData();

            if (this.state.tcode == "CREATE") {
                formData.append('query', fileUploadQuery);
                formData.append('variables', JSON.stringify(this.setFileUploadParams() || {}));
            }
            else if (this.state.tcode == "UPDATE") {
                formData.append('query', fileUpdateQuery);
                formData.append('variables', JSON.stringify(this.setFileUpdateParams() || {}));
            }

            for (let i = 0; i < fileArr.length; i++) {
                formData.append(`file${i}`, fileArr[i])
            }

            let response = fetch(url, {
                method: 'POST',
                headers: { Accept: '*/*' },
                body: formData
            }).then(res => res.json())
                .then(res => {
                  
                    if (this.state.tcode == "CREATE") {
                       
                        this.processCV(res.data.uploadDocuments[0].documentid)
                        this.setState({
                            documentid: res.data.uploadDocuments[0].documentid,
                            candidateid: res.data.uploadDocuments[0].candidateid,
                            FileUploadError: ""
                        })
                    }
                    else if (this.state.tcode == "UPDATE") {
                        
                        this.processCV(res.data.updateDocuments[0].documentid)
                        this.setState({
                            documentid: res.data.updateDocuments[0].documentid,
                            candidateid: res.data.updateDocuments[0].candidateid,
                            FileUploadError: ""
                        })
                    }
                })
        }
    }
    //---------set variables for file upload Query----------------
    setFileUploadParams() {
        var parameterValue = {
            "client": "1002",
            "lang": "EN"

        }
        return parameterValue;
    }

    //---------set variables for file update Query----------------
    setFileUpdateParams() {
        var parameterValue = {
            "client": "1002",
            "lang": "EN",
            "candidateid": this.state.candidateid

        }
        return parameterValue;
    }



    //.............function for CV processing..............
    async  processCV(DocID) {

        var documentid = DocID
        var executionid = this.generateProcessId()
        const data = new FormData();

        data.append('raw_text', documentid);
        data.append('client', "1002");
        data.append('lang', "EN");
        data.append('cvid', documentid);
        data.append('executionid', documentid);

        //---------request python server to process CV----------------
        let response = await fetch('http://localhost:8001/processresume',
            {
                method: 'POST',
                // headers: { Accept: '*/*' },
                body: data
            }).then(res => {
                res.body.getReader().read().then(chunk => {
                    var string = new TextDecoder("utf-8").decode(chunk.value);
                    console.log(string)
                var jsonStr=  JSON.parse(JSON.stringify(string))
               console.log(typeof jsonStr);
               
                      this.searchCVSummary(documentid)

                    this.showCVProcessMsg()
                })
            })
    }

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

    //---------shows popup after CV processing----------------
    showCVProcessMsg() {
        var x = document.getElementById("snackbar");
        x.className = "show";
        setTimeout(function () { x.className = x.className.replace("show", ""); }, 3000);
    }
    render() {
        return (
            <div className="ui one column grid">
                <div className=" row">
                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>
                    <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                        <h1 id="title_header">Corp - Candidate Registration</h1>
                    </div>
                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>
                </div>
                <div className=" row">
                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>
                    <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                        <div id="#cus_segment" className="ui segment" style={{ backgroundColor: '#f5f5f5' }}>
                            <div className="ui form">
                                <div className="ui  stackable grid">

                                    <div className="row" >

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.FileUploadError ? 'brown' : null }}>Upload CV</label>
                                                <input type="file" name="uploadcv" placeholder="" onChange={(e) => this.checkFileType(e)}
                                                    style={{ borderColor: this.state.FileUploadError ? 'brown' : null, backgroundColor: this.state.FileUploadError ? '#f3ece7' : null }} />
                                            </div>
                                            <div className="field">
                                                <span id="errorspan">{this.state.FileUploadError}</span>
                                            </div>
                                        </div>

                                        <div className="five wide column" style={{ marginTop: 15 }}>
                                            <button className="ui primary button" type="submit" onClick={() => this.uploadfile()} style={{ float: 'left' }}> Upload  </button>
                                           
                                               {/* this component is shown while file uploading and processing  */}
                                           {this.state.showFileProcessing? <div>
                                                <div class="ui mini active  centered inline loader" style={{ paddingLeft: 20, paddingRight: 20, float: 'left' }}>
                                                </div><div style={{ marginTop: 10 }}>Processing...</div>
                                            </div>:null}

                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label>Doc ID</label>
                                                <input type="text" name="docID" placeholder="Doc ID" value={this.state.documentid} disabled />
                                            </div>
                                        </div>


                                    </div>

                                    <div className=" row">

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.FirstNameerror ? 'brown' : null }}>First Name</label>
                                                <input style={{ borderColor: this.state.FirstNameerror ? 'brown' : null, backgroundColor: this.state.FirstNameerror ? '#f3ece7' : null }} type="text" name="firstName" placeholder="First Name" value={this.state.FirstName} onChange={e => this.setState({ FirstName: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.FirstNameerror}</span> : null}
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label>Middle Name</label>
                                                <input type="text" name="middleName" placeholder="Middle Name" value={this.state.MiddleName} onChange={e => this.setState({ MiddleName: e.target.value })} />
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.LastNameerror ? 'brown' : null }}>Last Name</label>
                                                <input style={{ borderColor: this.state.LastNameerror ? 'brown' : null, backgroundColor: this.state.LastNameerror ? '#f3ece7' : null }} type="text" name="lastName" placeholder="Last Name" value={this.state.LastName} onChange={e => this.setState({ LastName: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.LastNameerror}</span> : null}
                                            </div>
                                        </div>
                                    </div>

                                    <div className=" row">

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.Experienceerror ? 'brown' : null }}>Email Id</label>
                                                <input style={{ borderColor: this.state.EmailIderror ? 'brown' : null, backgroundColor: this.state.EmailIderror ? '#f3ece7' : null }} type="text" name="emailID" placeholder="Email Id" value={this.state.EmailId} onChange={e => this.setState({ EmailId: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.EmailIderror}</span> : null}
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.mobileerror ? 'brown' : null }}>Mobile</label>
                                                <input style={{ borderColor: this.state.mobileerror ? 'brown' : null, backgroundColor: this.state.mobileerror ? '#f3ece7' : null }} type="text" name="mobile" placeholder="Mobile" value={this.state.mobile} onChange={e => this.setState({ mobile: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.mobileerror}</span> : null}
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.passworderror ? 'brown' : null }}>Password</label>
                                                <input style={{ borderColor: this.state.passworderror ? 'brown' : null, backgroundColor: this.state.passworderror ? '#f3ece7' : null }} type="password" name="password" placeholder="Password" value={this.state.password} onChange={e => this.setState({ password: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.passworderror}</span> : null}
                                            </div>
                                        </div>

                                    </div>

                                    <div className=" row">

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.Experienceerror ? 'brown' : null }}>Experience</label>
                                                <input style={{ borderColor: this.state.Experienceerror ? 'brown' : null, backgroundColor: this.state.Experienceerror ? '#f3ece7' : null }} type="text" name="experience" placeholder="Experience" value={this.state.Experience} onChange={e => this.setState({ Experience: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.Experienceerror}</span> : null}
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label>Country</label>
                                                <select value={this.state.Country} onChange={e => this.setState({ Country: e.target.value })}>
                                                    <option value="">Select</option>
                                                    {this.state.DropdownListArr.map((data) => data.COUNTRY.map((data, index) => <option key={index} value={data.code}>{data.desc}</option>))}
                                                </select>
                                            </div>
                                        </div>



                                    </div>


                                    <div className=" row">
                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.IdProofTypeerror ? 'brown' : null }}>Id Proof Type</label>
                                                <select style={{ borderColor: this.state.IdProofTypeerror ? 'brown' : null, backgroundColor: this.state.IdProofTypeerror ? '#f3ece7' : null }} value={this.state.IdProofType} onChange={e => this.setState({ IdProofType: e.target.value })}>
                                                    <option value="">Select</option>
                                                    {this.state.DropdownListArr.map((data) => data.IDPROOF.map((data, index) => <option key={index} value={data.code}>{data.desc}</option>))}
                                                </select>
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.IdProofTypeerror}</span> : null}
                                            </div>
                                        </div>

                                        <div className="five wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.IdProofNoerror ? 'brown' : null }}>Id Proof No</label>
                                                <input style={{ borderColor: this.state.IdProofNoerror ? 'brown' : null, backgroundColor: this.state.IdProofNoerror ? '#f3ece7' : null }} type="text" name="idProofNo" placeholder="Id Proof No" value={this.state.IdProofNo} onChange={e => this.setState({ IdProofNo: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.IdProofNoerror}</span> : null}
                                            </div>
                                        </div>


                                    </div>

                                    <div className=" row">
                                        <div className="ten wide column">
                                            <div className="field">
                                                <label style={{ color: this.state.Technologyerror ? 'brown' : null }}>Technology</label>
                                                <textarea style={{ borderColor: this.state.Technologyerror ? 'brown' : null, backgroundColor: this.state.Technologyerror ? '#f3ece7' : null }} type="text" rows='3' name="technology" value={this.state.Technology} onChange={e => this.setState({ Technology: e.target.value })} />
                                            </div>
                                            <div className="field">
                                                {errorval ? <span id="errorspan">{this.state.Technologyerror}</span> : null}
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" row">
                                        <div className="ten wide column">
                                            <div className="field">
                                                <label>Self Rating</label>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="four row">
                                        <div className="one wide column">
                                            <div className="field">
                                                <h4 style={{ textAlign: "center", borderRadius: 2 }}>Action</h4>
                                            </div>
                                        </div>
                                        <div className="five wide column" style={{ marginLeft: 55 }}>
                                            <div className="field">
                                                <h4 style={{ textAlign: "center", borderRadius: 2 }}>Technology/Language/Module</h4>
                                            </div>
                                        </div>

                                        <div className="four wide column" >
                                            <div className="field">
                                                <h4 style={{ textAlign: "center", borderRadius: 2 }}>Rating</h4>
                                            </div>
                                        </div>

                                        <div className="six row">
                                            <div className="ten wide column">
                                                <div className="field" style={{ textAlign: "-webkit-right", paddingRight: "20px" }}>
                                                    <div className="ui icon" id="addRating" style={{ backgroundColor: "#c4d3d3", height: 35, width: 55, textAlign: "center", borderRadius: 2 }} onClick={this.handleAddRow}>
                                                        <i className="plus icon" style={{ marginTop: 8 }}></i>
                                                        <label>Add</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {this.state.rows.map((item, idx) => (
                                        <div className="five row" id="addr0" key={idx} >
                                            <div className="one wide column">
                                                <div className="field">
                                                    <div className="ui icon" style={{ backgroundColor: "#f76060", color: "white", height: 35, width: 40, textAlign: "center", borderRadius: 2 }} onClick={() => this.handleRemoveRow(idx)}>
                                                        <i className="trash alternate icon" style={{ marginTop: 8 }}></i>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="seven wide column">
                                                <div className="field">
                                                    <input type="text" name="technology" placeholder="Technology/Language/Module" value={this.state.rows[idx].technology} onChange={(e) => this.handleChange(idx, e)} />
                                                </div>
                                            </div>

                                            <div className="three wide column">
                                                <div className="field">
                                                    <StarRatingComponent className="ui massive star rating" name={`${idx}`} starCount={5} value={this.state.rows[idx].rating} onStarClick={this.onStarClick.bind(this)} />
                                                    {/* <div name="rating"  className="ui star rating"  data-max-rating="5" ></div> */}

                                                    {/* <input type="text" name="rating" placeholder="Rating" value={this.state.rows[idx].rating} onChange={this.handleChange(idx)} /> */}
                                                </div>
                                            </div>

                                        </div>

                                    ))}




                                    <div className=" row">
                                        <div className="ten wide column">
                                            <button className="ui primary button" type="submit" onClick={() => this.CreateCandidate()}>Save</button>
                                            <button className="ui  button" type="submit" onClick={() => this.clearState()}>Clear</button>
                                            <button className="ui  button" type="submit" onClick={() => this.navigateToList()}>Cancel</button>
                                        </div>
                                    </div>

                                    {/*--------------- component for displaying result after processing CV START-----------------*/}

                                    {/*--------------- component for displaying result after processing CV END-----------------*/}

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>
                </div>
                {/* -- The Modal -- */}
                <div className="modal" style={{ display: this.state.showModal }} >
                    <div className="modal-content">
                        <div class="ui active inverted dimmer">
                            <div class="ui text loader"></div>
                        </div>
                    </div>
                </div>


                {/* -- popup after processing cv-- */}
                <div id="snackbar">  <i className="info circle icon"></i> CV processed successfully..</div>

            </div>
        );
    }
}