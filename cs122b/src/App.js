import React, { Component } from 'react';
import './App.css';
import {Route} from 'react-router-dom';
import {BrowserRouter} from "react-router-dom";
import {Menu, Header} from "semantic-ui-react";
import Movies from "./Movies/Movies.js";
import Star from "./Star/Star.js";
import Film from "./Film/Film.js";

class App extends Component {
    state = {};
    render(){
        const { activeItem } = this.state;
        return (
            <div >
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
                <Menu inverted fluid widths={1}>
                    <Menu.Item
                        name='top-charts'
                        active={activeItem==='topcharts'}
                        header
                    >
                        <a href="/">Top Twenty</a>
                    </Menu.Item>
                </Menu>
                <BrowserRouter>
                    <div>
                        <Route path="/" exact component={Movies}/>
                        <Route path="/star" exact component={Star}/>
                        <Route path="/movie" exact component={Film}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
