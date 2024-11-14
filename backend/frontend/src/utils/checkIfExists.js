export function checkIfExists(id, arr) {
  return arr.some((item) => item._id === id);
}
