import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import {Container, Card, List, Icon, Label} from 'semantic-ui-react';

function Stars(props){
    console.log(props.list);
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
        <List.Item key={genre}>
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
    state = { activeIndex: 0 }
    render(){
        return (
            <Fetch url={'http://'+window.location.hostname+':8080/cs122b/top20'}>
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <div>Loading data...</div>;
                    }

                    if (failed) {
                        return <div>The request did not succeed.</div>;
                    }

                    if (data) {
                        const films = Object.keys(data).map((movie) =>
                                <Card key={movie}>
                                    <Card.Content>
                                        <Card.Header>
                                            <Link to={{
                                                pathname: '/movie',
                                                search: '?id='+data[movie].id
                                            }}>
                                                {data[movie].title}
                                            </Link>
                                        </Card.Header>
                                        <Card.Meta>
                                            Year: {data[movie].year}<br/>
                                            Director: {data[movie].director}<br/>
                                            Rating: {data[movie].rating}
                                        </Card.Meta>
                                        <Card.Description>
                                            <Stars list={data[movie].stars}/>
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Genres list={data[movie].genres}/>
                                    </Card.Content>
                                </Card>
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
}

export default Movies;
export { Stars };