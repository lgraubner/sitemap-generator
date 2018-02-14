module.exports = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month =
    now.getMonth() + 1 < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1;
  const date = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  return `${year}-${month}-${date}`;
};
