auth.onAuthStateChanged((user) => {
  if (user) {
    baza.ref("users").on('value', function(oOdgovorPosluzitelja)
      {
          oOdgovorPosluzitelja.forEach(function (oUserSnapshot)
          {
              var User = oUserSnapshot.val();
              if(User.email == user.email)
              {
                let profilePictureHolder = document.getElementById("profile-picture");
                let podaciKorisnik = document.getElementById("podaciKorisnik");
                podaciKorisnik.innerHTML=`Dobrodosli ${User.firstName} ${User.lastName}`;
                profilePictureHolder.setAttribute("src", User.profilePicture);
                let rentHistory = document.getElementById("rentHistory")
                baza.ref("rented").on('value', function(oOdgovorPosluzitelja)
                {
                  let counter = 1;
                  oOdgovorPosluzitelja.forEach(function (oRentSnapshot)
                  {
                      Object.values(oRentSnapshot.val()).forEach(function(val){
                      if(val.email == user.email)
                      {
                        //console.log("doso tu")
                        rentHistory.innerHTML += `<tr><th scope="row" class="white-text">${counter}</th><td class="white-text">${val.datumRentanja}
                        </td><td class="white-text">${val.datumPrestankaRentanja}
                        </td><td class="white-text">${val.rentaniAutoIme}
                        </td><td class="white-text"><button type="button" id="racun${counter}"class="btn btn-success"">Preuzmi racun</button>
                        </td></tr>`
                        if(val.brojRacuna == undefined)
                        {
                          document.getElementById(`racun${counter}`).setAttribute("disabled",'')
                        }
                        else
                        {
                          document.getElementById(`racun${counter}`).setAttribute("onclick",`fillInvoiceDetail('${val.brojRacuna}')`);
                        }
                        counter++;
                        
                      }
                    })
                  })
                })
              }
          })
      })
      baza.ref("administrator").on('value', function(oOdgovorPosluzitelja)
      {
          var isAdmin = false;
          oOdgovorPosluzitelja.forEach(function (oAdministratorSnapshot)
          {
              var administrator = oAdministratorSnapshot.val();
              if(administrator.email == user.email)
              {
                  isAdmin = true;
                  return;
              }
          })
          if (isAdmin) {
              $("#dashboardPlaceholder").append(`<button class="btn btn-orange" onclick="RedirectAdminDashboard()">Enter admin dashboard</button>`)
            }
      })
  } 
  else {
    window.open('../login.html', '_self');
  }
});
function RedirectAdminDashboard(){
  window.open('../dashboard.html', '_self')
}
function signOut() {
  firebase.auth().signOut().then(() => {
  }).catch((error) => {
  });
}
function monthDiff(d1, d2) {
  var months;
  //console.log(d1.getFullYear())
  //console.log(d2.getFullYear())
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth();
  months += d2.getMonth();
  return months == 0 ? 0 : months;
}

/*oDballCarsInStock.on('value', function (oOdgovorPosluzitelja)
{
    $("#carHold").empty();
    var rdb = 1;
oOdgovorPosluzitelja.forEach(function (oCarSnapshot)
 {
  var oCar = oCarSnapshot.val();
  var sCarKey = oCarSnapshot.key;
 if(rdb == 4 || rdb == 1)
 {
    rdb = 1;
    $("#carHold").append(`<div class='row'></div> <br>`);
    
 }
 /*var regTime = new Date(oCar.IstekRegistracije);
 var currTime = new Date()
 let isRentable = "";
 if(monthDiff(currTime, regTime) < 0)
 {
    isRentable = "disabled";
 }
 rdb += 1;
 $("#carHold .row:last").append(`<div class="col-4"><div class="card"">
 <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
 <div class="card-body">
   <h5 class="card-title">${oCar.Marka.split(".").join(" ")} ${oCar.Model}</h5>
   <table class="table">
   <tr>
   <th class="thead-dark">Godina proizvodnje:</th>
   <td>${oCar.GodinaProizvodnja}</td>
   </tr>
   <tr>
   <th class="thead-dark">Godina modela:</th>
   <td>${oCar.GodinaModela}</td>
   </tr>
   <tr>
   <th class="thead-dark">Snaga Motora (u kW):</th>
   <td>${oCar.SnagaMotora}</td>
   </tr>
   <tr>
   <th class="thead-dark">Tip Motora:</th>
   <td style="text:break-spaces; !important">${oCar.TipMotora}</td>
   </tr>
   <tr>
   <th class="thead-dark">Tip Mjenjaca:</th>
   <td>${oCar.TipMjenjaca}</td>
   </tr>
   </table>
   <a type="button" href="#" class="btn btn-primary" data-toggle="modal" data-target="areyousureModal" onclick="fillDetails(${sCarKey})">Provjeri detalje!</a>
 </div>
</div>
</div>`)
var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oCar.Marka}${oCar.Model}`);

uploadTask.getDownloadURL().then((url) => {
  var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;
    };
    xhr.open('GET', url);
    xhr.send();
  $(`#${sCarKey}`).attr("src", `${url}`)    
  $("body").append(`<script src="${url}"></script>`)
})
});
});
*/
oDballCarsInStock.on('value', function (oOdgovorPosluzitelja)
{
    $("#carHold").empty();
    var rdb = 1;
oOdgovorPosluzitelja.forEach(function (oCarSnapshot)
 {
 var sCarKey = oCarSnapshot.key;
 var oCar = oCarSnapshot.val();
 //console.log(rdb);
 if(rdb == 4 || rdb == 1)
 {
    rdb = 1;
    $("#carHold").append(`<div class='row'></div> <br>`);
 }
 var regTime = new Date(oCar.IstekRegistracije);
 var currTime = new Date()
 var status;
 var message;
 //console.log(monthDiff(regTime, currTime))
 if(monthDiff(currTime, regTime) > 0)
 {
    message="Automobil je dostupan!"
    status = "success";
 }
else
{
    message="Registracija je istekla!"
    status = "danger";
}
 rdb += 1;
 $("#carHold .row:last").append(`<div class="col-lg-4 "><div id="car-card" class="card">
 <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
 <div class="card-body">
   <h5 class="card-title text-center">${oCar.Marka.split(".").join(" ")} ${oCar.Model}</h5>
   <div class="text-center">
   <div class="alert alert-${status}" role="alert">
    ${message}
    </div>
   <a href="#" class="btn btn-orange mr-3" data-toggle="modal" data-target="#mainModal" onclick="fillDetails('${sCarKey}')">Provjeri detalje!</a>
   </div>
 </div>
</div>
</div>`)
var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oCar.Marka.split(" ").join(".")}${oCar.Model}`);

uploadTask.getDownloadURL().then((url) => {
  $(`#${sCarKey}`).attr("src", `${url}`);
})
});
});
function fillDetails(sCarKey)
{
  baza.ref('allCarsInStock/' + sCarKey).get().then((snapshot) => {
    if (snapshot.exists()) {
        let oAutomobil = snapshot.val();
        let ModalLabel = document.getElementById("ModalLabel");
        let validationServer06Modal = document.getElementById("validationServer06Modal");
        let validationServer07Modal = document.getElementById("validationServer07Modal");
        let validationServer08Modal = document.getElementById("validationServer08Modal");
        let MotorModal = document.getElementById("MotorModal");
        let MjenjacModal = document.getElementById("MjenjacModal");
        let CijenaModal = document.getElementById("CijenaModal")
        let SaveModal = document.getElementById("RentajModal");
        var regTime = new Date(oAutomobil.IstekRegistracije);
        var currTime = new Date()
        if(monthDiff(currTime, regTime) <= 0)
        {
          SaveModal.innerText = "Auto trenutno nije registriran"
          SaveModal.setAttribute("disabled",'');
        }
        else
        {
          SaveModal.setAttribute("onclick",`PripremaRentaj('${sCarKey}')`);
        }
        ModalLabel.innerHTML = `${oAutomobil.Marka.split(".").join(" ")} ${oAutomobil.Model}`;
        validationServer06Modal.innerText = oAutomobil.GodinaModela;
        validationServer07Modal.innerText = oAutomobil.GodinaProizvodnja;
        validationServer08Modal.innerText = oAutomobil.SnagaMotora;
        MotorModal.innerText = oAutomobil.TipMotora;
        MjenjacModal.innerText = oAutomobil.TipMjenjaca;  
        CijenaModal.innerText = `${parseInt(oAutomobil.Cijena)} €`;
        var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oAutomobil.Marka.split(" ").join(".")}${oAutomobil.Model}`);
        uploadTask.getDownloadURL().then((url) => {
            $(`#carPicture`).attr("src", `${url}`);
        })
        document.getElementById("datumRentanja").value = "";
        document.getElementById("datumPrestankaRentanja").value = "";
      }
    else 
    {
      //console.log("No data available");
    }
    }).catch((error) => {
    console.error(error);
  });;
}
function PripremaRentaj(sCarKey)
{
  let rentButton = document.getElementById("rentButton");
  rentButton.setAttribute("onclick", `Rentaj('${sCarKey}')`);
  let rangeStartValue = document.getElementById("datumRentanja");
  let rangeEndValue = document.getElementById("datumPrestankaRentanja");
  var errorMessage = document.getElementById("error-message");
  errorMessage.innerHTML = "";
  let curr = new Date()
  let currDate = new Date(curr.getUTCFullYear(), curr.getUTCMonth()+1, curr.getUTCDay()+1);
  //console.log(currDate)
  let selectedDate = new Date(rangeStartValue.value);
  rangeStartValue.addEventListener("input", function()
  {
      if(selectedDate <= currDate)
      {
        rangeStartValue.value="";
        errorMessage.innerHTML ="Ne mozes rentati u proslosti"
      }
  })
  selectedDate = new Date(rangeEndValue.value);
  rangeEndValue.addEventListener("input", function()
  {
      if(selectedDate <= currDate)
      {
        rangeEndValue.value="";
        errorMessage.innerHTML ="Ne mozes rentati u proslosti"
      }
  })
  baza.ref("rented/"+ sCarKey).on('value', function(oOdgovorPosluzitelja)
  {
    oOdgovorPosluzitelja.forEach(function(snapshot)
    {
        let disabledStart = new Date(snapshot.val().datumRentanja);
        let disabledEnd = new Date(snapshot.val().datumPrestankaRentanja);

        rangeStartValue.addEventListener("input", function(){
        selectedDate = new Date(rangeStartValue.value);
        if(selectedDate >= disabledStart && selectedDate <= disabledEnd)
          {
            rangeStartValue.value="";
            errorMessage.innerHTML =`Auto je rentan ${disabledStart.getUTCDay()+1}/${disabledStart.getUTCMonth()+1}/${disabledStart.getUTCFullYear()}
             - ${disabledEnd.getUTCDay()+1}/${disabledEnd.getUTCMonth()+1}/${disabledEnd.getUTCFullYear()}`;
          } 
        });
          
      rangeEndValue.addEventListener("input", function(){
        selectedDate = new Date(rangeEndValue.value);
        if(selectedDate >= disabledStart && selectedDate <= disabledEnd) 
          {
            rangeEndValue.value="";

            errorMessage.innerHTML = `Auto je rentan ${disabledStart.getUTCDay()+1}/${disabledStart.getUTCMonth()+1}/${disabledStart.getUTCFullYear()}
             - ${disabledEnd.getUTCDay()+1}/${disabledEnd.getUTCMonth()+1}/${disabledEnd.getUTCFullYear()}`;
          } 
        }
        );
    })
  })
};
// Landscape export, 2×4 inches
/*const doc = new jsPDF({
  orientation: "landscape",
  unit: "in",
  format: [4, 2]
});

doc.text("Hello world!", 1, 1);
doc.save("two-by-four.pdf");
*/
function Rentaj(sCarKey)
{
  if(document.getElementById("datumRentanja").value != "" && document.getElementById("datumPrestankaRentanja").value != "")
  {
  let noviRent = baza.ref().child("rented").child(sCarKey).push().key;
  let rentano = baza.ref("rented/" + sCarKey +"/");
  var errorMessage = document.getElementById("error-message");
  auth.onAuthStateChanged((user) => {
    if (user) {
      var oRentaniAuto = {
        'datumRentanja' : document.getElementById("datumRentanja").value,
        'datumPrestankaRentanja' : document.getElementById("datumPrestankaRentanja").value,
        'email' : user.email,
        'rentaniAuto' : sCarKey,
        'prihvaceno' : false,
        'rentaniAutoIme' : document.getElementById("ModalLabel").innerText
      }
    var oZapis = {};
    oZapis[noviRent] = oRentaniAuto;
    rentano.update(oZapis);
    errorMessage.innerHTML = "Uspjesno ste rentali automobil!"
    }
  });
  

}
}

function IsRented(sCarKey)
{
var ref = baza.ref("rented/" + sCarKey);

if(ref.once("value", function(snapshot) {
  if(snapshot.foreach(function()
  {
    let currTime = new Date().toISOString()
    if (snapshot.datumRentanja < currTime && snapshot.datumPrestankaRentanja > currTime) 
    {
      return true;
    } 
  else 
    {
      return false;
    }
  })
  ){return true;}
    
}))
{
  return true;
}
}

oDbcarFill.on('value', function (oOdgovorPosluzitelja)
{
oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
 {
 var carFill = oCarFillSnapshot.val();
 brand = carFill.brand.split(" ").join("");
 $("#Make").append(`<option value="${brand}">${carFill.brand}</option>`);
 });
});

document.addEventListener('input', function (event) {

	if (event.target.id !== 'Make') return;
    $("#Model").empty();
    $("#Model").append("<option value='default' selected>---Odaberite model!---</option>");
    oDbcarFill.on('value', function (oOdgovorPosluzitelja)
    {
        oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
    {
        var carFill = oCarFillSnapshot.val();
        brand = carFill.brand.split(" ").join("");
        //console.log(event.target.value + " "+ brand)
        if(brand == event.target.value)
        {
            for(let i = 0; i < Object.keys(carFill.models).length; i++)
            {
                model = carFill.models[i].split(" ").join("");
                $("#Model").append("<option value="+model+">"+carFill.models[i]+"</option>");
            }
        }
    });
  })
});
const filterForm = document.getElementById("Filter");
const CarHold = document.getElementById("CarHold");

filterForm.addEventListener("click", function(e)
{ 
    oDballCarsInStock.on('value', function (oOdgovorPosluzitelja)
{
    $("#carHold").empty();
    var rdb = 1;
  
oOdgovorPosluzitelja.forEach(function (oCarSnapshot)
 {
  var oCar = oCarSnapshot.val();
 var sCarKey = oCarSnapshot.key;
 let StartYear = document.getElementById("start-year").value;
 let EndYear = document.getElementById("end-year").value;
 let MinStrength = document.getElementById("kW").value;
 let sMake = document.getElementById("Make").value;
 let sModel = document.getElementById("Model").value;
 let sMjenjac = document.getElementById("Mjenjac").value;
 let sMotor = document.getElementById("Motor").value;
 //console.log(oCar.Marka)
 //console.log(sMake);
  if (sMake && sMake !== 'default' && oCar.Marka.split(".").join("") !== sMake) {
    return;
  }
  if (sModel && sModel !== 'default' && oCar.Model.split(".").join("") !== sModel) {
    return;
  }
  if (sMjenjac && sMjenjac !== 'default' && oCar.TipMjenjaca !== sMjenjac) {
    return;
  }
  if (sMotor && sMotor !== 'default' && oCar.TipMotora !== sMotor ) {
    return;
  }
  if (StartYear && oCar.GodinaProizvodnja < StartYear) {
    return;
  }
  if (EndYear && oCar.GodinaProizvodnja > EndYear) {
    return;
  }
  if (MinStrength && oCar.SnagaMotora < MinStrength) {
    return;
  }
 //console.log(rdb);
 if(rdb == 4 || rdb == 1)
 {
    rdb = 1;
    $("#carHold").append(`<div class='row'></div> <br>`);
    
 }
 var regTime = new Date(oCar.IstekRegistracije);
 var currTime = new Date()
 var status;
 var message;
 //console.log(monthDiff(regTime, currTime))
 if(monthDiff(currTime, regTime) > 0)
 {
    message="Automobil je dostupan!"
    status = "success";
 }
else
{
    message="Registracija je istekla!"
    status = "danger";
}
 rdb += 1;
 $("#carHold .row:last").append(`<div class="col-lg-4 "><div id="car-card" class="card">
 <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
 <div class="card-body">
   <h5 class="card-title text-center">${oCar.Marka.split(".").join(" ")} ${oCar.Model}</h5>
   <div class="text-center">
   <div class="alert alert-${status}" role="alert">
    ${message}
    </div>
   <a href="#" class="btn btn-orange mr-3" data-toggle="modal" data-target="#mainModal" onclick="fillDetails('${sCarKey}')">Provjeri detalje!</a>
   </div>
 </div>
</div>
</div>`)
var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oCar.Marka}${oCar.Model}`);

uploadTask.getDownloadURL().then((url) => {
  $(`#${sCarKey}`).attr("src", `${url}`)    
})
})})});

function generatePDF() {
  const element = document.getElementById('invoice');
  var opt = {
      margin:       1,
      filename:     'html2pdf_example.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    // Choose the element that our invoice is rendered in.
    html2pdf().set(opt).from(element).save();
  }
/*<div class="modal fade" id="invoice">
        <div>
          <h3 class="text-center">VOZNI PARK RACUN</h3>
          <hr>
          <p>Datum placanja: <span id="date-insert"></span></p>
          <p>Vrijeme: <span id="time-insert"></span></p>
          <p>Identifikator racuna: <span id="id-insert"></span></p>
          <br>
          <p>Iznajmljivac: <span id="customer-insert"></span></p>
          <br>
          <p><strong>PODACI O AUTOMOBILU:</strong></p>
          <p>- Marka: <span id="marka-insert"></span></p>
          <p>- Model: <span id="model-insert"></span></p>
          <p>- Tablice: <span id="tablice-insert"></span></p>
          <br>
          <p>Period rentanja: <span id="startDate-insert"></span> do <span id="endDate-insert"></span></p>
          <br>
          <p><strong>UKUPAN IZNOS:</strong></p>
          <p>- Bazna cijena rentanja: <span id="baznaCijena-insert"></span></p>
          <p>- Insurance fee: <span id="osiguranje-insert"></span></p>
          <p>- Porez (nema ga): <span>0,00 €</span></p>
          <p>- Ukupno: <span id="ukupno-insert"></span></p>
          <br>
          <p><strong>NACIN PLACANJA:</strong></p>
          <p>- Nacin:: <span id="nacinPlacanja-insert"></span></p>
          <p>- <span id="karticaPlacanjeDetalji-insert"></span></p>
        </div>
      </div>*/
  function fillInvoiceDetail(sInvoiceKey)
  {
    document.getElementById("invoice").removeAttribute('hidden');
      baza.ref('invoice/'+ sInvoiceKey).get().then((snapshot) => {
        if(snapshot.exists())
        {
          let invoice = snapshot.val();
          let dateInsert = invoice.datumPlacanja;
          let timeInsert = invoice.vrijeme;
          let idInsert = invoice.idRacun;
          let customerInsert = invoice.fullName;
          let markaInsert = invoice.Marka;
          let modelInsert = invoice.Model;
          let tabliceInsert = invoice.tablice;
          let startDateInsert = invoice.startDate;
          let endDateInsert = invoice.endDate;
          let baznaCijenaInsert = invoice.basePrice;
          let osiguranjeInsert = invoice.Osiguranje;
          let ukupnoInsert = invoice.Ukupno;
          let nacinPlacanjaInsert = invoice.nacinPlacanja;
          let karticaPlacanjeDetaljiInsert = "************" + invoice.cardNumber.substring(11, 4);
    
          document.getElementById("date-insert").innerText = dateInsert;
          document.getElementById("time-insert").innerText = timeInsert;
          document.getElementById("id-insert").innerText = idInsert;
          document.getElementById("customer-insert").innerText = customerInsert;
          document.getElementById("marka-insert").innerText = markaInsert;
          document.getElementById("model-insert").innerText = modelInsert;
          document.getElementById("tablice-insert").innerText = tabliceInsert;
          document.getElementById("startDate-insert").innerText = startDateInsert;
          document.getElementById("endDate-insert").innerText = endDateInsert;
          document.getElementById("baznaCijena-insert").innerText = parseInt(baznaCijenaInsert);
          document.getElementById("osiguranje-insert").innerText = parseInt(osiguranjeInsert);
          document.getElementById("ukupno-insert").innerText = parseInt(ukupnoInsert);
          document.getElementById("nacinPlacanja-insert").innerText = nacinPlacanjaInsert;
          document.getElementById("karticaPlacanjeDetalji-insert").innerText = karticaPlacanjeDetaljiInsert;
        }
        
      }).then(function(e)
      {
          generatePDF()
          document.getElementById("invoice").setAttribute('hidden','');
      })
  }
let mybutton = document.getElementById("myBtn");
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    mybutton.style.display = "block";
  } else {
    mybutton.style.display = "none";
  }
}

function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}