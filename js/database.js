
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
    });
	//console.log(event.target.value);

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
    console.log('File uploaded successfully');
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
                'Cijena' : Cijena
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
     $("#carHold .row:last").append(`<div class="col-4"><div id="car-card" class="card">
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
        console.log(event.target.value + " "+ brand)
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
            console.log(oAutomobil.TipMotora)
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
          console.log("No data available");
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
        console.log(Make);
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