// Or with jQuery
$(document).ready(function () {
  $('.sidenav').sidenav();
  $('.collapsible').collapsible();
});

//Funcionalidad select
document.addEventListener('DOMContentLoaded', () => {
  var elems = document.querySelectorAll('select');
  var instances = M.FormSelect.init(elems);
});

//Funcionalidad modal
document.addEventListener('DOMContentLoaded', () => {
  var elems = document.querySelectorAll('.modal');
  var instances = M.Modal.init(elems);
});

const ad = {
  product: '', //marca
  priceProduct: 0,
  show: '', //name
  showPrice: 0, //fee
  day: '',
  interval: '',
  recargo: 0 // 
}

const schedule = document.getElementById('schedule');
const brands = document.getElementById('brands');

//Creando elementos del DOM para mostrar las marcas
getBrands().then(brand => {
  const arr = brand;
  //console.log(arr);
  arr.forEach((e, i) => {
    const optionBrand = document.createElement('option');
    optionBrand.textContent = arr[i].product;
    optionBrand.value = arr[i].product;
    optionBrand.id = e.charge;
    brands.appendChild(optionBrand);
  });
});

brands.addEventListener('change', (event) => {
  console.log(event.target.value);
  const brand = event.target.value;
  ad.product = brand;
 ad.priceProduct = event.target.options[event.target.selectedIndex].id
});


schedule.addEventListener('click', (event) => {
  if (event.target.nodeName === 'I') {
    getShowInfo(event.target.dataset.name)
      .then(({ fee, name, schedule }) => {
        const { day, intervals } = schedule.find(({ day }) => day === event.target.dataset.date)

        ad.show = name;
        ad.showPrice = fee
        ad.day = day

        //Creando modal
        document.getElementById('modal1').innerHTML =
          `
<div class="top-nav-modal">
  <span class="center-align modal-content">Datos de reserva</span>
</div>

<div class="modal-content">

  <p>Marca: <span> ${ad.product} </span></p>
  <p>Programa: ${ad.show}</p>
   <p>Día: ${ad.day}</p>
   <div class='input-field'>
   <p>Precio del Producto: ${ad.priceProduct}</p>

   <select id="select" onChange="selectInterval()" class="browser-default">
   ${ intervals.map(({ interval, status }) => `<option ${status === 'available' ? '' : 'disabled'}>${interval}</option>`).join('')}
   </select>

   <p> Precio del Programa: ${ad.showPrice}</p>
   <p>Recargo: ${ad.recargo}</p>
   <p>Total: ${parseInt(ad.showPrice)  + parseInt(ad.priceProduct)  + parseInt( ad.recargo)}</p>
   </div>
</div>
<div class="modal-footer">
   <button class="btn waves-effect waves-light" type="submit" name="action">Agregar reserva
       <i class="material-icons right">send</i>
   </button>
</div>`
      })
  }
});

const selectInterval = () => {
  const interval = document.getElementById('select').value;
 
  ad.interval =  interval;
  console.log(parseFloat (interval))

  switch (true) {
    case ( parseFloat (interval) >= 8 && parseFloat (interval) < 12):
      ad.recargo = 0;
      console.log(ad.recargo)
      break;
    case (parseFloat (interval) >= 12 && parseFloat (interval) < 16):
      ad.recargo = 0.05 * (parseInt(ad.priceProduct) + parseInt(ad.showPrice) );
      console.log(ad.recargo)
      break;
    default:
      ad.recargo = 0.15 * (parseInt(ad.priceProduct) + parseInt(ad.showPrice) );
      console.log(ad.recargo)
      break;
  }
};


