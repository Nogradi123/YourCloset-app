// import 'bootstrap';

window.addEventListener('load', () => {
  console.log('Scripts File Connected');
})

var btn = document.getElementById("createOutfit");

btn.onclick = function() {
  document.location.href = "/outfits/create"
}

