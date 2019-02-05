import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import {Container, Card, List, Icon, Label,} from 'semantic-ui-react';
import {Redirect} from 'react-router';
import MyLoader from "../MyLoader/MyLoader";
import {FilmCard} from "../Film/Film";


function Stars(props){
    const stars = Object.keys(props.list).map((star) =>
        <List.Item key={star}>
            <Link to={{
                pathname: "/star",
                search: "?id="+props.list[star].id
            }}>
                <Label>
                    <Icon name={"male"}/>{props.list[star].name}
                </Label>
                </Link>
        </List.Item>
    );
    return(
        <List link>
            <List.Item active>Actors</List.Item>
            {stars}
        </List>
    );
}

function Genres(props){
    const genres = Object.keys(props.list).map((genre) =>
        <List.Item key={genre}
        as={Link} to={{pathname: '/browse',
        state: {genre: props.list[genre], reload: "yes"}}}
        >
            {props.list[genre]}
        </List.Item>
    );
    return (
      <List horizontal>
          {genres}
      </List>
    );
}

class Movies extends Component {
    state = {
        activeIndex: 0,
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
                    this.setState({valid: false});
                }
                else{
                    this.setState({valid: true});
                }
                this.setState({mounted: true});
            }
        ).catch((error) =>
            console.log(error)
        )
    }
    componentWillUnmount(){
        this.setState({mounted: false});
    }

    render(){
        if(this.state.mounted && this.state.valid){
            return (
                <Fetch url={'http://'+window.location.hostname+':8080/cs122b/top20'} credentials={'include'}>
                    {({ fetching, failed, data }) => {
                        if (fetching) {
                            return(
                                <MyLoader/>
                            );
                        }

                        if (failed) {
                            console.log("Error");
                        }

                        if (data) {
                            const films = Object.keys(data).map((movie) =>
                                <FilmCard key={movie} movieid={data[movie].id} title={data[movie].title}
                                          year={data[movie].year} director={data[movie].director} rating={data[movie].rating}
                                          stars = {data[movie].stars} genres={data[movie].genres} handleAddToCart={this.props.handleAddToCart}/>
                            );
                            return (
                                <Container>
                                    <Card.Group centered>{films}</Card.Group>
                                </Container>
                            );
                        }
                        return null;
                    }}
                </Fetch>
            );
        }
        else if(!this.state.valid && this.state.mounted){
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

export default Movies;
export { Stars , Genres};