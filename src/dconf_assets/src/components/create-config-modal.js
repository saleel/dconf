/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { createConfiguration } from '../data-service';
import Modal from './modal';

function CreateConfigModal(props) {
  const {
    application, isOpen, onRequestClose,
  } = props;

  const [configuration, setConfiguration] = React.useState({ key: '', valueType: 'string', defaultValue: '' });

  const title = 'Add new configuration';

  async function onFormSubmit(e) {
    e.preventDefault();
    document.getElementById('create-config-submit').setAttribute('disabled', 'disabled');
    await createConfiguration(application.id, configuration);
    document.getElementById('create-config-submit').removeAttribute('disabled');
    onRequestClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel="Create configuration"
      title={title}
    >
      <form className="form" onSubmit={onFormSubmit}>

        <div className="field">
          <label htmlFor="configKey" className="label">Key</label>
          <div className="control">
            <input
              id="configKey"
              className="input form-input"
              type="text"
              value={configuration.key}
              onChange={(e) => { setConfiguration((ex) => ({ ...ex, key: e.target.value })); }}
            />
          </div>
        </div>

        <div className="field">
          <label htmlFor="configType" className="label">Type</label>
          <div className="control">
            <select
              id="configType"
              className="input form-input"
              type="text"
              value={configuration.valueType}
              onChange={(e) => { setConfiguration((ex) => ({ ...ex, valueType: e.target.value })); }}
            >
              <option value="string">String</option>
              <option value="boolean">Boolean</option>
              <option value="number">Number</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label htmlFor="configDefault" className="label">Default Value</label>
          <div className="control">
            <input
              id="configDefault"
              className="input form-input"
              type="text"
              value={configuration.defaultValue}
              onChange={(e) => { setConfiguration((ex) => ({ ...ex, defaultValue: e.target.value })); }}
            />
          </div>
        </div>

        <button id="create-config-submit" className="button mt-5" type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default CreateConfigModal;