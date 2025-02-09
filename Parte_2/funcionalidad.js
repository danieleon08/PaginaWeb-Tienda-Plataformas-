document.addEventListener("DOMContentLoaded", () => {
    const carrito = [];
    const carritoBody = document.getElementById("carrito-body");
    const tablaCarrito = document.querySelector(".tablaCarrito");
    const btnVaciar = document.getElementById("vaciar-carrito");
    const btnsAgregar = document.querySelectorAll(".btn-agregar");
    const carritoIcono = document.querySelector(".carrito");
    const productosContainer = document.getElementById("productos-container");
    const btnAgregarArticulo = document.getElementById("agregar-articulo");

    // Función para agregar un producto al carrito
    function agregarAlCarrito(event) {
        const boton = event.target;
        const nombre = boton.getAttribute("data-nombre");
        const precio = parseFloat(boton.getAttribute("data-precio"));
        const imagen = boton.getAttribute("data-imagen");

        // Buscar si el producto ya está en el carrito
        const productoExistente = carrito.find(item => item.nombre === nombre);

        if (productoExistente) {
            productoExistente.cantidad += 1;
        } else {
            carrito.push({
                nombre,
                precio,
                imagen,
                cantidad: 1
            });
        }

        actualizarCarrito();
    }

    // Función para actualizar la tabla del carrito
    function actualizarCarrito() {
        carritoBody.innerHTML = ""; // Limpia la tabla antes de actualizar
        let total = 0; // Variable para calcular el total

        carrito.forEach((producto, index) => {
            const fila = document.createElement("tr");

            fila.innerHTML = `
                <td><img src="${producto.imagen}" width="50"></td>
                <td>${producto.nombre}</td>
                <td>${producto.precio.toLocaleString()} COP</td>
                <td>${producto.cantidad}</td>
                <td><button class="btn-eliminar" data-index="${index}">❌</button></td>
            `;

            carritoBody.appendChild(fila);

            // Sumar al total (precio * cantidad)
            total += producto.precio * producto.cantidad;
        });
        

        // Actualizar el total en la tabla
        document.getElementById("total-precio").textContent = `${total.toLocaleString()} COP`;

        // Agregar eventos de eliminar producto
        document.querySelectorAll(".btn-eliminar").forEach(btn => {
            btn.addEventListener("click", eliminarDelCarrito);
        });

        // Mostrar la tabla solo si hay elementos en el carrito
        tablaCarrito.style.display = carrito.length > 0 ? "block" : "none";
    }


    // Función para eliminar un producto del carrito
    function eliminarDelCarrito(event) {
        const index = event.target.getAttribute("data-index");
        carrito.splice(index, 1);
        actualizarCarrito();
    }

    // Función para vaciar el carrito

    function vaciarCarrito() {
        carrito.length = 0; // Vacía la lista de productos
        actualizarCarrito(); // Actualiza la tabla
        document.getElementById("total-precio").textContent = "0 COP"; // Borra el total
    }


    // Función para agregar un nuevo artículo a la tienda
    function agregarNuevoArticulo() {
        const nombre = document.getElementById("txtNombre").value.trim();
        const calidad = document.getElementById("selectCalidad").value.trim();
        const duracion = document.getElementById("txtDuracion").value.trim();
        const pantallas = document.getElementById("txtNumero").value.trim();
        const precio = parseFloat(document.getElementById("txtPrecio").value);
        const imagenInput = document.getElementById("imagen");

        // Validaciones
        if (!nombre || !calidad || !duracion || !pantallas || isNaN(precio) || !imagenInput.files.length) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (precio < 1000) {
            alert("El precio debe ser mayor o igual a 1.000.");
            return;
        }

        // Obtener la URL de la imagen subida
        const imagenURL = URL.createObjectURL(imagenInput.files[0]);

        // Crear la tarjeta del nuevo producto
        const nuevaTarjeta = document.createElement("div");
        nuevaTarjeta.classList.add("flex-vertical", "nueva-tarjeta");

        nuevaTarjeta.innerHTML = `
            <img class="iconoTarjeta" src="${imagenURL}" alt="${nombre}">
            <p>${nombre}</p>
            <ul>
                <li>${calidad}</li>
                <li>${duracion} días</li>
                <li>${pantallas} pantallas</li>
            </ul>
            <p>${precio.toLocaleString()} COP</p>
            <button class="btn-agregar" data-nombre="${nombre}" data-precio="${precio}" data-imagen="${imagenURL}">Agregar al carrito</button>
        `;

        // Agregar la tarjeta al contenedor de productos
        productosContainer.appendChild(nuevaTarjeta);

        // Asignar evento al nuevo botón de "Agregar al carrito"
        nuevaTarjeta.querySelector(".btn-agregar").addEventListener("click", agregarAlCarrito);

        // Limpiar formulario
        document.getElementById("txtNombre").value = "";
        document.getElementById("selectCalidad").value = "";
        document.getElementById("txtDuracion").value = "";
        document.getElementById("txtNumero").value = "";
        document.getElementById("txtPrecio").value = "";
        imagenInput.value = "";
    }

    // Mostrar el carrito al pasar el mouse sobre el icono
    carritoIcono.addEventListener("mouseenter", () => {
        if (carrito.length > 0) {
            tablaCarrito.style.display = "block";
        }
    });

    carritoIcono.addEventListener("mouseleave", () => {
        setTimeout(() => {
            if (!tablaCarrito.matches(":hover")) {
                tablaCarrito.style.display = "none";
            }
        }, 200);
    });

    tablaCarrito.addEventListener("mouseenter", () => {
        tablaCarrito.style.display = "block";
    });

    tablaCarrito.addEventListener("mouseleave", () => {
        tablaCarrito.style.display = "none";
    });

    // Eventos
    btnsAgregar.forEach(btn => btn.addEventListener("click", agregarAlCarrito));
    btnVaciar.addEventListener("click", vaciarCarrito);
    btnAgregarArticulo.addEventListener("click", agregarNuevoArticulo);
});
