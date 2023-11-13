const formatePrice = (number) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
    }).format(number / 100);
};

// sort

let gridIcon = document.querySelector(".grid-icon-btn");
let listIcon = document.querySelector(".list-icon-btn");
let productsView = document.getElementById("products-view");

gridIcon.addEventListener("click", function (){
    gridIcon.style.cssText = `
        background: var(--clr-black);
        color: var(--clr-white);
    `;
    listIcon.style.cssText = `
        background: transparent;
        color: var(--clr-black);
    `;
    productsView.className = "products-content";
});

listIcon.addEventListener("click", function (){
    listIcon.style.cssText = `
        background: var(--clr-black);
        color: var(--clr-white);
    `;
    gridIcon.style.cssText = `
        background: transparent;
        color: var(--clr-black);
    `;
    productsView.className = "list-view";
});

// filter

let request = new XMLHttpRequest();
request.open("GET", "https://course-api.com/react-store-products");
request.responseType = "json";
request.send();
request.onload = function () {
    let posts = request.response
    let viewFilter = document.querySelector(".view-filter-choice");
    let search = document.querySelector(".search");
    let categories = [];
    let companies = [];
    let colors = [];
    let companyFilter = [];
    let companyFilterIndex = [];
    let allFilter = [];
    let colorFilterIndex = [];
    let priceFilterIndex = [];
    let shippingFilterIndex = [];
    let allFunFilter = [];
    let allFunFilterColor = [];
    let allFunFilterPrice = [];
    let all = [];
    let maxPrice = 0;
    for (let post of posts) {
        categories.push(post.category);
        companies.push(post.company);
        for (let color of post.colors) {
            colors.push(color);
        }
        if (post["price"] > maxPrice) {
            maxPrice = post["price"];
        }
    }
    categories = removeDuplicates(categories);
    companies = removeDuplicates(companies);
    colors = removeDuplicates(colors);

    let productNum = document.querySelector(".span-num");
    productNum.innerHTML = "";
    let textProductNum = document.createTextNode(`${posts.length}`);
    productNum.appendChild(textProductNum);

    let productsGrid = document.querySelector(".products-content");
    posts = sort(posts);
    for (let i = 0; i < posts.length; i++) {
        allFilter.push(posts[i]);
        companyFilter.push(posts[i]);
        colorFilterIndex.push(posts[i]);
        priceFilterIndex.push(posts[i]);
        shippingFilterIndex.push(posts[i]);
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
    }

    let cat = document.querySelector(".categories");
    for (let i = 0; i < categories.length; i++) {
        let buttonCat = document.createElement("button");
        let buttonCatText = document.createTextNode(categories[i]);
        buttonCat.appendChild(buttonCatText);
        buttonCat.type = "button";
        buttonCat.className = "btn-category";
        buttonCat.name = "category";
        cat.appendChild(buttonCat);
    }

    let categoryFilterIndex = [];
    for (let i = 0; i < cat.children.length; i++){
        cat.children[i].addEventListener("click", function(){
            for(let i = 0; i < cat.children.length; i++){
                cat.children[i].className = "btn-category";
            }
            cat.children[i].className = "btn-category active-category";
            allFilter = [];
            categoryFilterIndex = [];
            for (let i = 0; i < posts.length; i++) {
                allFilter.push(posts[i]);
            }
            if (cat.children[i].innerHTML != "All") {
                for (let j = 0; j < allFilter.length; j++) {
                    if(allFilter[j]["category"] != cat.children[i].innerHTML){
                        categoryFilterIndex.push(allFilter[j]);
                    }
                }
            }
            allFilter = removeItems(allFilter,categoryFilterIndex);
            mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
        });
    }

    let comps = document.querySelector(".company");
    for (let i = 0; i < companies.length; i++) {
        let companyOption = document.createElement("option");
        companyOption.name = "company";
        let companyOptionText = document.createTextNode(companies[i]);
        companyOption.value = companies[i];

        companyOption.appendChild(companyOptionText);
        comps.appendChild(companyOption);
    }

    comps.addEventListener("change", function (){
        companyFilter = [];
        companyFilterIndex = [];
        for (let i = 0; i < posts.length; i++) {
            companyFilter.push(posts[i]);
        }
        if (event.target.value != "all") {
            for (let j = 0; j < companyFilter.length; j++) {
                if(companyFilter[j]["company"] != event.target.value){
                    companyFilterIndex.push(companyFilter[j]);
                }
            }
        }
        companyFilter = removeItems(companyFilter,companyFilterIndex);
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
    });

    let colorFilter = [];
    let myColors = document.querySelector(".colors");
    for (let i = 0; i < colors.length; i++) {
        let colorButton = document.createElement("button");
        let checkIcon = document.createElement("i");
        colorButton.name = "color";
        colorButton.type = "button";
        colorButton.className = "color-btn";
        colorButton.dataColor = colors[i];
        colorButton.style.cssText = `
            background: ${colors[i]};
        `;
        checkIcon.className = "check uil uil-check";
        colorButton.appendChild(checkIcon);
        myColors.appendChild(colorButton);
    }

    for(let color of myColors.children){
        color.addEventListener("click", function (){
            for(let i = 0; i < myColors.children.length; i++){
                if(i == 0){
                    myColors.children[i].className = "all-btn";
                    continue;
                }
                myColors.children[i].className = "color-btn";
                myColors.children[i].firstChild.style.cssText = `
                    display: none;
                `;
            }
            if(color.className.includes("all-btn")){
                color.className = "all-btn all-active";
                colorFilterIndex = [];
                for (let i = 0; i < posts.length; i++) {
                    colorFilterIndex.push(posts[i]);
                }
            }else{
                color.className = "color-btn active-color";
                let icon = color.firstChild;
                icon.style.cssText = `
                display: flex;
                align-item: center;
            `;
                colorFilter = [];
                colorFilterIndex = [];
                for (let i = 0; i < posts.length; i++) {
                    colorFilter.push(posts[i]);
                }
                f:
                for (let j = 0; j < colorFilter.length; j++) {
                    for(let i = 0; i < colorFilter[j]["colors"].length; i++){
                        if(hexToRgb(colorFilter[j]["colors"][i].substring(1)) == color.style.backgroundColor){
                            colorFilterIndex.push(colorFilter[j]);
                            continue f;
                        }
                    }
                }
            }
            mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
        });
    }

    let range = document.querySelector(".ra");
    range.setAttribute("max", maxPrice);
    range.setAttribute("value", maxPrice);
    let pRange = document.querySelector(".pr");
    let priceFilter = [];
    range.addEventListener("input", function(){
        pRange.innerHTML = formatePrice(range.value);
        priceFilter = [];
        priceFilterIndex = [];
        for (let i = 0; i < posts.length; i++) {
            priceFilter.push(posts[i]);
        }
        for (let j = 0; j < priceFilter.length; j++) {
            if(priceFilter[j]["price"] <= range.value){
                priceFilterIndex.push(priceFilter[j]);
            }
        }
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
    });

    let shipping = document.querySelector(".shipping-check");
    let shippingFilter = [];

    shipping.addEventListener("change", function (){
        shippingFilter = [];
        shippingFilterIndex = [];
        for (let i = 0; i < posts.length; i++) {
            shippingFilter.push(posts[i]);
        }
        if (shipping.checked) {
            for (let j = 0; j < shippingFilter.length; j++) {
                if(shippingFilter[j]["shipping"] == true){
                    shippingFilterIndex.push(shippingFilter[j]);
                }
            }
            mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
        }else {
            shippingFilterIndex = shippingFilter;
            mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
        }
    });

    let clear = document.querySelector(".clear-btn");
    clear.addEventListener("click", function (){
        for(let i = 0; i < cat.children.length; i++){
            cat.children[i].className = "btn-category";
        }
        cat.children[0].className = "btn-category active-category";
        comps.value = "all";
        for(let i = 0; i < myColors.children.length; i++) {
            if(i == 0){
                myColors.children[i].className = "all-btn all-active";
                continue;
            }
            myColors.children[i].className = "color-btn";
            myColors.children[i].firstChild.style.cssText = `
                    display: none;
            `;
        }
        range.value = maxPrice;
        pRange.innerHTML = formatePrice(range.value);
        shipping.checked = false;
        productNum.replaceChildren();
        productsGrid.replaceChildren();
        let textProductNum = document.createTextNode(`${posts.length}`);
        productNum.appendChild(textProductNum);
        allFilter = [];
        companyFilter = [];
        colorFilterIndex = [];
        priceFilterIndex = [];
        shippingFilterIndex = [];
        for (let post of posts) {
            allFilter.push(post);
            companyFilter.push(post);
            colorFilterIndex.push(post);
            priceFilterIndex.push(post);
            shippingFilterIndex.push(post);
        }
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
    });



    viewFilter.addEventListener("change", function () {
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
    });


    let searchList = [];
    search.oninput = function (e) {
        mergeAllFilter(allFilter,companyFilter,colorFilterIndex,priceFilterIndex,shippingFilterIndex);
        searchList = [];
        if (e.target.value == "") {
            searchList = all;
            console.log("yes");
        }else{
            for(let prod of all){
                if(prod["name"].startsWith(e.target.value)){
                    searchList.push(prod);
                }
            }
        }
        all = searchList;
        console.log(all);
        mergeAllFilter(all,all,all,all,all);
    }


    function sort(arr){
        let sortedProducts = [];
        if (viewFilter.value == "0") {
            sortedProducts = arr.sort((p1, p2) => (p1['price'] < p2['price']) ? -1 : (p1['price'] > p2['price']) ? 1 : 0);
        }else if (viewFilter.value == "1") {
            sortedProducts = arr.sort((p1, p2) => (p1['price'] < p2['price']) ? 1 : (p1['price'] > p2['price']) ? -1 : 0);
        }else if (viewFilter.value == "2") {
            sortedProducts = arr.sort((p1, p2) => (p1['name'] < p2['name']) ? -1 : (p1['name'] > p2['name']) ? 1 : 0);
        }else if (viewFilter.value == "3") {
            sortedProducts = arr.sort((p1, p2) => (p1['name'] < p2['name']) ? 1 : (p1['name'] > p2['name']) ? -1 : 0);
        }
        return sortedProducts;
    }

    
    function mergeAllFilter (categoryFunFilter,companyFunFilter,colorFunFilter,priceFunFilter,shippingFunFilter) {
        allFunFilter = [];
        allFunFilterColor = [];
        allFunFilterPrice = [];
        all = [];
        for(let i = 0; i < categoryFunFilter.length; i++) {
            if (companyFunFilter.includes(categoryFunFilter[i])) {
                allFunFilter.push(categoryFunFilter[i]);
            }
        }
        for (let j = 0; j < allFunFilter.length; j++){
            if (colorFunFilter.includes(allFunFilter[j])){
                allFunFilterColor.push(allFunFilter[j]);
            }
        }
        for (let i = 0; i < allFunFilterColor.length; i++) {
            if (priceFunFilter.includes(allFunFilterColor[i])) {
                allFunFilterPrice.push(allFunFilterColor[i]);
            }
        }
        for (let i = 0; i < allFunFilterPrice.length; i++) {
            if (shippingFunFilter.includes(allFunFilterPrice[i])) {
                all.push(allFunFilterPrice[i]);
            }
        }
        all = sort(all);
        productsGrid.replaceChildren();
        for(let i = 0; i < all.length; i++){
            callProducts(all[i]);
        }
        productNum.replaceChildren();
        let textProductNum = document.createTextNode(`${all.length}`);
        productNum.appendChild(textProductNum);
    }

    function callProducts (post){
        let product = document.createElement("article");
        product.className = "content";
        product.innerHTML = `
            <a href="product-view.html?id=${post["id"]}">
                <div class="product-image">
                    <img src="${post["image"]}" alt="">
                    <i class="uil uil-search"></i>
                </div>
            </a>
            <div class="product-content-info">
                <h4>${post["name"]}</h5>
                <h5>${formatePrice(post["price"])}</h5>
                <p>${post["description"]}</p>
            </div>
        `;
        productsGrid.appendChild(product);
    }

    let productButton = document.querySelector(".product-image");
    productButton.onclick = function () {
        
    }
}

function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

function removeDuplicates(arr) { 
    return arr.filter((item, 
        index) => arr.indexOf(item) === index); 
}

const removeItems = (array, itemToRemove) => { 
    return array.filter(v => { 
        return !itemToRemove.includes(v); 
    });
} 
removeItems([1, 2, 3, 4, 5], [1, 4]); // [2, 3, 5]

function hexToRgb(hex) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return `rgb(${r}, ${g}, ${b})`;
}

// filters button media (mobile screen)

let filtersButton = document.querySelector(".filter-side");
let filterSide = document.querySelector(".filters");
filtersButton.onclick = function () {
    if (filterSide.style.display == "none" || filterSide.style.display == "") {
        filterSide.style.display = "flex";
        filtersButton.innerHTML = "Close Filters";
    }else if (filterSide.style.display == "flex") {
        filterSide.style.display = "none";
        filtersButton.innerHTML = "Filters";
    }
}