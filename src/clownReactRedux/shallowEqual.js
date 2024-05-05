function is(x, y) {
  if (x === y) return x !== 0 || y !== 0 || 1 / x === 1 / y;
  else return x !== x && y !== y;
}

export default function shallowEqual(obj1, obj2) {
  if (is(obj1, obj2)) return true;
  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  )
    return false;
  const key1 = Object.keys(obj1),
    key2 = Object.keys(obj2);
  if (key1.length !== key2.length) return false;
  for (let i = 0; i < key1.length; ++i)
    if (
      !Object.prototype.hasOwnProperty.call(obj2, key1[i]) ||
      !is(obj1[key1[i]], obj2[key1[i]])
    )
      return false;
  return true;
}
