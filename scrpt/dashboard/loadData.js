
function loadAndAddTasks(week) {
  for (var i = 0; i < 7; i++) {
    var id = "date" + i;
    var dateId = document.getElementById(id);
    dateId.innerText = week.getDayAsString(i);
  }
  NProgress.start();
  NProgress.configure({ minimum: 0.1 });

  var toDoCount = 0;

  // Retrieving Tasks and appending them to Lists
  dataRefSelectedWeek.once('value', function (week) {
    week.forEach(function (day) {

      var addDay = day.key;
      var rightList = document.getElementById(addDay);

      day.forEach(function (taskid) {
        var task = taskid.key;

        dataRefTasks.child(task).once('value').then( function(snap) {
          var data = snap.val();
          if (day.key == "bubbleList") {
            counterDiv.style.display = "block";

            if (data.checked == false) {
              toDoCount++;
              counter.innerText = toDoCount;
              counterDiv.style.background = "red";
              counterCheck.style.display = "none";
              counterValue.style.display = "block";

              mobileCounter.innerText = toDoCount;
              mobileCounterDiv.style.background = "red";
              mobileCounterCheck.style.display = "none";
              mobileCounterValue.style.display = "block";
            } else if (toDoCount == 0) {
              counterDiv.style.background = "#39B44A";
              counterCheck.style.display = "block";
              counterValue.style.display = "none";

              mobileCounterDiv.style.background = "#39B44A";
              mobileCounterCheck.style.display = "block";
              mobileCounterValue.style.display = "none";
            }
            var li = generateBubbleTask(data.taskName, data.checked);
            li.id = task;
            rightList.appendChild(li);
          }
          else if (data.project == 'noProject')
          {
             var li = generateTask(data.taskName, data.taskDesc, data.checked, 'noProject');
             li.id = task;
             if (data.checked == true) {
               rightList.appendChild(li);
             } else {
               rightList.insertBefore(li, rightList.firstChild)
             }
          }
          else
          {
            dataRefProject.child(data.project).child('info').once('value', function(projectInfo) {

              var color = projectInfo.val().projectColor;
              var title = projectInfo.val().projectTitle;
              var li = generateTask(data.taskName, data.taskDesc, data.checked, data.project, color, title);
              li.id = task;
              if (data.checked == true) {
                rightList.appendChild(li);
              } else {
                rightList.insertBefore(li, rightList.firstChild)
              }
            });
          }
        });
      });
    });
  }).then(function () {
    NProgress.done();
  });
}

function loadAndAppendSingleTask(taskID, rightList) {
  dataRefTasks.child(taskID).once('value').then(function (snap) {
    var data = snap.val();

    if (data.project == 'noProject') {
      var li = generateTask(data.taskName, data.taskDesc, data.checked, 'noProject');
      li.id = taskID;
      rightList.appendChild(li);
    }
    else {
      dataRefProject.child(data.project).child('info').once('value', function (projectInfo) {

        var color = projectInfo.val().projectColor;
        var title = projectInfo.val().projectTitle;
        var li = generateTask(data.taskName, data.taskDesc, data.checked, data.project, color, title);
        li.id = taskID;
        rightList.appendChild(li);
      });
    }
  });
}
