import React, { Component } from 'react';
import {Button, Form, Grid, Header, Segment} from "semantic-ui-react";

class Login extends Component{
    state = {
        username: "",
        password: ""
    };
    handleNameChange = event =>{
        this.setState({username: event.target.value});
    };
    handlePassChange = event =>{
        this.setState({password: event.target.value});
    };
    handleSubmit = event =>{
        event.preventDefault();
        const creds = {
            username: this.state.username,
            password: this.state.password
        };
        fetch('https://'+window.location.hostname+':8080/cs122b/login', {
            method: 'POST',
            headers: {
                'Accept':'application/json'
            },
            body: JSON.stringify(creds)
        }).then(
            (res) => res.json()
        ).then((data) => console.log(data)
        ).catch((error) =>
                console.log(error)
        )
    };
    render(){
        return(
          <div>
              <Grid textAlign={'center'} verticalAlign={"middle"}>
                  <Grid.Column style={{ maxWidth: 450}}>
                      <Header as={'h3'} color={'teal'} textAlign={'center'}>
                          Login to your account
                      </Header>
                      <Form size={'large'} onSubmit={this.handleSubmit}>
                          <Segment stacked>
                              <Form.Input fluid icon={'user'}
                                          placeholder={'Username'}
                                          onChange={this.handleNameChange}
                              />
                              <Form.Input fluid icon={'lock'}
                                          placeholder={'Password'}
                                          onChange={this.handlePassChange}
                                          type={'password'}/>
                              <Button color={'teal'} fluid size={'large'} type={"submit"}>
                                  Submit
                              </Button>
                          </Segment>
                      </Form>
                  </Grid.Column>
              </Grid>
          </div>
        );
    }
}

export default Login;