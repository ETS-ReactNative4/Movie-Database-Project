import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import {Card, List, Icon, Label, Container, Header,} from 'semantic-ui-react';
import {Redirect} from "react-router";
import MyLoader from "../MyLoader/MyLoader";

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
    state = {
        valid: false,
        mounted: false
    };
    componentDidMount(){
        fetch('https://'+window.location.hostname+':8443/cs122b/login', {
            method: 'GET',
            credentials: 'include'
        }).then(
            (res) => {
                if(res.status === 403){
                    console.log("Invalid session");
                }
                else{
                    console.log("Logged in");
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
                <Fetch url={'https://'+window.location.hostname+':8443/cs122b/star?id='+query.id} credentials={'include'}>
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
                            let born = "Born in "+ data.birthYear;
                            if(data.birthYear === 0){
                                born = " ";
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
                                                    {born}
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

export default Star;
