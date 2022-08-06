import React from 'react';
import { setConfigurationValue } from '../data-service';
import Modal from './modal';

function EditConfigValueModal(props) {
  const {
    application, configuration, environment, isOpen, onRequestClose, currentValue,
  } = props;

  const [value, setValue] = React.useState(currentValue);

  const title = `Edit ${configuration.key} on ${environment.name}`;

  async function onFormSubmit(e) {
    e.preventDefault();
    await setConfigurationValue(application.id, environment.id, configuration.key, value);
    onRequestClose();
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={() => onRequestClose(false)}
      contentLabel={`Edit ${configuration?.key} for ${environment?.name}`}
      title={title}
    >
      <form className="form" onSubmit={onFormSubmit}>
        <input type="text" className="form-input" value={value} onChange={(e) => { setValue(e.target.value); }} />
        <button type="submit">Submit</button>
      </form>
    </Modal>
  );
}

export default EditConfigValueModal;
