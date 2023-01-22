 // Récupération de l'id
let str = "http://localhost:3000/api/products";
let url = new URL(location.href); 
let id = url.searchParams.get("id");

// Affichage du produit
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => {
    // ---------- création constantes pour récupérer le produit à afficher
    const affichagePriceKanap = document.getElementById("price");
    const affichageTitleKanap = document.getElementById("title");
    const affichageDescriptionKanap = document.getElementById("description");
    const affichageImgKanap = document.getElementsByClassName("item__img")[0];

    const itemData = res.json();

    itemData.then((product) => {
      // ---------- affichage des élements du produit
      affichagePriceKanap.innerHTML = product.price;
      affichageTitleKanap.innerHTML = product.name;
      affichageDescriptionKanap.innerHTML = product.description;
      const imgImageUrl = `<img src="${product.imageUrl}" alt ="${product.altTxt}">`;
      affichageImgKanap.insertAdjacentHTML("afterbegin", imgImageUrl);

      // ---------- affichage des couleurs
      product.colors.forEach((color) => {
        let optionsColors = document.createElement("option");
        optionsColors.innerText = `${color}`;
        optionsColors.value = `${color}`;

        let idColors = document.getElementById("colors");
        idColors.appendChild(optionsColors);
      });
    });
  })
  .catch((error) => console.log(error));
//--------------- insertion message d'erreur dans le cas d'une couleur ou une quantité inapropriée
const button = document.getElementById("addToCart");
if (button != null) {
  button.addEventListener("click", () => {

    //--------------- ajout des produits dans le panier
    const color = document.getElementById("colors").value;
    const quantity = Number(document.getElementById("quantity").value);
    let productInLocalStorage = JSON.parse (localStorage.getItem("panier")) || [];
    //--------------- creation d'une constante pour afficher les elements dans le localstorage
    const data = {
      id: id,
      color: color,
      quantity: quantity,
    };
  	//Condition a remplir pour ajout localStorage
    if (quantity > 0 && quantity <= 100 && color !== "") {
      // Ajout produit si localStorage existant ou non
      if (productInLocalStorage !== null) {
        const productFound = productInLocalStorage.find(
          (element) => element.id === data.id && element.color === data.color,
        ); // renvoie le premier élément trouvé qui respecte la condition
        // si l'element est trouvé dans le localStorage ou non
        if (productFound != undefined) {
          productFound.quantity += quantity;
        } else {
          productInLocalStorage.push(data);
        }
      }
      localStorage.setItem("panier",JSON.stringify(productInLocalStorage));
    } else {
      alert("Veuillez choisir une quantité entre 1 et 100 et une couleur.");
    }
    window.location.href = "cart.html";
  });
}