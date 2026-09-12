/* =====================================================
   SYAFANI BAROKAH
   SCRIPT.JS
===================================================== */


/* =====================================================
   NOMOR WHATSAPP
===================================================== */

const WA_NUMBER = "6281372637550";

/* =====================================================
   CART
===================================================== */

const CART_KEY = "syafaniCart";


function getCart() {

    const data = localStorage.getItem(CART_KEY);

    if (!data) {
        return [];
    }

    try {

        return JSON.parse(data);

    } catch (error) {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

}


/* =====================================================
   FORMAT RUPIAH
===================================================== */

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(number);

}


/* =====================================================
   ID
===================================================== */

function makeId(name) {

    return name
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

}


/* =====================================================
   UBAH JUMLAH MENU
===================================================== */

function changeQuantity(
    name,
    price,
    change
) {

    let cart = getCart();

    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.qty += change;


        if (existing.qty <= 0) {

            cart =
                cart.filter(
                    item => item.name !== name
                );

        }

    } else if (change > 0) {

        cart.push({

            name: name,

            price: price,

            qty: change

        });

    }


    saveCart(cart);

    updateMenuQuantity();

    updateCartCount();

}


/* =====================================================
   UPDATE JUMLAH DI MENU
===================================================== */

function updateMenuQuantity() {

    const cart = getCart();


    cart.forEach(item => {

        const id =
            "qty-" + makeId(item.name);

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                item.qty;

        }

    });


    const allQuantity =
        document.querySelectorAll(
            '[id^="qty-"]'
        );


    allQuantity.forEach(element => {

        const id =
            element.id.replace(
                "qty-",
                ""
            );

        const item =
            cart.find(
                item =>
                    makeId(item.name) === id
            );


        if (!item) {

            element.textContent = "0";

        }

    });


    const menuCount =
        document.getElementById(
            "menuCartCount"
        );


    if (menuCount) {

        menuCount.textContent =
            cart.reduce(
                (total, item) =>
                    total + item.qty,
                0
            );

    }

}


/* =====================================================
   CART COUNT
===================================================== */

function updateCartCount() {

    const cart = getCart();


    const count =
        cart.reduce(
            (total, item) =>
                total + item.qty,
            0
        );


    const elements =
        document.querySelectorAll(
            "#cartCount"
        );


    elements.forEach(element => {

        element.textContent =
            count;

    });

}


/* =====================================================
   RENDER PESANAN
===================================================== */

function renderOrders() {

    const container =
        document.getElementById(
            "orderContainer"
        );


    if (!container) {
        return;
    }


    const emptyOrder =
        document.getElementById(
            "emptyOrder"
        );


    const summary =
        document.getElementById(
            "orderSummary"
        );


    const totalElement =
        document.getElementById(
            "orderTotal"
        );


    const cart = getCart();


    container.innerHTML = "";


    if (cart.length === 0) {

        if (emptyOrder) {

            emptyOrder.style.display =
                "block";

        }


        if (summary) {

            summary.style.display =
                "none";

        }

        return;

    }


    if (emptyOrder) {

        emptyOrder.style.display =
            "none";

    }


    if (summary) {

        summary.style.display =
            "block";

    }


    let total = 0;


    cart.forEach(item => {

        const subtotal =
            item.price * item.qty;

        total += subtotal;


        const itemElement =
            document.createElement(
                "div"
            );


        itemElement.className =
            "order-item";


        itemElement.innerHTML = `

            <div class="order-item-info">

                <h3>
                    ${item.name}
                </h3>

                <p>
                    ${formatRupiah(item.price)}
                    × ${item.qty}
                </p>

            </div>


            <div class="order-item-actions">

                <strong class="order-price">
                    ${formatRupiah(subtotal)}
                </strong>


                <div class="quantity-control">

                    <button
                        onclick="changeQuantity('${item.name}', ${item.price}, -1)"
                    >
                        −
                    </button>

                    <span>
                        ${item.qty}
                    </span>

                    <button
                        onclick="changeQuantity('${item.name}', ${item.price}, 1)"
                    >
                        +
                    </button>

                </div>


                <button
                    class="delete-btn"
                    onclick="removeItem('${item.name}')"
                    title="Hapus"
                >
                    ×
                </button>

            </div>

        `;


        container.appendChild(
            itemElement
        );

    });


    if (totalElement) {

        totalElement.textContent =
            formatRupiah(total);

    }

}


/* =====================================================
   HAPUS ITEM
===================================================== */

function removeItem(name) {

    let cart = getCart();


    cart =
        cart.filter(
            item => item.name !== name
        );


    saveCart(cart);

    renderOrders();

    updateMenuQuantity();

    updateCartCount();

}


/* =====================================================
   KIRIM WHATSAPP
===================================================== */

function sendOrder() {

    const cart = getCart();


    if (cart.length === 0) {

        alert(
            "Pesanan masih kosong."
        );

        return;

    }


    let total = 0;


    let message =
        "Assalamu'alaikum, saya ingin memesan dari Syafani Barokah.%0A%0A";


    message +=
        "📍 Kantin STAIN Sultan Abdurrahman%0A%0A";


    message +=
        "Pesanan:%0A";


    cart.forEach(
        (item, index) => {

            const subtotal =
                item.price * item.qty;

            total += subtotal;


            message +=
                `${index + 1}. ${item.name} × ${item.qty} — ${formatRupiah(subtotal)}%0A`;

        }
    );


    message +=
        `%0ATotal: ${formatRupiah(total)}%0A%0A`;


    message +=
        "Terima kasih.";


    const url =
        `https://wa.me/${WA_NUMBER}?text=${message}`;


    window.open(
        url,
        "_blank"
    );


    setTimeout(
        () => {

            localStorage.removeItem(
                CART_KEY
            );


            window.location.href =
                "terima-kasih.html";

        },
        800
    );

}


/* =====================================================
   SAAT HALAMAN DIBUKA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateCartCount();

        updateMenuQuantity();

        renderOrders();

    }
);