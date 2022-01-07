if (document.getElementById("main-image") != null) {
  var textArray = ["guy.png", "img-container-small.png", "svg/undraw_medical_research_qg4d.svg", "svg/undraw_social_distancing_2g0u.svg"];
  var randomNumber = Math.floor(Math.random() * textArray.length);

  document.getElementById("main-image").setAttribute("src", "./images/" + textArray[randomNumber]);
}

GetPrameters();
const texts = ["Aalst  ", "", "", "", "Gent  ", "", "", "", "Oosterzele  ", "", "", "", "Brussel  ", "", "", ""];
let count = 0;
let index = 0;
let currentText = "";
let letter = "";

sessionStorage.setItem("prev-item", "Oost-Vlaanderen");
let besmettingen = [];
let population = [];

var scroll;

let plaats_arr = [];
let plaatsName_arr = [];

let Inputveld = document.getElementById("input-gemeente");

(function () {
  scroll = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    smoothMobile: false,
    multiplier: 0.8,
  });

  if ( document.URL.includes("waar-vaccineren.html") ) {
    fetch("../data/besmettingen.json")
    .then((data) => data.json())
    .then((data) => {
      besmettingen.push(Object.keys(data[0]).map((key) => [String(key), data[0][key]]));
      besmettingen = besmettingen[0];
    });

  fetch("../data/population.json")
    .then((data) => data.json())
    .then((data) => {
      population.push(Object.keys(data[0]).map((key) => [String(key), data[0][key]]));
      population = population[0];
    });

    fetch("../data/gemeentes.json")
  .then((data) => data.json())
  .then((data) => {
    for (let index = 0; index < data.length; index++) {
      let plaats = new GemeenteData(data[index][3], data[index][1], data[index][7], data[index][8]);
      plaats_arr.push(plaats);
    }
    for (let index = 0; index < data.length; index++) {
      plaatsName_arr.push(data[index][1]);
    }
  });
}
})();

var i = 0;
var txt = "Vaxcy,";
var speed = 175;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function typeWriter() {
  document.getElementById("anim").innerHTML = "";
  for (let i = 0; i < txt.length; i++) {
    document.getElementById("anim").innerHTML += txt.charAt(i);
    await sleep(speed);
  }
}

function DownArrow() {
  scroll.scrollTo(document.getElementById("toegediend").getBoundingClientRect().top, {
    duration: 400,
  });
}

(function typefuntie() {
  let input = document.getElementById("input-gemeente");
  if (input !== null) {
    if (count === texts.length) {
      count = 0;
    }
    currentText = texts[count];
    letter = currentText.slice(0, ++index);
    input.setAttribute("placeholder", letter);
    if (letter.length === currentText.length) {
      count++;
      index = 0;
    }
    setTimeout(typefuntie, 300);
  }
})();

Array.from(document.getElementsByClassName("vraag-item")).forEach(function (element) {
  element.addEventListener("click", () => {
    if (!element.classList.contains("vraag-item-expanded")) {
      Array.from(document.getElementsByClassName("vraag-item")).forEach(function (element) {
        element.classList.remove("vraag-item-expanded");
        element.children[0].children[2].classList.remove("fa-times");
        element.children[1].style.maxHeight = "0px";
      });
    }
    element.classList.toggle("vraag-item-expanded");
    element.children[0].children[2].classList.toggle("fa-times");
    if (element.children[1].style.maxHeight == 0 || element.children[1].style.maxHeight == "0px") {
      element.children[1].style.maxHeight = element.children[1].scrollHeight + 200 + "px";
    } else {
      element.children[1].style.maxHeight = "0px";
    }
  });
});

document.getElementById("hamburger").addEventListener("click", () => {
  document.getElementById("menu").classList.toggle("open-hamurger");
  document.getElementById("hamburger").classList.toggle("fa-bars");
  document.getElementById("hamburger").classList.toggle("fa-times");
});

function HoverProvintie(provintie) {
  if (sessionStorage.getItem("prev-item") == null) {
    sessionStorage.setItem("prev-item", provintie.id);
    document.getElementById("provintie-label").innerText = provintie.id;
    provintie.classList.add("path-hover");
  } else {
    if (provintie.id != sessionStorage.getItem("prev-item")) {
      document.getElementById(sessionStorage.getItem("prev-item")).classList.remove("path-hover");
      sessionStorage.setItem("prev-item", provintie.id);
      document.getElementById("provintie-label").innerText = provintie.id;
      provintie.classList.add("path-hover");
      for (let index = 0; index < besmettingen.length; index++) {
        if (besmettingen[index][0] == provintie.id) {
          document.getElementById("besmettingen-aantal").innerText = besmettingen[index][1].toLocaleString(undefined);
          document.getElementById("populatie-aantal").innerText = population[index][1].toLocaleString(undefined);
        }
      }
    }
  }
}

function PlayVideo() {
  let vid = document.getElementById("vid");
  if (vid.classList.contains("video-off")) {
    vid.classList.remove("video-off");
    document.getElementById("play-btn").style.display = "none";
    vid.play();
  } else {
    if (vid.paused) {
      vid.play();
    } else {
      vid.pause();
      document.getElementById("play-btn").style.display = "flex";
      vid.classList.add("video-off");
    }
  }
}

// GEMEENTE FUNCTIES
let GemeenteData = class {
  constructor(Gemeente, Adres, GemeenteLijst, Gsm) {
    (this.Gemeente = Gemeente), (this.Adres = Adres), (this.GemeenteLijst = GemeenteLijst), (this.Gsm = Gsm);
  }
};

function TypeInput(e) {
  if (e.style.borderColor == "rgb(235, 69, 53)") e.style.borderColor = "#00000033";
}

function PlaatsMap() {
  if (Inputveld.value !== null && Inputveld.value !== undefined && Inputveld.value.trim() !== "") {
    GetStations(Inputveld.value);
  } else {
    Inputveld.style.borderColor = "#eb4535";
    scroll.update();
  }
}
async function GetStations(response) {
  let Uses_Postcode = false;
  let Deelgemeente_arr = [];
  let RESULT = [];
  let RAW_INPUT_POSTCODE_hoofdgemeente = [];

  if (response == "" || response == " " || response == undefined || response == null) {
    scroll.update();
    return;
  }

  if (/^\d+$/.test(response) && response.length == 4) {
    Uses_Postcode = true;
  }

  Deelgemeente_arr = await (await fetch(`https://opzoeken-postcode.be/${response.toLowerCase()}.json`)).json();

  Deelgemeente_arr.forEach((element) => {
    if (element.Postcode.naam_deelgemeente.toLowerCase() == response.toLowerCase()) {
      RESULT.push(element);
    } else {
      RAW_INPUT_POSTCODE_hoofdgemeente.push(element.Postcode);
    }
  });

  if (Uses_Postcode) {
    if (RAW_INPUT_POSTCODE_hoofdgemeente.length > 0) {
      for (let index = 0; index < plaats_arr.length; index++) {
        let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(";");

        if (GemeenteLijst.includes(RAW_INPUT_POSTCODE_hoofdgemeente[0].naam_hoofdgemeente)) {
          document.getElementById("input-gemeente").style.borderColor = "#00000033";
          Inputveld.value = "";
          scroll.update();
          return DisplayData(plaats_arr[index]);
        } else {
          scroll.update();
          Inputveld.style.borderColor = "#eb4535";
          ResetInput();
        }
      }
    } else if (RESULT.length === 1) {
      for (let index = 0; index < plaats_arr.length; index++) {
        let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(";");
        if (GemeenteLijst.includes(RESULT[0].Postcode.naam_hoofdgemeente)) {
          document.getElementById("input-gemeente").style.borderColor = "#00000033";
          Inputveld.value = "";
          scroll.update();
          return DisplayData(plaats_arr[index]);
        } else {
          scroll.update();
          Inputveld.style.borderColor = "#eb4535";
          ResetInput();
        }
      }
    } else {
      for (let index = 0; index < plaats_arr.length; index++) {
        if (plaats_arr[index].Gemeente.toLowerCase() == response.toLowerCase()) {
          document.getElementById("input-gemeente").style.borderColor = "#00000033";
          Inputveld.value = "";
          scroll.update();
          return DisplayData(plaats_arr[index]);
        } else {
          //POSTCODE BESTAAT NIET
          scroll.update();
          Inputveld.style.borderColor = "#eb4535";
          ResetInput();
        }
      }
    }
  } else {
    if (RESULT.length === 1) {
      for (let index = 0; index < plaats_arr.length; index++) {
        let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(";");
        if (GemeenteLijst.includes(RESULT[0].Postcode.naam_hoofdgemeente)) {
          document.getElementById("input-gemeente").style.borderColor = "#00000033";
          Inputveld.value = "";
          scroll.update();
          return DisplayData(plaats_arr[index]);
        } else {
          scroll.update();
          Inputveld.style.borderColor = "#eb4535";
          ResetInput();
        }
      }
    } else {
      for (let index = 0; index < plaats_arr.length; index++) {
        if (plaats_arr[index].Gemeente.toLowerCase() == response.toLowerCase()) {
          document.getElementById("input-gemeente").style.borderColor = "#00000033";
          Inputveld.value = "";
          scroll.update();
          return DisplayData(plaats_arr[index]);
        } else {
          scroll.update();
          Inputveld.style.borderColor = "#eb4535";
          ResetInput();
        }
      }
    }
  }
}

function ResetInput() {
  document.getElementById("locatie-waar").innerHTML = "";
  document.getElementById("map-container").classList.add("map-hidden");
  document.getElementById("map-section").style.display = "none";
  document.getElementById("header-section").style.height = "75vh";
  window.scrollTo(0, 0);
}

function DisplayData(plaats) {
  let Uri = "https://www.google.com/maps/embed/v1/place?";
  let Key = "key=AIzaSyDiknhv8f5ZQ-_wfdSZcZVnDE-m_TSRyG0";
  let Query = "&q=" + `${plaats.Adres.trimEnd()}, ${plaats.Gemeente}`;

  let request = Uri + Key + Query;
  let mapContainer = document.getElementById("map-container");
  let map = document.getElementById("map");

  map.src = request;
  mapContainer.classList.remove("map-hidden");
  document.getElementById("locatie-waar").innerText = `${plaats.Adres.trimEnd()}, ${plaats.Gemeente}`;
  document.getElementById("gsm-waar").innerText = `${plaats.Gsm}`;
  document.getElementById("map-section").style.display = "flex";
  scroll.update();
  scroll.scrollTo(document.getElementById("map-section"));
}

function GetPrameters() {
  hasParam = false;
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const gemeente = urlParams.get("gemeente");

  if (gemeente !== "" && gemeente !== null && gemeente !== undefined) hasParam = true;

  if (hasParam) {
    GetStations(gemeente);
  }
}

window.addEventListener("load", () => {
  setTimeout(() => {
    scroll.update();
  }, 0);

  setInterval(() => {
    scroll.update();
  }, 500);
});
