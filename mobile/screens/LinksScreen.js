import React from 'react';
import { ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import {isEmpty, Movie} from "./HomeScreen";
import {Button, Icon} from "react-native-elements";

export default class LinksScreen extends React.Component {
  static navigationOptions = {
    header: null
  };
  state={
    movie: {},
  };
  componentDidMount(){
    const {navigation} = this.props;
    let x = navigation.getParam("movie", null);
    if(x !== null){
      this.setState({movie: x});
    }
  }
  _goBack(){
    this.props.navigation.navigate('HomeStack');
  }

  render() {
    return (
      <ScrollView style={styles.container}>
        <Button title={"Go Back"}
                icon={<Icon name={"chevron-left"} size={30} color={"white"}/>}
                titleStyle={{fontSize: 25}}
                buttonStyle={{backgroundColor: "lightseagreen", height: 75}}
                onPress={() => this._goBack()}/>
        {isEmpty(this.state.movie)? <ActivityIndicator/>:
          <Movie item={this.state.movie}/>
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
