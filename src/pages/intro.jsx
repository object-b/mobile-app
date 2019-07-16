import React from 'react';
import {
  Page,
  Navbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  NavTitle,
  Row,
  Col,
  Button
} from 'framework7-react';

export default class extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Page className="page-background-white">
        {/* Top Navbar */}
        <Navbar className="flex-align-center">
          <NavTitle>Просто тайтл</NavTitle>
        </Navbar>

        <BlockTitle medium>Привет</BlockTitle>
        <Block>
          <span>1. Загрузи</span><br />
          <span>2. Оцени</span><br />
          <span>3. Поделись</span><br />
        </Block>

        <BlockTitle medium>Кто будет убирать</BlockTitle>
        <Block>
          <p>Donec et nulla auctor massa pharetra adipiscing ut sit amet sem. Suspendisse molestie velit vitae mattis tincidunt.</p>
        </Block>

        <Block>
          <Row tag="p">
            <Col tag="span">
              <Button large outline href="/login/">Вход</Button>
            </Col>
            <Col tag="span">
              <Button large fill href="/register/">Регистрация</Button>
            </Col>
          </Row>
        </Block>

      </Page>
    );
  }

  componentDidMount() {
    this.$f7ready((f7) => {
      f7.$('.toolbar').hide();
    });
  }
}