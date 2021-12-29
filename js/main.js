AOS.init();
GetPrameters();

const texts = ['Aalst  ', '', '', '', 'Gent  ', '', '', '', 'Oosterzele  ', '', '', '', 'Brussel  ', '', '', ''];
let count = 0;
let index = 0;
let currentText = '';
let letter = '';

sessionStorage.setItem('prev-item', 'Oost-Vlaanderen')
let besmettingen = [];
let population = [];

(function initialfuntie() {
    fetch('../data/besmettingen.json')
        .then(data => data.json())
        .then((data) => {
            besmettingen.push(Object.keys(data[0]).map((key) => [String(key), (data[0][key])]));
            besmettingen = besmettingen[0]
        })

    fetch('../data/population.json')
        .then(data => data.json())
        .then((data) => {
            population.push(Object.keys(data[0]).map((key) => [String(key), (data[0][key])]));
            population = population[0]
        })
})();


(function typefuntie() {
    if (count === texts.length) {
        count = 0
    }
    currentText = texts[count]
    letter = currentText.slice(0, ++index)
    let input = document.getElementById('input-gemeente')
    input.setAttribute("placeholder", letter);
    if (letter.length === currentText.length) {
        count++
        index = 0
    }
    setTimeout(typefuntie, 300)
})();

document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("open-hamurger");
    document.getElementById("hamburger").classList.toggle("fa-bars");
    document.getElementById("hamburger").classList.toggle("fa-times");
})

function HoverProvintie(provintie) {
    if (sessionStorage.getItem('prev-item') == null) {
        sessionStorage.setItem('prev-item', provintie.id);
        document.getElementById("provintie-label").innerText = provintie.id;
        provintie.classList.add('path-hover');
    } else {
        if (provintie.id != sessionStorage.getItem('prev-item')) {
            document.getElementById(sessionStorage.getItem('prev-item')).classList.remove('path-hover')
            sessionStorage.setItem('prev-item', provintie.id);
            document.getElementById("provintie-label").innerText = provintie.id;
            provintie.classList.add('path-hover');
            for (let index = 0; index < besmettingen.length; index++) {
                if (besmettingen[index][0] == provintie.id) {
                    document.getElementById('besmettingen-aantal').innerText = besmettingen[index][1].toLocaleString(undefined);
                    document.getElementById('populatie-aantal').innerText = population[index][1].toLocaleString(undefined);
                }
            }
        }
    }
}

function PlayVideo() {
    let vid = document.getElementById('vid');
    if (vid.classList.contains('video-off')) {
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
        this.Gemeente = Gemeente,
            this.Adres = Adres,
            this.GemeenteLijst = GemeenteLijst,
            this.Gsm = Gsm
    }
};

function TypeInput(e) {
    if (e.style.borderColor == "rgb(235, 69, 53)")
        e.style.borderColor = "#00000033"
}

let plaats_arr = [];
let plaatsName_arr = [];

let Inputveld = document.getElementById('input-gemeente')


fetch('../data/gemeentes.json').then(data => data.json()).then(data => {
    for (let index = 0; index < data.length; index++) {
        let plaats = new GemeenteData(data[index][3], data[index][1], data[index][7], data[index][8])
        plaats_arr.push(plaats);
    }
    for (let index = 0; index < data.length; index++) {
        plaatsName_arr.push(data[index][1]);
    }
})

function PlaatsMap() {

    if (Inputveld.value !== null && Inputveld.value !== undefined && Inputveld.value.trim() !== '') {
        GetStations(Inputveld.value)
    } else {
        Inputveld.style.borderColor = "#eb4535";
    }
}
async function GetStations(response) {

    let Uses_Postcode = false;
    let Deelgemeente_arr = [];
    let RESULT = [];
    let RAW_INPUT_POSTCODE_hoofdgemeente = [];

    if (response == '' || response == ' ' || response == undefined || response == null) {
        return
    }

    if (/^\d+$/.test(response) && response.length == 4) {
        Uses_Postcode = true
    }

    Deelgemeente_arr = await (await fetch(`https://opzoeken-postcode.be/${response.toLowerCase()}.json`)).json()

    Deelgemeente_arr.forEach(element => {
        if (element.Postcode.naam_deelgemeente.toLowerCase() == response.toLowerCase()) {
            RESULT.push(element)
        } else {
            RAW_INPUT_POSTCODE_hoofdgemeente.push(element.Postcode)
        }
    });

    if (Uses_Postcode) {
        if (RAW_INPUT_POSTCODE_hoofdgemeente.length > 0) {
            for (let index = 0; index < plaats_arr.length; index++) {
                let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(';');

                if (GemeenteLijst.includes(RAW_INPUT_POSTCODE_hoofdgemeente[0].naam_hoofdgemeente)) {
                    // console.log("1-a") // Voor Debuggin
                    document.getElementById('input-gemeente').style.borderColor = "#00000033";
                    Inputveld.value = ''
                    return DisplayData(plaats_arr[index])
                    break
                } else {
                    // console.log("1-b") // Voor Debuggin
                    Inputveld.style.borderColor = "#eb4535";
                    ResetInput()
                }
            }
        } else if (RESULT.length === 1) {
            for (let index = 0; index < plaats_arr.length; index++) {
                let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(';');
                if (GemeenteLijst.includes(RESULT[0].Postcode.naam_hoofdgemeente)) {
                    // console.log("2-a") // Voor Debuggin
                    document.getElementById('input-gemeente').style.borderColor = "#00000033";
                    Inputveld.value = ''
                    return DisplayData(plaats_arr[index])
                    break
                } else {
                    // console.log("2-b") // Voor Debuggin
                    Inputveld.style.borderColor = "#eb4535";
                    ResetInput()
                }
            }
        } else {
            for (let index = 0; index < plaats_arr.length; index++) {
                if (plaats_arr[index].Gemeente.toLowerCase() == response.toLowerCase()) {
                    // console.log("3-a") // Voor Debuggin
                    document.getElementById('input-gemeente').style.borderColor = "#00000033";
                    Inputveld.value = ''
                    return DisplayData(plaats_arr[index])
                    break
                } else {
                    // console.log("3-b") // Voor Debuggin
                    //POSTCODE BESTAAT NIET
                    Inputveld.style.borderColor = "#eb4535";
                    ResetInput()
                }
            }
        }
    } else {
        if (RESULT.length === 1) {
            for (let index = 0; index < plaats_arr.length; index++) {
                let GemeenteLijst = plaats_arr[index].GemeenteLijst.split(';');
                if (GemeenteLijst.includes(RESULT[0].Postcode.naam_hoofdgemeente)) {
                    // console.log("4-a") // Voor Debuggin
                    document.getElementById('input-gemeente').style.borderColor = "#00000033";
                    Inputveld.value = ''
                    return DisplayData(plaats_arr[index])
                    break
                } else {
                    // console.log("4-b") // Voor Debuggin
                    Inputveld.style.borderColor = "#eb4535";
                    ResetInput()
                }
            }
        } else {
            for (let index = 0; index < plaats_arr.length; index++) {
                if (plaats_arr[index].Gemeente.toLowerCase() == response.toLowerCase()) {
                    // console.log("5-a") // Voor Debuggin
                    document.getElementById('input-gemeente').style.borderColor = "#00000033";
                    Inputveld.value = ''
                    return DisplayData(plaats_arr[index])
                    break
                } else {
                    // console.log("5-b") // Voor Debuggin
                    Inputveld.style.borderColor = "#eb4535";
                    ResetInput()
                }
            }
        }
    }
}

function ResetInput() {
    document.getElementById('locatie-waar').innerHTML = ''
    document.getElementById('map-container').classList.add('map-hidden')
    document.getElementById('map-section').style.display = "none";
    document.getElementById('header-section').style.height = "75vh";
    window.scrollTo(0, 0)
}

function DisplayData(plaats) {
    let Uri = "https://www.google.com/maps/embed/v1/place?"
    let Key = "key=AIzaSyDiknhv8f5ZQ-_wfdSZcZVnDE-m_TSRyG0"
    let Query = "&q=" + `${plaats.Adres.trimEnd()}, ${plaats.Gemeente}`

    let request = Uri + Key + Query
    let mapContainer = document.getElementById('map-container')
    let map = document.getElementById('map')

    map.src = request
    mapContainer.classList.remove('map-hidden')
    document.getElementById('locatie-waar').innerText = `${plaats.Adres.trimEnd()}, ${plaats.Gemeente}`
    document.getElementById('gsm-waar').innerText = `${plaats.Gsm}`
    document.getElementById('map-section').style.display = "flex";
    document.getElementById('header-section').style.height = "45vh";
    window.scrollTo(0, 400)
}

function GetPrameters() {
    hasParam = false;
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const gemeente = urlParams.get('gemeente')

    if (gemeente !== '' && gemeente !== null && gemeente !== undefined)
        hasParam = true

    if (hasParam) {
        GetStations(gemeente);
    }
}