import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage, Button, KeyboardAvoidingView,
  StatusBar,
  StyleSheet, Text, TextInput,
  View,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';


export default class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    data: {},
    valid: false,
    firstTime: true,
  };
  static navigationOptions = {
    title: 'Login',
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <KeyboardAvoidingView>
        <TextInput style={styles.input}
                   autoCapitalize={"none"}
                   autoCorrect={false}
                   keyboardType={'email-address'}
                   returnKeyType={'next'}
                   placeholder={'Username'}
                   onChangeText={(username) => this.setState({username})}
        />
        <TextInput style={styles.input}
                   returnKeyType={'go'}
                   ref={(input) => this.passwordInput = input}
                   placeholder={'Password'}
                   onChangeText={(password) => this.setState({password})}
                   secureTextEntry
        />
        <Button title={"Log In"} onPress={this._signIn}/>
      </KeyboardAvoidingView>
    );
  }

  _signIn = async url => {
    let creds = {
      username: this.state.username,
      password: this.state.password
    };
    fetch('https://ryanpadilla.us:8443/cs122b/login', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(creds)
    }).then(
      (res) => {
        if (res.status === 403) {
          this.setState({valid: false, firstTime: false}, function(){
            showMessage(
              {
                message: "Login Error",
                description: "Please try a different username/password",
                type: "danger"
              }
            )
          })
        }
        else {
          this.setState({valid: true, firstTime: false})
        }
        return res.json();
      }
    ).then(
      data => {
        this.setState({data}, function () {
          if (this.state.valid) {
            this.props.navigation.navigate({routeName: 'Home', key: 'Home', params: {data}})
          }
        });
      }
    )
      .catch((error) =>
        console.log(error)
      );
  };
}
const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 10,
    padding: 10,
    color: '#222'
  }
});
