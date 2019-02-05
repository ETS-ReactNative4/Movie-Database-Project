import React, {Component} from 'react';
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";
import {Button, Container, Grid, Header, Icon, Input, Item, Rail, Segment} from "semantic-ui-react";


class Cart extends Component {
    state = {
        valid: false,
        mounted: false,
        carty: null
    };

    componentDidMount() {
        this.setState({carty: this.props.cart}, function () {
            console.log(this.state.carty);
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
        this.setState({carty: crt}, function(){
            this.props.handleUpdateCart(this.state.carty);
            console.log(this.state.carty);
        });
    };
    handleMinus = (item) => {
        let crt = {...this.state.carty};
        crt[item.id]["quantity"] -= 1;
        if(crt[item.id]["quantity"] <= 0){
            delete crt[item.id];
        }
        this.setState({carty: crt}, function(){
            this.props.handleUpdateCart(this.state.carty);
            console.log(this.state.carty);
        });
    };
    componentWillUnmount() {
        this.setState({mounted: false});
    }

    render() {
        if (this.state.mounted && this.state.valid) {
            try {
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
                                <Button icon={'minus'} onClick={()=>this.handleMinus(this.state.carty[item])}/>
                                <Button icon={'plus'} onClick={()=>this.handleAdd(this.state.carty[item])}/>
                            </Button.Group>
                        </Container>
                    </Segment>
                );
                return (
                    <Container>
                        {items}
                    </Container>
                );
            }
            catch {
                return (
                    <Container>
                        <Header as={'h1'} icon textAlign={'center'}>
                            <Icon name={'shopping cart'} circular/>
                            <Header.Content>Cart Empty</Header.Content>
                        </Header>
                    </Container>
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