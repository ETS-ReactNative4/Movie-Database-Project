import React from 'react';
import Movies from "../Movies/Movies";
import MyLoader from "../MyLoader/MyLoader";
import {Container, Pagination} from "semantic-ui-react";
import {Redirect} from "react-router";
import {SearchResults} from "../MovieList/MovieList";

class FullTextResults extends Movies {
  state = {
    activeIndex: 0,
    valid: false,
    value: "",
    mounted: false,
    data: [],
    activePage: 1,
    pages: 0,
    limit: 10
  };

  handlePaginationChange = (e, {activePage}) => this.setState({activePage}, this.getMovies);

  getMovies() {
    this.setState({search: "loading"});
    fetch('https://' + window.location.hostname + ':8443/cs122b/fullsearch?query=' + this.state.value +
      '&offset=' + ((this.state.activePage - 1) * this.state.limit), {method: 'GET', credentials: 'include'}).then(
      (res) => res.json()
    ).then(
      data => this.setState({data: data.movies, search: "received"}, function(){console.log(this.state)})
    )
  }

  componentDidMount(props) {
    super.componentDidMount();
    this.setState({
      data: this.props.location.state.data.movies,
      total: this.props.location.state.data.numRecords,
      value: this.props.location.state.value,
      search: "received"
    }, function () {
      this.setState({pages: Math.ceil(this.state.total / this.state.limit)})
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.location.state.value !== this.state.value) {
      this.setState({
        data: nextProps.location.state.data.movies,
        total: nextProps.location.state.data.numRecords,
        value: nextProps.location.state.value,
        search: "received"
      }, function () {
        this.setState({pages: Math.ceil(this.state.total / this.state.limit)})
      })
    }
  }

  render() {
    if (this.state.mounted && this.state.valid) {
      return (
        <Container>
          <Container textAlign={"center"} style={{marginBottom: "3em"}}>
            <Pagination
              totalPages={this.state.pages}
              activePage={this.state.activePage}
              onPageChange={this.handlePaginationChange}
              siblingRange={2}
            />
          </Container>
          <SearchResults data={this.state.data} handleAddToCart={this.props.handleAddToCart}/>
        </Container>
      );
    } else if (!this.state.valid && this.state.mounted) {
      return (
        <Redirect to={"/login"}/>
      )
    } else {
      return (<MyLoader/>);
    }
  }
}

export default FullTextResults;