import React from 'react';

function ConfigValueInput(props) {
  const { configuration, onChange, value } = props;

  const { valueType } = configuration;

  if (valueType === 'string') {
    return (
      <input
        type="text"
        className="form-input"
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
      />
    );
  }

  if (valueType === 'number') {
    return (
      <input
        type="number"
        className="form-input"
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
      />
    );
  }

  if (valueType === 'boolean') {
    return (
      <select
        className="form-input"
        value={value}
        onChange={(e) => { onChange(e.target.value); }}
      >
        <option value="true">True</option>
        <option value="false">False</option>
      </select>
    );
  }
}

export default ConfigValueInput;
