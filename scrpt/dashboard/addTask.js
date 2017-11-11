
function addButtonClicked()
{
  clicked = this.id;
  // Identify clicked Button
  var color;
  switch (clicked) {
    case "monAdd":
      showAddMenu(monList, monColor, "Monday");
      break;
    case "tueAdd":
      showAddMenu(tueList, tueColor, "Tuesday");
      break;
    case "wedAdd":
      showAddMenu(wedList, wedColor, "Wednesday");
      break;
    case "thuAdd":
      showAddMenu(thuList, thuColor, "Thursday");
      break;
    case "friAdd":
      showAddMenu(friList, friColor, "Friday");
      break;
    case "satAdd":
      showAddMenu(satList, satColor, "Saturday");
      break;
    case "sunAdd":
      showAddMenu(sunList, sunColor, "Sunday");
      break;
  }
}

// Open 'New Task' Menu
function showAddMenu(list, color, text) {

    addBtn.style.display = "block";
    editBtn.style.display = "none";
    addTitle.style.display = "block";
    editTitle.style.display = "none";

    day.innerText = text;
    day.style.color = color;
    addBtn.style.background = color;
    closeBtn.style.background = color;
    addMenu.style.zIndex = "2000";
    //Confirm Task creation
    addBtn.onclick =  () => addConfirmButtonClicked(list);
    sleep(200).then(() => {
      addMenu.style.opacity = "1";
    });
  };

function addConfirmButtonClicked(list) {
  if (taskName.value.trim() == "") {
    taskName.style.border = "1px solid #FF514C"
    taskDesc.style.border = "none"
  } else if (taskDesc.value.trim() == "") {
    taskDesc.style.border = "1px solid #FF514C"
    taskName.style.border = "none"
  } else {

    var taskKey = dataRefTasks.push().key;

    var projectId = document.querySelector('input[name="project"]:checked').id;
    console.log(projectId);

    if (projectId != 'noProject') {
      var project = document.querySelector('label[for=' + projectId + ']');
      var projectColor = project.children[0].classList[1];
      var projectTitle = project.children[1].innerText;
      console.log(projectColor);
      console.log(projectTitle);
    }

    var li = generateTask(taskName.value, taskDesc.value, false, projectId, projectColor, projectTitle);

    var newTask = dataRefTasks.child(taskKey).update({ taskName: taskName.value, taskDesc: taskDesc.value, checked: false, project: projectId })
    var weekEntry = dataRefSelectedWeek.child(list.id).child(taskKey).set("");

    if (projectId != "noProject") {
      var projectEntry = dataRefProject.child(projectId).child('tasks').child(taskKey).set("");
    }

    li.id = taskKey;

    list.appendChild(li);
    hideAddMenu();
  }
}

// Close 'New Task' Menu
function hideAddMenu() {
  taskName.style.border = "none";
  addMenu.style.opacity = "0";
  sleep(300).then(() => {
    addMenu.style.zIndex = "-1000";
    taskName.value = "";
    taskDesc.value = "";
  });
};

function createToDoItem() {
  if (toDoValue.value.trim() == "") {
    toDoValue.style.border = "1px solid #FF514C";
  } else {
    toDoValue.style.border = "none";

    var counterDiv = document.getElementById('counterContainer');
    var counterCheck = document.getElementById('check');

    var li = generateBubbleTask(toDoValue.value, false);
    var taskKey = dataRefTasks.push().key;
    li.id = taskKey;

    var newTask = dataRefTasks.child(taskKey).update({taskName: toDoValue.value, checked: false});

    var counterValue = document.getElementById('counterValue');
    counterDiv.style.display = 'block';
    var count = parseInt(counterValue.innerText);
    if (count == 0) {
      counterDiv.style.background = 'red';
      counterValue.style.display = 'block';
      counterCheck.style.display = 'none';
    }
    count++;
    counterValue.innerText = count;

    var newEntry = dataRefSelectedWeek.child('bubbleList').child(taskKey).set("");

    toDoList.appendChild(li);
  }
}

function fetchAndAppendProjects() {

  dataRefProject.once('value', function(snap) {
    snap.forEach(function(project) {

          var form = projectSelector.children[0];

          var radio = document.createElement('input');
          radio.type = 'radio';
          radio.name = 'project';
          radio.id = project.key;

          var label = document.createElement('label');
          label.htmlFor = project.key;

          var colorDot = document.createElement('div');
          colorDot.classList.add('color', project.val().info.projectColor);

          var projectTitle = document.createElement('h3');
          projectTitle.innerText = project.val().info.projectTitle;

          var infoBtn = document.createElement('button');
          infoBtn.type = 'button';
          infoBtn.name = 'button';
          infoBtn.innerHTML = '<img src="res/info.png" alt="See your project details">';
          infoBtn.addEventListener('click', addRedirect);

          label.appendChild(colorDot);
          label.appendChild(projectTitle);
          label.appendChild(infoBtn);

          form.appendChild(radio);
          form.appendChild(label);
    })
  });
}
