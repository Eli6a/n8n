let mergeItems = new Array();

function pushCouple(resource1, resource2){
  mergeItems.push({resource1 : resource1,
                resource2 : resource2})
}

function findCouple(resource1, resource2){
  return mergeItems.filter(
    function(mergeItems) {
      return (mergeItems.resource1 == resource1 && mergeItems.resource2 == resource2);
    }
  );
}

for (let itemsIndex = 0; itemsIndex < $node["Aggregation Items"].json["0"].length; itemsIndex++) {

  for (let leftIndex = 0; leftIndex < $node["Aggregation Items"].json["0"][itemsIndex]["left"].length; leftIndex++){
    let left = JSON.stringify($node["Aggregation Items"].json["0"][itemsIndex]["left"][leftIndex]);
    left = JSON.parse(left);
      for (let rightIndex = 0; rightIndex < $node["Aggregation Items"].json["0"][itemsIndex]["right"].length; rightIndex++){
        let right = JSON.stringify($node["Aggregation Items"].json["0"][itemsIndex]["right"][rightIndex]);
        right = JSON.parse(right);

        let resource1;
        let resource2;

        // to keep resource1 < resource2
        if (left <= right) {
          resource1 = left;
          resource2 = right;
        }
        else {
          resource1 = right;
          resource2 = left;
        } 

        let coupleFound = findCouple(resource1, resource2);

        if (coupleFound.length == 0){        
          pushCouple(resource1, resource2);        
        }
      }    
  }
}

return mergeItems;
