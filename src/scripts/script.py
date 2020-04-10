from pymatgen.symmetry.groups import SpaceGroup
from pymatgen.util.string import unicodeify_spacegroup
import json

d = []


for x in range(1, 231):
    sg = SpaceGroup.from_int_number(x)
    dico = {}
    dico['full-symbol'] = sg.full_symbol
    dico['crystal-system'] = sg.crystal_system
    dico['point-group'] = sg.point_group
    dico['uni-point-group'] = unicodeify_spacegroup(sg.point_group)
    dico['uni-symbol'] = unicodeify_spacegroup(sg.symbol)
    dico['uni-full-symbol'] = unicodeify_spacegroup(sg.full_symbol)
    dico['symbol'] = sg.symbol
    dico['number'] = x
    d.append(dico)



j = json.dumps(d, indent=4)
f = open('sample.json', 'w')
print(j, file=f)
f.close()