import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

class LoginLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _checkLogin = async () => {
    return fetch('https://ryanpadilla.us:8443/cs122b/login', {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => {
        if (res.status === 403) {
          return false;
        } else {
          return true;
        }
      }
    ).catch((error) => {
        console.log(error);
        return false;
      }
    )
  };
  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await this._checkLogin();

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'HomeStack' : 'LoginStack');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View>
        <ActivityIndicator/>
        <StatusBar barStyle="default"/>
      </View>
    );
  }
}

export default LoginLoadingScreen;