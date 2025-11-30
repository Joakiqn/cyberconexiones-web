const REFRESH_INTERVAL_MS = 3600000; 
const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'; 

async function fetchBcvRate() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 🚨 CAMBIO CLAVE: Extraemos el campo 'promedio' de la respuesta para el Dólar Oficial
        const currentRate = parseFloat(data.promedio); 

        if (isNaN(currentRate)) {
            throw new Error('El valor de la tasa devuelto por la API no es un número válido.');
        }
        
        console.log('Tasa BCV obtenida:', currentRate);
        return currentRate;
        
    } catch (error) {
        console.error('Error al obtener la tasa BCV:', error);
        // Tasa de respaldo fija si la API falla o no está disponible
        return 36.50; 
    }
}

/**
 * Actualiza la tasa en el header y recalcula los precios de los productos.
 * @param {number} rate - Tasa de cambio actual (VES/USD).
 */

 
function updatePrices(rate) {
    document.querySelectorAll('[data-usd-price]').forEach(el => {
        const usdPrice = parseFloat(el.getAttribute('data-usd-price'));
        if (!isNaN(usdPrice)) {
            const vesPrice = usdPrice * rate;
            
            // CAMBIO AQUÍ: Usamos Math.round para redondear al entero y toFixed(0)
            const vesPriceRounded = Math.round(vesPrice); // Redondea (ej: 36.50 a 37, 36.49 a 36)
            
            el.innerHTML = `
                <span class="price-bs">Bs <b>${vesPriceRounded.toFixed(0).replace('.', ',')}</b></span> 
                <span class="price-usd">(${usdPrice.toFixed(2)} USD)</span>
            `;
        }
    });

    const textPrices = document.querySelectorAll('.info-price');
    textPrices.forEach(el => {
        const usd = parseFloat(el.getAttribute('data-usd'));
        if (!isNaN(usd)) {
            const ves = usd * rate;
            
            // CAMBIO AQUÍ: Redondeamos 'ves' al entero más cercano
            const vesRounded = Math.round(ves);
            
            // Formato: $0.05 (1.85 Bs) -> Queda limpio dentro del párrafo
            // Usamos vesRounded.toFixed(0) para asegurar que no haya decimales
            el.innerHTML = `$${usd.toFixed(2)} (<span style="color:var(--main-color)">${vesRounded.toFixed(0).replace('.', ',')} Bs</span>)`;
        }
    });

    const rateDisplay = document.getElementById('rate-value');
        if (rateDisplay) {
            if (rate) {
                rateDisplay.innerText = rate.toFixed(2).replace('.', ','); 
            } else {
                rateDisplay.innerText = 'Error de conexión';
            }
        }
}


  
/**
 * Función principal para iniciar la actualización periódica.
 */
async function startPriceUpdater() {
    // Primera actualización al cargar
    const currentRate = await fetchBcvRate();
    updatePrices(currentRate);

    // Actualizar periódicamente
    setInterval(async () => {
        const newRate = await fetchBcvRate();
        updatePrices(newRate);
    }, REFRESH_INTERVAL_MS);
}

// Iniciar el actualizador de precios al cargar la página
startPriceUpdater();

      // -- SECTION FONDO ---

      const images = document.querySelectorAll('.slider-image'); 
let currentImageIndex = 0;

function changeBackground() {
  images[currentImageIndex].classList.remove('active');
  currentImageIndex = (currentImageIndex + 1) % images.length;
  images[currentImageIndex].classList.add('active');
}

setInterval(changeBackground, 5000);
      // ---

      const observador = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add('mostrar')
          }
        })
      })

      const elementosOcultos =document.querySelectorAll('.oculto');
      elementosOcultos.forEach((el) => observador.observe(el))