import React, {Component} from 'react';
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
import EmployeeLogin from "./Employee/EmployeeLogin";
import EmployeeDashboard from "./Employee/EmployeeDashboard";
import FullTextSearch from "./FullTextSearch/FullTextSearch";

class App extends Component {
  state = {cart: {}, customer: {}, employee: {}, is_employee: false};

  constructor() {
    super();
    this.getCust = this.getCust.bind(this);
    this.getEmp = this.getEmp.bind(this);
  }

  handleAddToCart = (item) => {
    let crt = {...this.state.cart};
    if (item.id in crt) {
      crt[item.id]["quantity"] += 1
    }
    else {
      crt[item.id] = item;
      crt[item.id]["quantity"] = 1;
    }
    this.setState({cart: crt}, function () {
      sessionStorage.setItem("cart", JSON.stringify(this.state.cart));
    });
  };
  handleUpdateCart = (carty) => {
    this.setState({cart: carty});
  };

  getEmp(emp) {
    this.setState({employee: emp, is_employee: true});
    sessionStorage.setItem("employee", JSON.stringify(emp));
  }

  getCust(cust) {
    this.setState({customer: cust});
    sessionStorage.setItem("customer", JSON.stringify(cust));
  }

  componentDidMount() {
    let crt = JSON.parse(sessionStorage.getItem("cart"));
    if (!isEmpty(crt)) {
      this.setState({cart: crt});
    }
    let cust = JSON.parse(sessionStorage.getItem("customer"));
    if (!isEmpty(cust)) {
      this.setState({customer: cust}, function () {
        console.log(this.state);
      });
    }
  }

  render() {
    return (
      <div>
        <BrowserRouter basename={'/cs122b'}>
        {/*<BrowserRouter>*/}
          <div>
            {this.state.is_employee ?
              <Menu inverted fluid widths={1}>
                <Menu.Item
                  as={Link}
                  to={'/emplogin'}
                  name='emplogin'
                  header
                >
                  Employee Login
                </Menu.Item>
              </Menu>
              :
              <Menu inverted fluid widths={6}>
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
                <Menu.Item
                  as={Link}
                  to={'/emplogin'}
                  name='emplogin'
                  header
                >
                  Employee Login
                </Menu.Item>
                <Menu.Item
                as={FullTextSearch}
                />
              </Menu>
            }
            <Route path="/" exact render={(props) => <Movies {...props} handleAddToCart={this.handleAddToCart}/>}/>
            <Route path="/star" exact render={(props) => <Star {...props} handleAddToCart={this.handleAddToCart}/>}/>
            <Route path="/movie" exact render={(props) => <Film {...props} handleAddToCart={this.handleAddToCart}/>}/>
            <Route path="/login" exact render={(props) => <Login {...props} getCust={this.getCust}/>}/>
            <Route path="/emplogin" exact render={(props) => <EmployeeLogin {...props} getCust={this.getEmp}
                                                                            employee={this.state.employee}/>}/>
            <Route path="/employee" exact render={(props) => <EmployeeDashboard {...props}/>}/>
            <Route path="/search" exact
                   render={(props) => <Search {...props} handleAddToCart={this.handleAddToCart}/>}/>
            <Route path="/browse" exact
                   render={(props) => <Browse {...props} handleAddToCart={this.handleAddToCart}/>}/>
            <Route path="/cart" exact render={(props) => <Cart {...props} handleUpdateCart={this.handleUpdateCart}
                                                               handleAddToCart={this.handleAddToCart}
                                                               customer={this.state.customer}
                                                               cart={this.state.cart}/>}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
