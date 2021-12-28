AOS.init();

sessionStorage.setItem('prev-item', 'Oost-Vlaanderen')
let besmettingen = [];
let population = [];

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

function PlayVideo(){
    let vid = document.getElementById('vid');
    if(vid.classList.contains('video-off')){
        vid.classList.remove("video-off");
        document.getElementById("play-btn").style.display = "none";
        vid.play();
    }else{
        if(vid.paused ){
            vid.play();
        }else{
            vid.pause();
            document.getElementById("play-btn").style.display = "flex";
            vid.classList.add("video-off");
        }
    }

}