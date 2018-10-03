import React, { Component } from 'react';
export default class CorpCandidateRegistration extends Component {
    constructor(props) {
        super(props)
        this.state = {
            FirstName: "",
            MiddleName: "",
            LastName: "",
            EmailId: "",
            IdProofType: "",
            IdProofNo: "",
            Experience: "",
            Country: "",
            Technology: "",

        }
    }

    render() {
        return (

            <div className="ui one column grid">

                <div className=" row">

                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>

                    <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                        <h1 id="title_header" className="ui left aligned header">Corp - Candidate Registration </h1>
                    </div>

                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>

                </div>

                <div className=" row">

                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>

                    <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">

                        <div className="ui segment" style={{ backgroundColor: '#f5f5f5', padding: '0em 0em' }}>

                            <div className="ui form">

                                <div className="ui  stackable grid">

                                    <div className=" row">

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>First Name</label>

                                                <input type="text" name="firstName" placeholder="First Name" value={this.state.FirstName} onChange={e => this.setState({ FirstName: e.target.value })} />

                                            </div>
                                        </div>

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Middle Name</label>

                                                <input type="text" name="middleName" placeholder="Middle Name" value={this.state.MiddleName} onChange={e => this.setState({ MiddleName: e.target.value })} />

                                            </div>
                                        </div>

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Last Name</label>

                                                <input type="text" name="lastName" placeholder="Last Name" value={this.state.LastName} onChange={e => this.setState({ LastName: e.target.value })} />

                                            </div>
                                        </div>
                                    </div>

                                    <div className=" row">


                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Email Id</label>
                                                <input type="text" name="emailID" placeholder="Email Id" value={this.state.EmailId} onChange={e => this.setState({ EmailId: e.target.value })} />

                                            </div>
                                        </div>

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Id Proof Type</label>

                                                <input type="text" name="idProofType" placeholder="Id Proof Type" value={this.state.IdProofType} onChange={e => this.setState({ IdProofType: e.target.value })} />

                                            </div>
                                        </div>

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Id Proof No</label>

                                                <input type="text" name="idProofNo" placeholder="Id Proof No" value={this.state.IdProofNo} onChange={e => this.setState({ IdProofNo: e.target.value })} />

                                            </div>
                                        </div>

                                    </div>

                                    <div className=" row">

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Experience</label>

                                                <input type="text" name="experience" placeholder="Experience" value={this.state.Experience} onChange={e => this.setState({ Experience: e.target.value })} />

                                            </div>
                                        </div>

                                        <div className="four wide column">
                                            <div className="field">
                                                <label>Country</label>

                                                <select value={this.state.Country} onChange={e => this.setState({ Country: e.target.value })}>
                                                    <option value="">Country</option>
                                                    <option value="India">India</option>
                                                    <option value="SouthAfrica">South Africa</option>
                                                    <option value="France">France</option>

                                                </select>
                                            </div>
                                        </div>


                                    </div>

                                    <div className=" row">

                                        <div className="eight wide column">
                                            <div className="field">

                                                <label>Technology</label>

                                                <textarea type="text" name="technology" placeholder="Technology" value={this.state.Technology} onChange={e => this.setState({ Technology: e.target.value })} />


                                            </div>
                                        </div>

                                    </div>

                                    <div className=" row">
                                        <div className="ten wide column">
                                            <button className="ui primary button" type="submit">Save</button>
                                            <button className="ui  button" type="submit">Clear</button>
                                            <button className="ui  button" type="submit">Cancel</button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="one wide computer one wide tablet one wide mobile column">
                    </div>
                </div>
                <div className="ui message">
                    <pre>
                        {JSON.stringify({
                            "FirstName": this.state.FirstName,
                            "MiddleName": this.state.MiddleName,
                            "LastName": this.state.LastName,
                            "EmailId": this.state.EmailId,
                            "IdProofType": this.state.IdProofType,
                            "IdProofNo": this.state.IdProofNo,
                            "Experience": this.state.Experience,
                            "Country": this.state.Country,
                            "Technology": this.state.Technology,


                        })}
                    </pre>
                </div>
            </div>

        )
    }
}