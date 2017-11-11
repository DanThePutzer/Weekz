
//Get Elements
var sunOpen = document.getElementById('openSunday');
var sunClose = document.getElementById('closeSunday');
var sunDiv = document.getElementById('sunDiv');
var sunDate = document.getElementById('date6');
var sunAdd = document.getElementById('sunAdd');

function openSunday() {
  sunDiv.style.width = '100%';
  sunDiv.style.height = 'calc(100% - 20px)';

  sunAdd.style.display = 'block';
  sunAdd.style.opacity = '1';

  sunOpen.style.margin = '18px 0px 0px 30px';
  sunClose.style.display = 'block';

  sunDate.style.display = 'block';
}

function closeSunday() {
  sunDiv.style.width = '55px';
  sunDiv.style.height = '55px';

  sunAdd.style.display = 'none';
  sunAdd.style.opacity = '0';

  sunOpen.style.margin = '8px 0px 0px 18px';
  sunClose.style.display = 'none';

  sunDate.style.display = 'none';
}

sunOpen.addEventListener('click', openSunday);
sunClose.addEventListener('click', closeSunday);
