import React, { Component } from 'react';
import CorporateList from './Corporate_List'
import { Link} from "react-router-dom";
export default class Corporate_Main extends Component {
    render() {
        return (
            <div>
                <div className="ui one column grid">
                    <div className="three column row">
                        <div className="one wide computer one wide tablet one wide mobile column">
                        </div>
                        <div className="fourteen wide computer fourteen wide tablet fourteen wide mobile column">
                            <h1 id="title_header"> Corporate List</h1>

                            <div className="icode"id="title_header">
                           
                                <Link to={'/Dashboard/Corporate_main/Corporate_Add'} style={{ color: '#151515' }}>  <i id="iconbar" className="plus icon"></i></Link>
                                <i id="iconbar"  className="arrow down icon"></i>
                                <i id="iconbar" className="search icon"></i>
                                
                            </div>

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
                                    <CorporateList />

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
}