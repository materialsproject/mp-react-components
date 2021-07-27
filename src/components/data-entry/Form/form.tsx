import { useForm } from 'react-hook-form';
import { Field } from '../search-grid/cards-definition';
import './form.less';
import React from 'react';

export function Simpleform({ fields, onChange }) {
  const { register, errors, handleSubmit } = useForm({ mode: 'onChange', submitFocusError: false });
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form
      className="form-widget"
      onChange={handleSubmit(onChange)} // not sure if it's a good idea
      onSubmit={handleSubmit(onSubmit)}
    >
      {fields.map((field: Field) => (
        <div key={field.id} className={`form-field ${errors[field.name] ? 'error' : 'valid'}`}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            ref={register(field.validationOptions)}
          />
        </div>
      ))}
    </form>
  );
}
