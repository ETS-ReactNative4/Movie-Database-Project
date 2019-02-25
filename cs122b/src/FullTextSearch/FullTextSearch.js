import React, { Component } from 'react';
import {Search} from 'semantic-ui-react';
import _ from 'lodash';
import AwesomeDebouncePromise from "awesome-debounce-promise";

const search = value => fetch('https://'+window.location.hostname+':8443/cs122b/fullsearch?query='+value, {
  method: 'GET',
  credentials: 'include'
}).then(
  (res) => res.json()
).then(
  data => {
    let movies = [];
    Object.keys(data['movies']).forEach(function(key){
      movies.push({
        key: data['movies'][key]['id'],
        title: data['movies'][key]['title'],
        description: 'Director: '+data['movies'][key]['director']+', '+data['movies'][key]['year']
      })
    });
    return movies;
  }
);
const searchDebounced = AwesomeDebouncePromise(search, 400);
class FullTextSearch extends Component{
  componentWillMount() {
    this.resetComponent()
  }
  resetComponent = () => this.setState({ isLoading: false, results: []});
  handleResultSelect = (e, { result }) => this.setState({ value: result.title });
  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });
    setTimeout(async () => {
      if (this.state.value.length < 3) return this.resetComponent();
      const result = await searchDebounced(value);
      this.setState({
        isLoading: false,
        results: result
      });
    }, 400)
  };
  render(){
    return(
      <Search
        loading={this.state.isLoading}
        onResultSelect={this.handleResultSelect}
        onSearchChange={_.debounce(this.handleSearchChange, 300, {leading: true})}
        results={this.state.results}
        value={this.state.value}
      />
      );
  }
}
export default FullTextSearch;
