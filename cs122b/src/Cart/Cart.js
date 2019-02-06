import React, {Component} from 'react';
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";
import {Button, Container, Form, Header, Icon, Input, Modal, Segment} from "semantic-ui-react";

function isEmpty(obj) {
    for (var prop in obj) {
        return false;
    }
    return true;
}

function EmptyCart() {
    return (
        <Container>
            <Header as={'h1'} icon textAlign={'center'}>
                <Icon name={'shopping cart'} circular/>
                <Header.Content>Cart Empty</Header.Content>
            </Header>
        </Container>
    );
}
function OrderNums(props){
    const list = Object.keys(props.list).map((key) =>
        <Segment key={key}>
            {
                props.list[key]
            }
        </Segment>
    );
    return(
        <Segment.Group>
            {
                list
            }
        </Segment.Group>
    );
}
function Orders(props) {
    const items = Object.keys(props.res).map((key) =>
        <Segment key={key}>
            <Header as={'h1'}>
                {props.movies[key].title}
            </Header>
            <OrderNums list={props.res[key]}/>
        </Segment>
    );
    return (
        <Container>
            {items}
        </Container>
    );
}

class Cart extends Component {
    state = {
        valid: false,
        mounted: false,
        carty: {},
        customer: {},
        formData: {
            firstName: '',
            lastName: '',
            email: '',
            address: '',
            ccId: '',
            expiration: ''
        },
        error: {
            firstName: false,
            lastName: false,
            email: false,
            address: false,
            ccId: false,
            expiration: false,
        },
        transaction: false,
        disabled: true,
        res: {}
    };

    constructor() {
        super();
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    componentDidMount() {
        this.setState({carty: this.props.cart}, function () {
            if (isEmpty(this.state.carty)) {
                let crt = JSON.parse(sessionStorage.getItem("cart"));
                if (!isEmpty(crt)) {
                    this.setState({carty: crt})
                }
            }
        });
        this.setState({customer: this.props.customer}, function () {
            let cust = JSON.parse(sessionStorage.getItem("customer"));
            if (!isEmpty(cust)) {
                this.setState({customer: cust}, function () {
                    let form = {...this.state.formData};
                    form["firstName"] = this.state.customer.firstName;
                    form["lastName"] = this.state.customer.lastName;
                    form["email"] = this.state.customer.email;
                    form["address"] = this.state.customer.address;
                    this.setState({formData: form});
                });
            }
            else{
                let form = {...this.state.formData};
                form["firstName"] = this.state.customer.firstName;
                form["lastName"] = this.state.customer.lastName;
                form["email"] = this.state.customer.email;
                form["address"] = this.state.customer.address;
                this.setState({formData: form});
            }
        });
        fetch('http://' + window.location.hostname + ':8080/cs122b/login', {
            method: 'GET',
            credentials: 'include'
        }).then(
            (res) => {
                if (res.status === 403) {
                }
                else {
                    this.setState({valid: true});
                }
                this.setState({mounted: true});
            }
        ).catch((error) =>
            console.log(error)
        )
    }

    handleAdd = (item) => {
        let crt = {...this.state.carty};
        crt[item.id]["quantity"] += 1;
        this.setState({carty: crt}, function () {
            this.props.handleUpdateCart(this.state.carty);
            console.log(this.state.carty);
            sessionStorage.setItem("cart", JSON.stringify(this.state.carty));
        });
    };
    handleMinus = (item) => {
        let crt = {...this.state.carty};
        crt[item.id]["quantity"] -= 1;
        if (crt[item.id]["quantity"] <= 0) {
            delete crt[item.id];
        }
        this.setState({carty: crt}, function () {
            this.props.handleUpdateCart(this.state.carty);
            console.log(this.state.carty);
            sessionStorage.setItem("cart", JSON.stringify(this.state.carty));
        });
    };

    componentWillUnmount() {
        this.setState({mounted: false});
    }

    handleInputChange(e) {
        let formData = Object.assign({}, this.state.formData);
        formData[e.target.name] = e.target.value;
        let n = e.target.name;
        let v = e.target.value;
        this.setState({formData}, function () {
            let e = {...this.state.error};
            e[n] = this.state.customer[n] !== v;
            this.setState({error: e}, function(){
                let form = this.state.formData;
                let cust = this.state.customer;
                let correct = Object.keys(form).every(function(key) {
                    return form[key] === cust[key];
                });
                correct = !correct;
                this.setState({disabled: correct})
            });
        });
    }

    handleCheckout = event => {
        let form = this.state.formData;
        let cust = this.state.customer;
        let correct = Object.keys(form).every(function(key) {
            return form[key] === cust[key];
        });
        if (correct) {
            let crt = {...this.state.carty};
            crt['customerId'] = this.state.customer["id"];
            fetch('http://' + window.location.hostname + ':8080/cs122b/sale', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(crt)
            }).then((res) => res.json())
                .then(
                    data => {
                        this.setState({res: data, transaction: true});
                        console.log(data);
                    }
                ).catch((error) => console.log(error))
        }
        else{
            console.log(form);
            console.log(cust);
        }
    };

    render() {
        if (this.state.mounted && this.state.valid) {
            try {
                if (!isEmpty(this.state.carty)) {
                    const items = Object.keys(this.state.carty).map((item) =>
                        <Segment key={item} padded={'very'}>
                            <Header as={'h1'}>
                                {this.state.carty[item].title}
                            </Header>
                            <Container>
                                <p>
                                    Year: {this.state.carty[item].year}<br/>
                                    Director: {this.state.carty[item].director}<br/>
                                    Rating: {this.state.carty[item].rating}<br/>
                                </p>
                            </Container>
                            <br/>
                            <Container>
                                <Input fluid value={
                                    this.state.carty[item].quantity}
                                />
                                <Button.Group compact attached={'bottom'}>
                                    <Button icon={'minus'} color={'teal'}
                                            onClick={() => this.handleMinus(this.state.carty[item])}/>
                                    <Button icon={'plus'} color={'teal'}
                                            onClick={() => this.handleAdd(this.state.carty[item])}/>
                                </Button.Group>
                            </Container>
                        </Segment>
                    );
                    return (
                        <Container>
                            {items}
                            <Modal closeIcon
                                   trigger={
                                       <Button color={'green'} fluid content={'Checkout'}/>
                                   }
                            >
                                <Header icon={'shopping cart'} content={'Checkout'}/>
                                <Modal.Content>
                                    <Form>
                                        <Form.Group>
                                            <Form.Input icon={'male'}
                                                        name={'firstName'}
                                                        defaultValue={this.state.formData.firstName}
                                                        onChange={this.handleInputChange}
                                                        error={this.state.error['firstName']}
                                                        placeholder={'First Name'}/>
                                            <Form.Input icon={'male'}
                                                        name={'lastName'}
                                                        defaultValue={this.state.formData.lastName}
                                                        onChange={this.handleInputChange}
                                                        error={this.state.error['lastName']}
                                                        placeholder={'Last Name'}/>
                                            <Form.Input icon={'mail'}
                                                        name={'email'}
                                                        defaultValue={this.state.formData.email}
                                                        error={this.state.error['email']}
                                                        onChange={this.handleInputChange}
                                                        placeholder={'E-mail'}/>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Input icon={'address book'}
                                                        name={'address'}
                                                        defaultValue={this.state.formData.address}
                                                        onChange={this.handleInputChange}
                                                        error={this.state.error['address']}
                                                        placeholder={'Address'}/>
                                            <Form.Input icon={'credit card'}
                                                        name={'ccId'}
                                                        onChange={this.handleInputChange}
                                                        error={this.state.error['ccId']}
                                                        placeholder={'Credit Card'}
                                            />
                                            <Form.Input icon={'calendar'}
                                                        name={'expiration'}
                                                        onChange={this.handleInputChange}
                                                        error={this.state.error['expiration']}
                                                        placeholder={'Expiration Date'}
                                            />
                                        </Form.Group>
                                    </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                    <Modal
                                        trigger={
                                            <Button color={'green'}
                                                    content={'Confirm'}
                                                    disabled={this.state.disabled}
                                                    onClick={this.handleCheckout}
                                            />
                                        }
                                    >
                                        <Header icon={'checkmark'} content={'Confirmed'}/>
                                        <Modal.Content>
                                            {
                                                this.state.transaction ?
                                                    <Orders res={this.state.res} movies={this.state.carty}/>:
                                                    <MyLoader/>
                                            }
                                        </Modal.Content>
                                    </Modal>
                                </Modal.Actions>
                            </Modal>
                        </Container>
                    );
                }
                else {
                    return (
                        <EmptyCart/>
                    );
                }
            }
            catch {
                return (
                    <EmptyCart/>
                );
            }
        }
        else if (this.state.mounted && !this.state.valid) {
            return (
                <Redirect to={"/login"}/>
            );
        }
        else {
            return (
                <MyLoader/>
            );
        }
    }
}

export default Cart;
export {isEmpty};