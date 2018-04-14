export function addItem(array: string[], item: string) {
  const clearedArray = removeItem(array, item)
  return [ ...clearedArray, item]
}

export function removeItem(array: string[], item: string) {
  return array.filter(value => value !== item);
}

export function removeProperty(object: { [id: string]: any }, id: string) {
  const copyObject = { ...object }
  delete copyObject[id];
  return copyObject;
}

export interface EntityList<T> {
  byId: {
    [id: string]: T
  },
  allIds: string[]
}

export function addToEntityList<T>(entityList: EntityList<T>, entity: T): EntityList<T> {
  return {
    byId: { ...entityList.byId, [entity['id']]: entity },
    allIds: addItem(entityList.allIds, entity['id'])
  }
}

export function removeFromEntityList<T>(entityList: EntityList<T>, entityId: string): EntityList<T> {
  const byId = { ...entityList.byId };
  delete byId[entityId];
  return {
    byId,
    allIds: entityList.allIds.filter(id => id !== entityId)
  };
}

export function getList<T>(entityList: EntityList<T>): T[] {
  return entityList.allIds.map(id => entityList.byId[id]);
}
