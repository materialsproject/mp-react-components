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
          'Building a Search UI',
          'SearchUIContainer',
          ['Fully Featured', 'With MP Contribs Data', 'Matscholar Alpha'],
          'SearchUISearchBar',
          'SearchUIFilters',
          'SearchUIDataHeader',
          'SearchUIDataTable',
          'SearchUIDataView',
          'SearchUIGrid',
          'Columns',
          'Filters',
          'Conditional Row Styles',
          'Search Bar Input Types'
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
