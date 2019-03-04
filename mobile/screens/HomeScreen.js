import React from 'react';
import {
  Button,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  AsyncStorage,
  View, FlatList,
} from 'react-native';
import {WebBrowser} from 'expo';
import {MonoText} from '../components/StyledText';
import {SearchBar} from 'react-native-elements';

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
        let movies = [];
        Object.keys(data['movies']).forEach(function (key) {
          movies.push({
            key: data['movies'][key]['id'],
            title: data['movies'][key]['title'],
            description: 'Director: ' + data['movies'][key]['director'] + ', ' + data['movies'][key]['year'],
            year: data['movies'][key]['year'],
            movieid: data['movies'][key]['id'],
          })
        });
        console.log(data);
        this.setState({data: movies});
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
            data={this.state.data}
            renderItem={({item})=> <Text>{item.title}</Text>}
            />
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
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
