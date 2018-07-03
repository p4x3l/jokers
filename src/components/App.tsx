import * as React from 'react';
import { Modal } from 'reactstrap';

import AddNew from './addNew/addNew';
import DrawBoard from './drawBoard/drawBoard';

import { firebase } from '../firebase';

import IJoker from '../models/joker';

import './App.css';

interface IAppState {
  jokers: IJoker[];
  addNew: boolean;
}

class App extends React.Component<{}, IAppState> {
  public readonly state: IAppState = {
    addNew: false,
    jokers: [],
  }

  constructor(props: any) {
    super(props);

    this.onAddClick = this.onAddClick.bind(this);
  }

  public componentWillMount() {
    firebase.db.ref('jokers').on('value', (snapshot: any) => {
      this.recieveData(snapshot.val());
    });
  }
  
  public render() {
    const { jokers } = this.state;

    return (
      <div className="App">
        <div className="dad-header">
          <span className="dad-header-text">DAD JOKE OF THE DAY</span>
          <div className="add-button-container" onClick={this.onAddClick}>
            <i className="fas fa-plus" />
          </div>
        </div>
        <div className="dad-content">
          {
            Object.keys(jokers || {}).map((key: string) => (
              <DrawBoard key={`${key}-drawing`} joker={jokers[key]} drawnOn={
                // tslint:disable-next-line jsx-no-lambda
                () => this.drawnOn(key, jokers[key].counter)
              } />
            ))
          }
        </div>
        <Modal isOpen={this.state.addNew}>
          <AddNew addNew={this.createJoker} close={this.closeModal} />
        </Modal>
      </div>
    );
  }

  private onAddClick() {
    this.setState({addNew: true});
  }

  private recieveData = (inputData: any) => {
    this.setState({
      jokers: JSON.parse(JSON.stringify(inputData))
    });
  }

  private createJoker = (name: string) => {
    const key = firebase.db.ref().child('jokers/').push().key;
    const joker = { name, counter: 0 };
    firebase.db.ref(`jokers/${key}`).update(joker)
      .then(() => this.setState({addNew: false}));
  }

  private closeModal = () => {
    this.setState({
      addNew: false,
    });
  }

  private drawnOn = (key: string, currentVal: number): void => {
    firebase.db.ref(`jokers/${key}`).update({ counter: currentVal + 1});
  }
}

export default App;
