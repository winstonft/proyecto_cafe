// Traigo el carrito de localStorage (si no existe, lo creo vacio)
const carrito = JSON.parse(localStorage.getItem('carrito')) || []

// Variables
const confirmarCompra = document.querySelector("#confirmar-compra");
const pedidosCafe = document.querySelector("#pedido-cafes");

cargarEventListeners();

function cargarEventListeners() {
    mostrarPedidosCafe();
    
    confirmarCompra.addEventListener('click', (e) => {
        e.preventDefault()
        Swal.fire(
            'Listo!',
            'Gracias por tu compra!',
            'success'
        )

        localStorage.clear();

        setTimeout(() => {
            window.location.href = "/"
        }, 1500)
    })
}

function calcularPrecioTotal() {
    let totalPagar = 0
    for (cafes of carrito) {
        totalPagar += parseInt(cafes.precio.slice(1)) * cafes.cantidad
    }
    return totalPagar
}

function mostrarPedidosCafe() {
    pedidosCafe.innerHTML = ""
    const totalPedido = calcularPrecioTotal()
    const resumenPedido = `
          <div>
              <h3>Resumen del pedido</h3>
              <div>Total a pagar: $${totalPedido}</div>
          </div>
      `
    pedidosCafe.innerHTML += resumenPedido
}