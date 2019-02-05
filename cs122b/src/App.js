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
import Cart from "./Cart/Cart";

class App extends Component {
    state = {cart: {}};
    handleAddToCart = (item) => {
        let crt = {...this.state.cart};
        crt[item] = 1;
        this.setState({cart: crt}, function(){
            console.log(this.state.cart);
        });
    };
    render() {
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <Menu inverted fluid widths={4}>
                            <Menu.Item
                                as={Link}
                                to={'/'}
                                name='top-charts'
                                header
                            >
                                Top Twenty
                            </Menu.Item>
                            <Menu.Item
                                as={Link}
                                to={'/search'}
                                name='search'
                                header
                            >
                                Search
                            </Menu.Item>
                            <Menu.Item
                                as={Link}
                                to={{
                                    pathname: '/browse',
                                    state: {genre: "", reload: "no"}
                                }}
                                name='browse'
                                header
                            >
                                Browse
                            </Menu.Item>
                            <Menu.Item
                                as={Link}
                                to={'/cart'}
                                name='cart'
                                header
                            >
                                Cart
                            </Menu.Item>
                        </Menu>
                        <Route path="/" exact render={(props) => <Movies {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/star" exact render={(props) => <Star {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/movie" exact render={(props) => <Film {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/search" exact render={(props) => <Search {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/browse" exact render={(props) => <Browse {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/cart" exact component={Cart}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
