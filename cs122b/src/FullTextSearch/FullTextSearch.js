import React, { Component } from 'react';
import {Search} from 'semantic-ui-react';
import _ from 'lodash';

class FullTextSearch extends Component{
  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({ isLoading: false, results: [], value: '' });
  handleResultSelect = (e, { result }) => this.setState({ value: result.title });

  handleSearchChange = (e, { value }) => {
    this.setState({ isLoading: true, value });

    setTimeout(() => {
      if (this.state.value.length < 1) return this.resetComponent();

      this.setState({
        isLoading: false,
      }, this.search(value))
    }, 400)
  };
  search(value){
    fetch('https://'+window.location.hostname+':8443/cs122b/fullsearch?query='+value, {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => res.json()
    ).then(
      data => this.setState({results: data['movies']})
    );
    console.log(this.state.results);
  }
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
