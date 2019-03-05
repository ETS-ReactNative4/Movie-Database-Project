import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View, FlatList,
  TouchableOpacity
} from 'react-native';
import {SearchBar, Card, ListItem, Divider, Icon, Button, ButtonGroup} from 'react-native-elements';
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

function isEmpty(obj) {
  for (var prop in obj) {
    return false;
  }
  return true;
}


function Movie(props) {
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
        containerStyle={{paddingLeft: 15, paddingTop: 10, paddingBottom: 10, paddingRight: 15}}
      />
      <Divider/>
      <Stars stars={item.stars}/>
      <Divider/>
      <Genres genres={item.genres}/>
    </Card>
  );
}

export {Movie, isEmpty};
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  state = {
    search: '',
    data: {},
    offset: 0,
    index: 2,
  };

  _handleSearch() {
    fetch('https://ryanpadilla.us:8443/cs122b/fullsearch?query=' + this.state.search + '&offset=' + this.state.offset, {
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

  _navButtons(selected) {
    console.log(this.state);
    if (selected === 0 && (this.state.offset - 10) >= 0) {
      this.setState({index: selected, offset: this.state.offset - 10}, function () {
        console.log(this.state.offset);
        this._handleSearch();
      })
    }
    else if (selected === 1 && ((this.state.offset + 10) < this.state.data['numRecords'])) {
      this.setState({index: selected, offset: this.state.offset + 10}, function () {
        console.log(this.state.offset);
        this._handleSearch();
      })
    }
  }
  _onCardPress(item){
    this.props.navigation.navigate({routeName: 'Links', key: 'Links', params: {movie: item}});
  }

  // componentDidMount(){
  //   const {navigation} = this.props;
  //   let x = navigation.getParam("state", null);
  //   if(x !== null){
  //     this.setState({state})
  //   }
  // }

  render() {
    const buttons = ['Prev 10', 'Next 10'];

    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>

          <View style={{justifyContent: "center", alignItems: "center",}}>
            <Text style={{fontSize: 42, marginTop: 30, marginBottom: 10}}>
              Search Movies
            </Text>
          </View>
          <View style={{marginHorizontal: 10}}>
            <SearchBar
              placeholder={"Search..."}
              round={true}
              onChangeText={search => this.setState({search})}
              value={this.state.search}
            />
            <Button
              title={"Search"}
              onPress={() => this._handleSearch()}
              buttonStyle={{backgroundColor: "lightseagreen"}}
            />
          </View>
          {isEmpty(this.state.data) ? null :
            <ButtonGroup
              selectedIndex={this.state.index}
              onPress={(item) => this._navButtons(item)}
              buttons={buttons}
              containerStyle={{height: 50}}
            />}
          <FlatList
            data={this.state.data['movies']}
            renderItem={({item}) =>
              <TouchableOpacity onLongPress={() => this._onCardPress(item)}>
                <Movie item={item}/>
              </TouchableOpacity>
            }
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
