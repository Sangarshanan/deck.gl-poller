/* global window */
import React, {Component} from 'react';
import {render} from 'react-dom';
import {StaticMap} from 'react-map-gl';
import DeckGL from '@deck.gl/react';
import {View, MapView} from '@deck.gl/core';
import {H3HexagonLayer} from '@deck.gl/geo-layers';

// Set your mapbox token here
const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  latitude: 37.7749,
  longitude: -122.4194,
  zoom: 11,
  maxZoom: 16,
  pitch: 45,
  bearing: 0
};

// https://github.com/visgl/deck.gl/issues/2508

let date_var = new Date();

setInterval(intervalFunction, 500);

function intervalFunction() {
 date_var = new Date(); 
}

export class App extends Component {
  constructor(props) {
    super(props);
  }

  _redraw(){
    console.log("Reloading map objects:",new Date())
    this.forceUpdate()
  }

  componentDidMount() {
    console.log("Mount")
    this.interval = setInterval(() => this._redraw(), 2000);
  }

  componentWillUnmount() {
    console.log("Un Mount")  
    clearInterval(this.interval);
  }

  _renderLayers() {

    return [
    new H3HexagonLayer({
        id: 'h3-hexagon-layer',
        // appending a query parameter to the url, 
        // which would resolve to the same file but 
        // trick the layer into thinking it's a different data source
        data: `./hexids.json?timestamp=${date_var}`,
        pickable: true,
        wireframe: false,
        filled: true,
        extruded: true,
        elevationScale: 20,
        getHexagon: d => d.hex,
        getFillColor: d => [255, (1 - d.count / 500) * 255, 0],
        getElevation: d => d.count
      })
    ];
  }

  render() {
    return (
      <DeckGL
        layers={this._renderLayers()}
        getTooltip={({object}) => object && `${object.hex} count: ${object.count}`}
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
      >
        <StaticMap
          reuseMaps
          mapStyle="mapbox://styles/mapbox/dark-v9"
          preventStyleDiffing={true}
          mapboxApiAccessToken={MAPBOX_TOKEN}
        />
      </DeckGL>
    );
  }
}

/* global document */
render(<App />, document.body.appendChild(document.createElement('div')));
