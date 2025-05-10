//Used for any links without pages
function comingSoon(){
    window.location.href="coming-soon.html";
}

//Sign-Up and Login
//When a new account is created, the current user data is overwritten in local storage.

function register(event){
    event.preventDefault();

    const fName = document.getElementById("fName").value;
    const lName= document.getElementById("lName").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confPassword = document.getElementById("confPassword").value;
    const reminders = document.getElementById("emailCB").value;


    if (!fName || !lName || !email || !password || !confPassword){
        alert("Please complete all fields");
        return;
    }
    else if(password != confPassword){
        alert("Passwords do not match!\nPlease re-enter the password.");
        return;
    }
    else{
        localStorage.setItem("user",JSON.stringify({
            fName,lName,email,password})
        );
        alert("Registration Successful");
        
        //redirect to login page
        window.location.href = "login.html";
    }
}

function login(event){
    event.preventDefault();
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if(!savedUser || savedUser.email !== email || savedUser.password !== password){
        alert("Invalid username or password");
    }
    else{
        alert("Login Successful");
        window.location.href = "explore.html";
    }
}
//Explore, Locations and Book Trails
//Load location cards from database
document.addEventListener('DOMContentLoaded', () => {
    const pageId = document.body.id;

    if (pageId === 'explore-page') {
        displayLocations(locations);

    } else if (pageId === 'location-page') {
        const params = new URLSearchParams(window.location.search);
        const locationID = params.get('id');
        if (locationID) {
            displaySpecificLocation(locationID);
            displayReviews(reviews,locationID);
        }
    } else if (pageId === 'trail-page'){
        const params = new URLSearchParams(window.location.search);
        const bookName = params.get('book');
        if (bookName){
            displayBookTrail(bookName);
        }
    }
});

//Displays location list in explore.html
function displayLocations(locations){
    const container = document.getElementById('location-list');
    container.innerHTML= '';

    locations.forEach(location => {
        const card = document.createElement('div');
        card.classList.add('location-card');
        const iconPath = checkBookIcon(location.Book);
        
        card.innerHTML = `
        <a href="locationDetails.html?id=${encodeURIComponent(location.Location_ID)}">
            <img class=card-image src="${location.Image}" alt="Image of ${location.Location_Name}">
            <h3 >${location.Location_Name}</h3>
            <img src="${iconPath}" alt="${location.Book} icon" class="book-icon">
        </a>`;
        container.appendChild(card);
    });
}

function displaySpecificLocation(id){
    const location = locations.find(loc => loc.Location_ID === parseInt(id));
    if(!location){
        console.error("Location not found");
        return;
    }
    document.getElementById('location-header').style.backgroundImage = `url(${location.Image})`;
    document.getElementById('location-name').textContent = location.Location_Name;
    document.getElementById('rating').textContent = location.Average_Rating;
    document.getElementById('description').innerHTML = location.Description;
    document.getElementById('book-link').textContent = location.Book_Link;
    console.log(location.Website)
    if (location.Website){
        document.getElementById('website').innerHTML = `<p>More Information here</p>
        <a class="website-btn" href=${location.Website} target="_blank">Website</a>`
    }
    document.getElementById('address').innerHTML = "📍Address: "+location.Address;
    if (location.Extra_Info){
        document.getElementById('extra-info').innerHTML = "ℹ️ Extra Information: "+location.Extra_Info;
    }
    document.getElementById('times').textContent = "🕰️ Opening Times: "+location.Opening_Hours;
    document.getElementById('price').textContent = "💰 Price Rating: "+location.Price;

    //Google Map
    const mapFrame = document.getElementById('google-map');
    const mapQuery = encodeURIComponent(location.Location_Name + ", Oxford");
    mapFrame.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyA4aYGYFaFwQPygQLoLYQ1X6CLmHeqXBOQ&q=${mapQuery}`;
}

function displayReviews(reviews,id){
    const review_list = reviews.filter(review => review.Location_ID === parseInt(id));
    const reviewContainer = document.getElementById('review-container');
    //Review Cards
    review_list.forEach(review => {
        const review_card = document.createElement('div');
        review_card.classList.add('review-card');
        review_card.innerHTML = `
            <H3>${review.User_Name}</H3>
            <p id="rating">${review.Rating}</p>
            <p>${review.Text}</p>
            <p class="likes">👍${review.Rating_Likes}`
        reviewContainer.appendChild(review_card);
    });
}

function displayBookTrail(book){
    //page theme
    switch (book){
        case "Alice in Wonderland":
            themeId = "Alice";
            trailLink = "https://www.google.co.uk/maps/dir/S+Parks+Rd,+Oxford+OX1+3RF/The+Randolph+Hotel+Oxford,+a+Graduate+by+Hilton,+Beaumont+Street,+Oxford/Christ+Church+College,+Saint+Aldate's,+Oxford/Alice's+Shop,+Saint+Aldate's,+Oxford/@51.7552073,-1.2599328,16z/data=!3m1!5s0x4876c6b0250f3f7b:0xc1be2de0b3480e1e!4m26!4m25!1m5!1m1!1s0x4876c6a90ac207e7:0xa76a8f719eabb32b!2m2!1d-1.253087!2d51.7585245!1m5!1m1!1s0x4876c6a5d287b211:0x3a15f09b044fe952!2m2!1d-1.2596601!2d51.7550875!1m5!1m1!1s0x4876c6b023ce50cf:0x4e7d5b2a18299b40!2m2!1d-1.2558446!2d51.7498733!1m5!1m1!1s0x4876c6b068eef27b:0x73608b2e6523257c!2m2!1d-1.2567422!2d51.748897!3e2?entry=ttu&g_ep=EgoyMDI1MDUwNy4wIKXMDSoASAFQAw%3D%3D";
            break;
        case "His Dark Materials":
            themeId = "HDM";
            trailLink = "";
            break;
        case "The Secret Garden":
            themeId = "Garden";
            trailLink = "";
            break;
        case "The Chronicles of Narnia":
            themeId = "Narnia"
            trailLink = "";
            break;
    }

    const trail_list = getBookTrail(book);
    document.getElementsByClassName("header")[0].id = themeId;
    document.getElementsByClassName("return")[0].id = themeId;
    document.getElementById('book-name').textContent  = book;
    document.getElementById('trail-link').href = trailLink;

    //find div class nav and give corresponding book id attribute
    const trailContainer = document.getElementById('trail-content');
    trailContainer.innerHTML = '';

    trail_list.forEach((location, i )=> {
        const trailStep = document.createElement('div');
        trailStep.classList.add('trail-step');

        const trail_card = document.createElement('div');
        trail_card.classList.add('trail-card');
        
        //creating the alternating diagonal placement
        const column = (i%2)+1;
        const row = i+1;
        trailStep.style.gridColumn = column;
        trailStep.style.gridRow = row;

        //Location Cards
        trail_card.innerHTML = `
        <a href="locationDetails.html?id=${encodeURIComponent(location.Location_ID)}">
        <img class="card-image" src=${location.Image}">
        <h3>${location.Location_Name}</h3>
        </a>`;
        trailStep.appendChild(trail_card);

        //Creating the dashed line effect with SVG
        if (i < trail_list.length -1){
            const curve = document.createElementNS("http://www.w3.org/2000/svg","svg");
            curve.setAttribute("width","500");
            curve.setAttribute("height","500");
            curve.setAttribute("viewBox", "0 0 500 500");
            curve.classList.add("trail-curve");
            
            //Flips the curve in the other direction
            if (i % 2 !==0) curve.classList.add("flip");
        
            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", "M0,0 L400,0 Q400,0 400,300 L400,400");
            path.setAttribute("stroke","#523728");
            path.setAttribute("stroke-width", "10");
            path.setAttribute("fill", "none");
            path.setAttribute("stroke-dasharray", "5,5");

            curve.appendChild(path);
            trailStep.appendChild(curve);
        }
        trailContainer.appendChild(trailStep);
});
}
//Will check what book the location is linked to so the corresponding icon can be displayed.
function checkBookIcon(bookType){
    switch (bookType){
        case "Alice in Wonderland":
            return "Images/Alice-Icon.png";
        case "His Dark Materials":
            return "Images/HDM-Icon.png";
        case "The Secret Garden":
            return "Images/Garden-Icon.png";
        case "The Chronicles of Narnia":
            return "Images/Narnia-Icon.png";
        default:
            return ""; //Does not belong to a book
    }
}
//Filters the list of books displayed
function filterByBook(name){
    if (name === "all"){
        displayLocations(locations);
    }
    else{
        const filtered = locations.filter(location => location.Book === name);
        displayLocations(filtered);
    }
}

function showAlert(message){
    switch (message){
        case "bookmark":
            alert = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>📜 Location saved to bookmarks!</strong>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
            </button>
            </div>`;
            break;
        case "success":
            alert = `<div class="alert alert-success alert-dismissible fade show" role="alert">
                Successful Login
                </button>
            </div>`;
            break;
    }
    document.getElementById("alert-placeholder").innerHTML = alert;
    setTimeout(() => {
                $('.alert').alert('close');
            }, 3000);
}

//Finds locations for a book trail and orders them
function getBookTrail(name){
    const trailLocations = locations.filter(location => location.Book ===name && location.Trail_Number !== null)
    .sort((a,b) => a.Trail_Number - b.Trail_Number);
    return trailLocations;
}




//Work in Progress
function darkMode(){
    var logo = document.getElementById('logo')
    var themeBtn = document.getElementById('theme-toggle')
    
    if (logo.src==="Images.Logo-Day.png"){
        logo.src = "Images/Logo-Night.png"
        themeBtn.textContent = "☀️";

    }
    else{
        logo.src = "Images/Logo-Day.png";
        themeBtn.textContent= "🌙";
    }

}