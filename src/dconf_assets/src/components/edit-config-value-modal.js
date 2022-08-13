import React from 'react';
import { setConfigurationValue } from '../data-service';
import ConfigValueInput from './config-value-input';
import Modal from './modal';

function EditConfigValueModal(props) {
  const {
    application, configuration, environment, isOpen, onRequestClose, currentValue,
  } = props;

  const [value, setValue] = React.useState(currentValue);

  const title = `Edit ${configuration.key} on ${environment.name}`;

  async function onFormSubmit(e) {
    e.preventDefault();
    document.getElementById('edit-config-submit-button').setAttribute('disabled', 'disabled');
    await setConfigurationValue(application.id, environment.id, configuration.key, value);
    document.getElementById('edit-config-submit-button').removeAttribute('disabled');
    onRequestClose(true);
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel={`Edit ${configuration?.key} for ${environment?.name}`}
      title={title}
    >
      <form className="form" onSubmit={onFormSubmit}>

        <ConfigValueInput
          configuration={configuration}
          value={value}
          onChange={(e) => { setValue(e.target.value); }}
        />

        <button id="edit-config-submit-button" className="button mt-5" type="submit">Submit</button>

      </form>
    </Modal>
  );
}

export default EditConfigValueModal;
