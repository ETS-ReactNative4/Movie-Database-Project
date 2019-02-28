import React, {Component} from 'react';
import {Form, Label, Search} from 'semantic-ui-react';
import _ from 'lodash';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import {Redirect} from "react-router";
import {Link} from "react-router-dom";

const resultRenderer = ({movieid,title, year}) =>
  <Label as={Link}
         to={{
           pathname: '/movie',
           search: '?id=' + movieid
         }}
  >
    {title}
    <Label.Detail>{year}</Label.Detail>
  </Label>;
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
  state = {value: '', redir: false, fullredir: false, data: [], movieid: null};

  componentWillMount() {
    this.resetComponent()
  }

  resetComponent = () => this.setState({isLoading: false, results: []});
  handleResultSelect = (e, {result}) => this.setState({value: result.title, redir: true, movieid: result.movieid}, function () {
    this.setState({redir: false})
  });
  handleSubmit = event => {
    this.setState({})
  };
  handleSearchChange = async (e, {value}) => {
    this.setState({isLoading: true, value});
    if (this.state.value.length < 2) return this.resetComponent();
    const result = await searchDebounced(value);
    setTimeout(()=> {
      this.setState({
        isLoading: false,
        results: result['movies'],
        data: result['data']
      })
    }, 300);
  };

  render() {
    return (
      <div>
        {
          this.state.redir ?
            <Redirect to={{
              pathname: '/movie',
              search: '?id='+this.state.movieid
              //state: {data: this.state.data, reload: "yes"}
            }}/>
            :
            null
        }
        {
          this.state.fullredir ?
            <Redirect to={{
              pathname: '/fullresults',
              state: {data: this.state.data, reload: "yes"}
            }} />
            :null
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
