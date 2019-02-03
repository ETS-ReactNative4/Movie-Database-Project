import React, { Component } from 'react';
import { Fetch } from 'react-request';
import MyLoader from "../MyLoader/MyLoader";
import {Redirect} from "react-router";
import {FilmCard} from "../Film/Film";
import {Container, Form, Card, Button} from "semantic-ui-react";

function SearchResults(props){
    return(
        <Fetch url={'http://'+window.location.hostname+':8080/cs122b/search?title='+props.title+
        '&year='+props.year+'&director='+props.director+'&name='+props.name+'&offset='+props.offset} credentials={'include'}>
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
                    //props.handler(data.numRecords);
                    const films = Object.keys(data.movies).map((movie) =>
                        <FilmCard key={movie} movieid={data.movies[movie].id} title={data.movies[movie].title}
                                  year={data.movies[movie].year} director={data.movies[movie].director} rating={data.movies[movie].rating}
                                  stars = {data.movies[movie].stars} genres={data.movies[movie].genres}/>
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

class Search extends Component{
    state = {
        valid: false,
        mounted: false,
        searched: false,
        form_title: "",
        title: "",
        form_director: "",
        director: "",
        form_year: "",
        year: "",
        form_name: "",
        name: "",
        offset: 0,
        total: 0
    };
    constructor(props){
        super(props);
        this.handleTotal = this.handleTotal.bind(this);
    }
    handleTotal(props){
        this.setState({
            total: props.num
        })
    }
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
        this.setState({form_title: event.target.value})
    };
    handleDirectorChange = event => {
        this.setState({form_director: event.target.value})
    };
    handleYearChange = event => {
        this.setState({form_year: event.target.value})
    };
    handleNameChange = event => {
        this.setState({form_name: event.target.value})
    };
    handleSubmit = event =>{
        event.preventDefault();
        this.setState({
            searched: true,
            title: this.state.form_title,
            director: this.state.form_director,
            year: this.state.form_year,
            name: this.state.form_name
        });
    };
    render(){
        if(this.state.mounted && this.state.valid){
            return(
                <div>
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
                    {this.state.searched ?
                        <SearchResults title={this.state.title} director={this.state.director}
                                       year={this.state.year} name={this.state.name} offset={this.state.offset} handler={this.handleTotal}/>
                        :
                        null
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
