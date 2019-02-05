import React, { Component } from 'react';
import { Fetch } from 'react-request';
import queryString from 'query-string';
import {Stars,Genres} from "../Movies/Movies";
import {Card, Container} from "semantic-ui-react";
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";
import {Link} from "react-router-dom";

function FilmCard(props){
    return(
      <Card key={props.movie}>
          <Card.Content>
              <Card.Header>
                  <Link to={{
                      pathname: '/movie',
                      search: '?id='+props.movieid
                  }}>
                      {props.title}
                  </Link>
              </Card.Header>
              <Card.Meta>
                  Year: {props.year}<br/>
                  Director: {props.director}<br/>
                  Rating: {props.rating}
              </Card.Meta>
              <Card.Description>
                  <Stars list={props.stars}/>
              </Card.Description>
          </Card.Content>
          <Card.Content extra>
              <Genres list={props.genres} func={props.handlr}/>
          </Card.Content>
      </Card>
    );
}
class Film extends Component {
    state = {
        valid: false,
        mounted: false
    };
    componentDidMount(){
        fetch('http://'+window.location.hostname+':8080/cs122b/login', {
            method: 'GET',
            credentials: 'include'
        }).then(
            (res) => {
                if(res.status === 403){
                }
                else{
                    this.setState({valid: true});
                }
                this.setState({mounted:true});
            }
        ).catch((error) =>
            console.log(error)
        )
    }
    componentWillUnmount(){
        this.setState({mounted:false});
    }
    render(){
        const query = queryString.parse(this.props.location.search);
        if(this.state.mounted && this.state.valid){
            return (
                <Fetch url={'http://'+window.location.hostname+':8080/cs122b/movies?id='+query.id} credentials={'include'}>
                    {({ fetching, failed, data }) => {
                        if (fetching) {
                            return(
                                <MyLoader/>
                            );
                        }
                        if (failed) {
                            console.log("Error in film.js");
                        }
                        if (data) {
                            return (
                                <Container>
                                    <Card.Group centered>
                                        <FilmCard movieid={data.id} title={data.title}
                                        year={data.year} director={data.director} rating={data.rating}
                                        stars = {data.stars} genres={data.genres}/>
                                    </Card.Group>
                                </Container>
                            );
                        }
                        return null;
                    }}
                </Fetch>
            );
        }
        else if(this.state.mounted && !this.state.valid){
            return(
                <Redirect to={"/login"}/>
            );
        }
        else{
            return(
                <MyLoader/>
            );
        }
    }
}

export default Film;
export {FilmCard};