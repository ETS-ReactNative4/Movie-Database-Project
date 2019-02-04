import React from 'react';
import MovieList, {options} from "../MovieList/MovieList";
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";
import {Button, Container, Form, Pagination, Segment} from "semantic-ui-react";

const genreoptions = [
  { key: '1', text: 'Action', value:'Action'},
  { key: '2', text: 'Adult', value:'Adult'},
  { key: '3', text: 'Adventure', value:'Adventure'},
  { key: '4', text: 'Animation', value:'Animation'},
  { key: '5', text:  'Biography', value: 'Biography'},
  { key: '6', text:  'Comedy', value: 'Comedy'},
  { key: '7', text:  'Crime', value: 'Crime'},
  { key: '8', text:  'Documentary', value: 'Documentary'},
  { key: '9', text:  'Drama', value: 'Drama'},
  { key: '10', text:  'Family', value: 'Family'},
  { key: '11', text:  'Fantasy', value: 'Fantasy'},
  { key: '12', text:  'History', value: 'History'},
  { key: '13', text:  'Horror', value: 'Horror'},
  { key: '14', text:  'Music', value: 'Music'},
  { key: '15', text:  'Musical', value: 'Musical'},
  { key: '16', text:  'Mystery', value: 'Mystery'},
  { key: '17', text:  'Reality-TV', value: 'Reality-TV'},
  { key: '18', text:  'Romance', value: 'Romance'},
  { key: '19', text:  'Sci-Fi', value: 'Sci-Fi'},
  { key: '20', text:  'Sport', value: 'Sport'},
  { key: '21', text:  'Thriller', value: 'Thriller'},
  { key: '22', text:  'War', value: 'War'},
  { key: '23', text:  'Western', value: 'Western'},
];
const letteroptions = [
  {key: '1',  text: 'a', value:'a' },
  {key: '2',  text: 'b', value:'b' },
  {key: '3',  text: 'c', value:'c' },
  {key: '4',  text: 'd', value:'d' },
  {key: '5',  text: 'e', value:'e' },
  {key: '6',  text: 'f', value:'f' },
  {key: '7',  text: 'g', value:'g' },
  {key: '8',  text: 'h', value:'h' },
  {key: '9',  text: 'i', value:'i' },
  {key: '10', text: 'j', value:'j' },
  {key: '11', text: 'k', value:'k' },
  {key: '12', text: 'l', value:'l' },
  {key: '13', text: 'm', value:'m' },
  {key: '14', text: 'n', value:'n' },
  {key: '15', text: 'o', value:'o' },
  {key: '16', text: 'p', value:'p' },
  {key: '17', text: 'q', value:'q' },
  {key: '18', text: 'r', value:'r' },
  {key: '19', text: 's', value:'s' },
  {key: '20', text: 't', value:'t' },
  {key: '21', text: 'u', value:'u' },
  {key: '22', text: 'v', value:'v' },
  {key: '23', text: 'w', value:'w' },
  {key: '24', text: 'x', value:'x' },
  {key: '25', text: 'y', value:'y' },
  {key: '26', text: 'z', value:'z' },
  {key: '27', text: '0', value:'0' },
  {key: '28', text: '1', value:'1' },
  {key: '29', text: '2', value:'2' },
  {key: '30', text: '3', value:'3' },
  {key: '31', text: '5', value:'5' },
  {key: '32', text: '6', value:'6' },
  {key: '33', text: '7', value:'7' },
  {key: '34', text: '8', value:'8' },
  {key: '35', text: '9', value:'9' },
];

class Browse extends MovieList{
  state = {
    search: "notsearched",
    genre: "",
    letter: "",
    limit: 10,
    pages: 0,
    activePage: 1,
    sort: "rating",
    order: "DESC"
  };
  handlePaginationChange = (e, {activePage}) => this.setState({activePage}, this.getMovies)
  getMovies() {
    this.setState({search: "loading"});
    fetch('http://' + window.location.hostname + ':8080/cs122b/browse?genre=' + this.state.genre +
      '&letter=' + this.state.letter +'&limit='+this.state.limit+'&offset=' + ((this.state.activePage - 1) * this.state.limit)+
      '&sort=' + this.state.sort + '&order=' + this.state.order, {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => res.json()
    ).then(
      data => this.setState({data: data.movies, total: data.numRecords, search: "received"}, function () {
        this.setState({pages: Math.ceil(this.state.total / this.state.limit)})
      })
    );
  }
  handleGenreChange = (e, data) => {
    this.setState({genre: data.value, letter: ''});
  };
  handleLetterChange = (e, data) => {
    this.setState({letter: data.value, genre: ''});
  };
  render(){
    if(this.state.mounted && this.state.valid){
      return(
        <div>
          <Segment>
            <Form size={'large'} onSubmit={this.handleSubmit}>
              <Form.Group widths={'equal'}>
                <Form.Select fluid
                             placeholder={'Genre'}
                             value={this.state.genre}
                             onChange={this.handleGenreChange}
                             options={genreoptions}
                             />
                <Form.Select fluid
                             placeholder={'Starting Letter'}
                             value={this.state.letter}
                             onChange={this.handleLetterChange}
                             options={letteroptions}
                />
              </Form.Group>
              <Form.Group widths={'equal'}>
                <Form.Select fluid
                             placeholder={'Results Per Page'}
                             onChange={this.handleLimitChange}
                             options={options}
                />
                <Button color={'teal'} fluid size={'small'} type={"submit"}>
                  Browse
                </Button>
              </Form.Group>
            </Form>
          {
            (this.state.search !== "notsearched") ?
              <Container textAlign={"center"}>
                <Pagination
                  totalPages={this.state.pages}
                  activePage={this.state.activePage}
                  onPageChange={this.handlePaginationChange}
                  siblingRange={2}
                />
              </Container>
              : null
          }
          </Segment>
          {
            super.render()
          }
        </div>
      );
    }
    else if(!this.state.valid && this.state.mounted){
      return (
        <Redirect to={'/login'}/>
      );
    }
    else{
      return(<MyLoader/>)
    }
  }
}
    export default Browse;