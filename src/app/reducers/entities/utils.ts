export function removeItem(array: string[], item: string) {
  return array.filter(value => value !== item);
}

export function removeProperty(object: { [id: string]: any }, id: string) {
  const copyObject = { ...object }
  delete copyObject[id];
  return copyObject;
}
