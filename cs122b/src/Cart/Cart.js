import React, {Component} from 'react';
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";
import {Container, Header, Icon, Item} from "semantic-ui-react";


class Cart extends Component {
    state = {
        valid: false,
        mounted: false,
        carty: null
    };

    componentDidMount() {
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

    componentWillUnmount() {
        this.setState({mounted: false});
    }

    render() {
        if (this.state.mounted && this.state.valid) {
            try{
                const items = Object.keys(this.state.carty).map((item) =>
                    <Item key={item}>
                        <Item.Header>{this.state.carty[item]}</Item.Header>
                    </Item>
                );
                return (
                    <Item.Group>
                        {items}
                    </Item.Group>
                );
            }
            catch{
                return(
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