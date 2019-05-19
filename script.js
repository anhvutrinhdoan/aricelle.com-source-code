//Global variable needs to be declared to start loop
var i = 1;
var inprogress = false;
var array =[];

function clearArray(){
	array = [];
}

//Handling the page tracker
function pageTracker(){
	var whatPageIsThis = document.getElementById("jumpval").value;
	console.log("Value I read in box:" + whatPageIsThis);
	return whatPageIsThis;
}

//Displays the current page if no chapter selected, if cookie found, loads current chapter
function currentPage() {  
  if (cookieGetter() == 0 || cookieGetter() == null) {
    clearDisplay();
	array = [];
    loadImages(1, i);
  } else {
    clearDisplay();
    array = [];
	loadImages(cookieGetter(), i);
  }
}

//Arrow press navigation
function code(e) {
  e = e || window.event;
  return e.keyCode || e.which;
}
function arrowNavigation() {
  document.onkeypress = function(e) {
    var key = code(e);
    if (key == "37") {
      // left arrow
      incrementButton(-1);
      //document.getElementById('stickyBlock2').backgroundColor(#696969);
    } else if (key == "39") {
      // right arrow
      incrementButton(1);
      //document.getElementById('stickyBlock1').backgroundColor(#696969);
    }
  };
}
//Creates new <div>s when user selects a chapter

function selectChapter(n) {
  array = [];
  //summon "next" and "prev" box in rightSideBar div if they don't exist
  if (
    !document.getElementById("stickyBlock1") &&
    !document.getElementById("stickyBlock2")
  ) {
    var jumper = document.createElement("div");
    var makeForm = document.createElement("form");
    var inputBox = document.createElement("INPUT");
    var nextChapterBox = document.createElement("div");
    var nextChapterArrow = document.createElement("div");
    var prevChapterBox = document.createElement("div");
    var prevChapterArrow = document.createElement("div");
    var tinyarrow = document.createElement("div");
	var arrowBox = document.createElement("div");

    //"jump" box
    jumper.id = "jumpToPage";
	makeForm.id= "thisForm";	
	inputBox.id = "jumpval";
	inputBox.setAttribute("type", "number");
	makeForm.setAttribute("onsubmit","return false");
	
	//tiny arrow box
	tinyarrow.id = "tiny-arrow";
	arrowBox.id = "tiny_arrow_box";
	tinyarrow.className ="arrow_small";
	arrowBox.setAttribute("onclick","pageSkipper()");

    //"next" and "prev" box
    nextChapterBox.id = "stickyBlock1";
    nextChapterArrow.className = "arrow";
    nextChapterArrow.id = "arrow-right";
    prevChapterBox.id = "stickyBlock2";
    prevChapterArrow.className = "arrow";
    prevChapterArrow.id = "arrow-left";
    nextChapterBox.setAttribute("onclick", "incrementButton(1)");
    //nextChapterBox.onclick = function() {incrementButton(1);};
    prevChapterBox.setAttribute("onclick", "incrementButton(-1)");
    //prevChapterBox.onclick = function() {incrementButton(-1)};

    //Stick 'em all on
	document.getElementById("rightSideBar").appendChild(jumper);   	
    document.getElementById("jumpToPage").appendChild(makeForm);
	document.getElementById("thisForm").appendChild(inputBox);	  
	document.getElementById("jumpval").value = 1;	
	document.getElementById("jumpToPage").appendChild(arrowBox);
	document.getElementById("tiny_arrow_box").appendChild(tinyarrow);	
    document.getElementById("rightSideBar").appendChild(prevChapterBox);
    document.getElementById("rightSideBar").appendChild(nextChapterBox);
    
    //document.getElementById('rightSideBar').appendChild(close);
    document.getElementById("stickyBlock1").appendChild(nextChapterArrow);
    document.getElementById("stickyBlock2").appendChild(prevChapterArrow);
  }

  //Populate with images
  if (inprogress == false) {
    //Clear docDisplay div
    clearDisplay();
    loadImages(n, i);
  }

  //make a cookie with selected chapter
  var currentChapter = n;
  document.cookie = "whichChapter=" + currentChapter + "; path=/";
}
//Clears docDisplay div when loading a chapter
function clearDisplay() {
  // Removing all children from an element
  var element = document.getElementById("rightSideBar");
  document.getElementById("docDisplay").innerHTML = "";
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

//Retrieves value of cookie that keeps track of which chapter you're on.
function cookieGetter() {
  var nameEQ = "whichChapter=";
  var ca = document.cookie.split(";");
  for (var m = 0; m < ca.length; m++) {
    var c = ca[m];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
//OnEvent to allow user to advance or go back a page
function incrementButton(b) {
  array = [];
  var b;
  console.log("cookieGetter returns:" + cookieGetter());

  var chapter = parseInt(cookieGetter());
  var nextChapter;
  if (inprogress == false) {
    //Clear docDisplay div
    clearDisplay();

    //Advance to next chapter
    nextChapter = chapter + b;
    console.log("value of nextChapter:" + nextChapter);

    //Populate with images
    loadImages(nextChapter, i);
    clearNavButtons(nextChapter);

    //make a cookie with value of nextChapter
    document.cookie = "whichChapter = " + nextChapter + "; path=/";
  }
}
//OnEvent that loads images in a chapter until OnError, then prunes broken image
function loadImages(n, i) {
  var img = new Image();
  img.onerror = function() {
    docDisplay.removeChild(docDisplay.lastChild);
    i = 1;
    inprogress = false;
    
  };
  img.onload = function() {
    inprogress = true;
    i++;
    console.log(i);    	
    loadImages(n, i);
  };

  img.src = "http://aricelle.com/chapter" + n + "/" + i + ".png";
  //give this image an id
  img.id = i;  
  document.getElementById("docDisplay").appendChild(img);
  //Add this image's dimensions to the array
  var compareMyPage = document.getElementById(i).getBoundingClientRect();
  array.push(compareMyPage.bottom)+ 44;	
  //if while navigating, either prev or next buttons don't exist, create them
  if (!document.getElementById("stickyBlock1") || !document.getElementById("stickyBlock2")) {
    //if jump to page box doesn't exist, create it
    if(!document.getElementById("jumper")){
		var jumper = document.createElement("div");
		var makeForm = document.createElement("form");
		var inputBox = document.createElement("INPUT");
		jumper.id = "jumpToPage";
		makeForm.id= "thisForm";	
		inputBox.id = "jumpval";
		inputBox.setAttribute("type", "number");
		makeForm.setAttribute("onsubmit","return false");
		document.getElementById("rightSideBar").appendChild(jumper);
		document.getElementById("jumpToPage").appendChild(makeForm);
		document.getElementById("thisForm").appendChild(inputBox);
		document.getElementById("jumpval").value = 1;
	}
	//if tiny submit arrow doesn't exist, create it
    if(!document.getElementById("tiny-arrow")){
		var tinyarrow = document.createElement("div");
		var arrowBox = document.createElement("div");
		
		tinyarrow.id = "tiny-arrow";
		arrowBox.id = "tiny_arrow_box";
		tinyarrow.className ="arrow_small";
		arrowBox.onclick = function(){pageSkipper();};
		
		document.getElementById("jumpToPage").appendChild(arrowBox);
		document.getElementById("tiny_arrow_box").appendChild(tinyarrow);		
	}
    //if next button doesn't exist, create it
    if (!document.getElementById("stickyBlock1")) {
      var nextChapterBox = document.createElement("div");
      var nextChapterArrow = document.createElement("div");
      nextChapterBox.id = "stickyBlock1";
      nextChapterArrow.className = "arrow";
      nextChapterArrow.id = "arrow-right";

      nextChapterBox.setAttribute("onclick", "incrementButton(1)");
      nextChapterBox.onclick = function() {
        incrementButton(1);
      };

      document.getElementById("rightSideBar").appendChild(nextChapterBox);
      document.getElementById("stickyBlock1").appendChild(nextChapterArrow);
    }
    //if prev button doesn't exist, create it
    if (!document.getElementById("stickyBlock2")) {
      var prevChapterBox = document.createElement("div");
      var prevChapterArrow = document.createElement("div");
      prevChapterBox.id = "stickyBlock2";
      prevChapterArrow.id = "arrow-left";
      prevChapterArrow.className = "arrow";

      prevChapterBox.setAttribute("onclick", "incrementButton(-1)");
      prevChapterBox.onclick = function() {
        incrementButton(-1);
      };

      document.getElementById("rightSideBar").appendChild(prevChapterBox);
      document.getElementById("stickyBlock2").appendChild(prevChapterArrow);
    }
  } else {
    return;
  }
}

//Get rid of increment buttons when end of chapter reached
function clearNavButtons(b) {
  var nextButtonCleaner = document.getElementById("stickyBlock1");
  var prevButtonCleaner = document.getElementById("stickyBlock2");
  var getSideBar = document.getElementById("rightSideBar");
  var jumper = document.getElementById("jumpToPage");
  if (b == 0) {
    getSideBar.removeChild(prevButtonCleaner);
    getSideBar.removeChild(jumpToPage);
  } else {
    return;
  }
}

//Text generator

function textGenerator(dataSource) {
  var textBox = document.createElement("div");
  textBox.id = "text";
  document.getElementById("docDisplay").innerHTML = "";
  document.getElementById("rightSideBar").innerHTML = "";
  document.getElementById("docDisplay").appendChild(textBox);
  jQuery(function() {
    $("#text").load(dataSource + ".txt");
  });
}

//checks if page is scrolling and puts a value in the page jump box
function pageChecker(){
	var whereAmI = window.scrollY;
	var arrayelements = array.length - 1;	
	//console.log(whereAmI,elements);
	for(n=0;n<arrayelements;n++){
		if(whereAmI >= array[n]){
			document.getElementById("jumpval").value = n+2;			
		} else if (whereAmI <= array[0]){
			document.getElementById("jumpval").value = 1;
		}
	}
}

//Lets you skip to a page 
function pageSkipper(){
	var pageIndicator = document.getElementById("jumpval").value - 2;
	if (pageIndicator >= 0){
		window.scrollTo({
			top: array[pageIndicator] + 1,
			behavior: "smooth"
		});
	}
	else {
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	}
}
