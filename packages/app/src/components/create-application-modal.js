/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import useCanister from '../hooks/use-canister';
import Modal from './modal';
import { sanitize } from '../utils';

function CreateApplicationModal(props) {
  const { isOpen, onRequestClose } = props;

  const [application, setApplication] = React.useState({ id: '', name: '' });

  const { createApplication } = useCanister();

  const title = 'Add new application';

  async function onFormSubmit(e) {
    e.preventDefault();
    document.getElementById('create-application-submit').setAttribute('disabled', 'disabled');
    await createApplication(application);
    document.getElementById('create-application-submit').removeAttribute('disabled');
    onRequestClose(true);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel="Create application"
      title={title}
    >
      <form className="form" onSubmit={onFormSubmit}>

        <div className="field">
          <label htmlFor="applicationName" className="label">Name</label>
          <div className="control">
            <input
              id="applicationName"
              className="input form-input"
              type="text"
              value={application.name}
              onChange={(e) => { setApplication((ex) => ({ ...ex, name: e.target.value, id: sanitize(e.target.value) })); }}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="applicationId" className="label">ID</label>
          <div className="control">
            <input
              id="applicationId"
              className="input form-input"
              type="text"
              value={application.id}
              onChange={(e) => { setApplication((ex) => ({ ...ex, id: e.target.value })); }}
            />
          </div>
        </div>

        <button id="create-application-submit" className="button mt-5" type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default CreateApplicationModal;
