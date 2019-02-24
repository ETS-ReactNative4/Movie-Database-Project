import React from 'react';
import MyLoader from "../MyLoader/MyLoader";
import {Redirect} from "react-router";
import MovieList, {options} from "../MovieList/MovieList"
import {Container, Form, Button, Segment, Pagination} from "semantic-ui-react";


class Search extends MovieList {
    state = {
        title: "",
        search: "notsearched",
        director: "",
        year: "",
        name: "",
        data: null,
        limit: 10,
        pages: 0,
        activePage: 1,
        total: 0,
        sort: "rating",
        order: "DESC"
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
    handlePaginationChange = (e, {activePage}) => this.setState({activePage}, this.getMovies)
    handleOrderChange = (e, data) => {
        this.setState({order: data.value});
    };
    handleSortChange = (e, data) => {
        this.setState({sort: data.value});

    };

    getMovies() {
        this.setState({search: "loading"});
        fetch('https://' + window.location.hostname + ':8443/cs122b/search?title=' + this.state.title +
            '&year=' + this.state.year + '&director=' + this.state.director + '&name=' + this.state.name +
            '&limit=' + this.state.limit + '&offset=' + ((this.state.activePage - 1) * this.state.limit +
                '&sort=' + this.state.sort + '&order=' + this.state.order), {
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

    render() {
        if (this.state.mounted && this.state.valid) {
            return (
                <div>
                    <Segment>
                        <Form size={'large'} onSubmit={this.handleSubmit}>
                            <Form.Group widths={'equal'}>
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
                            </Form.Group>
                            <Form.Group widths={'equal'}>
                                <Form.Select fluid
                                             placeholder={'Sort'}
                                             onChange={this.handleSortChange}
                                             options={[{key: 1, text: 'Rating', value: 'rating'},
                                                 {key: 2, text: 'Title', value: 'title'}]}
                                />
                                <Form.Select fluid
                                             placeholder={'Order Asc/Desc'}
                                             onChange={this.handleOrderChange}
                                             options={[{key: 1, text: 'Ascending', value: 'ASC'},
                                                 {key: 2, text: 'Descending', value: 'DESC'}]}
                                />
                                <Form.Select fluid
                                             placeholder={'Results Per Page'}
                                             onChange={this.handleLimitChange}
                                             options={options}
                                />
                                <Button color={'teal'} fluid size={'small'} type={"submit"}>
                                    Search
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
                        super.render(this.props)
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

export default Search;
