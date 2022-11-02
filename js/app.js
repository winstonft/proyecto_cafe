// Variables
const carrito = document.querySelector("#carrito");
const contenedorCarrito = document.querySelector("#lista-carrito tbody");
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito");
const finalizarCompraBtn = document.querySelector("#finalizar-compra");
const listaCafes = document.querySelector("#lista-cafes");
let cafesEnCarrito = [];
let precioTotalPagar = 0;


// Llamar a mi catalogo de productos(cafes)
async function fetchProductos() {
  const response = await fetch('./catalogo.json')
  return await response.json()
}

// Llamo a esa función
let catalogoCafes = []

fetchProductos().then(listaDeCafes => {
  catalogoCafes = listaDeCafes
  mostrarCatalogo()
})

// Renderiza el catalogo de productos
function mostrarCatalogo() {
  for (cafe of catalogoCafes) {
    const {
      id,
      nombre,
      precio,
      imagen
    } = cafe // Destructuring
    const productoHTML = `
      <div class="producto col-6 col-md-4">
      <div class="card mt-3">
        <div class="card-body">
          <img src="${imagen}" class="card-img-top" alt="cafe">
          <h2 class="card-title">${nombre}</h2>
          <p class="card-text precio">$${precio}</p>
          <div class="text-center">
          <a href="#" class="btn btn-primary agregar-carrito" data-id="${id}">Agregar al carrito</a>
          </div>
        </div>
      </div>
      `
    listaCafes.innerHTML += productoHTML
  }
}

mostrarCatalogo()

cargarEventListeners();

function cargarEventListeners() {
  // Para agregar cafe presionando "Agregar al carrito"
  listaCafes.addEventListener("click", agregarCafe);
  listaCafes.addEventListener("click", () => {
    Toastify({
      text: "Café agregado a tu carrito de compra",
      duration: 3000
    }).showToast();
  })

  // Para eliminar cafes del carrito
  carrito.addEventListener("click", eliminarCafe);

  // Muestra los cafes en el carrito del localStorage
  document.addEventListener('DOMContentLoaded', () => {
    cafesEnCarrito = JSON.parse(localStorage.getItem('carrito')) || [];

    carritoHTML();
  })



  // Vaciar el carrito 
  vaciarCarritoBtn.addEventListener('click', () => {
    cafesEnCarrito = []; // Reseteamos el arreglo
    localStorage.clear();
    limpiarHTML(); // Eliminamos todo el HTML
  })


  // Finalizar compra
  finalizarCompraBtn.addEventListener('click', (e) => {
    e.preventDefault()
    if (cafesEnCarrito.length === 0) {
      return Swal.fire(
        'Ups!',
        'No hay productos en el carrito'
      )
    } else {
      window.location.href = "/compra.html"
    }
  })
}


// Funciones
function agregarCafe(e) {
  e.preventDefault();
  if (e.target.classList.contains("agregar-carrito")) {
    const cafeSeleccionado = e.target.parentElement.parentElement;
    leerPedidoCafe(cafeSeleccionado);
  }
};

// Para eliminar cafes del carrito
function eliminarCafe(e) {
  if (e.target.classList.contains('borrar-cafe')) {
    const cafeId = e.target.getAttribute('data-id');

    // Elimina del arreglo de cafesEnCarrito por el data-id
    cafesEnCarrito = cafesEnCarrito.filter(cafe => cafe.id !== cafeId);

    carritoHTML(); // Iterar sobre el carrito y mostrar su HTML
  }
}

// Extrae la informacion del pedido del HTML
function leerPedidoCafe(cafe) {
  // console.log(cafe)

  // Crear un objeto con el contenido del pedido
  const infoPedido = {
    imagen: cafe.querySelector("img").src,
    titulo: cafe.querySelector("h2").textContent,
    precio: cafe.querySelector(".precio").textContent,
    id: cafe.querySelector("a").getAttribute("data-id"),
    cantidad: 1,
  };

  // Revisa si un elemento ya existe en el carrito
  const existe = cafesEnCarrito.some(cafe => cafe.id === infoPedido.id);
  if (existe) {
    // Actualizamos la cantidad
    const cafes = cafesEnCarrito.map(cafe => {
      if (cafe.id === infoPedido.id) {
        cafe.cantidad++;
        return cafe; // retorna el objeto actualizado
      } else {
        return cafe; // retorna los objetos que no son los duplicados
      }
    });

    cafesEnCarrito = [...cafes];
  } else {
    // Agrega elementos al arreglo del carrito
    cafesEnCarrito = [...cafesEnCarrito, infoPedido];
  }


  carritoHTML();
}

// Muestra el pedido de cafes en el carrito HTML
function carritoHTML() {
  // Limpiar el HTML
  limpiarHTML();

  // Recorre el carrito y genera el HTML
  cafesEnCarrito.forEach((cafe) => {
    const {
      imagen,
      titulo,
      precio,
      cantidad,
      id
    } = cafe;
    const row = document.createElement("tr");
    row.innerHTML = `
    <td>
      <img src="${imagen}" width="100">
    </td>
        <td>
          ${titulo}
        </td>
        <td>
          ${precio}
        </td>
        <td>
          ${cantidad}
        </td>
        <td>
          <a href="#" class="borrar-cafe" data-id="${id}" > X </a>
        </td>
    `;

    // Agrega el HTML del carrito en el tbody
    contenedorCarrito.appendChild(row);
  });

  // Agregar el carrito de compras al localStorage
  sincronizarStorage();
}

function sincronizarStorage() {
  localStorage.setItem('carrito', JSON.stringify(cafesEnCarrito));
}

// Elimina los pedidos de cafe del tbody(carrito)
function limpiarHTML() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}