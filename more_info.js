// GET PLACE FROM URL
const params = new URLSearchParams(window.location.search);
const place = params.get("place");

// DATA OBJECT
const destinations = {
  italy: {
    title: "Royal Italy Escape",
    image: "assets/images/popular-1.jpg",
    desc: "Experience the beauty of Italy with stunning architecture and rich history.",
    gallery: [
      "assets/images/popular-1.jpg",
      "assets/images/popular-2.jpg",
      "assets/images/popular-3.jpg"
    ]
  },

  dubai: {
    title: "Luxury Dubai Tour",
    image: "assets/images/popular-2.jpg",
    desc: "Discover luxury lifestyle, Burj Khalifa and golden deserts of Dubai.",
    gallery: [
      "assets/images/popular-2.jpg",
      "assets/images/packege-1.jpg",
      "assets/images/popular-3.jpg"
    ]
  },

  japan: {
    title: "Royal Japan Journey",
    image: "assets/images/popular-3.jpg",
    desc: "Explore Kyoto temples, cherry blossoms and traditional culture.",
    gallery: [
      "assets/images/popular-3.jpg",
      "assets/images/popular-1.jpg",
      "assets/images/popular-2.jpg"
    ]
  }
};

// LOAD CONTENT
if(destinations[place]){
  document.getElementById("heroTitle").innerText = destinations[place].title;
  document.getElementById("heroImg").src = destinations[place].image;
  document.getElementById("heroDesc").innerText = destinations[place].desc;

  const galleryContainer = document.getElementById("galleryContainer");
  destinations[place].gallery.forEach(img=>{
    galleryContainer.innerHTML += `<img src="${img}" />`;
  });
}

// POPUP
function openPopup(){
  document.getElementById("popup").classList.add("active");
}

function closePopup(){
  document.getElementById("popup").classList.remove("active");
}

// BOOKING FORM
document.getElementById("type").addEventListener("change",function(){
  let members=document.getElementById("members");
  members.style.display = this.value==="family" ? "block" : "none";
});

document.getElementById("bookingForm").addEventListener("submit",function(e){
  e.preventDefault();

  let name=document.getElementById("name").value.trim();
  let email=document.getElementById("email").value.trim();
  let type=document.getElementById("type").value;
  let members=document.getElementById("members").value;
  let date=document.getElementById("date").value;

  if(!name || !email || !type || !date){
    alert("Please fill all required fields");
    return;
  }

  if(type==="family" && (!members || members<2)){
    alert("Family booking must have at least 2 members");
    return;
  }

  document.getElementById("bookingForm").style.display="none";
  document.getElementById("successMsg").style.display="block";

  setTimeout(()=>{
    closePopup();
    location.reload();
  },3000);
});


// dark light toggle
// CHECK SAVED THEME
if(localStorage.getItem("theme") === "dark"){
  document.body.classList.add("dark-mode");
  document.getElementById("themeToggle").innerText="☀";
}

// TOGGLE BUTTON
document.getElementById("themeToggle").addEventListener("click", function(){

  document.body.classList.toggle("dark-mode");

  if(document.body.classList.contains("dark-mode")){
    localStorage.setItem("theme","dark");
    this.innerText="☀";
  }else{
    localStorage.setItem("theme","light");
    this.innerText="🌙";
  }

});