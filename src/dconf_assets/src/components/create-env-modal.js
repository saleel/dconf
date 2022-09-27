/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { createEnvironment } from '../data-service';
import Modal from './modal';
import { sanitize } from '../utils';

function CreateEnvironmentModal(props) {
  const {
    application, isOpen, onRequestClose,
  } = props;

  const [environment, setEnvironment] = React.useState({ id: '', name: '' });

  const title = 'Add new environment';

  async function onFormSubmit(e) {
    e.preventDefault();
    document.getElementById('create-config-submit').setAttribute('disabled', 'disabled');
    await createEnvironment(application.id, environment);
    document.getElementById('create-config-submit').removeAttribute('disabled');
    onRequestClose(true);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel="Create environment"
      title={title}
    >
      <form className="form" onSubmit={onFormSubmit}>

        <div className="field">
          <label htmlFor="envName" className="label">Name</label>
          <div className="control">
            <input
              id="envName"
              className="input form-input"
              type="text"
              value={environment.name}
              onChange={(e) => {
                setEnvironment((ex) => ({
                  ...ex,
                  name: e.target.value,
                  id: sanitize(e.target.value),
                }));
              }}
            />
          </div>

          <label htmlFor="envName" className="label">ID</label>
          <div className="control">
            <input
              id="envName"
              className="input form-input"
              type="text"
              value={environment.id}
              onChange={(e) => { setEnvironment((ex) => ({ ...ex, id: e.target.value })); }}
            />
          </div>
        </div>

        <button id="create-config-submit" className="button mt-5" type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default CreateEnvironmentModal;
