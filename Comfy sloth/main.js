let burgerMenu = document.querySelectorAll(".nav-toggle");
let aside = document.querySelector("aside");


setSize();
window.addEventListener('resize', setSize, false);

function setSize(){
    width = window.innerWidth;
    if(window.innerWidth <= 768){
        burgerMenu[0].addEventListener("click",function (){
            aside.style.cssText = `
                display: block;
                animation: MyDiv;
                animation-duration: 0.8s;
                animation-iteration-count: 1;
                animation-timing-function: ease-in;
                animation-direction: alternate;
                animation-fill-mode: forwards;
            `;
        });
        burgerMenu[1].addEventListener("click",function (){
            aside.style.cssText = `
                display: block;
                animation: Back;
                animation-duration: 0.8s;
                animation-iteration-count: 1;
                animation-timing-function: ease-in;
                animation-direction: alternate;
                animation-fill-mode: forwards;
            `;
        });
    }else{
        aside.style.display = "none";
    }
}