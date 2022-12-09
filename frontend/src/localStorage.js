export const loadState = (data) => {
  try {
    const serialState = localStorage.getItem(data);
    if (serialState === null) {
      return undefined;
    }
    return JSON.parse(serialState);
  } catch (err) {
    return undefined;
  }
};

export const saveState = (data, item) => {
  try {
    const serialState = JSON.stringify(data);
    localStorage.setItem(item, serialState);
  } catch(err) {
      console.log(err);
  }
};