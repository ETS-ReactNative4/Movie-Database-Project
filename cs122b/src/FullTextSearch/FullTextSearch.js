import React, {Component} from 'react';
import {Form, Search} from 'semantic-ui-react';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {Redirect} from "react-router";

const search = value => fetch('https://' + window.location.hostname + ':8443/cs122b/fullsearch?query=' + value, {
  method: 'GET',
  credentials: 'include'
}).then(
  (res) => res.json()
).then(
  data => {
    console.log(data);
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
    const ret = {data, movies};
    return ret;
  }
);
const searchDebounced = AwesomeDebouncePromise(search, 400);

class FullTextSearch extends Component {
  state = {value: '', redir: false, fullredir: false, data: [], movieid: null, cache: []};

  componentWillMount() {
    this.resetComponent()
  }
  componentDidMount() {
    let cache = JSON.parse(sessionStorage.getItem("cache"));
    if(cache !== null){
      this.setState({cache})
    }
  }

  resetComponent = () => this.setState({isLoading: false, results: []});
  handleResultSelect = (e, {result}) => this.setState({
    value: result.title,
    redir: true,
    movieid: result.movieid
  }, function () {
    this.setState({redir: false})
  });
  handleSubmit = event => {
    event.preventDefault();
    this.setState({fullredir: true}, function(){
      this.setState({fullredir: false});
    })
  };
  handleSearchChange = async (e, {value}) => {
    this.setState({isLoading: true, value});
    if (value.length < 2) return this.resetComponent();
    if(value in this.state.cache){
      console.log("Using cache");
      setTimeout(() => {
        this.setState({
          isLoading: false,
          results: this.state.cache[value]['movies'],
          data: this.state.cache[value]['data']
        })
      }, 300);
    }
    else{
      console.log("Sending request");
      const result = await searchDebounced(value);
      setTimeout(() => {
        let cache = {...this.state.cache};
        cache[value] = result;
        this.setState({
          isLoading: false,
          results: result['movies'],
          data: result['data'],
          cache: cache
        }, function(){
          sessionStorage.setItem("cache", JSON.stringify(this.state.cache))
        })
      }, 300);
    }
  };

  render() {
    return (
      <div>
        {
          this.state.redir ?
            <Redirect to={{
              pathname: '/movie',
              search: '?id=' + this.state.movieid
            }}/>
            :
            null
        }
        {
          this.state.fullredir ?
            <Redirect to={{
              pathname: '/fullresults',
              state: {data: this.state.data, value: this.state.value, reload: "yes"}
            }}/>
            : null
        }
        <Form onSubmit={this.handleSubmit}>
          <Search
            loading={this.state.isLoading}
            onResultSelect={this.handleResultSelect}
            onSearchChange={this.handleSearchChange}
            results={this.state.results}
            value={this.state.value}
            input={{action: "Submit"}}
            style={{paddingTop: "5px", paddingBottom: "5px", paddingLeft: "10px"}}
          />
        </Form>
      </div>
    );
  }
}

export default FullTextSearch;
