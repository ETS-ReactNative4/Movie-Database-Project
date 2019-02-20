import React, {Component} from 'react';
import {Button, Container, Form, Grid, Header, Icon, Segment} from "semantic-ui-react";
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
  state = {
    schema: {},
    loading: true,
    formData: {
      title: '',
      year: '',
      director: '',
      star: '',
      genre: '',
      starname: '',
      stardob: '',
      genrename: ''
    }
  };

  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
  }

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

  handleInputChange(e) {
    let formData = Object.assign({}, this.state.formData);
    formData[e.target.name] = e.target.value;
    this.setState({formData})
  };

  handleMovie = event => {
    event.preventDefault();
    console.log(this.state.formData);
  };
  handleStar = event => {
    event.preventDefault();
    console.log(this.state.formData);
  };
  handleGenre = event => {
    event.preventDefault();
    console.log(this.state.formData);
  }
  render() {
    return (
      <Container>
        {
          this.state.loading ?
            <MyLoader/> :
            <Grid style={{marginTop: "3em"}}>
              <Grid.Column width={5}>
                <JSONTree data={this.state.schema} theme={theme}/>
              </Grid.Column>
              <Grid.Column width={11}>
                <Segment>
                  <Form onSubmit={this.handleMovie}>
                    <Header as={'h1'}>
                      <Icon name={'film'} inverted circular/>
                      Movie Input
                    </Header>
                    <Form.Group>
                      <Form.Input icon={'film'}
                                  name={'title'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Title'}/>
                      <Form.Input icon={'male'}
                                  name={'director'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Director'}/>
                      <Form.Input icon={'calendar'}
                                  name={'year'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Year'}/>
                    </Form.Group>
                    <Form.Group>
                      <Form.Input icon={'star'}
                                  name={'star'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Star'}/>
                      <Form.Input icon={'linkify'}
                                  name={'genre'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Genre'}/>
                    </Form.Group>
                    <Button color={'teal'} fluid content={'Add Movie'} type={"submit"}/>
                  </Form>
                </Segment>
                <Segment>
                  <Form onSubmit={this.handleStar}>
                    <Header as={'h1'}>
                      <Icon name={'star'} inverted circular/>
                      Star Input
                    </Header>
                    <Form.Group>
                      <Form.Input icon={'star'}
                                  name={'starname'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Star Name'}/>
                      <Form.Input icon={'calendar'}
                                  name={'stardob'}
                                  onChange={this.handleInputChange}
                                  placeholder={'Star Date of Birth'}/>
                    </Form.Group>
                    <Button color={'teal'} fluid content={'Add Star'} type={"submit"}/>
                  </Form>
                </Segment>
                <Segment>
                  <Form onSubmit={this.handleGenre}>
                    <Header as={'h1'}>
                      <Icon name={'linkify'} inverted circular/>
                      Genre Input
                    </Header>
                    <Form.Input icon={'linkify'}
                                name={'genrename'}
                                onChange={this.handleInputChange}
                                placeholder={'Genre Name'}/>
                    <Button color={'teal'} fluid content={'Add Genre'} type={"submit"}/>
                  </Form>
                </Segment>
              </Grid.Column>
            </Grid>
        }
      </Container>
    );
  }
}

export default EmployeeDashboard;