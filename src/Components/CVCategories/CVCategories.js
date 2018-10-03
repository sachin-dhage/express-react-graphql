import React from 'react';
import { execGql } from '../apolloClient/apolloClient';
import { CVCategoryCRUDOps} from '../Queries/queries'
export default class CVCategories extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Category: "",
            Attribute: "",
            Inference: "",
            Dispalycomp: true,
            tcode: "CREATE"
        };
    };

    // TO Create CV Category
    async CreateCVCategory() {
        var result = '', errorMessage = '';
        try {
            result = await execGql('mutation', CVCategoryCRUDOps, this.setCreateParams())
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
            this.navigateToCVCategoryList()
            this.OnClear()

        }

    };


    setCreateParams() {
        var parameters = {
            "transaction": "CREATE",
            "CVCategory": [
                {
                    "client": "1002",
                    "lang": "EN",
                    "category": this.state.Category,
                    "attribute": this.state.Attribute,
                    "inference": this.state.Inference

                }
            ]
        }
        return parameters

    };


    // Navigate to CV Category Lis
    navigateToCVCategoryList() {
        return this.props.history.push('/Dashboard/CVCategory')
    };


    // To Clear Field

    OnClear() {
        this.setState({
            Category: "",
            Attribute: "",
            Inference: ""
        })
    }

    render() {
        return (
            <div>
                <div className="ui one column grid">
                    <div className=" row">
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                        <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                            <h1 id="title_header" >CV Category</h1>
                        </div>
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                    </div>
                    <div className=" row">
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                        <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                            <div className="ui segment ">
                                <div className="ui form">
                                    <div className="ui stackable grid">
                                        <div className=" row">
                                            <div className="five wide column">
                                                <div className="field">
                                                    <label >Category</label>
                                                    <div className="ui input">
                                                        <input type="text" name="Category" placeholder="Category" value={this.state.Category} onChange={(e) => this.setState({ Category: e.target.value })} />
                                                    </div>
                                                </div>

                                            </div>
                                            <div className=" five wide column">
                                                <div className="field">
                                                    <label>Attribute</label>
                                                    <div className="ui input">
                                                        <input type="text" name="Attribute" placeholder="Attribute" value={this.state.Attribute} onChange={(e) => this.setState({ Attribute: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className=" five wide column">
                                                <div className="field">
                                                    <label>Inference</label>
                                                    <div className="ui input">
                                                        <input type="text" name="Inference" placeholder="Inference" value={this.state.Inference} onChange={(e) => this.setState({ Inference: e.target.value })} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className=" row">
                                            <div className="ten wide column">
                                                <button className="ui primary button" type="submit" onClick={() => this.CreateCVCategory()}>Save</button>
                                                <button className="ui button" type="submit" onClick={()=>this.OnClear()} >Clear</button>
                                                <button className="ui button" type="submit" onClick={() => this.navigateToCVCategoryList()} >Cancel</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                        {<div className="ui message">
                            <pre>
                                {JSON.stringify({
                                    "Category": this.state.Category,
                                    "Attribute": this.state.Attribute,
                                    "Inference": this.state.Inference,
                                })}
                            </pre>
                        </div>}
                    </div>

                </div>

            </div>
        );  
    }


}