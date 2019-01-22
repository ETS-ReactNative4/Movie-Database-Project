import React, { Component } from 'react';
import { Fetch } from 'react-request';
import './App.css';
import {Route} from 'react-router-dom';
import {BrowserRouter} from "react-router-dom";
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Movies from "./Movies/Movies.js";
import Star from "./Star/Star.js";
import Film from "./Film/Film.js";

const styles = {
    card: {
        minWidth: 300,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};

class App extends Component {
    render(){
        return (
            <div>
                <header>
                    <nav>
                        <ul>
                            <li><a href="/">Top Twenty</a></li>
                        </ul>
                    </nav>
                </header>
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
