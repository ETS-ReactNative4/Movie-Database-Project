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
import Cart, {isEmpty} from "./Cart/Cart";

class App extends Component {
    state = {cart: {}};
    handleAddToCart = (item) => {
        let crt = {...this.state.cart};
        if(item.id in crt){
            crt[item.id]["quantity"] += 1
        }
        else{
            crt[item.id] = item;
            crt[item.id]["quantity"] = 1;
        }
        this.setState({cart: crt}, function(){
            console.log(this.state.cart);
            localStorage.setItem("cart", JSON.stringify(this.state.cart));
        });
    };
    handleUpdateCart = (carty) => {
        this.setState({cart: carty});
    };
    componentDidMount(){
        let crt = JSON.parse(localStorage.getItem("cart"));
        if(!isEmpty(crt)){
            this.setState({cart: crt});
        }
    }
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
                                Checkout
                            </Menu.Item>
                        </Menu>
                        <Route path="/" exact render={(props) => <Movies {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/star" exact render={(props) => <Star {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/movie" exact render={(props) => <Film {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/login" exact component={Login}/>
                        <Route path="/search" exact render={(props) => <Search {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/browse" exact render={(props) => <Browse {...props} handleAddToCart={this.handleAddToCart}/>}/>
                        <Route path="/cart" exact render={(props) => <Cart {...props} handleUpdateCart={this.handleUpdateCart} handleAddToCart={this.handleAddToCart} cart={this.state.cart}/>}/>
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
