import React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet, TextInput,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Button, Input, Icon, Avatar} from 'react-native-elements';


export default class LoginScreen extends React.Component {
  state = {
    username: '',
    password: '',
    data: {},
    valid: false,
    firstTime: true,
  };
  static navigationOptions = {
    header: null,
  };

  render() {
    /* Go ahead and delete ExpoConfigView and replace it with your
     * content, we just wanted to give you a quick view of your config */
    return (
      <KeyboardAvoidingView style={{paddingTop: 50, alignItems: "center", justifyContent: "center"}}>
        <Avatar rounded size={"xlarge"}
                source={
                  require('../assets/images/movieiconsquare.jpg')
                }
                containerStyle={{marginVertical: 20}}
        />
        <Input inputContainerStyle={styles.input}
               autoCapitalize={"none"}
               autoCorrect={false}
               keyboardType={'email-address'}
               returnKeyType={'next'}
               placeholder={'Username'}
               leftIcon={
                 <Icon name={"person"} color={"grey"} containerStyle={{paddingRight: 10}}/>
               }
               onChangeText={(username) => this.setState({username})}
        />
        <Input inputContainerStyle={styles.input}
               returnKeyType={'go'}
               ref={(input) => this.passwordInput = input}
               placeholder={'Password'}
               onChangeText={(password) => this.setState({password})}
               leftIcon={
                 <Icon name={"lock"} color={"grey"} containerStyle={{paddingRight: 10}}/>
               }
               secureTextEntry
        />
        <Button
          buttonStyle={{backgroundColor: "grey", paddingHorizontal: 20}}
          title={"Log In"}
          raised
          onPress={this._signIn}
          icon={<Icon name={'chevron-right'} color={"white"}/>}
        />
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
          this.setState({valid: false, firstTime: false}, function () {
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
    marginBottom: 30,
    padding: 10,
  }
});
