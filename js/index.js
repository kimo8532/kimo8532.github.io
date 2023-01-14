auth.onAuthStateChanged((user) => {
  if (user) {
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
 console.log(rdb);
 if(rdb == 4 || rdb == 1)
 {
    rdb = 1;
    $("#carHold").append(`<div class='row'></div> <br>`);
 }
 var regTime = new Date(oCar.IstekRegistracije);
 var currTime = new Date()
 var status;
 var message;
 console.log(monthDiff(regTime, currTime))
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
 $("#carHold .row:last").append(`<div class="col-4"><div id="car-card" class="card">
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
        let SaveModal = document.getElementById("RentajModal");
        var regTime = new Date(snapshot.IstekRegistracije);
        var currTime = new Date()
        if(monthDiff(currTime, regTime) <= 0)
        {
          SaveModal.innerText = "Auto trenutno nije registriran"
          SaveModal.classList.add("disabled");
        }
        else
        {
          SaveModal.setAttribute("onclick",`PripremaRentaj('${sCarKey}')`);
        }
        ModalLabel = `${oAutomobil.Marka.split(".").join(" ")} ${oAutomobil.Model}`;
        validationServer06Modal.innerText = oAutomobil.GodinaModela;
        validationServer07Modal.innerText = oAutomobil.GodinaProizvodnja;
        validationServer08Modal.innerText = oAutomobil.SnagaMotora;
        MotorModal.innerText = oAutomobil.TipMotora;
        MjenjacModal.innerText = oAutomobil.TipMjenjaca;
        var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oAutomobil.Marka.split(" ").join(".")}${oAutomobil.Model}`);
        uploadTask.getDownloadURL().then((url) => {
            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = (event) => {
            var blob = xhr.response;
            };
            xhr.open('GET', url);
            xhr.send();
            $(`#carPicture`).attr("src", `${url}`);
            $("body").append(`<script src="${url}"></script>`);
        })
        document.getElementById("datumRentanja").value = "";
        document.getElementById("datumPrestankaRentanja").value = "";
      }
    else 
    {
      console.log("No data available");
    }
    }).catch((error) => {
    console.error(error);
  });;
}
function PripremaRentaj(sCarKey)
{
  let rentButton = document.getElementById("rentButton");
  rentButton.setAttribute("onclick", `Rentaj('${sCarKey}')`);
  baza.ref("rented/"+ sCarKey).on('value', function(oOdgovorPosluzitelja)
  {
    oOdgovorPosluzitelja.forEach(function(snapshot)
    {
        let disabledStart = new Date(snapshot.val().datumRentanja);
        let disabledEnd = new Date(snapshot.val().datumPrestankaRentanja);
        let rangeStartValue = document.getElementById("datumRentanja");
        let rangeEndValue = document.getElementById("datumPrestankaRentanja");
        rangeStartValue.addEventListener("input", function(){
        let selectedDate = new Date(rangeStartValue.value);
        if(selectedDate >= disabledStart && selectedDate <= disabledEnd)
          {
            rangeStartValue.value="";
            rangeStartValue.classList.add("disabled");
            alert(`Auto je rentan ${disabledStart.getUTCDay()+1}/${disabledStart.getUTCMonth()+1}/${disabledStart.getUTCFullYear()}
             - ${disabledEnd.getUTCDay()+1}/${disabledEnd.getUTCMonth()+1}/${disabledEnd.getUTCFullYear()}`)
          } 
          else {
            rangeStartValue.classList.remove("disabled");
          }
        });
          
      rangeEndValue.addEventListener("input", function(){
        let selectedDate = new Date(rangeEndValue.value);
        if(selectedDate >= disabledStart && selectedDate <= disabledEnd) 
          {
            rangeEndValue.value="";
            rangeEndValue.classList.add("disabled");
            alert(`Auto je rentan ${disabledStart.getUTCDay()+1}/${disabledStart.getUTCMonth()+1}/${disabledStart.getUTCFullYear()}
             - ${disabledEnd.getUTCDay()+1}/${disabledEnd.getUTCMonth()+1}/${disabledEnd.getUTCFullYear()}`)
          } 
        else 
        {
          rangeEndValue.classList.remove("disabled");
        }
        }
        );
    })
  })
};

function Rentaj(sCarKey)
{
  if(document.getElementById("datumRentanja").value != "" && document.getElementById("datumPrestankaRentanja").value != "")
  {
  let noviRent = baza.ref().child("rented").child(sCarKey).push().key;
  let rentano = baza.ref("rented/" + sCarKey +"/");
  var oRentaniAuto = {
    'datumRentanja' : document.getElementById("datumRentanja").value,
    'datumPrestankaRentanja' : document.getElementById("datumPrestankaRentanja").value
  }
var oZapis = {};
oZapis[noviRent] = oRentaniAuto;
rentano.update(oZapis);
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
    if (event.target.value == 'default')
    {
        $("#Model").append("<option value='default' selected>---Odaberite model!---</option>");
    }
    oDbcarFill.on('value', function (oOdgovorPosluzitelja)
    {
        oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
    {
        var carFill = oCarFillSnapshot.val();
        brand = carFill.brand.split(" ").join("");
        console.log(event.target.value + " "+ brand)
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
  console.log(oOdgovorPosluzitelja)
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

  if (sMake && sMake !== 'default' && oCar.Marka !== sMake) {
    return;
  }
  if (sModel && sModel !== 'default' && oCar.Model !== sModel) {
    return;
  }
  if (sMjenjac && sMjenjac !== 'default' && oCar.Marka !== sMjenjac) {
    return;
  }
  if (sMotor && sMotor !== 'default' && oCar.Model !== sMotor ) {
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
 console.log(rdb);
 if(rdb == 4 || rdb == 1)
 {
    rdb = 1;
    $("#carHold").append(`<div class='row'></div> <br>`);
    
 }
 rdb += 1;
 $("#carHold .row:last").append(`<div class="col-4"><div class="card"">
 <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
 <div class="card-body">
   <h5 class="card-title">${oCar.Marka} ${oCar.Model}</h5>
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
   <th class="thead-dark">Snaga Motora:</th>
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
   <a href="#" class="btn btn-primary" onclick="RentCheck(${sCarKey})">Rentaj!</a>
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
})})});