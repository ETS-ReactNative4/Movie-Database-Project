import React, { Component } from 'react';
import { Fetch } from 'react-request';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';

const styles = {
    card: {
        minWidth: 300,
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
        transform: 'scale(0.8)',
    },
    title: {
        fontSize: 14,
    },
    pos: {
        marginBottom: 12,
    },
};

class Movies extends Component {
    render(){
        return (
            <Fetch url="http://localhost:8080/top20">
                {({ fetching, failed, data }) => {
                    if (fetching) {
                        return <div>Loading data...</div>;
                    }

                    if (failed) {
                        return <div>The request did not succeed.</div>;
                    }

                    if (data) {
                        // const listItems = Object.keys(data).map((movie) =>
                        //     <tr key={movie}>
                        //         <td>{data[movie].title}</td>
                        //         <td>{data[movie].year}</td>
                        //         <td>{data[movie].director}</td>
                        //         <td>{data[movie].rating}</td>
                        //         <td>{data[movie].stars}</td>
                        //         <td>{data[movie].genres}</td>
                        //     </tr>
                        // );
                        // return (
                        //     <table>
                        //         <tr><th>Movie Title</th><th>Year</th><th>Director</th><th>Rating</th><th>Stars</th></tr>
                        //         {listItems}
                        //         </table>
                        // );
                        const films = Object.keys(data).map((movie) =>
                            <div key={movie}>
                                <Card>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        Title: {data[movie].title}
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
                                    {
                                    }
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
