import * as React from 'react';

import './addNew.css';

interface IAddNewProps {
  addNew: (name: string) => void;
  close: () => void;
}

interface IAddNewState {
    name: string;
  }

class AddNew extends React.Component<IAddNewProps, IAddNewState> { 
  public readonly state: IAddNewState = {
    name: '',
  }

  public render() {
    return (
      <form>
        <div className="add-new-header">
          <span className="add-new-header-text">{('Add new joker').toUpperCase()}</span>
        </div>
        <div className="add-new-content">
          <div className="form-group">
            <label htmlFor="newname">Name</label>
            <input className="form-control" id="newname" value={this.state.name} onChange={this.onNameChange} />
          </div>
          <button className="btn btn-primary mr-1" onClick={this.addNew} disabled={!this.state.name}>Add</button>
          <button className="btn btn-secondary" onClick={this.close}>Close</button>
        </div>
      </form>
    );
  }

  private onNameChange = (e: any) => {
    this.setState(
      {
        name: e.target.value,
      }
    )
  }

  private addNew = (e: any) => {
    this.props.addNew(this.state.name);
    e.preventDefault();
  }

  private close = (e: any) => {
    this.props.close();
    e.preventDefault();
  }
}

export default AddNew;
