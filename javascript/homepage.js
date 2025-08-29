console.log("homepage.js loaded ✅");


function displayProduct(product) {
    return `<div id="p${product.product_id}">
    <H2>${product.product_name}</H2>
    <img src="${product.imgSrc}">
    <br>
    <HR>
    <span>₹${product.price}</span><button onclick="addToCart(${product.product_id},'${product.product_name}','${product.imgSrc}',${product.price})">Add-to-cart</button></div>`
}

function displayItems(filter_id) {
    let cvalue = getCookie("username");
    if (cvalue !== null && cvalue !== "") {
        if (localStorage.getItem("finalHTML") !== null) {
            document.getElementById("flexOutput").innerHTML = localStorage.getItem("finalHTML");

            let qtyArray = localStorage.getItem("qty").split(",");
            let prodArray = localStorage.getItem("productsArray").split(",");

            for (let i = 0; i < prodArray.length; i++) {
                document.getElementById(`i${prodArray[i]}`).value = qtyArray[i];
            }
        }
    }

    fetch("Json/myProducts.json")
        .then((response) => response.json())
        .then((myObject) => {
            for (let k in myObject) {
                if (myObject[k].filter_id === filter_id) {
                    let arr = myObject[k].products;
                    let productHTML = "";
                    for (let j in arr) {
                        productHTML += displayProduct(arr[j]);
                    }

                    let myRow = document.querySelectorAll(".myRow");
                    myRow.forEach((row) => (row.innerHTML = "")); // ✅ fixed

                    let firstRow = document.querySelectorAll(".myRow")[0];
                    firstRow.innerHTML = productHTML;
                    firstRow.style.display = "flex";
                    firstRow.style.flexDirection = "row";
                    firstRow.style.justifyContent = "space-around";
                    firstRow.style.alignContent = "space-around";
                    firstRow.style.flexWrap = "wrap";
                    firstRow.style.padding = "20px";
                    firstRow.style.paddingTop = "0px";
                    firstRow.style.height = "630px";
                    firstRow.style.boxSizing = "border-box"; // ✅ fixed

                    let myBlocks = document.querySelectorAll(".myRow div");
                    myBlocks.forEach((block) => {
                        if (block.innerHTML !== undefined && block.innerHTML !== "") {
                            block.style.width = "33%";
                            block.style.height = "300px";
                            block.style.textAlign = "center";
                            block.style.borderRadius = "3%";
                            block.style.border = "2px solid black";
                            block.style.marginTop = "10px";
                            block.style.backgroundImage =
                                "linear-gradient(to bottom right,rgba(7, 71, 11, 0.51),rgba(15, 172, 54, 0.82),rgba(15, 150, 217, 0.54))";
                        }
                    });

                    let myImages = document.querySelectorAll(".myRow img");
                    myImages.forEach((img) => {
                        if (typeof img === "object") {
                            img.style.width = "180px";
                            img.style.height = "180px";
                            img.style.objectFit = "cover";
                        }
                    });

                    let mySpan = document.querySelectorAll(".myRow span");
                    mySpan.forEach((span) => {
                        if (typeof span === "object") {
                            span.style.float = "left";
                            span.style.color = "red";
                            span.style.margin = "auto auto auto 10px";
                        }
                    });

                    let myCartButton = document.querySelectorAll(".myRow button");
                    myCartButton.forEach((btn) => {
                        if (typeof btn === "object") {
                            btn.style.float = "right";
                            btn.style.margin = "auto 10px auto auto";
                        }
                    });
                }
            }
        });
}



function setCookie(cname, cvalue) {
    let myCookie = cname + "=" + cvalue

    let d = new Date()

    d.setMinutes(d.getMinutes() + 2)

    document.cookie = myCookie + ";expires=" + d.toUTCString() + ";path=/"

}

function getCookie(cname) {
    let myCookie = cname + "="

    let allCookies = decodeURIComponent(document.cookie)

    let cookieArray = allCookies.split(";")

    for (let k = 0; k < cookieArray.length; k++) {
        if (cookieArray[k].indexOf(myCookie) != -1) {
            let cvalue = cookieArray[k].substring(cookieArray[k].indexOf("=") + 1)

            if (cvalue === "") {
                continue
            }
            else {
                return cvalue
            }

        }
    }
    return ""
}


function addToCart(product_id, product_name, imgSrc, price) {
    let cookieValue = getCookie("username");
    if (cookieValue !== "" && cookieValue !== null) {
        let productsString = localStorage.getItem("productsArray") || "";
        let prodArr = productsString ? productsString.split(",") : [];

        if (prodArr.indexOf(String(product_id)) !== -1) {
            alert("Product already in cart");
        } else {
            productsString = productsString ? productsString + "," + product_id : String(product_id);
            localStorage.setItem("productsArray", productsString);

            let myContainer = document.getElementById("flexContainer");
            let newDiv = document.createElement("div");
            newDiv.id = product_id;

            let productNameLabel = document.createElement("label");
            productNameLabel.textContent = "Product Name:";
            newDiv.appendChild(productNameLabel);

            let nameSpan = document.createElement("span");
            nameSpan.textContent = product_name;
            nameSpan.style.marginLeft = "20px";
            newDiv.appendChild(nameSpan);

            newDiv.appendChild(document.createElement("br"));

            let quantityLabel = document.createElement("label");
            quantityLabel.textContent = "Quantity:";
            newDiv.appendChild(quantityLabel);

            // ✅ FIXED: use backticks for string template
            let inputHTML = `<input style="margin-left:10px;text-align:center;" type="number" id="i${product_id}" value="1" onchange="populateQuantity()">`;
            newDiv.innerHTML += inputHTML;

            newDiv.appendChild(document.createElement("br"));

            let priceLabel = document.createElement("label");
            priceLabel.textContent = "Price:";
            newDiv.appendChild(priceLabel);

            let priceSpan = document.createElement("span");
            priceSpan.textContent = `₹${price}`; // ✅ FIXED
            priceSpan.style.marginLeft = "90px";
            newDiv.appendChild(priceSpan);

            newDiv.appendChild(document.createElement("br"));
            newDiv.appendChild(document.createElement("hr"));

            // ✅ FIXED: wrap button inside backticks
            newDiv.innerHTML += `<button class="badge badge-pill badge-danger" style="padding:10px;" onclick="removeItem(${product_id})"><i class="bi bi-trash-fill"></i></button>`;

            let myButtons = document.getElementById("buttons");
            myContainer.insertBefore(newDiv, myButtons);

            let flexOutput = document.getElementById("flexOutput");
            flexOutput.replaceChild(myContainer, document.getElementById("flexContainer"));

              let   myPriceArry=localStorage.getItem("prices").split(",")
              myPriceArry.push(price)

              localStorage.setItem("prices",myPriceArry)

              let myImageSrc=localStorage.getItem("imgSrcs").split(",")
              myImageSrc.push(imgSrc)

              localStorage.setItem("imgSrcs",myImageSrc)

            populateQuantity();
            localStorage.setItem("finalHTML", flexOutput.innerHTML);
        }
    } else {
        let uname = prompt("Introduce Yourself");
        if (uname !== null && uname !== "") {
            setCookie("username", uname);

            localStorage.setItem("finalHTML", "");
            localStorage.setItem("qty", "");
            localStorage.setItem("productsArray", String(product_id));

            let returnDiv = `<div id="flexContainer">
               <H2>Welcome,${uname}</H2>
               <div id="${product_id}">
               <label>Product_name:</label><span style="margin-left:20px;">${product_name}</span><br>
               <label>Quantity:</label><input style="margin-left:10px;text-align:center;" type="number"  id="i${product_id}" value="1" onchange="populateQuantity()"><br>
               <label>Price:</label><span style="margin-left:90px;">₹${price}</span><br>
               <hr><button class="badge badge-pill badge-danger" style="padding:10px;" onclick="removeItem(${product_id})"><i class="bi bi-trash3-fill"></i></button></div>
               <div id="buttons" style="background-color:none;background-image:none;border:none;">
               <button class="btn btn-danger" onclick="clearCart()" style="float:left;margin:auto auto auto 10px;">Clear Cart</button>
               <button class="btn btn-success" style="float:right;margin:auto 10px auto auto;" onclick="checkOut()" >Check-Out</button>
               </div></div>`;

            localStorage.setItem("finalHTML", returnDiv);
            localStorage.setItem("prices", [price]);
            localStorage.setItem("imgSrcs", [imgSrc]);

            document.getElementById("flexOutput").innerHTML = returnDiv;
            populateQuantity();
        }
    }
}


function populateQuantity() {

    let prodArray = localStorage.getItem("productsArray").split(",")

    let len = prodArray.length

    let qtyArr = new Array()


    for (let k = 0; k < len; k++) {

        if (document.getElementById(`i${prodArray[k]}`).value != "") {
            qtyArr[k] = document.getElementById(`i${prodArray[k]}`).value
        }
        else {

            qtyArr[k] = 1
        }
    }

    localStorage.setItem("qty", qtyArr)
}



function clearCart() {
    d = new Date()
    d.setMonth(d.getMonth() - 1)
    document.cookie = "username=;expires=" + d.toUTCString() + ";path=/"
    localStorage.setItem("productsArray", "")
    document.getElementById("flexOutput").innerHTML = ""
    localStorage.setItem("finalHTML", "")
    localStorage.setItem("qty", "")
    localStorage.setItem("prices", "")
    localStorage.setItem("imgSrcs", "")
}


function removeItem(product_id) {
    let productsString = localStorage.getItem("productsArray")
    let qty = localStorage.getItem("qty").split(",")

    let productsArray = productsString.split(",")

    let imgSrcArr = localStorage.getItem("imgSrcs").split(",")
    let priceArr = localStorage.getItem("prices").split(",")

    let removePosition = productsArray.indexOf(`${product_id}`)


    productsArray.splice(removePosition, 1)
    qty.splice(removePosition, 1)
    imgSrcArr.splice(removePosition, 1)
    priceArr.splice(removePosition, 1)


    localStorage.setItem("productsArray", productsArray)
    localStorage.setItem("qty", qty)
    localStorage.setItem("imgSrcs", imgSrcArr)
    localStorage.setItem("prices", priceArr)



    if (productsArray.length === 0) {
        d = new Date()
        d.setMonth(d.getMonth() - 1)
        document.cookie = "username=;expires=" + d.toUTCString() + ";path=/"
        localStorage.setItem("productsArray", "")
        document.getElementById("flexOutput").innerHTML = ""
        localStorage.setItem("finalHTML", "")
        localStorage.setItem("qty", "")
        localStorage.setItem("imgSrcs", "")
        localStorage.setItem("prices", "")
    }
    else {
        let finalOutput = document.getElementById("flexOutput")
        let container = document.getElementById("flexContainer")

        let child = document.getElementById(`${product_id}`)
        container.removeChild(child)

        finalOutput.replaceChild(container, document.getElementById("flexContainer"))

        let finalHTML = finalOutput.innerHTML

        document.getElementById("flexOutput").innerHTML = finalHTML
        localStorage.setItem("finalHTML", finalHTML)

        let qtyArray = localStorage.getItem("qty").split(",")

        let prodArray = localStorage.getItem("productsArray").split(",")

        for (let i = 0; i < prodArray.length; i++) {

            document.getElementById(`i${prodArray[i]}`).value = qtyArray[i]
        }
    }
}

function checkOut()
{
     let myImageArr=localStorage.getItem("imgSrcs").split(",");
     let qtyArr=localStorage.getItem("qty").split(",");
     let priceArr=localStorage.getItem("prices").split(",");

     

     let myTable=`<table><tr><th class="table-product-heading">Product</th><th class="table-items-heading">Quantity</th><th class="table-items-heading">Price</th><th class="table-total-heading">Total</th></tr>`
     let grandTotal=0;

     for(let i=0;i<myImageArr.length;i++)
     {
        let tot=Number(qtyArr[i])*Number(priceArr[i]);
        grandTotal+=tot
        myTable+=`<tr><td class="table-product-content"><img src="${myImageArr[i]}" style="width:100px; height:100px; object-fit: cover;border:1px solid white;"></td><td class="table-product-items">${qtyArr[i]}</td><td class="table-product-items">${priceArr[i]}</td><td class="table-product-total">${tot}</td></tr>`

     }

     myTable+=`<tr><td colspan="3" style="text-align: center;">Grand Total</td><td class="table-total-heading">${grandTotal}</td></tr></table>`

     let billDiv=`<div id="billTable"><h2>Your Final Bill:</h2>${myTable}</div><div id="buttons2"><button id="backToCart" class="btn btn-danger" onclick="goBack()">Back</button><button class="btn btn-success" id="pay" onclick="proceedPayment(${grandTotal})">proceed To Pay</button></div>
                    <div id="bankInfo" class="bg-info"></div>`
     document.getElementById("finalBill").style.display="block"
     document.getElementById("finalBill").innerHTML=billDiv
    }

    function goBack()
    {
        document.getElementById("finalBill").innerHTML=""
        document.getElementById("finalBill").style.display="none"
    }


    function proceedPayment(total)
    {
        let cardDiv=`<img src="img/visa.jpg" style="width: 50px; height: 50px; object fit: cover;margin-left: 10px;"><img src="img/mastercard.jpg" style="margin-left: 10px; width: 40px; height: 30px; object fit: cover"><img src="img/amex.jpgu" style="margin-left: 10px; width: 40px; height: 50px; object fit: cover"><img  src="img/discover.svg" style=" margin-left: 10px; width: 50px; height: 50px; object fit: cover">`
        cardDiv+=`<h4 style="margin: 10px auto auto auto; text-align: center;">Amount Payable:₹${total}</h4>`

        cardDiv+=`<div style="width: 510px; margin: auto;"><div style="float: left; margin: 10px auto auto auto;"><label>Card Number:</label><input type="text" style="width: 50px; text-align: center;" maxlength="4">-<input type="text" style="width: 50px; text-align: center;" maxlength="4">-<input type="text" style="width:50px; text-align: center;" maxlength="4">-<input type="text" style="width:50px; text-align: center;" maxlength="4"> </div>`
        cardDiv+=`<div style="margin:10px 10px auto auto; float: right;">CVV/CVV2:<input type="password" style="appearance:none; padding-left: 15px; width: 70px;background-image:url('img/lock-fill.svg');background-size:15px auto; background-position:1px 5px; background-repeat: no-repeat;" maxlength="3"></div>`
        cardDiv+=`<div style="margin: 10px auto auto 27px; clear: left;"><label>Valid thru:</label><input type="text" style="width: 40px;text-align:center; margin-top: 10px;" maxlength="2">/<input type="text" style="width: 40px; text-align: center; margin-top: 10px;" maxlength="2"></div><hr style="margin: 0px padding: 0px;"></div>`
        cardDiv+=`<button class="btn btn-success" onclick="paymentSuccessfull()" style="float: right; margin-right:15px;">Confirm Payment</button></div>`
        document.getElementById("bankInfo").innerHTML=cardDiv

        $("#bankInfo").slideDown("slow")
    }


