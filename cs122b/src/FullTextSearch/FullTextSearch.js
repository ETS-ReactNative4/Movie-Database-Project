import React, {Component} from 'react';
import {Search} from 'semantic-ui-react';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {Redirect} from "react-router";

const search = value => fetch('https://' + window.location.hostname + ':8443/cs122b/fullsearch?query=' + value, {
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
        description: 'Director: ' + data['movies'][key]['director'] + ', ' + data['movies'][key]['year']
      })
    });
    const ret = {data, movies};
    return ret;
  }
);
const searchDebounced = AwesomeDebouncePromise(search, 400);

class FullTextSearch extends Component {
  state = {value: '', redir: false, data: []};

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({isLoading: false, results: []});
  handleResultSelect = (e, {result}) => this.setState({value: result.title});
  handleSearchChange = async (e, {value}) => {
    this.setState({isLoading: true, value});
    if (this.state.value.length < 2) return this.resetComponent();
    const result = await search(value);//await searchDebounced(value);
    setTimeout(() => {
      this.setState({
        isLoading: false,
        results: result['movies'],
        data: result['data']
      });
    }, 400);
  };

  render() {
    return (
      <div>
        {
          this.state.redir ?
            <Redirect to={{
              pathname: '/search',
              state: {data: this.state.results}
            }}/>
            :
            null
        }
        <Search
          loading={this.state.isLoading}
          onResultSelect={this.handleResultSelect}
          onSearchChange={_.debounce(this.handleSearchChange, 400, {leading: true})}
          results={this.state.results}
          value={this.state.value}
          style={{paddingTop: "5px", paddingBottom: "5px", paddingLeft: "10px"}}
        />
      </div>
    );
  }
}

export default FullTextSearch;
