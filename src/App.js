import React from 'react'
import * as GitHubAPI from './GitHubAPI'
import './App.css'
import {
  Container,
  Row,
  Col,
  Form,
  Spinner,
  Image
} from 'react-bootstrap'
import { Debounce } from 'react-throttle'

class App extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: null,
      username_list: [],
      searching: false
    }
  }

  search = (username, page = 1) => {
    if (username !== this.state.username) {
      this.clearContent()
    }

    if (username) {
      this.setState({username: username, searching: true});
      GitHubAPI
      .searchByUsername(username)
      .then((result) => {
        if (result.total_count) {
          this.setState({ username_list: result.items, searching: false })
        } else {
          this.clearContent();
        }
      })
      .catch((e) => {
        console.log(e)
      });
    } else {
      this.clearContent();
    }
  }

  clearContent = () => {
    this.setState({
      username: null,
      userdata: null,
      searching: false
    });
  }

  render () {
    const { username, username_list, searching } = this.state
    let list;
    if (username_list.length) {
      list = username_list.map((item, index) =>
        <Image key={ index } src={ item.avatar_url } className='avatar' />
      )
    } else {
       list = <p>No results</p>
    }
    return (
      <Container className='py-5'>
        <h1 className='text-center'>GitHub search</h1>
        <Row className='justify-content-md-center pb-5'>
          <Col lg='6'>
            <Debounce time='400' handler='onChange'>
              <Form.Control
                className='input-github'
                placeholder='Search username'
                aria-label='Type a username to search on GitHub'
                onChange={(event) => this.search(event.target.value)}
              />
            </Debounce>
          </Col>
        </Row>
        {
          searching &&
          <Row className='text-center py-5'>
            <Col>
              <Spinner animation='border' role='status' variant='light'>
                <span className='sr-only'>Loading...</span>
              </Spinner>
            </Col>
          </Row>
        }
        <Row>
          <Col className='text-center'>
            { username && !searching && list }
          </Col>
        </Row>
      </Container>
    )
  }
}

export default App
