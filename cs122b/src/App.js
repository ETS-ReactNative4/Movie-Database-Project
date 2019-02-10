import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Link, Route} from 'react-router-dom';
import {Menu} from "semantic-ui-react";
import Movies from "./Movies/Movies.js";
import Star from "./Star/Star.js";
import Film from "./Film/Film.js";
import Login from "./Login/Login.js";
import 'semantic-ui-css/semantic.min.css';
import Search from "./Search/Search";
import Browse from "./Browse/Browse";
import {loadReCaptcha} from 'react-recaptcha-google';

class App extends Component {
  state = {};
  handleMenuClick = (e, {name}) => this.setState({activeItem: name});
  componentDidMount() {
    loadReCaptcha();
  }

  render() {
    const {activeItem} = this.state;
    return (
      <div>
        <BrowserRouter>
          <div>
            <Menu inverted fluid widths={3}>
              <Menu.Item
                as={Link}
                to={'/'}
                name='top-charts'
                active={activeItem === 'top-charts'}
                header
                onClick={this.handleMenuClick}
              >
                Top Twenty
              </Menu.Item>
              <Menu.Item
                as={Link}
                to={'/search'}
                name='search'
                active={activeItem === 'search'}
                header
                onClick={this.handleMenuClick}
              >
                Search
              </Menu.Item>
              <Menu.Item
                as={Link}
                to={'/browse'}
                name='browse'
                active={activeItem === 'browse'}
                header
                onClick={this.handleMenuClick}
              >
                Browse
              </Menu.Item>
            </Menu>
            <Route path="/" exact component={Movies}/>
            <Route path="/star" exact component={Star}/>
            <Route path="/movie" exact component={Film}/>
            <Route path="/login" exact component={Login}/>
            <Route path="/search" exact component={Search}/>
            <Route path="/browse" exact component={Browse}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
