// ==UserScript==
// @name        Canvas Grades Sorter
// @version     1.0
// @author      Thomas Brickhouse
// ==/UserScript==

// This user script is intended to be used on canvas.jmu.edu/ and sub pages.
// The script will add a grades button to the sidebar and, when clicked, take you
// to a page with all your grades, sorted by semester.

// -------------------------------------------------------------------\\
// Removing and creating a new grades button on the side bar of every Canavs page.

// Removes the history element on the sidebar
const header = document.getElementById("menu");
const arrayOfHeaderElements = header.getElementsByTagName("li");
arrayOfHeaderElements[6].style.display = "none";
const referenceNode = arrayOfHeaderElements[3];

// Creates a new list element to add to the header. Then the id, class and href
// are set before adding children to this element later on.
const newEl = document.createElement("li");
newEl.setAttribute("class", "menu-item ic-app-header__menu-list-item");
const anchorLink = newEl.appendChild(document.createElement("a"));
anchorLink.setAttribute("id", "global_nav_dashboard_link");
anchorLink.setAttribute("class", "ic-app-header__menu-list-link");
anchorLink.setAttribute("href", "https://canvas.jmu.edu/grades");

// Create grades image button. A copy of an already existing SVG tag is made
// and its vector image is changed to match the title.
const toCopySVG = document.getElementById("global_nav_courses_link")
  .childNodes[1].childNodes[1];
// .ic-app-header__menu-list-link .ic-icon-svg //good not applied
// .ic-app-header__menu-list-link .ic-icon-svg
// .ic-app-header__menu-list-link .ic-icon-svg //bad
const copySVG = toCopySVG.cloneNode(true);
copySVG.innerHTML = `<g xmlns="http://www.w3.org/2000/svg" transform="translate(-70.000000,720.000000) scale(0.100000,-0.100000)" fill="#000000" stroke="none">
<path style="fill: white" d="M1850 6314 c-30 -8 -93 -33 -140 -56 -67 -32 -102 -59 -171 -127 -98 -98 -147 -178 -178 -291 -21 -74 -21 -80 -21 -2563 l0 -2489 34 -34 34 -34 149 0 148 0 -3 2386 c-2 1446 1 2417 6 2464 13 102 48 176 118 251 69 71 153 116 245 129 91 13 5063 13 5154 0 93 -14 163 -48 230 -111 74 -70 112 -149 126 -260 7 -58 9 -853 7 -2472 l-3 -2387 134 0 133 0 34 34 34 34 0 2489 c0 2485 0 2489 -21 2563 -33 119 -83 205 -174 295 -90 91 -176 141 -295 174 l-75 21 -2725 -1 c-2338 0 -2733 -2 -2780 -15z"/>
<path style="fill: white" d="M6116 5482 c-2 -4 -119 -316 -259 -692 -141 -377 -258 -693 -262 -703 -7 -16 3 -17 151 -15 l157 3 50 148 49 147 256 -2 255 -3 50 -147 49 -148 154 0 c85 0 154 3 154 8 0 4 -118 322 -263 707 l-263 700 -136 3 c-75 1 -139 -1 -142 -6z m229 -613 c47 -139 85 -257 85 -261 0 -5 -79 -8 -176 -8 -137 0 -175 3 -171 13 2 6 42 126 88 264 45 139 84 251 86 249 2 -2 42 -117 88 -257z"/>
<path style="fill: white" d="M2022 4278 c-8 -8 -12 -49 -12 -118 0 -69 4 -110 12 -118 17 -17 2829 -17 2846 0 16 16 16 220 0 236 -17 17 -2829 17 -2846 0z"/>
<path style="fill: white" d="M2022 3318 c-8 -8 -12 -49 -12 -118 0 -69 4 -110 12 -118 17 -17 3979 -17 3996 0 8 8 12 49 12 120 0 96 -2 108 -19 118 -30 16 -3973 14 -3989 -2z"/>
<path style="fill: white" d="M2028 2359 c-16 -9 -18 -26 -18 -123 0 -95 3 -115 16 -120 9 -3 1182 -6 2608 -6 2003 0 2595 3 2604 12 8 8 12 49 12 120 0 96 -2 108 -19 118 -27 14 -5179 14 -5203 -1z"/>
<path style="fill: white" d="M2027 1397 c-15 -11 -17 -28 -15 -127 l3 -115 2615 0 2615 0 3 115 c2 99 0 116 -15 127 -25 19 -5181 19 -5206 0z"/>
</g>`
copySVG.setAttribute("viewBox", "0 0 790 650");
const divImage = anchorLink.appendChild(document.createElement("div"));
divImage.setAttribute("class", "menu-item-icon-container");
divImage.setAttribute("aria-hidden", "true");
const svg = divImage.appendChild(copySVG);

// Create grades title
const divTitle = anchorLink.appendChild(document.createElement("div"));
divTitle.setAttribute("class", "menu-item__text");
divTitle.appendChild(document.createTextNode("Grades"));

// Add new grades element to the header(sidebar)
header.insertBefore(newEl, arrayOfHeaderElements[3]);

// Removes the original grades button found at the bottom of the
// dashboard page.
setTimeout(() => {
  const aside = document.getElementById("right-side");
  const gradeDiv = aside.children;
  gradeDiv[4].remove();
}, 1000);

// -------------------------------------------------------------------\\
// Sorting the grades table on Canvas.

// Grabs the table from the HTML and creates a variable to use in the
// sortTable() method later.
const table = document.getElementsByClassName(
  "course_details student_grades"
)[0];
// An array of Nodes, each one containing a row(tr) in the table.
const arrayOfTableRows = table.rows;

sortTable();

// Helper method for sortTable() method. This method takes in an index
// refering to an element in the table and will return the URL of the
// page. The URL is then compared to another  URL in order to
// determine the age of the class.
function getHref(classIndex) {
  let returnValue = arrayOfTableRows[classIndex]
    .querySelectorAll("td")[0]
    .querySelectorAll("a")[0];
  return returnValue;
}

// Method to sort the grades table.
function sortTable() {
  let notSorted = true;
  let swap = false;

  while (notSorted) {
    notSorted = false;
    for (i = 0; i < arrayOfTableRows.length - 1; i++) {
      swap = false;
      //Uses helper method in this if statement comparison.
      if (getHref(i) < getHref(i + 1)) {
        swap = true;
        break;
      }
    }
    // Swaps the two rows when swap becomes true.
    if (swap) {
      let newNode = arrayOfTableRows[i + 1];
      let referenceNode = arrayOfTableRows[i];
      referenceNode.parentNode.insertBefore(newNode, referenceNode);
      notSorted = true;
    }
  }
}
