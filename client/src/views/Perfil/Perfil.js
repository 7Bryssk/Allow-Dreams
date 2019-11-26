import React, { Component } from 'react';
import {
  Card,
  CardBody,
  CardFooter,
  Row,
  Col,
  Button,
  CardHeader,
  Jumbotron,
} from "reactstrap";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import swal from 'sweetalert';
import $ from 'jquery';

class Perfil extends Component {
  constructor(props) {
    super(props);
    this.state = {
      post: '',
      user: null,
      userId: props.match.params.id,
      user_logado: JSON.parse(localStorage.getItem('dadosUser')),
      page: 1,
      posts: [],
      consulta: false
    };

    this.handleChangePost = this.handleChangePost.bind(this);
    this.sendPost = this.sendPost.bind(this)
    this.getPosts = this.getPosts.bind(this)
  }



  componentDidMount() {
    let dadosUser
    if (!this.state.userId) {
      $(function () {

        dadosUser = JSON.parse(localStorage.getItem('dadosUser'))
        this.setState({ user: dadosUser });
        this.getPosts();
      }.bind(this))

    } else {
      axios.get(`http://127.0.0.1:3333/api/v1/users/1`)
        .then(function (response) {
          dadosUser = response.data;

          this.setState({ user: response.data });

          window.onscroll = () => this.handleScroll()
          this.getPosts();
        }.bind(this))
        .catch(function (error) {
          swal("Erro!", "Um erro inesperado ocorreu, tente novamente!", "error");
        })
    }
  }

  handleScroll() {
    if ($(window).scrollTop() + $(window).height() == $(document).height()) {
      this.getPosts();
    }
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
        "post_friends": false
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
      <div className="content">
        {this.state.user &&
          <div>
            <Row className="justify-content-center">
              <Col md="9" lg="7" xl="6">
                <Card className="card-user">
                  <div className="image" style={{ textAlign: 'center', marginTop: '30px', width: 'auto', height: 'auto' }}>
                    <img
                      alt="..."
                      src={require("../../assets/img/user.jpeg")}
                      style={{ textAlign: 'center', width: '200px', height: '200px', borderRadius: '360px' }}
                    />
                  </div>
                  <CardBody>
                    <div className="author">
                      <h5 className="title" style={{ textAlign: 'center' }}>{this.state.user.name}</h5>
                    </div>
                    <p className="description text-center">
                      @{this.state.user.nickname}
                    </p>
                    <p className="description text-center">
                      Descrição
                    </p>
                  </CardBody>
                  <CardFooter>
                    <hr />
                    <div className="button-container">
                      <Row className="justify-content-center" style={{ textAlign: 'center' }}>
                        <Col lg="3" md="6" xs="6">
                          <h5>
                            2 <br />
                            <small>Albúns</small>
                          </h5>
                        </Col>
                        <Col lg="3" md="6" xs="6">
                          <h5>
                            12<br />
                            <small>Postagens</small>
                          </h5>
                        </Col>
                        <Col lg="3" md="6" xs="6">
                          <h5>
                            9.570<br />
                            <small>Seguidores</small>
                          </h5>
                        </Col>
                      </Row>
                    </div>
                  </CardFooter>
                </Card>
              </Col>
            </Row>

            {this.state.user.id == this.state.user_logado.id &&
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
            }

            {this.state && this.state.posts.length > 0 &&
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
        }
      </div>
    );
  }
}
export default Perfil;