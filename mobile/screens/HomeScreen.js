import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View, FlatList,
} from 'react-native';
import {WebBrowser} from 'expo';
import {SearchBar, Card, ListItem, Divider, Icon} from 'react-native-elements';
import StarRating from "react-native-star-rating";

function Stars(props) {
  return props.stars.map((stuff, i) => (
    <ListItem
      key={i}
      title={stuff.name}
      leftIcon={{name: 'person'}}
    />
  ));
}
function Genres(props) {
  return props.genres.map((stuff, i) => (
    <ListItem
      key={i}
      title={stuff}
      leftIcon={{name: 'folder'}}
    />
  ));
}

function Movie(props) {
  console.log(props.item);
  let item = props.item;
  return (
    <Card title={item.title} titleStyle={{fontSize: 25}} image={require('../assets/images/movieicon.jpg')}>
      <ListItem
        key={'director'}
        title={'Director: ' + item.director}
        leftIcon={{name: 'movie'}}
      />
      <ListItem
        key={'year'}
        title={'Year: ' + item.year}
        leftIcon={{name: 'date-range'}}
      />
      <StarRating
        disabled={true}
        maxStars={10}
        rating={item.rating}
        fullStarColor={'grey'}
        starSize={25}
        containerStyle={{paddingLeft:15, paddingTop: 10, paddingBottom: 10, paddingRight: 15}}
      />
      <Divider/>
      <Stars stars={item.stars}/>
      <Divider/>
      <Genres genres={item.genres}/>
    </Card>
  );
}

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    search: '',
    data: {}
  };

  _handleSearch() {
    fetch('https://ryanpadilla.us:8443/cs122b/fullsearch?query=' + this.state.search, {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => res.json()
    ).then(
      data => {
        let d = {...data};
        let movies = d['movies'].map((item, i) => Object.assign({}, item, {key: 'ky' + i}));
        d['movies'] = movies;
        this.setState({data: d});
        // const ret = {data, movies};
        // return ret;
      }
    );
  }

  render() {
    const {navigation} = this.props;
    let data = navigation.getParam('data', 'nuthin');
    let name = 'help';
    if (data !== 'nuthin') {
      console.log(data);
      name = data.firstName;
    }

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={{justifyContent: "center", alignItems: "center",}}>
            <Text style={{fontSize: 42, marginTop: 50}}>
              Search Movies
            </Text>
          </View>
          <View style={{marginHorizontal: 25}}>
            <SearchBar
              placeholder={"Search..."}
              lightTheme={true}
              round={true}
              onChangeText={search => this.setState({search})}
              value={this.state.search}
            />
            <Button
              title={"Search"}
              onPress={() => this._handleSearch()}
            />
          </View>
          <FlatList
            data={this.state.data['movies']}
            renderItem={({item}) => <Movie item={item}/>}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: {height: -3},
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
