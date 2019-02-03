import React, { Component } from 'react';
import MyLoader from "../MyLoader/MyLoader";
import {Redirect} from "react-router";
import {FilmCard} from "../Film/Film";
import {Container, Form, Card, Button, Segment} from "semantic-ui-react";

function SearchResults(props){
    const films = Object.keys(props.data).map((movie) =>
        <FilmCard key={movie} movieid={props.data[movie].id} title={props.data[movie].title}
                  year={props.data[movie].year} director={props.data[movie].director} rating={props.data[movie].rating}
                  stars = {props.data[movie].stars} genres={props.data[movie].genres}/>
    );
    return (
        <Container>
            <Card.Group centered>{films}</Card.Group>
        </Container>
    );
}
class Search extends Component{
    state = {
        valid: false,
        mounted: false,
        search: "notsearched",
        title: "",
        director: "",
        year: "",
        name: "",
        offset: 0,
        data: null,
        limit: 12,
        pages: 0,
        total: 0
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
    };
    componentWillUnmount(){
        this.setState({mounted: false});
    };
    handleTitleChange = event => {
        this.setState({title: event.target.value})
    };
    handleDirectorChange = event => {
        this.setState({director: event.target.value})
    };
    handleYearChange = event => {
        this.setState({year: event.target.value})
    };
    handleNameChange = event => {
        this.setState({name: event.target.value})
    };
    handleNext = event =>{
        if((this.state.total-(this.state.offset+this.state.limit)) > 0){
            this.setState({offset: this.state.offset+this.state.limit},this.getMovies);
        }
    };
    handlePrev = event =>{
        if((this.state.total-(this.state.offset-this.state.limit)) <= this.state.total){
            this.setState({offset: this.state.offset-this.state.limit},this.getMovies);
        }
    };
    handleSubmit = event =>{
        event.preventDefault();
        this.setState({offset: 0},this.getMovies);
    };
    getMovies() {
        this.setState({search: "loading"});
        fetch('http://'+window.location.hostname+':8080/cs122b/search?title='+this.state.title+
            '&year='+this.state.year+'&director='+this.state.director+'&name='+this.state.name+'&offset='+this.state.offset, {
            method: 'GET',
            credentials: 'include'
        }).then(
            (res) => res.json()
        ).then(
            data => this.setState({data: data.movies, total: data.numRecords, search: "received"}, function(){
                this.setState({pages: Math.ceil(this.state.total/this.state.limit)})
            })
        );
    }
    renderContent(){
        switch(this.state.search){
            case "loading":
                return(
                  <MyLoader/>
                );
            case "received":
                return(
                    <SearchResults data={this.state.data}/>
                );
            default:
                return(
                    null
                );
        }
    }
    renderPagination(){

    }
    render(){
        if(this.state.mounted && this.state.valid){
            return(
                <div>
                    <Segment>
                        <Form size={'large'} onSubmit={this.handleSubmit}>
                            <Form.Group widths={'equal'} >
                                <Form.Input fluid icon={'film'}
                                            placeholder={'Movie Name'}
                                            onChange={this.handleTitleChange}
                                />
                                <Form.Input fluid icon={'star outline'}
                                            placeholder={'Star Name'}
                                            onChange={this.handleNameChange}
                                />
                                <Form.Input fluid icon={'male'}
                                            placeholder={'Director'}
                                            onChange={this.handleDirectorChange}
                                />
                                <Form.Input fluid icon={'calendar alternate outline'}
                                            placeholder={'Year'}
                                            onChange={this.handleYearChange}
                                />
                                <Button color={'teal'} fluid size={'small'} type={"submit"}>
                                    Search
                                </Button>
                            </Form.Group>
                        </Form>
                        <Button.Group widths={2}>
                            <Button color={'teal'} onClick={this.handlePrev}>
                                Prev
                            </Button>
                            <Button color={'teal'} onClick={this.handleNext}>
                                Next
                            </Button>
                        </Button.Group>
                    </Segment>
                    {
                        this.renderContent()
                    }
                </div>
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
export default Search;
