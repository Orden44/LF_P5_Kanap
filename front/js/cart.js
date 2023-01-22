let productInLocalStorage = JSON.parse(localStorage.getItem("panier"));

const rajProduct = document.querySelector("#cart__items"); // renvoie les élément de l'id cart__items de cart.html

const cart = [];
const productPrice = []; // tableau créé pour le calcul de totalPrice

//------------------------------------------------------- récuperation fichier local storage
for (let i = 0; i < productInLocalStorage.length; i++) {
  cart.push(productInLocalStorage[i].id);
  // -----------------------------------------------------Récuperation de l'Api
  fetch(
    `http://localhost:3000/api/products/${productInLocalStorage[i].id}`
  ).then((reponse) => {
    const itemData = reponse.json();
    itemData.then((product) => {
      productPrice[i] = product.price;
      // ------------------------------------------------Ajout du code Html dans la page
      rajProduct.insertAdjacentHTML(
        "beforeend",
        `<article class="cart__item" data-id="${productInLocalStorage[i].id}" data-color="${productInLocalStorage[i].color}">
          <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
          </div>
          <div class="cart__item__content">
            <div class="cart__item__content__description">
              <h2>${product.name}</h2>
              <p>${productInLocalStorage[i].color}</p>
              <p>${product.price}€</p>
            </div>
            <div class="cart__item__content__settings">
              <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${productInLocalStorage[i].quantity}" id="${productInLocalStorage[i].id}">
              </div>
              <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
              </div>
            </div>
          </div>
        </article>`
      );
      // --------------------------------------- Modifier la quantité des produits
      let result = document.querySelectorAll(".itemQuantity");
      for (let k = 0; k < result.length; k++) {
        result[k].addEventListener("change", (e) => {
          e.preventDefault();
          const quantityModifValue = result[k].valueAsNumber;
          const resultFind = productInLocalStorage[k];
          if (quantityModifValue  > 0 && quantityModifValue <= 100) {
            resultFind.quantity = quantityModifValue;    
            localStorage.setItem("panier", JSON.stringify(productInLocalStorage));
          }
          else {
            alert("la quantité n'est pas valide");
          }
          window.location.href = "cart.html";  
        });
      }
      //---------------------------------------------- Supprimer les produits
      let btnDelete = document.querySelectorAll(".deleteItem");

      btnDelete[i].addEventListener("click", (event) => {
        event.preventDefault();
        let idDelete = productInLocalStorage[i].id;
        let colorDelete = productInLocalStorage[i].color;

        productInLocalStorage = productInLocalStorage.filter(
          el => ( el.id !== idDelete || el.color !== colorDelete)
        );
        localStorage.setItem("panier", JSON.stringify(productInLocalStorage));

        alert("Le produit a été supprimé du panier");
        window.location.href = "cart.html";
      });
      // ---------------------------------------------calcul de la quantité et prix total des produits du panier
      let itemQuantity = document.querySelectorAll(".itemQuantity");
      let selectQuantity = itemQuantity.length;
      let totalQtt = 0;
      let totalPrice = 0;
      for (let l = 0; l < selectQuantity; l++) {
        totalQtt += itemQuantity[l].valueAsNumber;
        totalPrice += itemQuantity[l].valueAsNumber * productPrice[l]; 
      }
      let totalQuantity = document.querySelector("#totalQuantity");
      totalQuantity.innerHTML = totalQtt;
      let productTotalPrice = document.querySelector("#totalPrice");
      productTotalPrice.innerHTML = totalPrice;
      
      // ------------------------------------------------- Récupération de la partie formulaire
      let emailRegExp = new RegExp("^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$");
      let regularRegExp = new RegExp("^[a-zA-Z]{1}[a-zA-Z0-9\ ,.'-()àâäéèêëïîôöùûüç]+$");
      let addressRegExp = new RegExp("^[0-9]{1}[a-zA-Z0-9\ ,.'-()àâäéèêëïîôöùûüç]{3,}$");

      const firstName = document.getElementById("firstName");
      const lastName = document.getElementById("lastName");
      const address = document.getElementById("address");
      const city = document.getElementById("city");
      const email = document.querySelector("#email");

      firstName.addEventListener("input", (event) => {
        event.preventDefault();
        if (regularRegExp.test(firstName.value) == false || firstName.value == "") {
          document.getElementById("firstNameErrorMsg").innerHTML =
            "Veuillez renseigner votre prénom";
          return false;
        } else {
          document.getElementById("firstNameErrorMsg").innerHTML = "";
          return true;
        }
      });

      lastName.addEventListener("input", (event) => {
        event.preventDefault();
        if (regularRegExp.test(lastName.value) == false || lastName.value == "") {
          document.getElementById("lastNameErrorMsg").innerHTML =
            "Veuillez renseigner votre nom";
          return false;
        } else {
          document.getElementById("lastNameErrorMsg").innerHTML = "";
          return true;
        }
      });

      address.addEventListener("input", (event) => {
        event.preventDefault();
        if (addressRegExp.test(address.value) == false || address.value == "") {
          document.getElementById("addressErrorMsg").innerHTML =
            "Veuillez indiquer votre adresse";
          return false;
        } else {
          document.getElementById("addressErrorMsg").innerHTML = "";
          return true;
        }
      });

      city.addEventListener("input", (event) => {
        event.preventDefault();
        if (regularRegExp.test(city.value) == false || city.value == "") {
          document.getElementById("cityErrorMsg").innerHTML =
            "Veuillez préciser la ville";
          return false;
        } else {
          document.getElementById("cityErrorMsg").innerHTML = "";
          return true;
        }
      });

      email.addEventListener("input", (event) => {
        event.preventDefault();
        if (emailRegExp.test(email.value) == false || email.value == "") {
          document.getElementById("emailErrorMsg").innerHTML =
            "veuillez saisir une adresse mail valide";
          return false;
        } else {
          document.getElementById("emailErrorMsg").innerHTML = "";
          return true;
        }
      });
      //--------------- Envoie commande
      let order = document.getElementById("order");
      order.addEventListener("click", (e) => {
        e.preventDefault();

        const cartOrder = {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        };
        console.log(cartOrder);
        if (
          firstName.value === "" ||
          lastName.value === "" ||
          address.value === "" ||
          city.value === "" ||
          email.value === ""
        ) {
          alert (
            "Vous devez renseigner vos coordonnées pour passer la commande !"
          );
          return;
        } else {
          let products = [];
          for (let j = 0; j < productInLocalStorage.length; j++) {
            products.push(productInLocalStorage[j].id);
          }

          let formData = {
            products: products,
            contact: cartOrder,
          };

          fetch("http://localhost:3000/api/products/order", {
            method: "POST",
            body: JSON.stringify(formData),
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((res) => res.json())
            .then((data) => {
              window.location.href = "./confirmation.html?id=" + data.orderId;
              localStorage.clear()
            });
        }
      });
    });
  });
}
