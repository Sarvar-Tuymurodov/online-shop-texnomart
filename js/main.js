const productsSetting = {
    allProducts :[],
    isFiltered:false,
    filteredProducts:[],
    currentPage:1,
    maxPage:0
}


//TODO: Get Products from JSON
const  getProductsFromJson = async ()=>{
    const responseData = await fetch("../products.json",{
        method:"GET"
    })
    const productsArray = await responseData.json();


    if(!responseData.ok){
        console.error("Something get wrong with getting products!")
        return [];
    }

    productsSetting.allProducts = productsArray;
}

//TODO: Template of product
const renderProductTemplate = (product)=>{
    return  `<div class="product__box">
                <div class="product__name"><p>Name:</p><span>${product.name}</span> </div>
                <div class="product__brand"><p>Brand:</p><span>${product.brand}</span></div>
                <div class="product__quantity"><p>Quantity:</p><span>${product.quantity}</span></div>
                <div class="product__weight"><p>Weight:</p><span>${product.weight}</span></div>
                <div class="product__stock"><p>Stock:</p><span>${product.stock}</span></div>
                <div class="product__price"><p>Price:</p><span>${product.price}</span></div>
            </div>`
}

//TODO: Render Products In Browser
const renderProducts = (array) =>{
    const productList = document.querySelector(".product__list");
    productList.innerHTML ="";
    array.forEach(product => {
         productList.innerHTML += renderProductTemplate(product);
    })
}

//TODO: Draw Part Pf Objects
const filteredProducts = ()=>{
    const paginPage =  productsSetting.currentPage;
    productsSetting.filteredProducts = productsSetting.allProducts.slice((paginPage - 1) * 4 ,(paginPage - 1) * 4 + 4);

    renderProducts(productsSetting.filteredProducts);
}

//TODO: Claculate maxpage and dotes
const calculateMaxPage = (array = productsSetting.allProducts)=>{
    productsSetting.maxPage = Math.ceil(array.length / 4 );
    const paginationDotesParent = document.querySelector(".product__pagination--count");
    paginationDotesParent.innerHTML = "";

    for(let i=0; i < productsSetting.maxPage; i++){
        paginationDotesParent.innerHTML += 
            `<span class="${productsSetting.currentPage == i ? "active" :""}"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="10" fill="#61636C"/>
            </svg></span>`
    }

    doClickableDot();
}

//TODO: Active pagination count
const doActivePaginationDot = ()=>{
    let dotes = document.querySelectorAll(".product__pagination--count > span");

    dotes.forEach((dot,index) => {
        dot.classList.remove("active");
        if((index + 1) == productsSetting.currentPage) dot.classList.add("active");

    } )
}

//TODO: Pagination dot clickable
const doClickableDot = ()=>{
    document.querySelectorAll(".product__pagination--count > span").forEach((pagDot,index) =>{  
        pagDot.addEventListener("click",() => {
            productsSetting.currentPage = index + 1;
    
            doActivePaginationDot();
            filteredProducts();
        })
    })
}

const showAllAndSortedProductsCount = ()=>{
    document.querySelector(".product__counts--sorted").innerHTML = productsSetting.filteredProducts.length
    document.querySelector(".product__counts--all").innerHTML = productsSetting.allProducts.length
}

//TODO: Load Functions when DOM is loaded
document.addEventListener("DOMContentLoaded", async () => {
    await getProductsFromJson();
    calculateMaxPage();
    filteredProducts();
    doActivePaginationDot();
    doClickableDot();
});

//TODO: Pagination Next
document.getElementById("paginationNext").addEventListener("click",()=>{
    if(productsSetting.currentPage >=  productsSetting.maxPage ) return

    productsSetting.currentPage += 1;
    filteredProducts();
    doActivePaginationDot();
})

//TODO: Pagination Prev
document.getElementById("paginationPrev").addEventListener("click",()=>{
    if(productsSetting.currentPage <= 1  ) return;

    productsSetting.currentPage -= 1;
    filteredProducts();
    doActivePaginationDot();
})


document.getElementById("sarchAndFilter").addEventListener("input",function(){
    //TODO: I want to paste check input lenght but it`s a demo !
    // if (this.lenth < 3) return;
    const paginPage = productsSetting.currentPage;
    const allFilteredProducts = productsSetting.allProducts.filter(c => c.brand.includes(this.value.trim()));
    calculateMaxPage(allFilteredProducts);
    doActivePaginationDot();
    debugger
    if(paginPage > productsSetting.maxPage) {
        productsSetting.filteredProducts = allFilteredProducts?.slice(0 ,4);
        renderProducts(productsSetting.filteredProducts);
        return;
    }
    productsSetting.filteredProducts = allFilteredProducts?.slice((paginPage - 1) * 4 ,(paginPage - 1) * 4 + 4);
    renderProducts(productsSetting.filteredProducts);
})