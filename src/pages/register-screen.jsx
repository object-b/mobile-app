import React from 'react';
import {
  Page,
  LoginScreenTitle,
  List,
  Icon,
  ListInput,
  ListButton,
  Button,
  Row,
  Col,
  Block,
  Navbar,
  BlockFooter
} from 'framework7-react';

import auth from '../api/auth.js';

export default class extends React.Component {
  constructor(props) {
    super(props);

    // REMOVE ME
    this.state = {
      name: '1',
      email: '1@1.com',
      password: 'jsdhfsdhfjhdjsfhfjsd',
    };
  }

  render() {
    return (
      <Page noToolbar noSwipeback loginScreen>
        <Navbar backLink="Назад" title="Регистрация" />
        <List form>
          <ListInput
            type="text"
            required
            validateOnBlur
            floatingLabel
            label="Имя"
            value={this.state.name}
            onInput={(e) => {
              this.setState({ name: e.target.value });
            }}
          />
          <ListInput
            type="text"
            required
            floatingLabel
            validateOnBlur
            label="Электронная почта"
            value={this.state.email}
            onInput={(e) => {
              this.setState({ email: e.target.value });
            }}
          />
          <ListInput
            type="password"
            required
            floatingLabel
            validateOnBlur
            label="Пароль"
            minlength={6}
            value={this.state.password}
            onInput={(e) => {
              this.setState({ password: e.target.value });
            }}
          />
        </List>
        <List>
        {/* <ListButton onClick={this.signUp.bind(this)}>Зарегистрироваться</ListButton> */}
          <Block>
            <Row>
              <Col width="15"></Col>
              <Col width="70">
                <Button fill onClick={this.signUp.bind(this)}>Зарегистрироваться</Button>
              </Col>
              <Col width="15"></Col>
            </Row>
          </Block>
          <BlockFooter className="auth-block-footer">или через социальные сети</BlockFooter>
          <Block>
            <Row>
              <Col>
                <Button fill style={{ backgroundColor: '#4c75a3' }}>
                  <Icon size="20" icon="fab fa-vk"></Icon>
                </Button>
              </Col>
              <Col>
                <Button fill style={{ backgroundColor: '#ed812b' }}>
                  <Icon size="20" icon="fab fa-odnoklassniki"></Icon>
                </Button>
              </Col>
              <Col>
                <Button fill style={{ backgroundColor: '#3b5999' }}>
                  <Icon size="20" icon="fab fa-facebook"></Icon>
                </Button>
              </Col>
            </Row>
          </Block>
        </List>
      </Page>
    )
  }
  async signUp() {
    const self = this;
    const app = self.$f7;
    const router = self.$f7router;
    const $$ = self.Dom7;

    if ($$('.login-screen-content form')[0].checkValidity()) {
      app.dialog.preloader('Загрузка...');

      const { email, password, name } = this.state;
      const response = await auth.register(email, password, name);

      if (response.status === 401) {
        app.dialog.alert(response.data.error || 'Неизвестная ошибка. Код 2');
      } else if (response.status === 200) {
        router.navigate('/object-list');
      } else {
        app.dialog.alert(response);
      }

      app.dialog.close();
    }
  }
}