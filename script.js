const defaultProducts = [
    {
        id: "1",
        name: "Gaming Laptop",
        searchName: "gaming laptop computer",
        price: 49999,
        category: "Laptops",
        image: "images/laptop.jpg",
        rating: 4
    },
    {
        id: "2",
        name: "Smartphone",
        searchName: "smartphone mobile phone",
        price: 14999,
        category: "Mobiles",
        image: "images/mobile.jpg",
        rating: 5
    },
    {
        id: "3",
        name: "Wireless Headphones",
        searchName: "wireless headphones electronics",
        price: 1999,
        category: "Electronics",
        image: "images/headphone.jpg",
        rating: 4
    }
];


let storeProducts =
    JSON.parse(
        localStorage.getItem("storeProducts")
    );


if (!storeProducts) {

    storeProducts = defaultProducts;

    localStorage.setItem(
        "storeProducts",
        JSON.stringify(storeProducts)
    );

}


let cart =
    JSON.parse(
        localStorage.getItem("cart")
    ) || [];


let wishlist =
    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];


const productsContainer =
    document.getElementById("productsContainer");

const noResults =
    document.getElementById("noResults");

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


function formatPrice(price) {

    return "₹" +
        Number(price).toLocaleString("en-IN");

}


function createStars(rating) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

        if (i <= rating) {

            stars += "★";

        } else {

            stars += "☆";

        }

    }

    return stars;

}


function displayProducts(productsToShow) {

    if (!productsContainer) {
        return;
    }

    productsContainer.innerHTML = "";


    if (!productsToShow ||
        productsToShow.length === 0) {

        if (noResults) {

            noResults.style.display =
                "block";

        }

        return;

    }


    if (noResults) {

        noResults.style.display =
            "none";

    }


    productsToShow.forEach(
        function (product) {

            const productCard =
                document.createElement("div");

            productCard.className =
                "product";


            const stockLeft =
                Math.floor(
                    Math.random() * 8
                ) + 3;


            productCard.innerHTML = `

                <button
                    class="wishlist-btn"
                    type="button"
                    data-id="${product.id}"
                >
                    ❤️
                </button>

                <div
                    class="product-click-area"
                    data-product-id="${product.id}"
                >

                    <img
                        src="${product.image}"
                        alt="${product.name}"
                    >

                    <h3>
                        ${product.name}
                    </h3>

                    <div class="best-seller-badge">
                        Best Seller
                    </div>

                    <div class="product-rating">

                        ${createStars(
                            Number(product.rating)
                        )}

                        <span>
                            ${product.rating}
                        </span>

                    </div>

                    <div class="product-price-box">

                        <span class="discount-price">

                            ${formatPrice(
                                product.price
                            )}

                        </span>

                        <span class="old-price">

                            ₹${Math.round(
                                Number(product.price) * 1.25
                            ).toLocaleString("en-IN")}

                        </span>

                    </div>

                    <p class="discount-text">
                        20% off
                    </p>

                    <p class="delivery-text">
                        ✔ FREE Delivery
                    </p>

                    <p class="delivery-date">
                        🚚 Delivery by Tomorrow
                    </p>

                    <p class="emi-text">

                        💳 EMI from ₹${Math.round(
                            Number(product.price) / 12
                        ).toLocaleString("en-IN")}/month

                    </p>

                    <p class="coupon-text">
                        🎁 Coupon ₹500 OFF
                    </p>

                    <p class="stock-text">

                        🔥 Only ${stockLeft}
                        left in stock

                    </p>

                </div>

                <div class="product-buttons">

                    <button
                        class="buy-now"
                        type="button"
                        data-id="${product.id}"
                    >
                        Buy Now
                    </button>

                    <button
                        class="add-cart"
                        type="button"
                        data-id="${product.id}"
                    >
                        Add to Cart
                    </button>

                </div>

            `;


            productsContainer.appendChild(
                productCard
            );

        }
    );


    connectProductLinks();

    connectCartButtons();

    connectBuyNowButtons();

    connectWishlistButtons();

}
function connectProductLinks() {

    const productLinks =
        document.querySelectorAll(
            ".product-click-area"
        );

    productLinks.forEach(
        function (productLink) {

            productLink.addEventListener(
                "click",
                function () {

                    const productId =
                        productLink.dataset.productId;

                    localStorage.setItem(
                        "selectedProductId",
                        productId
                    );

                    window.location.href =
                        "product.html";

                }
            );

        }
    );

}


function connectCartButtons() {

    const cartButtons =
        document.querySelectorAll(
            ".add-cart"
        );

    cartButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const product =
                        storeProducts.find(
                            function (item) {

                                return String(item.id) ===
                                    String(button.dataset.id);

                            }
                        );

                    if (!product) {
                        return;
                    }


                    const existingProduct =
                        cart.find(
                            function (item) {

                                return String(item.id) ===
                                    String(product.id);

                            }
                        );


                    if (existingProduct) {

                        existingProduct.quantity =
                            Number(
                                existingProduct.quantity || 1
                            ) + 1;

                    } else {

                        cart.push({

                            id: product.id,

                            name: product.name,

                            price: Number(
                                product.price
                            ),

                            image: product.image,

                            quantity: 1

                        });

                    }


                    localStorage.setItem(
                        "cart",
                        JSON.stringify(cart)
                    );


                    updateCartCount();


                    button.textContent =
                        "Added ✓";

                    button.style.background =
                        "#90ee90";


                    setTimeout(
                        function () {

                            button.textContent =
                                "Add to Cart";

                            button.style.background =
                                "#ffd814";

                        },
                        1000
                    );

                }
            );

        }
    );

}


function connectBuyNowButtons() {

    const buyNowButtons =
        document.querySelectorAll(".buy-now");

    buyNowButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.stopPropagation();

            const productId =
                button.dataset.id;

            const product =
                storeProducts.find(function (item) {

                    return String(item.id) ===
                           String(productId);

                });

            if (!product) {

                alert("Product not found");

                return;

            }

            const buyNowCart = [
                {
                    id: product.id,
                    name: product.name,
                    price: Number(product.price),
                    image: product.image,
                    quantity: 1
                }
            ];

            localStorage.setItem(
                "cart",
                JSON.stringify(buyNowCart)
            );

            window.location.href =
                "checkout.html";

        });

    });

}

function connectWishlistButtons() {

    const wishlistButtons =
        document.querySelectorAll(
            ".wishlist-btn"
        );

    wishlistButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function (event) {

                    event.stopPropagation();

                    const productId =
                        button.dataset.id;

                    const alreadySaved =
                        wishlist.some(
                            function (id) {

                                return String(id) ===
                                    String(productId);

                            }
                        );


                    if (alreadySaved) {

                        wishlist =
                            wishlist.filter(
                                function (id) {

                                    return String(id) !==
                                        String(productId);

                                }
                            );

                    } else {

                        wishlist.push(
                            productId
                        );

                    }


                    localStorage.setItem(
                        "wishlist",
                        JSON.stringify(wishlist)
                    );


                    updateWishlistCount();

                    alert(
                        "Wishlist Updated ❤️"
                    );

                }
            );

        }
    );

}


function updateCartCount() {

    const cartCount =
        document.getElementById(
            "cartCount"
        );

    if (!cartCount) {
        return;
    }


    let totalQuantity = 0;


    cart.forEach(
        function (item) {

            totalQuantity +=
                Number(
                    item.quantity || 1
                );

        }
    );


    cartCount.textContent =
        totalQuantity;

}


function updateWishlistCount() {

    const wishlistCount =
        document.getElementById(
            "wishlistCount"
        );

    if (!wishlistCount) {
        return;
    }


    wishlistCount.textContent =
        wishlist.length;

}


function searchProducts() {

    if (!searchInput) {
        return;
    }


    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const filteredProducts =
        storeProducts.filter(
            function (product) {

                const name =
                    String(
                        product.name || ""
                    ).toLowerCase();

                const category =
                    String(
                        product.category || ""
                    ).toLowerCase();

                const searchName =
                    String(
                        product.searchName ||
                        product.name ||
                        ""
                    ).toLowerCase();


                return (

                    name.includes(
                        searchText
                    ) ||

                    category.includes(
                        searchText
                    ) ||

                    searchName.includes(
                        searchText
                    )

                );

            }
        );


    displayProducts(
        filteredProducts
    );

}
if (searchButton) {

    searchButton.addEventListener(
        "click",
        searchProducts
    );

}


if (searchInput) {

    searchInput.addEventListener(
        "input",
        searchProducts
    );


    searchInput.addEventListener(
        "keyup",
        function (event) {

            if (event.key === "Enter") {

                searchProducts();

            }

        }
    );

}


/* Category Filter */

const categoryItems =
    document.querySelectorAll(
        ".category-menu span"
    );


categoryItems.forEach(
    function (item) {

        item.addEventListener(
            "click",
            function () {

                const selectedCategory =
                    item.innerText
                        .trim()
                        .toLowerCase();


                if (
                    selectedCategory.includes(
                        "all"
                    )
                ) {

                    displayProducts(
                        storeProducts
                    );

                    return;

                }


                const filteredProducts =
                    storeProducts.filter(
                        function (product) {

                            return String(
                                product.category || ""
                            )
                                .toLowerCase()
                                .includes(
                                    selectedCategory
                                );

                        }
                    );


                displayProducts(
                    filteredProducts
                );

            }
        );

    }
);


/* Login Display */

const loggedInUser =
    JSON.parse(
        localStorage.getItem(
            "loggedInUser"
        )
    );


const accountLink =
    document.getElementById(
        "accountLink"
    );


const logoutButton =
    document.getElementById(
        "logoutButton"
    );


if (
    loggedInUser &&
    accountLink
) {

    accountLink.innerHTML = `

        Hello, ${loggedInUser.name}

        <strong>
            My Account
        </strong>

    `;


    accountLink.href =
        "orders.html";

}


if (logoutButton) {

    if (loggedInUser) {

        logoutButton.style.display =
            "block";

    } else {

        logoutButton.style.display =
            "none";

    }


    logoutButton.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Do you want to logout?"
                );


            if (!confirmLogout) {
                return;
            }


            localStorage.removeItem(
                "loggedInUser"
            );


            window.location.reload();

        }
    );

}


/* Slider */

const slides =
    document.querySelectorAll(
        ".slide"
    );


const previousSlideButton =
    document.getElementById(
        "previousSlide"
    );


const nextSlideButton =
    document.getElementById(
        "nextSlide"
    );


let currentSlide = 0;


function showSlide(index) {

    if (slides.length === 0) {
        return;
    }


    slides.forEach(
        function (slide) {

            slide.classList.remove(
                "active"
            );

        }
    );


    currentSlide =
        (
            index +
            slides.length
        ) %
        slides.length;


    slides[currentSlide]
        .classList.add(
            "active"
        );

}


function nextSlide() {

    showSlide(
        currentSlide + 1
    );

}


function previousSlide() {

    showSlide(
        currentSlide - 1
    );

}


if (nextSlideButton) {

    nextSlideButton.addEventListener(
        "click",
        nextSlide
    );

}


if (previousSlideButton) {

    previousSlideButton.addEventListener(
        "click",
        previousSlide
    );

}


if (slides.length > 0) {

    showSlide(0);

    setInterval(
        nextSlide,
        3000
    );

}


/* Shop Now Button */

function scrollToProducts() {

    const productSection =
        document.getElementById(
            "productSection"
        );


    if (productSection) {

        productSection.scrollIntoView({

            behavior: "smooth"

        });

    }

}


/* Start Website */

displayProducts(
    storeProducts
);


updateCartCount();


updateWishlistCount();

/* ===========================
   PRODUCT FILTERS
=========================== */

const categoryFilter =
    document.getElementById("categoryFilter");

const priceFilter =
    document.getElementById("priceFilter");

const ratingFilter =
    document.getElementById("ratingFilter");

const sortProducts =
    document.getElementById("sortProducts");


function applyFilters() {

    let filtered = [...storeProducts];

    if (
        categoryFilter.value !== "all"
    ) {

        filtered = filtered.filter(
            function (product) {

                return String(product.category) ===
                       String(categoryFilter.value);

            }
        );

    }


    if (
        priceFilter.value !== "all"
    ) {

        filtered = filtered.filter(
            function (product) {

                return Number(product.price) <=
                       Number(priceFilter.value);

            }
        );

    }


    if (
        ratingFilter.value !== "all"
    ) {

        filtered = filtered.filter(
            function (product) {

                return Number(product.rating) >=
                       Number(ratingFilter.value);

            }
        );

    }


    if (
        sortProducts.value === "low"
    ) {

        filtered.sort(
            function (a, b) {

                return Number(a.price) -
                       Number(b.price);

            }
        );

    }


    if (
        sortProducts.value === "high"
    ) {

        filtered.sort(
            function (a, b) {

                return Number(b.price) -
                       Number(a.price);

            }
        );

    }


    if (
        sortProducts.value === "rating"
    ) {

        filtered.sort(
            function (a, b) {

                return Number(b.rating) -
                       Number(a.rating);

            }
        );

    }


    displayProducts(filtered);

}


if (
    categoryFilter &&
    priceFilter &&
    ratingFilter &&
    sortProducts
) {

    categoryFilter.addEventListener(
        "change",
        applyFilters
    );

    priceFilter.addEventListener(
        "change",
        applyFilters
    );

    ratingFilter.addEventListener(
        "change",
        applyFilters
    );

    sortProducts.addEventListener(
        "change",
        applyFilters
    );

}