import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Route, Link, BrowserRouter} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

function Stars(props){
    const stars = Object.keys(props.list).map((star) =>
        <li key={star}>
            <Link to={{
                pathname: "/star",
                search: "?id="+props.list[star].id
            }}>
                {props.list[star].name}</Link>
        </li>
    );
    return(
        <Typography>
            Actors
            <ul>{stars}</ul>
        </Typography>
    );
}

function Genres(props){
    const genres = Object.keys(props.list).map((genre) =>
        <li key={genre}>
            {props.list[genre]}
        </li>
    );
    return (
      <Typography>
          Genres
          <ul>{genres}</ul>
      </Typography>
    );
}

class Movies extends Component {
    render(){
        return (
            <Fetch url="http://localhost:8080/cs122b/top20">
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <div>Loading data...</div>;
                    }

                    if (failed) {
                        return <div>The request did not succeed.</div>;
                    }

                    if (data) {
                        const films = Object.keys(data).map((movie) =>
                            <div key={movie}>
                                <Card>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        <Link to={{
                                            pathname: '/movie',
                                            search: '?id='+data[movie].id
                                        }}>
                                            {data[movie].title}
                                        </Link>
                                    </Typography>
                                    <Typography color="textSecondary" >
                                        Year: {data[movie].year}
                                    </Typography>
                                    <Typography color="textSecondary" >
                                        Director: {data[movie].director}
                                    </Typography>
                                    <Typography color="textSecondary" >
                                        Rating: {data[movie].rating}
                                    </Typography>
                                    <Stars list={data[movie].stars}/>
                                    <Genres list={data[movie].genres}/>
                                </Card>
                            </div>
                        );
                        return (
                           <ul>{films}</ul>
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