import React, { createRef } from 'react';
import { Page, Navbar, List, ListItem } from 'framework7-react';
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';

export default class extends React.Component {
  constructor() {
    super();

    this.state = {
        latlng: {
            lat: 51.505,
            lng: -0.09,
          },
      };
  
      this.handleLocationFound = this.handleLocationFound.bind(this);
  }
  componentDidMount() {
    var map = this.refs.map.leafletElement;
    setTimeout(function() {
        map.invalidateSize();
    }, 1500);
  }
  handleLocationFound(e) {
    this.setState({
        hasLocation: true,
        latlng: e.latlng,
      })
  }
  render() {
    return (
      <Page name="map">
        <Navbar title="Карта" />
        <Map zoom={13} center={[51.505, -0.09]} key="maymap" ref="map">
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            <Marker position={[51.505, -0.09]}>
            <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker>
        </Map>
      </Page>
    );
  }
}