import React, { Component } from 'react';
import { Fetch } from 'react-request';
import {Link} from 'react-router-dom';
import queryString from 'query-string';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import {Stars} from "../Movies/Movies";

class Film extends Component {
    render(){
        const query = queryString.parse(this.props.location.search);
        return (
            <Fetch url={"http://"+window.location.hostname+":8080/cs122b/movies?id="+query.id}>
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
                                        Rating: {data.rating}
                                    </Typography>
                                    <Stars list={data.stars}/>
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

export default Film;
