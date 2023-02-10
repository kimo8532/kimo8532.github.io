
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
                profilePictureHolder.setAttribute("src", User.profilePicture);
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
            if (!isAdmin) {
                window.open('../login.html', '_self');
              }
        })
    } 
    else {
      window.open('../login.html', '_self');
    }
  });
  function signOut() {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
    });
  }
  
  function RedirectIndex(){
    window.open('../index.html', '_self')
  }
oDbcarFill.on('value', function (oOdgovorPosluzitelja)
{
oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
 {
 var carFill = oCarFillSnapshot.val();
 brand = carFill.brand.split(" ").join(".");
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
        brand = carFill.brand.split(" ").join(".");
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
    });
	////console.log(event.target.value);

})
let file;
let fileInput = document.getElementById('Slike');
fileInput.addEventListener('change', function(event) {
    // Get the selected file
    
    file = event.target.files[0];
});    
function submitAddCar()
{
    let Marka = $("#Make").val();
    let Model = $("#Model").val();
    let IstekRegistracije = $("#validationServer03").val();
    let TrenutnaKilometraza = $("#validationServer04").val();
    let Registracija = $("#validationServer05").val();
    let GodinaModela = $("#validationServer06").val();
    let GodinaProizvodnja = $("#validationServer07").val();
    let SnagaMotora = $("#validationServer08").val();
    let TipMotora = $("#Motor").val();
    let TipMjenjaca = $("#Mjenjac").val();
    let Cijena = $("#Cijena").val();

    let errorDiv = $("#error-div");
    let error = $("#error-div");
    
    if(Marka == "default")
    {
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!") 
        return null;
    }
    if(Model == "default")
    {
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!") 
        return null;
    }
    if(GodinaModela > Date('year') || GodinaProizvodnja > Date("year")){
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!") 
        return null;
    }
    if(TipMotora == "default")
    {
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!") 
        return null;
    }
    if(TipMjenjaca == "default")
    {
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!")
        return null;
    }
    if(!IstekRegistracije)
    {
        IstekRegistracije = "2000-01"
        Registracija = "xxxxxxxx"
    }
    if(!Cijena || !SnagaMotora || !GodinaProizvodnja || !GodinaModela || !TrenutnaKilometraza)
    {
        errorDiv.removeAttr("hidden");
        error.html("ISPUNITE ISPRAVNO!") 
        return null;
    }
    var sKey = baza.ref().child('allCarsInStock').push().key;
    const storageRef = storage.ref(`Cars/${sKey}/${$("#Make").val()}${$("#Model").val()}`);
    errorDiv.attr("hidden", "true");
    storageRef.put(file).then(function(snapshot) {
    //console.log('File uploaded successfully');
    });
    
            var oAuto = {
                'Marka' : Marka,
                'Model' : Model,
                'IstekRegistracije' : IstekRegistracije,
                'TrenutnaKilometraza' : TrenutnaKilometraza,
                'Registracija' : Registracija,
                'GodinaModela' : GodinaModela,
                'GodinaProizvodnja' : GodinaProizvodnja,
                'SnagaMotora' : SnagaMotora,
                'TipMotora' : TipMotora,
                'TipMjenjaca' : TipMjenjaca,
                'Cijena' : Cijena/558
            }
            var oZapis = {};
            oZapis[sKey] = oAuto;
            oDballCarsInStock.update(oZapis);
            Marka = "";
            Model = "";
            IstekRegistracije = "";
            TrenutnaKilometraza = "";
            Registracija = "";
            GodinaModela = "";
            GodinaProizvodnja = "";
            SnagaMotora = "";
            TipMotora = "";
            TipMjenjaca = "";
            Slike = "";
            Cijena = "";
    };
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
     if(monthDiff(currTime, regTime) > 3)
     {
        message="Automobil je dostupan!"
        status = "success";
     }
     else if(monthDiff(currTime, regTime) < 3 && monthDiff(currTime, regTime) > 0)
    {
        message="Automobilu uskoro istece registracija!"
        status ="warning";
    }
    else
    {
        message="Registracija je istekla!"
        status = "danger";
    }
     rdb += 1;
     $("#carHold .row:last").append(`<div class="col-lg-4"><div id="car-card" class="card">
     <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
     <div class="card-body">
       <h5 class="card-title text-center">${oCar.Marka.split(".").join(" ")} ${oCar.Model}</h5>
       <div class="text-center">
       <div class="alert alert-${status}" role="alert">
        ${message}
        </div>
       <a href="#" class="btn btn-orange mr-3" data-toggle="modal" data-target="#mainModal" onclick="fillUpdateDetails('${sCarKey}')">Azuriraj modal</a>
       <a href="#" class="btn btn-orange" data-toggle="modal" data-target="#areyousureModal" onclick="fillDeleteDetails('${sCarKey}')">Delete</a>
       </div>
     </div>
    </div>
    </div>`)
    var uploadTask = storage.ref().child(`Cars/${sCarKey}/${oCar.Marka.split(" ").join(".")}${oCar.Model}`);
    
    uploadTask.getDownloadURL().then((url) => {
      $(`#${sCarKey}`).attr("src", `${url}`)    
    })
    });
    });


    function hideContainer(id) {
        var allID = ["carHold", "Unos", "Administrator", "Rentano"];
        for (var i = 0; i < allID.length; i++) {
          if (id == allID[i]) {
            document.getElementById(id).removeAttribute('hidden');
          } else {
            document.getElementById(allID[i]).setAttribute('hidden', true);
          }
        }
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
function DodajAdministratora()
{
    var sKey = baza.ref().child('administrator').push().key;
    var email = document.getElementById("mailAdmin").value;
    var oAdministrator = {
        'email' : email,
    }
    var oZapis = {};
    oZapis[sKey] = oAdministrator;
    baza.ref("administrator").update(oZapis);
    email = "";
}
function DeleteCar(sCarKey){
    var oCarStorageRef = storage.ref('Cars/' + sCarKey);
    oCarStorageRef.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => this.deleteFile(oCarStorageRef.fullPath, fileRef.name));
      dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
    })
    var oCarDatabaseRef = oDballCarsInStock.ref('allCarsInStock/' + sCarKey);
    oCarDatabaseRef.remove();
}
function UpdateCar(sCarKey)
{
    var oAutoRef = baza.ref('allCarsInStock/' + sCarKey);
    let MakeModal = document.getElementById("MakeModal").value;
    let ModelModal = document.getElementById("ModelModal").value;
    let validationServer03Modal = document.getElementById("validationServer03Modal").value;
    let validationServer04Modal = document.getElementById("validationServer04Modal").value;
    let validationServer05Modal = document.getElementById("validationServer05Modal").value;
    let validationServer06Modal = document.getElementById("validationServer06Modal").value;
    let validationServer07Modal = document.getElementById("validationServer07Modal").value;
    let validationServer08Modal = document.getElementById("validationServer08Modal").value;
    let MotorModal = document.getElementById("MotorModal").value;
    let MjenjacModal = document.getElementById("MjenjacModal").value;
    var oAuto =
    {
        'Marka' : MakeModal,
        'Model' : ModelModal,
        'IstekRegistracije' : validationServer03Modal,
        'TrenutnaKilometraza' : validationServer04Modal,
        'Registracija' : validationServer05Modal,
        'GodinaModela' : validationServer06Modal,
        'GodinaProizvodnja' : validationServer07Modal,
        'SnagaMotora' : validationServer08Modal,
        'TipMotora' : MotorModal,
        'TipMjenjaca' : MjenjacModal
    };
    oAutoRef.update(oAuto);
}

function DeleteCar(sCarKey){
    var oAutomobil = baza.ref('allCarsInStock/' + sCarKey);
    oAutomobil.remove();
    var storageRef = storage.ref();
    var carRef = storageRef.child("Cars/"+ sCarKey);
    
            // Now we get the references of these files
            carRef.listAll().then(function (result) {
                result.items.forEach(function (file) {
                   file.delete();
                }
                )});
}
function fillDeleteDetails(sCarKey){
    var oAutomobil = baza.ref('allCarsInStock/' + sCarKey);
    var deleteButton = document.getElementById("deleteButton");
    deleteButton.setAttribute("onclick", `DeleteCar('${sCarKey}')`);
}

function fillUpdateDetails(sCarKey){
    oDbcarFill.on('value', function (oOdgovorPosluzitelja)
{
oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
 {
 var carFill = oCarFillSnapshot.val();
 brand = carFill.brand.split(" ").join(".");
 $("#MakeModal").append(`<option value="${brand}">${carFill.brand}</option>`);
 });
});

document.addEventListener('input', function (event) {

	if (event.target.id !== 'MakeModal') return;
    $("#ModelModal").empty();
    if (event.target.value == 'default')
    {
        $("#Model").append("<option value='default' selected>---Odaberite model!---</option>");
    }
    oDbcarFill.on('value', function (oOdgovorPosluzitelja)
    {
        oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
    {
        var carFill = oCarFillSnapshot.val();
        brand = carFill.brand.split(" ").join(".");
        //console.log(event.target.value + " "+ brand)
        if(brand == event.target.value)
        {
            for(let i = 0; i < Object.keys(carFill.models).length; i++)
            {
                model = carFill.models[i].split(" ").join("");
                $("#ModelModal").append("<option value="+model+">"+carFill.models[i]+"</option>");
            }
        }
    });
    })});
    baza.ref('allCarsInStock/' + sCarKey).get().then((snapshot) => {
        if (snapshot.exists()) {
            let oAutomobil = snapshot.val();
            let MakeModal = document.getElementById("MakeModal");
            let ModelModal = document.getElementById("ModelModal");
            let validationServer03Modal = document.getElementById("validationServer03Modal");
            let validationServer04Modal = document.getElementById("validationServer04Modal");
            let validationServer05Modal = document.getElementById("validationServer05Modal");
            let validationServer06Modal = document.getElementById("validationServer06Modal");
            let validationServer07Modal = document.getElementById("validationServer07Modal");
            let validationServer08Modal = document.getElementById("validationServer08Modal");
            let MotorModal = document.getElementById("MotorModal");
            let MjenjacModal = document.getElementById("MjenjacModal");
            let SaveModal = document.getElementById("modalSaveChanges");
            SaveModal.setAttribute("onclick",`UpdateCar('${sCarKey}')`);
            //console.log(oAutomobil.TipMotora)
            MakeModal.value = oAutomobil.Marka;
            fillModalModel(MakeModal.value);
            ModelModal.value = oAutomobil.Model;
            validationServer03Modal.value = oAutomobil.IstekRegistracije;
            validationServer04Modal.value = oAutomobil.TrenutnaKilometraza;
            validationServer05Modal.value = oAutomobil.Registracija;
            validationServer06Modal.value = oAutomobil.GodinaModela;
            validationServer07Modal.value = oAutomobil.GodinaProizvodnja;
            validationServer08Modal.value = oAutomobil.SnagaMotora;
            MotorModal.value = oAutomobil.TipMotora;
            MjenjacModal.value = oAutomobil.TipMjenjaca;

        } 
        else {
          //console.log("No data available");
        }
      }).catch((error) => {
        console.error(error);
      });;
}

function fillModalModel(Make)
{
    oDbcarFill.on('value', function (oOdgovorPosluzitelja)
    {
        $("#ModelModal").empty();
        $("#ModelModal").append("<option value='default' selected>---Odaberite model!---</option>");
        oOdgovorPosluzitelja.forEach(function (oCarFillSnapshot)
        {
        var carFill = oCarFillSnapshot.val();
        brand = carFill.brand.split(" ").join(".");
        //console.log(Make);
        if(brand == Make)
        {
            for(let i = 0; i < Object.keys(carFill.models).length; i++)
            {
                model = carFill.models[i].split(" ").join("");
                $("#ModelModal").append("<option value="+model+">"+carFill.models[i]+"</option>");
            }
        }
    });
    });
}
function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months == 0 ? 0 : months;
}

function daysBetween(date1, date2) {
    var difference = date2 - date1;
    var days = Math.round(difference / (1000 * 60 * 60 * 24));

    return days + 1;
  }
let value;
let anotherValue;
function fillCreateInvoiceDetail(val)
{
    value = val;
    baza.ref("rented").on('value', function(oOdgovorPosluzitelja)
    {
        oOdgovorPosluzitelja.forEach(function(oRentSnapshot)
        {
            //console.log(value)
            //console.log(oRentSnapshot.val()[value])
            if(oRentSnapshot.val()[value])
            {
                
                let oRent = oRentSnapshot.val()[value];
                let overAllPrice = document.getElementById("fullPrice")
                let datumRentanje = new Date(oRent.datumRentanja.split("-").join(", "));
                let datumPrestankaRentanje = new Date(oRent.datumPrestankaRentanja.split("-").join(", "))
                //console.log(datumRentanje)
                //console.log(datumPrestankaRentanje)
                anotherValue = oRent;
                baza.ref('allCarsInStock/' + oRent.rentaniAuto).get().then((snapshot) => {
                    if (snapshot.exists()) 
                    {
                        //console.log("radis li?")
                        overAllPrice.innerText = parseInt(`${daysBetween(datumRentanje,datumPrestankaRentanje) * snapshot.val().Cijena}`) +"€"
                    }
                    }
                )
            }
            
        })
        
    })

}
const creditCard = document.getElementById("creditCard");
const cash = document.getElementById("cash");

creditCard.addEventListener("click", function() {
  if (creditCard.checked) {
    cash.checked = false;
    document.getElementById("form-container-creditCard").removeAttribute("hidden");
  }
});

cash.addEventListener("click", function() {
  if (cash.checked) {
    creditCard.checked = false;
    document.getElementById("form-container-creditCard").setAttribute("hidden", '');
  }
});
/*var oAutoRef = baza.ref('allCarsInStock/' + sCarKey);
    let MakeModal = document.getElementById("MakeModal").value;
    let ModelModal = document.getElementById("ModelModal").value;
    let validationServer03Modal = document.getElementById("validationServer03Modal").value;
    let validationServer04Modal = document.getElementById("validationServer04Modal").value;
    let validationServer05Modal = document.getElementById("validationServer05Modal").value;
    let validationServer06Modal = document.getElementById("validationServer06Modal").value;
    let validationServer07Modal = document.getElementById("validationServer07Modal").value;
    let validationServer08Modal = document.getElementById("validationServer08Modal").value;
    let MotorModal = document.getElementById("MotorModal").value;
    let MjenjacModal = document.getElementById("MjenjacModal").value;
    var oAuto =
    {
        'Marka' : MakeModal,
        'Model' : ModelModal,
        'IstekRegistracije' : validationServer03Modal,
        'TrenutnaKilometraza' : validationServer04Modal,
        'Registracija' : validationServer05Modal,
        'GodinaModela' : validationServer06Modal,
        'GodinaProizvodnja' : validationServer07Modal,
        'SnagaMotora' : validationServer08Modal,
        'TipMotora' : MotorModal,
        'TipMjenjaca' : MjenjacModal
    };
    oAutoRef.update(oAuto);*/
function createInvoice()
{
    let creditCard = document.getElementById("creditCard");
    let cash = document.getElementById("cash");
    if(creditCard.checked == true || cash.checked== true)
    {
        let overAllPrice = document.getElementById("fullPrice").value;
        let currValue = value;
        var nowDate = new Date(); 
        var date = nowDate.getFullYear()+'-'+(nowDate.getMonth()+1)+'-'+nowDate.getDate();
        var nowTime = nowDate.getHours()+":"+nowDate.getMinutes()
        var sInvoiceKey = baza.ref().child('invoice').push().key;
        var fullName;
        var marka;
        var model;
        var tablice;
        var cijena;
        
        let startDate = new Date(anotherValue.datumRentanja.split("-").join(", "));
        let endDate = new Date(anotherValue.datumPrestankaRentanja.split("-").join(", "));
        
        let nacinPlacanja;
        var oUser = baza.ref('users').on('value', function(oOdgovorPosluzitelja)
        {
            oOdgovorPosluzitelja.forEach(function (oUserSnapshot)
            {
                if(oUserSnapshot.val().email == document.getElementById("EmailKorisnikaRent").value)
                {
                    fullName = oUserSnapshot.val().firstName + " " + oUserSnapshot.val().lastName
                }
            })
        })
        //console.log(anotherValue.rentaniAuto)
        var oAutoRef = baza.ref('allCarsInStock/' + anotherValue.rentaniAuto).get().then((snapshot) => {
            if (snapshot.exists()) 
            {
                //console.log(snapshot.val())
                marka = snapshot.val().Marka
                model = snapshot.val().Model
                tablice = snapshot.val().Registracija
                cijena = snapshot.val().Cijena
                let osiguranje = cijena * daysBetween(startDate, endDate) * 0.09;
                if(creditCard.checked)
        {
            let cardholderName = document.getElementById("cardholderName").value;
            let cardNumber = document.getElementById("cardNumber").value;
            let expirationDate = document.getElementById("expirationDate").value;
            let cvv = document.getElementById("cvv").value;
            nacinPlacanja = "Kreditna kartica"
            var oInvoice = {
                'datumPlacanja' : date,
                'vrijeme' : nowTime,
                'idRacun' : sInvoiceKey,
                'fullName' : fullName,
                'Marka' : marka,
                'Model' : model,
                'tablice' :tablice,
                'startDate' : startDate.getFullYear()+'-'+(startDate.getMonth()+1)+'-'+startDate.getDate(),
                'endDate' : endDate.getFullYear()+'-'+(endDate.getMonth()+1)+'-'+endDate.getDate(),
                'basePrice' : cijena,
                'Osiguranje' : osiguranje,
                'Ukupno' : cijena + osiguranje,
                'nacinPlacanja' : nacinPlacanja,
                'cardholderName' : cardholderName,
                'cardNumber' : cardNumber,
                'expirationDate' : expirationDate,
                'cvv' : cvv
            }
            var oZapis = {};
            oZapis[sInvoiceKey] = oInvoice;
            baza.ref('invoice').update(oZapis);
            var oRentRef = baza.ref('rented/' + anotherValue.rentaniAuto +'/'+ value)
            var oRent = {
                'datumPrestankaRentanja': anotherValue.datumPrestankaRentanja,
                'datumRentanja': anotherValue.datumRentanja,
                'email': anotherValue.email,
                'prihvaceno' : true,
                'rentaniAuto': anotherValue.rentaniAuto,
                'rentaniAutoIme' : anotherValue.rentaniAutoIme,
                'brojRacuna' : sInvoiceKey
            }
            oRentRef.update(oRent);
        }
        else if(cash.checked)
        {
            nacinPlacanja = "Gotovina"
            var oInvoice = {
                'datumPlacanja' : date,
                'vrijeme' : nowTime,
                'idRacun' : sInvoiceKey,
                'fullName' : fullName,
                'Marka' : marka,
                'Model' : model,
                'startDate' : startDate,
                'endDate' : endDate,
                'basePrice' : cijena,
                'Osiguranje' : osiguranje,
                'Ukupno' : cijena + osiguranje,
                'nacinPlacanja' : nacinPlacanja,
                'cardholderName' : null,
                'cardNumber' : null,
                'expirationDate' : null,
                'cvv' : null
            }
            var oZapis = {};
            oZapis[sInvoiceKey] = oInvoice;
            baza.ref("invoice").update(oZapis);
        }
            }
            }
        )
        
        
    }

    
}
function fillTableWithUserRentals()
{
    let EmailKorisnikaRent = document.getElementById("EmailKorisnikaRent");
    let rentHistory = document.getElementById("rentContainer")
    baza.ref("rented").on('value', function(oOdgovorPosluzitelja)
    {
      rentHistory.innerHTML = "";
      let counter = 1;
      let indexOfKey = 0;
      let keys;
      oOdgovorPosluzitelja.forEach(function (oRentSnapshot)
      {
        indexOfKey = 0;
          keys = Object.keys(oRentSnapshot.val())
          Object.values(oRentSnapshot.val()).forEach(function(val){
          if(val.email == EmailKorisnikaRent.value)
          {
            //console.log(oRentSnapshot.val())
            if(val.brojRacuna == undefined)
            {
                //console.log("doso tu")
                rentHistory.innerHTML += `<tr><th scope="row" class="white-text">${counter}</th><td class="white-text">${val.datumRentanja}
                </td><td class="white-text">${val.datumPrestankaRentanja}
                </td><td class="white-text">${val.rentaniAutoIme}
                </td><td class="white-text" id="racunGumb"><button type="button" class="btn btn-success" data-toggle="modal" data-target="#placanjeModal" onclick="fillCreateInvoiceDetail('${keys[indexOfKey]}')">Placanje</button>
                </td></tr>`
                counter++;
            }
          }
          indexOfKey++;
        })
      })
    })
}
/*<h5 class="card-title">${oCar.Marka} ${oCar.Model}</h5>
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
       <a href="#" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" onclick="fillUpdateDetails('${sCarKey}')">Launch demo modal</a>
       <a href="#" class="btn btn-warning" onclick="DeleteCar('${sCarKey}')">Delete</a>
       
       
       
       
       
       
     $("#carHold .row:last").append(`<div class="col-4"><div id="car-card" class="card">
     <img id="${sCarKey}"class="card-img-top" style="height:300px; width: 100%;">
     <div class="card-body">
       <h5 class="card-title text-center">${oCar.Marka.split(".").join(" ")} ${oCar.Model}</h5>
       <div class="text-center">
       <div class="alert alert-${status}" role="alert">
        ${message}
        </div>
       <a href="#" class="btn btn-orange mr-3" data-toggle="modal" data-target="#exampleModal" onclick="fillUpdateDetails('${sCarKey}')">Azuriraj modal</a>
       <a href="#" class="btn btn-warning" onclick="DeleteCar('${sCarKey}')">Delete</a>
       </div>
     </div>
    </div>
    </div>`)*/