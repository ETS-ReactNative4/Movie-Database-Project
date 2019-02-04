import React, {Component} from 'react';
import MyLoader from "../MyLoader/MyLoader";
import {Redirect} from "react-router";
import {FilmCard} from "../Film/Film";
import {Container, Card} from "semantic-ui-react";

const options = [
  { key: '10', text: '10 Per Page', value: '10' },
  { key: '25', text: '25 Per Page', value: '25'},
  { key: '50', text: '50 Per Page', value: '50'},
  { key: '100', text: '100 Per Page', value: '100'},
];
function SearchResults(props) {
  const films = Object.keys(props.data).map((movie) =>
    <FilmCard key={movie} movieid={props.data[movie].id} title={props.data[movie].title}
              year={props.data[movie].year} director={props.data[movie].director} rating={props.data[movie].rating}
              stars={props.data[movie].stars} genres={props.data[movie].genres}/>
  );
  return (
    <Container>
      <Card.Group centered>{films}</Card.Group>
    </Container>
  );
}

class MovieList extends Component {
  state = {
    valid: false,
    mounted: false,
  };
  handleLimitChange = (e, data) => {
    this.setState({limit: parseInt(data.value, 10)});
  };
  componentDidMount() {
    fetch('http://' + window.location.hostname + ':8080/cs122b/login', {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => {
        if (res.status === 403) {
          this.setState({valid: false});
        } else {
          this.setState({valid: true});
        }
        this.setState({mounted: true});
      }
    ).catch((error) =>
      console.log(error)
    )
  };

  componentWillUnmount() {
    this.setState({mounted: false});
  };

  handleSubmit = event => {
    event.preventDefault();
    this.setState({activePage: 1}, this.getMovies);
  };

  getMovies() {
  }

  renderContent() {
    switch (this.state.search) {
      case "loading":
        return (
          <MyLoader/>
        );
      case "received":
        return (
          <SearchResults data={this.state.data}/>
        );
      default:
        return (
          null
        );
    }
  }

  render() {
    if (this.state.mounted && this.state.valid) {
      return (
        <div>
          {
            this.renderContent()
          }
        </div>
      );
    } else if (!this.state.valid && this.state.mounted) {
      return (
        <Redirect to={"/login"}/>
      );
    } else {
      return (
        <MyLoader/>
      );
    }
  }
}

export default MovieList;
export {SearchResults, options};
