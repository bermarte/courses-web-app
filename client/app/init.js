'use strict';


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

//GET
const courseList = document.getElementById("courseList");
courseList.addEventListener('click', () => {

  const requestOptions = {
    method: 'GET',
    headers: httpHeaders,
    redirect: 'follow'
  };

  fetch('/api/courses/', requestOptions)
    .then(response => response.text())
    .then(result => {
      try {
        const parsed = JSON.parse(result);
        console.log('hello', parsed);
        const items = document.getElementById("items");

        parsed.courses.forEach(item => {
          const cardId = item.id;

          //card template
          let card = '<!-- card -->\n' +
            '<div\n' +
            '   class="card card-width col-12 col-sm-6 col-md-4 col-xl-3 card-color card border-light card-round mx-auto">\n' +
            '    <div class="card-body text-center">\n' +
            `        <h6 class="card-title text-right font mr-5">Course Id: <span class="courseId">${cardId}</span> </h6>\n` +
            '        <div class="row">\n' +
            '            <div class="w-25 mx-auto">\n' +
            '                <img class="img-thumbnail img-icon border-0" alt="icon"\n' +
            '                    src="./assets/online-course.png">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="container mt-4">\n' +
            '            <div class="alert bg-primary card-round font courseName" role="alert">JavaScript</div>\n' +
            '        </div>\n' +
            '        <div class="d-flex flex-column bottom">\n' +
            '            <h5 class="font-weight-bold">Details:</h5>\n' +
            '            <p class="font courseDescription">Creates dynamic activity on your app.</p>\n' +
            '            <div class="w-15 d-flex justify-content-between justify-content-center">\n' +
            '                <img class="img-thumbnail img-icon information" alt="information"\n' +
            '                    src="./assets/information.png" width="50" height="15" role="button">\n' +
            '                <img class="img-thumbnail img-icon edit" alt="edit" src="./assets/edit.png"\n' +
            '                    width="50" height="15" role="button">\n' +
            '                <img class="img-thumbnail img-icon delete" alt="delete" src="./assets/delete.png"\n' +
            '                    width="50" height="15" role="button">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '    </div>\n' +
            '</div>'
          items.innerHTML += card;
        });

      } catch (e) {
        console.log('error');
      }

    })
    .catch(error => {
      console.log(error);
    });

});