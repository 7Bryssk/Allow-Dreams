import React, { Component } from 'react';
import { Button, Card, CardBody, CardHeader, Col, Jumbotron, Row, CardFooter, } from 'reactstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import swal from 'sweetalert';
import $ from 'jquery';

class Home extends Component {
  constructor(props) {
    super(props);

    let dadosUser = JSON.parse(localStorage.getItem('dadosUser'))

    this.state = {
      post: '',
      user: dadosUser,
      page: 1,
      posts: [],
      consulta: false
    };

    this.handleChangePost = this.handleChangePost.bind(this);
    this.sendPost = this.sendPost.bind(this)
    this.getPosts = this.getPosts.bind(this)

  }

  handleScroll() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      this.getPosts();
    }
  }

  handleDark = () => {
    const elemento = document.getElementsByClassName('app-body')[0]
    const elemento2 = document.getElementsByClassName('app-header')[0]
    elemento.className = elemento.className.includes('dark')
      ? elemento.className.replace('dark', '').trim()
      : `${elemento.className} dark`.trim();
    elemento2.className = elemento2.className.includes('dark')
      ? elemento2.className.replace('dark', '').trim()
      : `${elemento2.className} dark`.trim();
  }

  componentDidMount() {
    this.getPosts();

    window.onscroll = () => this.handleScroll()
  }

  handleChangePost(event) {
    this.setState({ post: event });
  }

  sendPost(event) {
    axios.post(`http://127.0.0.1:3333/api/v1/post`, {
      "post_content": this.state.post,
      "user_id": this.state.user.id
    })
      .then(function (response) {
        if (response.data.message) {
          swal("Erro!", response.data.message, "error");
        } else {
          this.setState({ page: 1, post: '', posts: [] });
          this.getPosts();
        }
      }.bind(this))
      .catch(function (error) {
        swal("Erro!", "Um erro inesperado ocorreu, tente novamente!", "error");
      });
  }

  getPosts() {
    if (!this.state.consulta) {
      this.setState({ consulta: true });
      axios.post(`http://127.0.0.1:3333/api/v1/post/feed/`, {
        "user_id": this.state.user.id,
        "page": this.state.page,
        "post_friends": true
      })
        .then(function (response) {
          let newPosts = [...this.state.posts, ...response.data]

          this.setState({ posts: newPosts, page: this.state.page + 1, consulta: false });
        }.bind(this))
        .catch(function (error) {
          swal("Erro!", "Um erro inesperado ocorreu, tente novamente!", "error");
        });
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="9">
            <Card>
              <button onClick={this.handleDark}>Dark Mode</button>
            </Card>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md="9" lg="7" xl="9">
            <Card>
              <CardHeader>
                <strong>Novo Post</strong>
              </CardHeader>
              <CardBody>
                <ReactQuill value={this.state.post}
                  onChange={this.handleChangePost} />
              </CardBody>
              <CardFooter>
                <Button color="primary" onClick={this.sendPost} id="publicacao">Publicar</Button>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        {this.state.posts.length > 0 &&
          <Row className="justify-content-center">
            {
              this.state.posts.map(function (post) {
                return (

                  <Col md="9" lg="7" xl="9" key={post.id}>
                    <Card>
                      <CardHeader>
                        <Row className="justify-content-center">
                          <Col md="6" lg="6" xl="6">
                            <strong>@{post.nickname}</strong>
                          </Col>
                          <Col md="6" lg="6" xl="6" style={{ textAlign: 'right' }}>
                            {post.updated_at}
                          </Col>
                        </Row>
                      </CardHeader>
                      <CardBody dangerouslySetInnerHTML={{ __html: post.post_content }}>
                      </CardBody>
                    </Card>
                  </Col>
                )
              })
            }
          </Row>
        }
      </div>
    );
  }
}

export default Home;
