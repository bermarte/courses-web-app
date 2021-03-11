export const init = async () => {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);
};



//get data from form
//do data validation
const newCourse = document.getElementById('newCourse');
newCourse.addEventListener('click', (event) => {
  event.preventDefault();
  const newData = {
    name: document.getElementById("name").value,
    location: document.getElementById("location").value,
    details: document.getElementById("details").value
  }
  console.log(newData);

});
