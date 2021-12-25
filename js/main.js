document.getElementById("hamburger").addEventListener("click", () => {
    document.getElementById("menu").classList.toggle("open-hamurger");
    document.getElementById("hamburger").classList.toggle("fa-bars");
    document.getElementById("hamburger").classList.toggle("fa-times");
})