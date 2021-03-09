export const init = async () => {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);
};
