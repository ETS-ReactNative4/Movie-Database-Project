import React, {Component} from 'react';
import {Container, Grid} from "semantic-ui-react";
import MyLoader from "../MyLoader/MyLoader";
import JSONTree from "react-json-tree";

const theme = {
  scheme: 'atelier forest',
  author: 'bram de haan (http://atelierbram.github.io/syntax-highlighting/atelier-schemes/forest)',
  base00: '#1b1918',
  base01: '#2c2421',
  base02: '#68615e',
  base03: '#766e6b',
  base04: '#9c9491',
  base05: '#a8a19f',
  base06: '#e6e2e0',
  base07: '#f1efee',
  base08: '#f22c40',
  base09: '#df5320',
  base0A: '#d5911a',
  base0B: '#5ab738',
  base0C: '#00ad9c',
  base0D: '#407ee7',
  base0E: '#6666ea',
  base0F: '#c33ff3'
};

class EmployeeDashboard extends Component {
  state = {schema: {}, loading: true};

  getSchemaDatabase() {
    fetch('http://' + window.location.hostname + ':8080/cs122b/employee?schema=true', {
      method: 'GET',
      credentials: 'include'
    }).then(
      (res) => res.json()
    ).then(
      data => {
        this.setState({schema: data, loading: false});
      }
    )
  }
  componentDidMount() {
    this.getSchemaDatabase();
  }

  render() {
    return (
      <Container>
        {
          this.state.loading ?
            <MyLoader/> :
            <Grid>
              <Grid.Column width={5}>
                <JSONTree data={this.state.schema} theme={theme}/>
              </Grid.Column>
            </Grid>
        }
      </Container>
    );
  }
}

export default EmployeeDashboard;