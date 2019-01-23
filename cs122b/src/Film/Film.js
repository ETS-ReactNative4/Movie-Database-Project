import React, { Component } from 'react';
import { Fetch } from 'react-request';
import queryString from 'query-string';
import {Stars} from "../Movies/Movies";
import {Card,Container, Header} from "semantic-ui-react";
class Film extends Component {
    render(){
        const query = queryString.parse(this.props.location.search);
        let CORSUrl = "http://cors-anywhere.herokuapp.com/"+window.location.hostname;
        if (window.location.hostname==="localhost"){
            CORSUrl = "http://localhost"
        };
        CORSUrl = CORSUrl+":8080/cs122b/movies?id="+query.id;
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
                        return (
                            <Container>
                                <Card.Group centered>
                                    <Card>
                                        <Card.Content>
                                            <Card.Header>
                                                <Header>
                                                {data.title}
                                                </Header>
                                            </Card.Header>
                                            <Card.Meta>
                                                Rating: {data.rating}
                                            </Card.Meta>
                                            <Card.Description>
                                                <Stars list={data.stars}/>
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

export default Film;
