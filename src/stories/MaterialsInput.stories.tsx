import React from 'react';
import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MaterialsInput, MaterialsInputProps } from '../components/data-entry/MaterialsInput';
import {
  MaterialsInputType,
  PeriodicTableMode
} from '../components/data-entry/MaterialsInput/MaterialsInput';

export default {
  component: MaterialsInput,
  title: 'Data-Entry/MaterialsInput',
  parameters: { actions: { argTypesRegex: '^on.*' } }
};

const Template: Story<MaterialsInputProps> = (args) => <MaterialsInput {...args} />;

export const MultiType = Template.bind({});
MultiType.args = {
  periodicTableMode: 'toggle' as PeriodicTableMode,
  allowedInputTypes: [
    'elements' as MaterialsInputType,
    'formula' as MaterialsInputType,
    'mpid' as MaterialsInputType
  ],
  errorMessage: 'Please enter a valid list of element symbols, chemical formula, or Material ID.',
  onSubmit: action('onSubmit')
};

export const Elements = Template.bind({});
Elements.args = {
  periodicTableMode: 'toggle' as PeriodicTableMode,
  allowedInputTypes: ['elements' as MaterialsInputType],
  errorMessage: 'Please enter a valid list of element symbols separated by a comma or a dash.',
  inputType: 'elements' as MaterialsInputType,
  onSubmit: action('onSubmit')
};

export const ElementsWithHelp = Template.bind({});
ElementsWithHelp.args = {
  ...Elements.args,
  helpItems: [
    {
      label: 'Elements Examples'
    },
    {
      label: null,
      examples: ['Li,Fe', 'Li-Fe', 'Li-Fe-*-*']
    }
  ]
};

export const Formula = Template.bind({});
Formula.args = {
  periodicTableMode: 'toggle' as PeriodicTableMode,
  allowedInputTypes: ['formula' as MaterialsInputType],
  errorMessage: 'Please enter a valid chemical formula.',
  inputType: 'formula' as MaterialsInputType,
  onSubmit: action('onSubmit')
};

export const FormulaWithoutPeriodicTable = Template.bind({});
FormulaWithoutPeriodicTable.args = {
  ...Formula.args,
  periodicTableMode: 'none' as PeriodicTableMode
};

export const FormulaWithLabel = Template.bind({});
FormulaWithLabel.args = {
  ...FormulaWithoutPeriodicTable.args,
  label: 'Formula'
};

export const FormulaWithoutSubmit = Template.bind({});
FormulaWithoutSubmit.args = {
  ...FormulaWithLabel.args,
  onSubmit: undefined,
  inputType: 'formula' as MaterialsInputType
};
/** Need to ignore onSubmit action or else it won't be considered undefined */
FormulaWithoutSubmit.parameters = { actions: { argTypesRegex: '^(?!onSubmit)on.*' } };

export const FormulaWithAutocomplete = Template.bind({});
FormulaWithAutocomplete.args = {
  ...FormulaWithLabel.args,
  autocompleteFormulaUrl: 'https://api.materialsproject.org/materials/formula_autocomplete/'
};
