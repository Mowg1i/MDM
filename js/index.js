var currentView = "view0";
document.getElementById('view1').style.display = 'none';
document.getElementById('view2').style.display = 'none';
document.getElementById('alertbox').style.visibility = 'hidden';

// variables to hold the user's input
var opt = [];
var eff = [];
var imp = [];

// for testing, these won't be initialised when I'm done.
var numberofopts = 3;
var numberofeffs = 3;

///////////////// CLICKS

document.getElementById('addoption').onclick = function() {
  makefield('opt', 'optcontainer');
  numberofopts++;
};

document.getElementById('removeoption').onclick = function() {
  if (numberofopts > 2) {
    removefield('optcontainer');
    numberofopts--;
  } else {
    alertbox("You must have at least two options.");
  }
};

document.getElementById('addeffect').onclick = function() {
  makefield('eff', 'effcontainer');
  numberofeffs++;
};

document.getElementById('removeeffect').onclick = function() {
  if (numberofeffs > 2) {
    removefield('effcontainer');
    numberofeffs--;
  } else {
    alertbox("You must have at least two effects.");
  }
};

document.getElementById('next0').onclick = function() {

  ///check user input!
  if (document.getElementById('decision').value == '') {
    alertbox("Decision cannot be blank.");
    return false;
  };
                  
        
  container1.innerHTML = ''; // clears any previous forms

  //gets user's decision and puts in subtitle
  var decision = document.getElementById('decision').value;
  document.getElementById('subtitle').innerHTML = decision;

  // collects user's inputs and saves in variables
  for (var i = 0; i < numberofopts; i++) {
    opt[i] = document.getElementsByName('opt')[i].value;
    if (opt[i] == '') {
      alertbox("Option cannot be blank");
      return false;
    };
  };
  for (var x = 0; x < numberofeffs; x++) {
    eff[x] = document.getElementsByName('eff')[x].value;
    if (eff[x] == '') {
      alertbox("Effect cannot be blank.");
      return false;
    };
  };
    for (var y = 0; y < numberofeffs; y++) {
    imp[y] = document.getElementsByName('imp')[y].value;
    if (imp[y] == '') {
      imp[y] = 3;
    }
      else if (imp[y] > 5 || imp[y] < 1) {
        alertbox("Importance must be between 1 and 5.");
        return false;
      }
  };

  // makes radio options within container1, for each option
  for (var a = 0; a < numberofopts; a++) {
    makeradios(container1, a);
  }

  showView('view1');
  document.body.scrollTop = document.documentElement.scrollTop = 0;
};

document.getElementById('next1').onclick = function() {
  getresult(container2);
  showView('view2');
};

document.getElementById('back1').onclick = function() {
  document.getElementById('subtitle').innerHTML = 'The logical way to make tough decisions.';
  showView('view0');
};

document.getElementById('back2').onclick = function() {
  showView('view1');
};

document.getElementById('restart').onclick = function() {
  history.go(0);
};

///////////////// FUNCTIONS

function showView(view) {
  hideView(currentView);
  document.getElementById(view).style.display = 'inline';
  currentView = view;
}

function hideView(view) {
  document.getElementById(view).style.display = 'none';
}

function getresult(container) {

  var optionscores = [];
  for (var j = 0; j < numberofopts; j++) {
    optionscores[j] = 0; //initialises each optionscore so we can add numbers later - this has to be outside of forloop, for scope reasons.
    for (var k = 0; k < numberofeffs; k++) {
      var optradios = document.getElementsByName('opt' + j + 'radios' + k); //gets group of radio buttons
      for (var l = 0; l < 5; l++) //iterates through each button in group
      {
        if (optradios[l].checked) {
          optionscores[j] += (Number(optradios[l].value) * Number(imp[k])); //imp[k] is the importance of that effect. So each time you check a radio pertaining to an effect that is v. important, it's worth more 'points'
        }
      }
    }
  }
  
  var optionresult = findbestoption(optionscores);
  var result = opt[optionresult];

  container.innerHTML = ('Based on your input, you should:<br><br><div class = "result">' + result + '</div><br>');
}

// This function is heavily based on ryan's solution to this stack exchange question: http://stackoverflow.com/questions/11301438/return-index-of-greatest-value-in-an-array
function findbestoption(optionscores) {
  var bestoption = optionscores[0];
  var optionindex = 0;
  for (var n = 1; n < optionscores.length; n++) {
    if (optionscores[n] > bestoption) {
      optionindex = n;
      bestoption = optionscores[n];
    }
  }
  return optionindex;

}

function makefield(type, container) {
  // TODO. takes two strings, type and container, and makes a new element containing a new input field. type is opt or eff. container is where it is added. the name of the new element will be e.g. eff4
  var newfield;
  if (type == 'opt') {
    newfield = document.createElement(type + (numberofopts + 1));
    newfield.innerHTML = '<input type="text" class="' + type + '" name="' + type + '" placeholder="........."><br>';

  } else if (type == 'eff') {
    newfield = document.createElement(type + (numberofeffs + 1));

    newfield.innerHTML = '<input type="text" class="' + type + '" name="' + type + '" placeholder="........."><input type="number" class="imp" name="imp" placeholder="3" min="1" max="5"><br>';
  }
  document.getElementById(container).appendChild(newfield);
}

function removefield(container) {
  // removes last child from container.

  var select = document.getElementById(container);
  select.removeChild(select.lastChild);
}

// generates radio button form based what option we're on.
function makeradios(container, optcount) {
  var betterworse = ['much worse', 'worse', 'the same', 'better', 'much better'];
  for (var i = 0; i < numberofeffs; i++) {
    var formheader = '<div class ="formheaders" id="formheader' + i + '">If you <span class="optcontent">' + opt[optcount] + '</span>' + ' will your <span class="effcontent">' + eff[i] + '</span>' + ' be:<br>';
    container.innerHTML += formheader;
    for (var j = 0; j < 5; j++) {
      var radioid = 'opt' + optcount + 'radios' + i + 'radio' + j;
      var radio0 = '<input type="radio" name="opt' + optcount + 'radios' + i + '" id="' + radioid;
      var radio1 = '" value=' + j + '><label for="' + radioid + '">' + betterworse[j] + '</label>';
      if (j == 2) {
        container.innerHTML += (radio0 + '" checked="checked ' + radio1);
      } else {
        container.innerHTML += (radio0 + radio1);
      }
    }
    container.innerHTML += "</div>";
  }
  container.innerHTML += '<br><br>&#9679;';
}

function alertbox(alert) {
  document.body.scrollTop = document.documentElement.scrollTop = 0;
  var alertbox = document.getElementById('alertbox');
  alertbox.innerHTML = alert;
  alertbox.style.visibility = 'visible';
  
  
  window.setTimeout(hidealert, 3000);
}

function hidealert() {
  var alertbox = document.getElementById('alertbox').style.visibility = 'hidden';
}