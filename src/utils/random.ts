export const randomIndex = <T>(list: T[]): number => {
  return Math.floor(Math.random() * list.length);
};

export const selectRandom = <T>(list: T[]): T => {
  const index = randomIndex(list);
  return list[index];
};

export const popRandom = <T>(list: T[]): T => {
  const index = randomIndex(list);
  const [item] = list.splice(index, 1);
  return item;
};

export const randomEnum = <T extends object>(anEnum: T): T[keyof T] => {
  const enumValues = Object.values(anEnum) as unknown as T[keyof T][];
  return selectRandom(enumValues);
};
