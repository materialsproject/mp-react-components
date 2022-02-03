import '../node_modules/bulma/css/bulma.min.css';
import '../src/styles.less';
import '../src/assets/fonts.css';
import '../src//stories/stories.css';

export const parameters = {
  controls: { expanded: true, sort: 'alpha' },
  options: {
    storySort: {
      order: [
        'Introduction',
        ['MP React Components', 'Usage with Dash'],
        'Search UI',
        [
          'SearchUI Component',
          'Columns',
          'Filters',
          'Conditional Row Styles',
          'Allowed Input Types Map'
        ],
        'Data-Entry',
        [
          'MaterialsInput',
          'PeriodicTable',
          'RangeSlider',
          'DualRangeSlider',
          'Select',
          'ThreeStateBooleanSelect',
          'Switch'
        ],
        'Data-Display',
        'Publications',
        ['BibCard', 'CrossrefCard', 'BibjsonCard', 'PublicationCard', 'BibtexCard', 'BibFilter'],
        'Crystal Toolkit',
        ['CrystalToolkitScene', 'ReactGraphComponent'],
        'Navigation'
      ]
    }
  }
};
