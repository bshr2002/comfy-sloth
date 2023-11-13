const formatePrice = (number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number / 100);
};

let id = window.location.href.split("id=")[1];

let request = new XMLHttpRequest();
request.open("GET", `https://course-api.com/react-store-single-product?id=${id}`);
request.responseType = "json";
request.send();
request.onload = function (){
    let product = request.response;
    let name = document.querySelector(".name");
    name.innerHTML = product["name"];
    let mainImage = document.querySelector(".main-img");
    let imageViewer = document.querySelector(".image-viewer");
    let images = product["images"];
    for(let i = 0; i < images.length; i++){
        let img = document.createElement("img");
        img.src = `${images[i]["url"]}`;
        imageViewer.append(img);
    }
    for(let i = 0; i < imageViewer.children.length; i++) {
        mainImage.src = imageViewer.children[0].src;
        imageViewer.children[i].addEventListener("click",function(){
            mainImage.src = imageViewer.children[i].src;
        });
    }


    let productName = document.querySelector(".product-content h2");
    productName.innerHTML = product["name"];

    let textReviews = document.querySelector(".stars-content p span");
    textReviews.innerHTML = product["reviews"];

    let price = document.querySelector(".price");
    price.innerHTML = formatePrice(product["price"]);

    let description = document.querySelector(".desc");
    description.innerHTML = product["description"];

    let sku = document.querySelector(".sku-value");
    sku.innerHTML = id;

    let brand = document.querySelector(".brand-value");
    brand.innerHTML = product["company"];

    let colors = product["colors"];
    let colorsDiv = document.querySelector(".colors");
    for (let i = 0; i < colors.length; i++) {
        let color = document.createElement("button");
        color.className = "color";
        color.style.cssText = `
            background-color: ${colors[i]}
        `;
        colorsDiv.appendChild(color);
    }

    let colorsList = colorsDiv.children;
    let colorActive = "";

    for (let i = 0; i < colorsList.length; i++) {
        colorsList[0].className = "color-active";
        colorActive = "";
        colorActive = colorsList[0].style["background-color"];
        colorsList[i].addEventListener("click", function (){
            for (let j = 0; j < colorsList.length; j++) {
                colorsList[j].className = "color";
            }
            colorActive = "";
            colorsList[i].className = "color-active";
            colorActive = colorsList[i].style["background-color"];
        });
    }

    let stars = document.querySelector(".stars");
    for(let j = 0; j < Math.round(product["stars"]); j++){
        stars.children[j].style.cssText = `
            color: gold;
        `;
    }
    for (let i = 0; i < 5; i++) {
        
    }

    let number = document.querySelector(".number");
    let plus = document.querySelector(".uil-plus");
    let minus = document.querySelector(".uil-minus");

    plus.onclick = function (){
        number.innerHTML++;
    }

    minus.onclick = function (){
        if(number.innerHTML > 1 ){
            number.innerHTML--;
        }
    }


    let addToCart = document.querySelector(".add-cart-btn");
    let cartLocal = [];
    addToCart.addEventListener("click", function (){
        let list = [];
        if (localStorage["cart"] !== undefined){
            cartLocal = JSON.parse(localStorage["cart"]);
            console.log(`list is ${cartLocal}`);
        }
        let prod = `{
            "image": "${images[0]["url"]}",
            "name": "${product["name"]}",
            "color": "${colorActive}",
            "price": "${product["price"]}",
            "quantity": ${number.innerHTML}
        }`;
        cartLocal.push(JSON.parse(prod));
        main:
        for(let j = 0; j < cartLocal.length; j++){
            if(list.length != 0){
                for(let m = 0; m < list.length; m++){
                    if(cartLocal[j]["name"] == list[m]["name"]){
                        if(cartLocal[j]["color"] == list[m]["color"]){
                            continue main;
                        }
                    }
                }
            }
            for(let k = j; k < cartLocal.length; k++){
                if (j == k){
                    continue;
                }
                if(cartLocal[j]["name"] == cartLocal[k]["name"]){
                    if(cartLocal[j]["color"] == cartLocal[k]["color"]){
                        cartLocal[j]["quantity"] =Number(Number(cartLocal[j]["quantity"]) + Number(cartLocal[k]["quantity"]));
                        console.log(cartLocal[j]["quantity"]);
                    }
                }
            }
            list.push(cartLocal[j]);
        }
        console.log(list);
        localStorage.setItem("cart",JSON.stringify(list));
    });
}