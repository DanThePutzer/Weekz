
var weekOffset = 0;
var dataRefSelectedWeek;
var dataRefTasks;
var dataRefProject;
var currentlySelectedWeek;

// SVG for Delete Button
var deleteBtnIcon = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 22 22" style="enable-background:new 0 0 22 22;" xml:space="preserve"><rect class="noFill" width="22" height="22"/><g><g><path class="fill" d="M16.1,3.6h-1.9V3.3c0-1.3-1-2.3-2.3-2.3h-1.7C8.9,1,7.8,2,7.8,3.3v0.2H5.9c-1.3,0-2.3,1-2.3,2.3v1.3c0,0.5,0.4,0.9,0.9,1v10.5c0,1.3,1,2.3,2.3,2.3h8.5c1.3,0,2.3-1,2.3-2.3V8.2c0.5-0.1,0.9-0.5,0.9-1V5.9C18.4,4.6,17.4,3.6,16.1,3.6z M9.1,3.3c0-0.6,0.5-1.1,1.1-1.1h1.7c0.6,0,1.1,0.5,1.1,1.1v0.2H9.1V3.3z M16.3,18.7c0,0.6-0.5,1.1-1.1,1.1H6.7c-0.6,0-1.1-0.5-1.1-1.1V8.2h10.6L16.3,18.7L16.3,18.7z M17.2,7H4.8V5.9c0-0.6,0.5-1.1,1.1-1.1h10.2c0.6,0,1.1,0.5,1.1,1.1V7z"/></g><g><g><path class="fill" d="M11,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6s0.6,0.3,0.6,0.6v6.8C11.6,17.7,11.4,18,11,18z"/></g><g><path class="fill" d="M8,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8C7.4,10.2,7.7,10,8,10c0.4,0,0.6,0.3,0.6,0.6v6.8C8.7,17.7,8.4,18,8,18z"/></g><g><path class="fill" d="M14,18c-0.4,0-0.6-0.3-0.6-0.6v-6.8c0-0.4,0.3-0.6,0.6-0.6c0.4,0,0.6,0.3,0.6,0.6v6.8C14.6,17.7,14.3,18,14,18z"/></g></g></g></svg>';

var editBtnIcon = '<img src="res/edit.png">'
var moveBtnIcon = '<img src="res/move.png">'

// Get Elements
var addWeekBtn = document.getElementById('newWeek');
var previousBtn = document.getElementById('previous');
var allLists = document.getElementsByClassName('taskList');
// var context = document.getElementById('contextMenu');

// Edit Menu Elements
var addMenu = document.getElementById('addTask');
var projectSelector = document.getElementById('projectSelector');
var moveMenu = document.getElementById('moveTask');
var day = document.getElementById('whatDay');
var taskName = document.getElementById('taskName');
var taskDesc = document.getElementById('taskDesc');
var addTaskBtn = document.getElementById('addBtn');
var editTaskBtn = document.getElementById('editBtn');
var closeBtn = document.getElementById('closeBtn');
var addTitle = document.getElementById('addTitle');
var editTitle = document.getElementById('editTitle');

var showBubble = document.getElementById('showBubble');
var hideBubble = document.getElementById('hideBubble');
var bubble = document.getElementById('bubble');
var toDoValue = document.getElementById('toDoName');
var toDoAddBtn = document.getElementById('bubbleAdd');
var toDoList = document.getElementById('bubbleList');
var showBubbleMobile = document.getElementById('showBubbleMobile');


// ToDo Counter Elements
var counter = document.getElementById('counterValue');
var counterDiv = document.getElementById('counterContainer');
var counterCheck = document.getElementById('check');

var mobileCounter = document.getElementById('mobileCounterValue');
var mobileCounterDiv = document.getElementById('mobileCounter');
var mobileCounterCheck = document.getElementById('mobileCheck');

// Define Colors
var monColor = "#FF514C";
var tueColor = "#FFE44F";
var wedColor = "#F6921E";
var thuColor = "#7AC843";
var friColor = "#3FA8F4";
var satColor = "#662D90";
var sunColor = "#444000";

// Get Lists
var monList = document.getElementById('monList');
var tueList = document.getElementById('tueList');
var wedList = document.getElementById('wedList');
var thuList = document.getElementById('thuList');
var friList = document.getElementById('friList');
var satList = document.getElementById('satList');
var sunList = document.getElementById('sunList');

Element.prototype.documentOffsetTop = function () {
    return this.offsetTop + ( this.offsetParent ? this.offsetParent.documentOffsetTop() : 0 );
};

addLoggedInHandler(function (user) {

    addGlobalEventListeners();
    dataRefTasks = firebase.database().ref().child('users').child(userId).child('tasks');
    dataRefProject = firebase.database().ref().child('users').child(userId).child('projects');
    fetchAndAppendProjects();
    initFeedback();

    var initialWeekOffset = 0;
    var t = window.location.pathname;
    if (window.location.hash != "")
    {
        initialWeekOffset = parseInt(window.location.hash.substr(1));
    }

    changeWeek(initialWeekOffset);
});

function changeWeek (offset)
{
    history.pushState(null, null, '#' + offset);

    markCurrentDay(offset == 0);
    //location.replace("#" + offset);
    weekOffset = offset;
    var currentWeek = new Week(offset);
    currentlySelectedWeek = currentWeek; //Experimental
    dataRefSelectedWeek = firebase.database().ref().child('users').child(userId).child('weeks').child(currentWeek.getWeekID());
    loadAndAddTasks(currentWeek);

    //wedList.scrollIntoView();
}

function addGlobalEventListeners() {

    //JUST FOR TESTING PURPOSES
    addWeekBtn.ondragover = function (ev)
    {
        ev.preventDefault();
    };
    addWeekBtn.ondragenter = function (ev)
    {
        clearLists();
        changeWeek(weekOffset + 1);
        console.log("enter");
    };
    addWeekBtn.ondragleave = function (ev)
    {
        console.log("leave");
    };

    previousBtn.ondragover = function (ev)
    {
        ev.preventDefault();
    };
    previousBtn.ondragenter = function (ev)
    {
        clearLists();
        changeWeek(weekOffset - 1);
    };

    //Previous-Next Week buttons
    addWeekBtn.addEventListener('click', function () {
        clearLists();
        changeWeek(weekOffset + 1);
    });
    previousBtn.addEventListener('click', function () {
        clearLists();
        changeWeek(weekOffset - 1);
    });

    //Open new Task dialog
    var buttons = document.querySelectorAll(".addBtn");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", addButtonClicked);
    }

    var taskLists = document.querySelectorAll('.taskList');
    for (var i = 0; i < taskLists.length; i++) {
        var item = taskLists[i];
        item.ondragover = enterDrag;
        item.ondragleave = leftDrag;
        item.ondrop = elementDropped;
    }
    /*taskLists.forEach(function (item)
    {
        item.ondragover = enterDrag;
        item.ondragleave = leftDrag;
        item.ondrop = elementDropped;
    });*/
    // Close New Task Menu
    closeBtn.addEventListener('click', hideAddMenu);

    //TO-DO List
    showBubble.addEventListener('click', function() {
        bubble.style.display = "block";
        hideBubble.style.display = "block";
        sleep(100).then(() => {
          bubble.style.opacity = "1";
        });
      });

      showBubbleMobile.addEventListener('click', function() {
        bubble.style.display = "block";
        if (bubble.style.height == "0px") {
          bubble.style.height = "335px";
          console.log('opened');
        } else {
          bubble.style.height = "0px";
          console.log('closed');
        }
      });

      hideBubble.addEventListener('click', function() {
        bubble.style.opacity = "0";
        toDoValue.value = "";
        sleep(100).then(() => {
          bubble.style.display = "none";
          hideBubble.style.display = "none";
        });
      });

      toDoAddBtn.addEventListener('click', function() {
        createToDoItem();
        toDoValue.value = "";
      });
}

//BEGIN HELPER FUNCTIONS
function clearLists() {
    for (var i = 0; i < allLists.length; i++) {
      allLists[i].innerHTML = "";
  }}


// Show Detail View
function showDetail() {
    var detailDiv = this.parentNode.getElementsByClassName("detail")[0];
    if (detailDiv.style.opacity == "1") {
        detailDiv.style.opacity = "0";
        detailDiv.style.display = "none";
    } else {
        detailDiv.style.opacity = "1";
        detailDiv.style.display = "block";
    }
};

// Sleep function
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
};

function markCurrentDay(mark)
{
    // var date = new Date();
    // var day = date.getDay();
    // if (day == -1)
    //     return;
    //
    // var lists = [monList, tueList, wedList, thuList, friList, satList, sunList];
    // var dayList = lists[day - 1];
    //
    // if (isMobile && dayList != sunList)
    //     scrollToElement(dayList);
    //
    // var h2 = document.getElementById("date" + day);
    // if (mark)
    //     h2.classList.add("h2-highlight");
    // else
    //     h2.classList.remove("h2-highlight");
}

function scrollToElement(elem)
{
    var top = elem.documentOffsetTop() - ( window.innerHeight / 2 );
    window.scrollTo( 0, top );
}
