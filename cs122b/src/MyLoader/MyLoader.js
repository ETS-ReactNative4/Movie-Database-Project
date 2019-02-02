import React, { Component } from 'react';
import {Container, Dimmer, Loader} from "semantic-ui-react";


class MyLoader extends Component{
    render(){
        return(
            <Container>
                <Dimmer active inverted>
                    <Loader size='massive'>Loading</Loader>
                </Dimmer>
            </Container>
        );
    }
}

export default MyLoader;
