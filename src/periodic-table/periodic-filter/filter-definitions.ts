// map displayed value to data value

//TODO(chab) leverage TS to prevent errors, if we know the shape of the filters and the shape of the datas
// we can have static validations

export const FILTER_VALUE_MAPPER: any = {
  'Gases': 'Gas',
  'Liquids': 'Liquid',
  'Solids': 'Solid',
  'Unknown': 'unknown',
  'Alkali': 'element-alkali-metal',
  'Alkali Earth Metals': 'element-alkali-earth-metal',
  'Actinides': 'element-actinoid',
  'Metalloids': 'element-metalloid',
  'Transition Metals': 'element-transition-metal',
  'Post-Transition Metals': 'element-metal', //TODO(chab) confirm with Matthew
  'Lanthanides': 'element-lanthoid',
  'Noble Gases': 'element-noble-gas',
  'Halognes': 'element-halogen',
  'Nonmetals': 'element-non-metal'
};


export const FILTERS = {
  categories: [
    [{ name: "All", subGroups: []}],
    [

      {
        name: "Metals", key: "category",
        subGroups: [
          { name: "Alkali" },
          { name: "Alkali Earth Metals" },
          { name: "Transition Metals" },
          { name: "Post-Transition Metals" },
          { name: "Metalloids" },
          { name: "Lanthanides" },
          { name: "Actinides" }
        ]
      },
      {
        name: "Nonmetals", key: "category",
        subGroups: [
          { name: "Nonmetals" },
          { name: "Halognes" },
          { name: "Noble Gases" }
        ]
      }
    ],
    [
      {
        name: "Phase", key: "phase",
        subGroups: [
          { name: "Gases" },
          { name: "Liquids" },
          { name: "Solids" }
        ]
      }
    ],
    [
      {
        name: "Groups", key: "group", // TODO(chab)
        subGroups: [
          {name: 1},
          {name: 2},
          {name: 3},
          {name: 4},
          {name: 5},
          {name: 6},
          {name: 7},
          {name: 8},
          {name: 9},
          {name: 10},
          {name: 11},
          {name: 12},
          {name: 13},
          {name: 14},
          {name: 15},
          {name: 16},
          {name: 17},
          {name: 18}
        ]
      },
      {
        name: 'Periods', key: 'period', subGroups: [
          {name: 1},
          {name: 2},
          {name: 3},
          {name: 4},
          {name: 5},
          {name: 6},
          {name: 7}
        ]
      }
    ]
  ]
};

export const FILTER_BY_CATEGORY = FILTERS.categories.reduce((acc : {[id: string]: string[]}, filters) => {
  return (filters as any[]).reduce((_, filter: any) => {
     acc[filter.name] = filter.subGroups;
     return acc;
  }, acc)
}, {});

console.log(FILTER_BY_CATEGORY);

