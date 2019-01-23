import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import {Card, List, Icon, Label, Container, Header} from 'semantic-ui-react';

function StarMovies(props){
    const movies = Object.keys(props.list).map((movie)=>
        <List.Item key={movie}>
            <Link to={{
                pathname: "/movie",
                search: "?id="+props.list[movie].id
            }}>
                <Label>
                    <Icon name={"film"}/>{props.list[movie].title}
                </Label>
            </Link>
        </List.Item>
    );
    return(
      <List link>
          {movies}
      </List>
    );
}
class Star extends Component {
    render(){
        let CORSUrl = "http://cors-anywhere.herokuapp.com/"+window.location.hostname;
        if (window.location.hostname==="localhost"){
            CORSUrl = "http://localhost"
        };
        const query = queryString.parse(this.props.location.search);
        CORSUrl = CORSUrl+":8080/cs122b/star?id="+query.id;
        return (
            <Fetch url={CORSUrl}>
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <div>Loading data...</div>;
                    }

                    if (failed) {
                        return <div>The request did not succeed.</div>;
                    }

                    if (data) {
                        if(data.birthYear === 0){
                            data.birthYear = " ";
                        }
                        else {
                            data.birthYear = "Born in " + data.birthYear;
                        }
                        return (
                            <Container>
                                <Card.Group centered>
                                    <Card>
                                        <Card.Content>
                                            <Card.Header>
                                                <Header as={"h1"}>
                                                {data.title}
                                                </Header>
                                            </Card.Header>
                                            <Card.Meta>
                                                {data.birthYear}
                                            </Card.Meta>
                                            <Card.Description>
                                                <StarMovies list={data.movies}/>
                                            </Card.Description>
                                        </Card.Content>
                                    </Card>
                                </Card.Group>
                            </Container>
                        );
                    }
                    return null;
                }}
            </Fetch>
        );
    }
}

export default Star;
