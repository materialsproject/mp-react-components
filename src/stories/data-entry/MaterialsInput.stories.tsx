import React from 'react';
import { Story } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { MaterialsInput, MaterialsInputProps } from '../../components/data-entry/MaterialsInput';
import {
  MaterialsInputType,
  PeriodicTableMode
} from '../../components/data-entry/MaterialsInput/MaterialsInput';

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
    'chemical_system' as MaterialsInputType,
    'elements' as MaterialsInputType,
    'formula' as MaterialsInputType,
    'mpid' as MaterialsInputType
  ],
  type: 'chemical_system' as MaterialsInputType,
  chemicalSystemSelectHelpText:
    'Select elements to search for materials with **only** these elements',
  elementsSelectHelpText:
    'Select elements to search for materials with **at least** these elements',
  errorMessage: 'Please enter a valid list of element symbols, chemical formula, or Material ID.',
  showSubmitButton: true,
  onSubmit: action('onSubmit')
};

export const Elements = Template.bind({});
Elements.args = {
  ...MultiType.args,
  allowedInputTypes: ['chemical_system' as MaterialsInputType, 'elements' as MaterialsInputType],
  errorMessage: 'Please enter a valid list of element symbols separated by a comma or a dash.',
  type: 'chemical_system' as MaterialsInputType
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

export const ChemicalSystem = Template.bind({});
ChemicalSystem.args = {
  ...MultiType.args,
  allowedInputTypes: ['chemical_system' as MaterialsInputType],
  errorMessage: 'Please enter a valid chemical system (e.g. Li-Fe-Co).',
  type: 'chemical_system' as MaterialsInputType
};

export const Formula = Template.bind({});
Formula.args = {
  ...MultiType.args,
  allowedInputTypes: ['formula' as MaterialsInputType],
  errorMessage: 'Please enter a valid chemical formula.',
  type: 'formula' as MaterialsInputType
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
  showSubmitButton: false,
  type: 'formula' as MaterialsInputType
};
/** Need to ignore onSubmit action or else it won't be considered undefined */
FormulaWithoutSubmit.parameters = { actions: { argTypesRegex: '^(?!onSubmit)on.*' } };

export const FormulaWithAutocomplete = Template.bind({});
FormulaWithAutocomplete.args = {
  ...FormulaWithLabel.args,
  autocompleteFormulaUrl: 'https://api.materialsproject.org/materials/formula_autocomplete/'
};
