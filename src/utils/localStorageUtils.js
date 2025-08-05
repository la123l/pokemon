export const getCollection = () => {
  const data = localStorage.getItem("pokemon-collection");
  return data ? JSON.parse(data) : [];
};

export const saveCollection = (collection) => {
  localStorage.setItem("pokemon-collection", JSON.stringify(collection));
};