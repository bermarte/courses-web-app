'use strict';


export const init = async () => {
  const res = await fetch('/api');
  const data = await res.json();
  console.log(data);
};

//are cards visible?
let cardsVisible = false;

function resetForm() {
  document.getElementById("name").value = '';
  document.getElementById("place").value = '';
  document.getElementById("details").value = '';
}

const httpHeaders = new Headers({
  'Content-Type': 'application/json'
});

resetForm();

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
      //there's an error:
      try {
        const {
          message
        } = feed.error;
        feedback.classList.remove("green");
        feedback.classList.add("red");
        feedback.innerHTML = `<div class="d-flex justify-content-center flex-row"><div class="p-2 mx-2 align-self-center">${message}</div> <span class="err"></span></div>`;
        setTimeout(removeFeedback, 7000);
      }
      //data is saved
      catch (e) {
        feedback.classList.remove("red");
        feedback.classList.add("green");
        feedback.innerHTML = "Data written to file";
        setTimeout(removeFeedback, 7000);
        //empty form once post is done
        resetForm();
        /*
        reload cards if cards are visible
        */
        if (cardsVisible) simulateClick(courseList);
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
        //remember that cards are visible
        cardsVisible = true;
        const parsed = JSON.parse(result);
        const items = document.getElementById("items");
        //stop adding HTML elements
        items.innerHTML = '';
        parsed.courses.forEach(item => {
          const cardId = item.id;
          const cardName = item.name;
          const cardDetails = item.details;

          //place is optional
          let cardPlace = '';
          if (item.place !== "") cardPlace = `<p class="font coursePlace text-white bg-secondary card-round">${item.place}</p>`;
          /*
          card template: will join HTML to produce a single card in JS
          */
          let card = '<!-- card -->\n' +
            '<div\n' +
            '   class="card card-width col-12 col-sm-6 col-md-4 col-xl-3 card-color card border-light card-round mx-auto">\n' +
            '    <div class="card-body text-center">\n' +
            `        <h6 class="card-title text-right font pos-r">Course Id: <span class="courseId">${cardId}</span> </h6>\n` +
            '        <div class="row">\n' +
            '            <div class="w-25 mx-auto">\n' +
            '                <img class="img-thumbnail img-icon border-0" alt="icon"\n' +
            '                    src="./assets/online-course.png">\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <div class="container mt-4">\n' +
            `            <div class="alert bg-primary card-round font courseName" role="alert">${cardName}</div>\n` +
            '        </div>\n' +
            '        <div class="d-flex flex-column bottom">\n' +
            `            <div class= "detail" id="detail_${cardId}"><h5 class="font-weight-bold">Details:</h5>\n` +
            `            <p class="font courseDescription">${cardDetails}</p></div>\n` +
            `            ${cardPlace}\n` +
            '            <div class="w-15 d-flex justify-content-between justify-content-center">\n' +
            '                <img class="img-thumbnail img-icon information" alt="information"\n' +
            `                    src="./assets/information.png" width="50" height="15" role="button" onclick="document.getElementById('detail_${cardId}').style.display = 'block';" >\n` +
            '                <img class="img-thumbnail img-icon edit" alt="edit" src="./assets/edit.png"\n' +
            '                    width="50" height="15" role="button">\n' +
            '                <img class="img-thumbnail img-icon delete" alt="delete" src="./assets/delete.png"\n' +
            `                    width="50" height="15" role="button" onclick="deleteItem(${cardId})">\n` +
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
//send click
const simulateClick = function (elem) {
  // Create our event (with options)
  var evt = new MouseEvent('click', {
    bubbles: true,
    cancelable: true,
    view: window
  });
  // If cancelled, don't dispatch our event
  var canceled = !elem.dispatchEvent(evt);
};

//DELETE card by id
window.deleteItem = function (id) {

  const requestOptions = {
    method: 'DELETE',
    headers: httpHeaders,
    redirect: 'follow'
  };
  fetch(`/api/courses/${id}`, requestOptions)
    .then(response => response.text())
    .then(result => {
      feedback.classList.remove("red");
      feedback.classList.add("green");
      feedback.innerHTML = "Item removed";
      console.log(result);
      /*send get courses
      reload cards */
      simulateClick(courseList);
    })
    .catch(error => {
      console.log(error);
    });

};