const formatePrice = (number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number / 100);
};

let cartList = [];

if (localStorage["cart"] !== undefined){
    cartList = JSON.parse(localStorage["cart"]);
}

let cartContent = document.querySelector(".cart-content");
let subTotalBillElem = document.querySelector(".subtotal-bill p");
let totalPrice = document.querySelector(".total p");
let subTotalBill = 5;
if (cartList.length != 0){
    for (let i = 0; cartList.length > i; i++) {
        subTotalBill = subTotalBill + (Number(cartList[i]["quantity"]) * Number(cartList[i]["price"]));
        let product = document.createElement("div");
        product.className = `product-details ${i}`;
        product.innerHTML = `
            <div class="prod-item">
                <img src="${cartList[i]["image"]}" alt="">
                <div class="prod-item-content">
                    <h5 class="name-product">${cartList[i]["name"]}</h5>
                    <div class="colors">
                        <p>Colors: </p>
                        <div class="color" style="background-color: ${cartList[i]["color"]};"></div>
                    </div>
                </div>
            </div>
            <p class="price">${formatePrice(cartList[i]["price"])}</p>
            <div class="product-amount">
                <button><i class="uil uil-minus"></i></button>
                <span class="number">${cartList[i]["quantity"]}</span>
                <button><i class="uil uil-plus"></i></button>
            </div>
            <p class="subtotal">${formatePrice(Number(cartList[i]["quantity"]) * Number(cartList[i]["price"]))}</p>
            <button type="button" class="delete"><i class="uil uil-trash-alt"></i></button>
        `;
        cartContent.appendChild(product);
    }
}

let products = document.querySelectorAll(".product-details");
let number = document.querySelectorAll(".number");
let plus = document.querySelectorAll(".uil-plus");
let minus = document.querySelectorAll(".uil-minus");
let subTotal = document.querySelectorAll(".subtotal");


for (let i = 0; i < plus.length; i++){
    plus[i].addEventListener("click",function (){
        number[i].innerHTML++;
        cartList[i]["quantity"]++;
        subTotal[i].innerHTML = formatePrice(Number(cartList[i]["quantity"]) * Number(cartList[i]["price"]));
        localStorage.setItem("cart",JSON.stringify(cartList));
        subTotalBill = 0;
        for(let j = 0; j < cartList.length; j++){
            subTotalBill = subTotalBill + (Number(cartList[j]["quantity"]) * Number(cartList[j]["price"]))
        }
        subTotalBillElem.innerHTML = formatePrice(subTotalBill);
        totalPrice.innerHTML = formatePrice(subTotalBill + 5.43);
    });
}

for (let i = 0; i < minus.length; i++){
    minus[i].addEventListener("click",function (){
        if(number[i].innerHTML > 1){
            number[i].innerHTML--;
            cartList[i]["quantity"]--;
            subTotal[i].innerHTML = formatePrice(Number(cartList[i]["quantity"]) * Number(cartList[i]["price"]));
            localStorage.setItem("cart",JSON.stringify(cartList));
            subTotalBill = 0;
            for(let j = 0; j < cartList.length; j++){
                subTotalBill = subTotalBill + (Number(cartList[j]["quantity"]) * Number(cartList[j]["price"]))
            }
            subTotalBillElem.innerHTML = formatePrice(subTotalBill);
            totalPrice.innerHTML = formatePrice(subTotalBill + 5.43);
        }
    });
}

let deleteButtons = document.querySelectorAll(".delete");

for (let i = 0; i < deleteButtons.length; i++) {
    deleteButtons[i].addEventListener("click", function(){
        products[i].style.display = `none`;
        console.log(products[i].className.split(" "));
        for (let j = 0; j < cartList.length; j++) {
            if (products[i].className.split(" ")[1] == j) {
                cartList.splice(j,1);
            }
        }
        localStorage.setItem("cart",JSON.stringify(cartList));
        subTotalBill = 0;
        for(let j = 0; j < cartList.length; j++){
            subTotalBill = subTotalBill + (Number(cartList[j]["quantity"]) * Number(cartList[j]["price"]))
        }
        subTotalBillElem.innerHTML = formatePrice(subTotalBill);
        totalPrice.innerHTML = formatePrice(subTotalBill + 5.43);
    });
}

let clearCart = document.querySelector(".clr-cart");

clearCart.addEventListener("click", function (){
    cartContent.innerHTML = "";
    cartList = [];
    localStorage.setItem("cart",JSON.stringify(cartList));
    subTotalBill = 0;
    subTotalBillElem.innerHTML = formatePrice(subTotalBill);
    totalPrice.innerHTML = 0;
});

subTotalBillElem.innerHTML = formatePrice(subTotalBill);
if (cartList.length == 0) {
    totalPrice.innerHTML = 0;
}else{
    totalPrice.innerHTML = formatePrice(subTotalBill + 543);
}