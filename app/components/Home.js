// @flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import routes from '../constants/routes.json';

type Props = {};

export default class Home extends Component<Props> {
  props: Props;
  state = {
    wif: '',
    sigHash: ''
  }

  handleOnChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  }

  render() {
    const { wif, sigHash } = this.state;
    return (
      <div className="container" data-tid="container">
        <div className="row">
          <div className="col">
            <h2>Tyrion</h2>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h2>Form</h2>
            <form>
              <label>WIF</label>
              <input value={wif} onChange={this.handleOnChange} type="string" id="wif" />

              <label>Sig Hash</label>
              <input value={sigHash} onChange={this.handleOnChange} type="string" id="sigHash" />

              <a href="#">
                Submit
              </a>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
