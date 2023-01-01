firebase.auth().onAuthStateChanged((user) => {
  if (user) {

  } else {
    window.open('../login.html', '_self');
  }
});

function signOut() {
  firebase.auth().signOut().then(() => {
  }).catch((error) => {
  });
}

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
});
});

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
  let Marka = document.getElementById("Make").value;
  let Model = document.getElementById("Model").value;
  let startYear = document.getElementById("start-year").value;
  let endYear = document.getElementById("end-year").value;
  let tipMjenjaca = document.getElementById("Mjenjac").value;
  let Snaga = document.getElementById("kW").value;
  let Motor = document.getElementById("Motor").value
 var sCarKey = oCarSnapshot.key;
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