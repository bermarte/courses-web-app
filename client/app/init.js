export const init = async () => {
  const res = await fetch('/api/courses');
  const data = await res.json();
  console.log(data);
  listOfCourses(data);
};

// List of courses array
const listOfCourses = (arr) => {
  const courseList = [...arr.courses]
    .map(course => {
      console.log(course);
      const loadCourses = document.createElement('div');
      loadCourses.classList.add('service');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('name');
      loadCourses.appendChild(nameDiv);

      const container = document.createElement('div');
      nameDiv.appendChild(container);

      const iconDiv = document.createElement('div');
      iconDiv.classList.add('icon');
      iconDiv.innerHTML = `<i class="fas fa-laptop-code"></i>`;
      container.appendChild(iconDiv)

      const nameHeader = document.createElement('h2');
      nameHeader.innerHTML = course.name;
      container.appendChild(nameHeader);

      if (course.details === '' || course.details === undefined || course.details === null) {
        const detailsHeader = document.createElement('h3');
        detailsHeader.classList.add('details-header');
        detailsHeader.innerHTML = 'Details: ';
        const details = document.createElement('p');
        details.classList.add('detailsInfo', 'display');
        details.setAttribute('data-id', course.id);
        details.innerHTML = 'Details for the current course are not provided';
        nameDiv.appendChild(detailsHeader);
        nameDiv.appendChild(details);

      } else {
        const detailsHeader = document.createElement('h3');
        detailsHeader.classList.add('details-header');
        detailsHeader.innerHTML = 'Details: ';
        const details = document.createElement('p');
        details.classList.add('detailsInfo', 'display');
        details.setAttribute('data-id', course.id);
        details.innerHTML = course.details;
        nameDiv.appendChild(detailsHeader);
        nameDiv.appendChild(details);
      }
      
      const placeDiv = document.createElement('div');
      nameDiv.appendChild(placeDiv);
      
   
if(course.place === '' || course.place === undefined || course.place === null) {
        const place = document.createElement('p');
        place.innerHTML = ``;
        placeDiv.appendChild(place);
      }else{
        const place = document.createElement('p');
        place.innerHTML = `${course.place}`;
       
        placeDiv.appendChild(place);
      }
       
      
      const iconsDiv = document.createElement('div');
      iconsDiv.classList.add('icons');
      loadCourses.appendChild(iconsDiv);

      const infoButton = document.createElement('div');
      infoButton.classList.add('icon');
      infoButton.innerHTML = `<i class="fas fa-info-circle"></i>`;
      iconsDiv.appendChild(infoButton);
      infoButton.onclick = () => handlers.getAllCourses(course); // handlers
     

      const editButton = document.createElement('div');
      editButton.classList.add('icon');
      editButton.innerHTML = `<i class="fas fa-edit"></i>`;
      iconsDiv.appendChild(editButton);
      editButton.onclick = () => handlers.editCourse(course); // handlers 

      const deleteButton = document.createElement('div');
      deleteButton.classList.add('icon');
      deleteButton.innerHTML = `<i class="fas fa-trash-alt"></i>`;
      iconsDiv.appendChild(deleteButton );
      deleteButton.onclick = () => deleteCourse(course); // handlers

      const li = document.createElement('li');
      li.appendChild(loadCourses);
  
      return li;
    }).reduce((all, next) => {
      all.appendChild(next);
      return all;
    },
    document.createElement('ul'));

  const coursesList = document.getElementById('courses-list');
  coursesList.innerHTML = '';
  coursesList.appendChild(courseList);
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