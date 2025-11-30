const REFRESH_INTERVAL_MS = 3600000; 
const API_URL = 'https://ve.dolarapi.com/v1/dolares/oficial'; 

async function fetchBcvRate() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API: ${response.status}`);
        }
        
        const data = await response.json();
        const currentRate = parseFloat(data.promedio); 

        if (isNaN(currentRate)) {
            throw new Error('El valor de la tasa devuelto por la API no es un número válido.');
        }
        
        console.log('Tasa BCV obtenida:', currentRate);
        return currentRate;
        
    } catch (error) {
        console.error('Error al obtener la tasa BCV:', error);
        return 36.50; 
    }
}

function updatePrices(rate) {
    document.querySelectorAll('[data-usd-price]').forEach(el => {
        const usdPrice = parseFloat(el.getAttribute('data-usd-price'));
        if (!isNaN(usdPrice)) {
            const vesPrice = usdPrice * rate;
            const vesPriceRounded = Math.round(vesPrice);
            
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
            const vesRounded = Math.round(ves);
            
            el.innerHTML = `$${usd.toFixed(2)} (<span style="color:var(--main-color)">${vesRounded.toFixed(0).replace('.', ',')} Bs</span>)`;
        }
    });

    const rateDisplay = document.getElementById('rate-value');
        if (rateDisplay) {
            if (rate) {
                rateDisplay.innerText = rate.toFixed(2).replace('.', ','); 
            } else {
                rateDisplay.innerText = 'Error';
            }
        }
}

async function startPriceUpdater() {
    const currentRate = await fetchBcvRate();
    updatePrices(currentRate);

    setInterval(async () => {
        const newRate = await fetchBcvRate();
        updatePrices(newRate);
    }, REFRESH_INTERVAL_MS);
}

startPriceUpdater();

// -- SLIDER -- //
const images = document.querySelectorAll('.slider-image'); 
let currentImageIndex = 0;

function changeBackground() {
  if (images.length > 0) {
      images[currentImageIndex].classList.remove('active');
      currentImageIndex = (currentImageIndex + 1) % images.length;
      images[currentImageIndex].classList.add('active');
  }
}

setInterval(changeBackground, 5000);

// -- ANIMACIÓN SCROLL -- //
const observador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (entrada.isIntersecting) {
      entrada.target.classList.add('mostrar');
      observador.unobserve(entrada.target);
    }
  })
});

const elementosOcultos = document.querySelectorAll('.oculto');
elementosOcultos.forEach((el) => observador.observe(el));