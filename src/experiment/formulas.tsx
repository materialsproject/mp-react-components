import * as React from "react";
import { TableLayout, Table } from "../periodic-table/periodic-table-component/periodic-table.component";
import { useState } from "react";

export function Formulas({onFormulaClicked = () => {}}: any) {
  const foz = [
    'Li2MnO9', 'LiHo2Al', 'Li3Cu4NiO8', '(LiNi)14P2O7'
  ];

  function clicked(f) {
    onFormulaClicked(f);
  }
  return (<div>
    {foz.map(f => <div key={f} onClick={() => clicked(f)}> {f} </div>)}
  </div>)
}


const defaulthm =  {
  'K': 12,
  'O': 15,
  'Pb': 200,
  'He': 45,
  'Ti': 59,
  'V': 200,
  'Fe': 180,
  'Co': 170,
  'Ni': 160,
  'Y': 150,
  'Re': 140,
  'Os': 130,
  'Ir': 120,
  'Pt': 110,
  'Au': 100,
  'Rf': 90,
  'Db': 80,
  'Sg': 70,
  'Bh': 40,
  'Hs': 15,
  'Mt': 1,
  'Gd': 33,
  'Pa': 15,
  'Ac': 12,
  'Fr': 100,
  'Cs': 120,
  'Rb': 130,
  'Na': 140,
  'I': 150,
  'S': 160,
  'Hg': 170,
  'Ds': 10,
  'Rg': 5,
  'Cn': 1
};

export function FormulaWithTable() {

  const [hm, sethm] = useState(defaulthm);

  return (<div>
    <Formulas onFormulaClicked={(c) => {

    }} />
    <Table
      onElementHovered={() => {}}
      onElementClicked={() => {}}
      disabledElement={{}}
      hiddenElement={{}}
      enabledElement={{}}
      forceTableLayout={TableLayout.MINI}
      heatmapMax={'#FF1010'}
      heatmapMin={'#EEEEEE'}
      heatmap={
        hm
      }/>
  </div>)
}
