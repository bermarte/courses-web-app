export const init = async () => {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);
};

const httpHeaders = new Headers({
  'Content-Type': 'application/json'
});


let feedback = document.getElementById("feedback");
const newCourse = document.getElementById('newCourse');

//POST
newCourse.addEventListener('click', (event) => {
  event.preventDefault();

  let name = document.getElementById("name").value;
  let place = document.getElementById("place").value;
  let details = document.getElementById("details").value;

  //cast to numbers if possible
  if (Number(name)) name = Number(name);
  if (Number(place)) place = Number(place);
  if (Number(details)) details = Number(details);

  const formValues = {
    name,
    place,
    details
  }

  const raw = JSON.stringify(formValues);

  const requestOptions = {
    method: 'POST',
    headers: httpHeaders,
    body: raw,
    redirect: 'follow'
  };
  const removeFeedback = () => {
    feedback.innerHTML = '';
  };

  fetch('/api/courses/', requestOptions)
    .then(response => response.text())
    .then(result => {
      const feed = JSON.parse(result);
      //if there's an error:
      try {
        const {
          message
        } = feed.error;
        feedback.classList.remove("green");
        feedback.classList.add("red");
        feedback.innerHTML = `<div class="d-flex justify-content-center flex-row"><div class="p-2 mx-2 align-self-center">${message}</div> <span class="err"></span></div>`;
        setTimeout(removeFeedback, 7000);
      }
      //if data is saved
      catch (e) {
        feedback.classList.remove("red");
        feedback.classList.add("green");
        feedback.innerHTML = "Data written to file";
        setTimeout(removeFeedback, 7000);
      }

    })
    .catch(error => {
      console.log('catch error', error);
      feedback.innerHTML = 'error';
    });

});