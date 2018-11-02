

const ad = {
  currentId: '',
  product: '', //marca
  priceProduct: 0,
  show: '', //name
  showPrice: 0, //fee
  day: '',
  intervals: [],
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
    optionBrand.id = arr[i].charge;
    console.log(arr[i].charge);
    optionBrand.value = arr[i].product;
    optionBrand.id = e.charge;
    brands.appendChild(optionBrand);
  });
});

const handleReservation = ({ intervals, currentId, ...reservation }) => saveReservation(reservation)
  .then(() => updateShowInfo(currentId, ad.day, ad.interval))
  .then(() => {
    ad.recargo = 0;
    ad.interval = '';
    M.toast({ html: '¡Se generó la reserva!' })
  })

const printModal = () => {
  document.getElementById('modal1').innerHTML =
    `
<div class="top-nav-modal">
  <span class="center-align modal-content">Datos de reserva</span>
</div>
<div class="modal-content">
  <p>Marca: ${ad.product}</p>
  <p>Precio por marca: ${ad.priceProduct}</p>
  <p>Programa: ${ad.show}</p>
  <p> Precio del Programa: ${ad.showPrice}</p>
   <p>Día: ${ad.day}</p>
   <div class="input-field">
   <select id="select" onChange="selectInterval()" class="browser-default">
   <option value="" selected disabled>Seleciona un horario</option>
   ${
    ad.intervals.map(({ interval, status }) => `
     <option 
     ${ status === 'available' ? '' : 'disabled'} 
     ${ ad.interval === interval ? 'selected' : ''}
     >
       ${interval}
     </option>`).join('')
    }
   </select>
   <p>Recargo: ${ad.recargo}</p>
   <p>Total: ${parseInt(ad.showPrice) + parseInt(ad.priceProduct) + parseInt(ad.recargo)}</p>
   </div>
</div>
<div onClick="handleReservation(ad)" class="modal-footer">
   ${ad.interval.length
      ? '<button id="btnSaveReservation" class="btn waves-effect waves-light modal-close" type="submit" name="action">Agregar reserva<i class="material-icons right">send</i></button>'
      : ''}
</div>`
}

brands.addEventListener('change', (event) => {
  Array.prototype.forEach.call(document.querySelectorAll('.btn-floating'), item => {
    item.classList.remove('display-none');
  })
  const brand = event.target.value;
  ad.product = brand;
  ad.priceProduct = event.target.options[event.target.selectedIndex].id;
});


schedule.addEventListener('click', (event) => {
  if (event.target.nodeName === 'I') {
    getShowInfo(event.target.dataset.name)
      .then(({ fee, name, schedule }) => {
        const { day, intervals } = schedule.find(({ day }) => day === event.target.dataset.date)

        ad.currentId = event.target.dataset.name;
        ad.show = name;
        ad.showPrice = fee
        ad.day = day
        ad.intervals = intervals
        printModal();
      })
  }
});

const selectInterval = () => {
  const interval = document.getElementById('select').value;

  ad.interval = interval;
  console.log(parseFloat(interval))

  switch (true) {
    case (parseFloat(interval) >= 8 && parseFloat(interval) < 12):
      ad.recargo = 0;
      console.log(ad.recargo)
      break;
    case (parseFloat(interval) >= 12 && parseFloat(interval) < 16):
      ad.recargo = 0.05 * (parseInt(ad.priceProduct) + parseInt(ad.showPrice));
      console.log(ad.recargo)
      break;
    default:
      ad.recargo = 0.15 * (parseInt(ad.priceProduct) + parseInt(ad.showPrice));
      console.log(ad.recargo)
      break;
  }
  printModal();
};

document.getElementById('logout').addEventListener('click', signOut);