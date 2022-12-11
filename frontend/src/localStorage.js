export const loadState = (data) => {
  try {
    // console.log("loadState----------------------")
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
    // console.log("saveState------------------------")
    const serialState = JSON.stringify(data);
    localStorage.setItem(item, serialState);
  } catch(err) {
      console.log(err);
  }
};