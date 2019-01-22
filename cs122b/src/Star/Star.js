import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

function StarMovies(props){
    const movies = Object.keys(props.list).map((movie)=>
        <li key={movie}>
            <Link to={{
                pathname: "/movie",
                search: "?id="+props.list[movie].id
            }}>
            {props.list[movie].title}
            </Link>
        </li>
    );
    return(
      <Typography>
          Movies
          <ul>{movies}</ul>
      </Typography>
    );
}
class Star extends Component {
    render(){
        const query = queryString.parse(this.props.location.search);
        return (
            <Fetch url={"http://cors-anywhere.herokuapp.com/"+window.location.hostname+":8080/cs122b/star?id="+query.id}>
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <div>Loading data...</div>;
                    }

                    if (failed) {
                        return <div>The request did not succeed.</div>;
                    }

                    if (data) {
                        return (
                            <div>
                                <Card>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {data.title}
                                    </Typography>
                                    <Typography color="textSecondary">
                                        Birth Year: {data.birthYear}
                                    </Typography>
                                    <StarMovies list={data.movies}/>
                                </Card>
                            </div>
                        );
                    }
                    return null;
                }}
            </Fetch>
        );
    }
}

export default Star;
