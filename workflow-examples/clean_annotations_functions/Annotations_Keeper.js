// array that will be return
let leftRightArray = new Array();

let array = item.Annotations.split("'], ['");

array[0] = array[0].substr(3,array[0].length);
array[1] = array[1].substr(0,array[1].length-3);

let left = array[0].split("', '");
left = left.sort();

let right = array[1].split("', '");
right = right.sort();

leftRightArray.push({left : left, right : right});

return leftRightArray;

