import React from 'react';
import {
  Page,
  Navbar,
  NavLeft,
  NavTitle,
  NavTitleLarge,
  NavRight,
  Link,
  Toolbar,
  Block,
  BlockTitle,
  List,
  ListItem,
  Row,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Col,
  Button
} from 'framework7-react';

export default class extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      backgroundImage: ''
    };

    this.getPicture = this.getPicture.bind(this);
    this.cameraSuccess = this.cameraSuccess.bind(this);
    this.cameraError = this.cameraError.bind(this);
    this.setOptions = this.setOptions.bind(this);
    this.openFilePicker = this.openFilePicker.bind(this);
  }

  render() {
    return (
      <Page name="home">
        {/* Top Navbar */}
        <Navbar title="Дэшборд" />

        <Block>
          <Row>
            <Col>
              <Button fill color="green" onClick={this.getPicture}>Фото</Button>
            </Col>
            <Col>
              <Button fill onClick={this.openFilePicker}>Файл</Button>
            </Col>
          </Row>
        </Block>

        <img src={this.state.backgroundImage} alt="" />

      </Page>
    );
  }

  setOptions(srcType) {
    var options = {
      // Some common settings are 20, 50, and 100
      quality: 80,
      destinationType: Camera.DestinationType.FILE_URI,
      // In this app, dynamically set the picture source, Camera or photo gallery
      sourceType: srcType,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      // do we need this?
      targetWidth: 600,
      targetHeight: 600,
      correctOrientation: true,  //Corrects Android orientation quirks
    }
    return options;
  }

  openFilePicker() {
    let cameraOptions = this.setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);

    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, cameraOptions);
  }

  getPicture() {
    let cameraOptions = this.setOptions(Camera.PictureSourceType.CAMERA);

    navigator.camera.getPicture(this.cameraSuccess, this.cameraError, cameraOptions);
  }

  cameraSuccess(imageUri) {
    this.setState({
      backgroundImage: imageUri,
    });
  }

  cameraError(error) {
    console.debug("Unable to obtain picture: " + error);
  }
}