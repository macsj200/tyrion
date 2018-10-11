import React, { Component } from 'react';
import crypto from 'crypto';
import img from '../images/titanLogo.png';
import faker from 'faker';

var bitcoin = require('bitcoinjs-lib');

// TODO generate new key!!!
const publicKey = '-----BEGIN PUBLIC KEY-----\n' +
	'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDCtTEic76GBqUetJ1XXrrWZcxd\n' +
	'8vJr2raWRqBjbGpSzLqa3YLvVxVeK49iSlI+5uLX/2WFJdhKAWoqO+03oH4TDSup\n' +
	'olzZrwMFSylxGwR5jPmoNHDMS3nnzUkBtdr3NCfq1C34fQV0iUGdlPtJaiiTBQPM\n' +
	't4KUcQ1TaazB8TzhqwIDAQAB\n' +
    '-----END PUBLIC KEY-----';

export default class Home extends Component {
  state = {
    wif: '', //'BuJRgDGLynQmN12yrS1kL4XGg8xzpySgGrWjdthsktgTZ9PfHnKF',
    sigHashesRaw: null, // '["f7b43605ca334a74ba8bfdfa4099d0f995844d6fe1f24175907bbe343a1197bf"]',
    sigHashes: [],
    signatures: [],
    errorMessage: null
  }
  handleOnChange = (e) => {
    const { id, value } = e.target;
    this.setState({ [id]: value });
  }
  parseSigHashesRaw = async () => {
    const { sigHashesRaw } = this.state;
    const signatureLength = 172;
    // const signature = 'd2wIgO6rsU2amgYTTDp3ZEoB15YCU6dpUL5FXaJgFUzrFEzilWQEETivQGaSASac+oNxGERA+Thc57g/XRRgy8UQ79pnAXX3uAW94V8MJaSmByhsfmdWhSCs1Ub7XDhU6yakJ2Qa8a9pdZ0tlBUByczWISqXbtWy3gR79g8VQYY=';
    const signature = decodeURIComponent(sigHashesRaw.slice(0, signatureLength));
    console.log(signature);
    const hashes = sigHashesRaw.slice(signatureLength);
    const verifier = crypto.createVerify('sha256');
    verifier.update(hashes);
    // console.log(signature, hashes, publicKey)
    const verified = verifier.verify(publicKey, signature, 'base64');
    if(verified) {
        try {
            const sigHashes = JSON.parse(hashes) /* TODO safer implementation */;
            await this.setState({ sigHashes });
        } catch (err) {
            const errorMessage = err.message;
            this.setState({ errorMessage })
        }
    } else {
        this.setState({ errorMessage: 'Signature not verified' })
    }
  }
  createSig = () => {
    try {
      const sign = (keyPair, sigHash) => keyPair.sign(Buffer.from(sigHash, 'hex')).toScriptSignature(bitcoin.Transaction.SIGHASH_ALL).toString('hex');
      const { sigHashes, wif } = this.state;
      const network = {
        messagePrefix: '\x18Bitcoin Signed Message:\n',
        bech32: 'bc',
        bip32: {
          public: 0x0488b21e,
          private: 0x0488ade4
        },
        pubKeyHash: 0x1b,
        scriptHash: 0x1f,
        wif: 0x49
      };
      const keyPair = bitcoin.ECPair.fromWIF(wif, network);
      const signatures = sigHashes.map(sigHash => sign(keyPair, sigHash));
      this.setState({ signatures });
    } catch (err) {
      const errorMessage = err.message;
      this.setState({ errorMessage })
    }
  }
  handleSign = async () => {
    this.setState({ errorMessage: null }) // reset error on new submit
    await this.parseSigHashesRaw();
    this.createSig();
  }
  // https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
  downloadObjectAsJson(exportObj, exportName) {
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", exportName + ".json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  generatePhrase() {
    const { sigHashesRaw } = this.state;
    if (sigHashesRaw) {
        const signatureLength = 172;
        const signature = decodeURIComponent(sigHashesRaw.slice(0, signatureLength));
        let seed = 0;
        for(let i = 0; i < signature.length; i++) {
          const charCode = signature.charCodeAt(i);
          seed += charCode;
        }
        
        faker.seed(seed);
    
        const phrase = faker.random.words(3);
        return phrase;
    } else {
        return "";
    }
  }
  render() {
    const { wif, sigHashesRaw, signatures, errorMessage } = this.state;
    let signaturesRaw;
    if (signatures.length > 0) {
      signaturesRaw = JSON.stringify(signatures);
    }
    return (
      <div className="container-fluid">
          <div className="navbar">
              <img className="navbar-brand img-fluid" style={{width:'4rem'}} src={img} alt=""/>
          </div>
          <div className="card w-auto mx-auto" style={{maxWidth: '45rem', padding: '4rem'}}>
              <div className="row">
                  <div className="col">
                      <h2 className="text-center">Offline Signing Tool</h2>
                      <h4><a href="https://github.com/titan-digital-exchange/offline-signing-tool/blob/master/README.md">Instructions</a></h4>
                  </div>
              </div>
              <div style={{ paddingTop: '1rem' }} className="text-center">
                <p>
                    You should manually verify that the phrase you see here matches the
                    phrase displayed in Titan Escrow.
                </p>
            </div>
            <div style={{ backgroundColor: 'grey' }} className="text-center">
                <h5 style={{ color: 'white', padding: '.5rem' }}>{this.generatePhrase()}</h5>
            </div>
              <div className="row">
                  <div className="col">
                      <form>
                          <div className="form-group">
                              <label>WIF</label>
                              <input className="form-control" value={wif} onChange={this.handleOnChange} type="string" id="wif" />
                          </div>
                          <div className="form-group">
                              <label>Sig Hash (JSON)</label> {/* TODO better file format? */}
                              <input type="file" className="form-control-file"
                                     style={{ marginBottom: '.5rem' }}
                                     onChange={e => {
                                         const file = e.target.files[0];
                                         const fileReader = new FileReader();
                                         fileReader.addEventListener('load', () => this.setState({ sigHashesRaw: fileReader.result }));
                                         fileReader.readAsText(file);
                                     }}
                              ></input>
                              <pre>{sigHashesRaw}</pre>
                              {/* <textarea className="form-control" spellCheck="false" value={sigHashesRaw} onChange={this.handleOnChange} id="sigHashesRaw" rows="3" placeholder="Sig hashes" required></textarea> */}
                              {/* <input className="form-control" value={sigHash} onChange={this.handleOnChange} type="textarea" id="sigHash" /> */}
                          </div>
                          <div className="row">
                              <a className="orangeButton mx-auto" onClick={this.handleSign} style={{width: '17rem'}}>
                                  <div style={{margin: 'auto'}}>
                                      Sign
                                  </div>
                              </a>
                          </div>
                      </form>
                      {errorMessage && <div className="alert alert-danger" style={{ marginTop: '1rem' }}>
                          <h4 className="alert-heading">Error</h4>
                          {errorMessage}
                      </div>}
                      {signaturesRaw && <div className="alert alert-success " style={{ marginTop: '1rem' }}>
                          <h4 className="alert-heading">Signatures (JSON)</h4>
                          {signaturesRaw && <div>
                              <pre className="mb-0">{signaturesRaw}</pre>
                              <div className="row">
                                  <a
                                      style={{ marginTop: '1rem', marginRight: '.5rem', width: '17rem' }}
                                      className="orangeButton mx-auto "
                                      onClick={() => this.downloadObjectAsJson(signatures /* not signaturesRaw */, 'signatures')}
                                  >
                                      <div style={{margin: 'auto'}}>
                                          Download File
                                      </div>
                                  </a>
                              </div>
                          </div>}
                      </div>}
                  </div>
              </div>
          </div>
      </div>
    );
  }
}
