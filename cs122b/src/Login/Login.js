import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Button, Form, Grid, Header, Message, Segment} from "semantic-ui-react";
import MyLoader from "../MyLoader/MyLoader";
import ReCAPTCHA from 'react-google-recaptcha';

class Login extends Component {
  state = {
    username: "",
    password: "",
    recaptcha: "",
    disable_button: true,
    valid: false,
    error: false,
    mounted: false
  };

  verifyCallback = (token) => {
    this.setState({recaptcha: token, disable_button: false});
    console.log(token);
  };

  componentDidMount() {
    fetch('http://' + window.location.hostname + ':8080/cs122b/login', {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => {
        if (res.status === 403) {
          console.log("Invalid session");
        } else {
          console.log("Logged in");
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

  handleNameChange = event => {
    this.setState({username: event.target.value});
  };
  handlePassChange = event => {
    this.setState({password: event.target.value});
  };
  handleSubmit = event => {
    event.preventDefault();
    const creds = {
      username: this.state.username,
      password: this.state.password,
      g_recaptcha_response: this.state.recaptcha
    };
    this.getSession(creds);
  };

  getSession(creds) {
    fetch('http://' + window.location.hostname + ':8080/cs122b/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(creds)
    }).then(
      (res) => {
        if (res.status === 403) {
          document.getElementById("Form").reset();
          this.setState({valid: false});
          this.setState({error: true});
        } else {
          this.setState({valid: true});
        }
        return res.json();
      }
    ).then(
      data => {
        this.props.getCust(data);
      }
    )
      .catch((error) =>
        console.log(error)
      )
  }

  getRetVal() {
    return (
      <Redirect to={"/"}/>
    );
  }

  render() {
    if (!this.state.valid && this.state.mounted) {
      return (
        <div>
          <Grid textAlign={'center'} verticalAlign={"middle"}>
            <Grid.Column style={{maxWidth: 450}}>
              <Header as={'h3'} color={'teal'} textAlign={'center'}>
                Login to your account
              </Header>
              <Form size={'large'} onSubmit={this.handleSubmit} id={'Form'} error>
                <Segment stacked>
                  <Form.Input fluid icon={'user'}
                              placeholder={'Username'}
                              onChange={this.handleNameChange}
                  />
                  <Form.Input fluid icon={'lock'}
                              placeholder={'Password'}
                              onChange={this.handlePassChange}
                              type={'password'}/>
                  {this.state.error
                    ?
                    <Message
                      error={this.state.error}
                      header={"Error"}
                      content={"Invalid Username/Password"}
                    />
                    :
                    null
                  }
                  <Segment>
                    <ReCAPTCHA
                      sitekey={'6LcOX5AUAAAAAGBgvP1F36tDbNdub8r2Bnhmt78H'}
                      onChange={this.verifyCallback}
                    />
                  </Segment>
                  <Button disabled={this.state.disable_button} color={'teal'} fluid size={'large'}
                          type={"submit"}>
                    Submit
                  </Button>
                </Segment>
              </Form>
            </Grid.Column>
          </Grid>
        </div>
      );
    } else if (this.state.valid && this.state.mounted) {
      console.log("Back to home");
      return (
        <div>
          {this.getRetVal()}
        </div>
      );
    } else {
      return (
        <MyLoader/>
      );
    }
  }
}

export default Login;