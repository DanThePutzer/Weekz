
function loadAndAddTasks(week) {
  for (var i = 0; i < 6; i++) {
    var id = "date" + (i + 1);
    var dateId = document.getElementById(id);
    dateId.innerText = week.getDayAsString(i);
  }
  NProgress.start();
  NProgress.configure({ minimum: 0.1 });

  // Retrieving Tasks and appending them to Lists
  dataRefSelectedWeek.once('value', function (week) {
    week.forEach(function (day) {
      day.forEach(function (taskid) {
        var task = taskid.key;

        dataRefTasks.child(task).once('value').then( function(snap) {

          data = snap.val();
          if (day.key == "bubbleList") {
            var li = generateBubbleTask(data.taskName, data.checked);

            li.id = task;
            var addDay = day.key;
            var rightList = document.getElementById(addDay);
            rightList.appendChild(li);
          }
          else
          {
            dataRefProject.child(data.project).child('info').once('value', function(projectInfo) {

              if (data.project != 'noProject') {
                var color = projectInfo.val().projectColor;
                var title = projectInfo.val().projectTitle;
              }

              var li = generateTask(data.taskName, data.taskDesc, data.checked, data.project, color, title);

              li.id = task;
              var addDay = day.key;
              var rightList = document.getElementById(addDay);
              rightList.appendChild(li);

            })
          }
        });
      });
    });
  }).then(function () {
    NProgress.done();
  });
}
