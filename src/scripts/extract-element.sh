// extract a json from the original html JSONIFIED file


cat ./table.json | jq '.children | map(select(.class="periodic-row") | select(.children) .children | .[] | select(.class | contains("element-blank")| not)| { class:.class, symbol:.children[0].children[0].children[1].html, elementNumber: .children[0].children[0].children[0].html'}

