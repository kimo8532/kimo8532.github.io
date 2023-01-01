auth.onAuthStateChanged((user) => {
    if (user != null) {
        console.log(user);
    } else {
      window.open('../login.html', '_self');
    }
  });
  function signOut() {
    firebase.auth().signOut().then(() => {
    }).catch((error) => {
    });
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

// Listen for changes to the file input element

    
    if(Make == "default")
    {
        alert("Unesite marku");
        return null;
    }
    if(Model == "default")
    {
        alert("Unesite model");
        return null;
    }
    if(GodinaModela > Date('year') || GodinaProizvodnja > Date("year")){
        alert("Unesite valjanu godinu");
        return null;
    }
    if(TipMotora == "default")
    {
        alert("Unesite tip motor");
        return null;
    }
    if($("#Mjenjac").val() == "default")
    {
        alert("Unesite tip mjenjaca");
        return null;
    }
    var sKey = firebase.database().ref().child('allCarsInStock').push().key;
    const storageRef = storage.ref(`Cars/${sKey}/${$("#Make").val()}${$("#Model").val()}`);
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
       <a href="#" class="btn btn-primary" onclick="UpdateCar('${sCarKey}')">Update</a>
       <a href="#" class="btn btn-warning" onclick="DeleteCar('${sCarKey}')">Delete</a>
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


function hideContainer(id, otherid){
    document.getElementById(id).setAttribute('hidden', true);
    document.getElementById(otherid).removeAttribute('hidden', true);
}
function DeleteCar(sCarKey, e){
    var oCarStorageRef = storage.ref('Cars/' + sCarKey);
    oCarStorageRef.listAll()
    .then(dir => {
      dir.items.forEach(fileRef => this.deleteFile(oCarStorageRef.fullPath, fileRef.name));
      dir.prefixes.forEach(folderRef => this.deleteFolder(folderRef.fullPath))
    })
    var oCarDatabaseRef = oDballCarsInStock.ref('allCarsInStock/' + sCarKey);
    oCarDatabaseRef.remove();
}
function UpdateCar(sCarKey){

}