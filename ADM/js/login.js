function login() {
  const db = firebase.firestore();
  const onGetUsers = (callback) => db.collection("Administrador").onSnapshot(callback);
  var email = document.getElementById("email").value;
  var senha = document.getElementById("senha").value;
  var aux = false;

  onGetUsers((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const adm = doc.data();
      if(adm.email == email){
        aux = true;
      }
    });
  });

  firebase.auth().setPersistence('session').then(() => {
    firebase.auth().signInWithEmailAndPassword(email, senha).then((userCredential) => {
      if(aux){
        var user = userCredential.user;
        window.location.href = "area-restrita/menu.html";
      }
    })
    .catch((error) => {
      var errorCode = error.code;
      var errorMessage = error.message;
      window.alert("Senha Ou Email Não Encontrados");
    });
  });

}