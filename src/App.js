import React, { Component } from 'react';
import logo from './image/netpie_logo.png';
import reactLogo from './image/reactlogo.svg';
import config from './config';
import './App.css';

const microgear = Microgear.create({
  key: config.appKey,
  secret: config.appSecret,
  alias : 'reactdev',
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,
      lampStatus: false,
    }

    this.onSwitch = this.onSwitch.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  componentWillMount() {
    microgear.on('message', this.onMessage);
    microgear.on('connected', this.onconnected);

    microgear.connect(config.appId);
    microgear.subscribe(config.topic);
  }

  onconnected() {
    microgear.setAlias('reactdev');
    console.log('connected');
  }

  onMessage(topic,msg) {
    console.log(msg);
    this.setState({
      lampStatus: msg === 'ON' ? true : false,
      waiting: false,
    });
  }

  onSwitch(lampStatus) {
    const topic = config.topic;
    this.setState({ waiting: true });
    microgear.publish(topic, lampStatus ? 'ON' : 'OFF', true);
  }

  render() {
    const lampSource = this.state.lampStatus ? require('./image/on.png') : require('./image/off.png');

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            <img src={logo} className="App-logo" alt="logo" />
            <img src={reactLogo} className="App-logo" alt="logo" />
            <h3>Welcome to React NETPIE Demo</h3>
            <p>NETPIE client library for HTML5 Javascript</p>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-3">
            <img src={lampSource} className="img-responsive" alt="lamp" />
          </div>
          <div className="col-sm-2">
            <button
              type="button"
              className="btn btn-success btn-lg btn-block"
              disabled={this.state.lampStatus || this.state.waiting}
              onClick={() => this.onSwitch(true)}
            >
              ON
            </button>
            <button
              type="button"
              className="btn btn-danger btn-lg btn-block"
              disabled={!this.state.lampStatus || this.state.waiting}
              onClick={() => this.onSwitch(false)}
            >
              OFF
            </button>
          </div>
        </div>

      </div>
    );
  }
}

export default App;
