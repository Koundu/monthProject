/*Recieving the data and storing in the variable*/
var key = `597415ca28mshdec5547040704b1p109fabjsn3a44e3f8049e`;
let userLocation;

//Coding starts from Here
window.addEventListener("DOMContentLoaded", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
    }
    const searchButton = document.getElementById("search-button");
searchButton.addEventListener('click', async (e) => { // Add async keyword here
    e.preventDefault();
    const searchInput = document.getElementById("search-input").value;
    const checkIn = document.getElementById("checkIn").value;
    const checkOut = document.getElementById("checkOut").value;
    const guests = document.getElementById("guestCount").value;
    console.log(checkIn,searchInput,checkOut,guests);
        const url = `https://airbnb13.p.rapidapi.com/search-location?location=${searchInput}&checkin=${checkIn}&checkout=${checkOut}&adults=${guests}&page=1&currency=IN`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': '597415ca28mshdec5547040704b1p109fabjsn3a44e3f8049e',
                'X-RapidAPI-Host': 'airbnb13.p.rapidapi.com'
            }
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            console.log(data);
            const listingsContainer = document.getElementById("listings-container");
            // Clear previous listings
            listingsContainer.innerHTML = "";
            // Append new listings
            data.results.forEach((listing) => {
                const listingCard = createListingCard(listing);
                listingsContainer.appendChild(listingCard);
            });
        } catch (error) {
            console.error(error);
        }
    });

});



function createListingCard(listing){
    console.log(listing);
    const listingLocation = `${listing.lat},${listing.lng}`;
    const listingCard = document.createElement("div");
    listingCard.classList.add("listing-card");

    fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userLocation.lat},${userLocation.lng}&destinations=${listingLocation}&key=`+key)
    .then(response => response.json())
    .then(data => {
        const distance = data.rows[0].elements[0].distance.text;
    /* NOTE: Need to implement listing.location */
            listingCard.innerHTML = `
                <img src="${listing.hostThumbnail}" alt="${listing.name}"/>
                <div class="listing-info">
                    <h2>${listing.name}</h>
                    <p>${listing.type} · ${listing.beds} beds · ${listing.bathrooms} bathrooms</p>
                    <p>${listing.price.rate}${listing.price.currency} per night</p>
                    <p>Amenities: ${listing.previewAmenities.join(", ")}</p>
                    <p>Distance from you: ${distance}</p>
                </div>
            `;})
        // Add a paragraph for the reviews count and average rating
        const reviewsP = document.createElement("p");
        reviewsP.innerHTML = `Reviews: ${listing.reviewsCount} | Average Rating: ${calculateAverageRating(listing)}`;
        listingCard.appendChild(reviewsP);
        // Add a button for booking cost breakdown
        const costButton = document.createElement("button");
        costButton.innerText = "Show Booking Cost Breakdown";
        costButton.addEventListener("click", () => showBookingCostBreakdown(listing));
        listingCard.appendChild(costButton);
        
            // Add a superhost indicator if the host is a superhost
    if (listing.isSuperhost) {
        const superhostIndicator = document.createElement("p");
        superhostIndicator.innerText = "Superhost";
        superhostIndicator.style.color = "red";
        listingCard.appendChild(superhostIndicator);
    }

        // Add a 'rare find' indicator if the listing is a 'rare find'
        if (listing.rareFind) {
            const rareFindIndicator = document.createElement("p");
            rareFindIndicator.innerText = "Rare Find";
            rareFindIndicator.style.color = "green";
            listingCard.appendChild(rareFindIndicator);
        }
            // Add an amenities preview
        const amenitiesPreview = document.createElement("p");
        amenitiesPreview.innerText = `Amenities: ${createAmenitiesPreview(listing.previewAmenities)}`;
        listingCard.appendChild(amenitiesPreview);

            // Add a directions button
        const directionsButton = document.createElement("button");
        directionsButton.innerText = "Get Directions";
        directionsButton.addEventListener("click", function() {
            openDirections(listing);
        });
        listingCard.appendChild(directionsButton);

    return listingCard;
}


function initMap() {
    var dumbo = {lat: 40.700802, lng:73.987602};
    var mapOptions = {
        center: dumbo,
        zoom: 10
    };
    var googlemap = new google.maps.Map(document.getElementById("map"), mapOptions);
}

function showBookingCostBreakdown(listing) {
    // Calculate additional fees and total cost
    const additionalFees = listing.price * 0.10; // Assuming additional fees are 10% of base price
    const totalCost = listing.price + additionalFees;

    // Create a modal dialog box
    const modal = document.createElement("div");
    modal.style.display = "block";
    modal.style.width = "300px";
    modal.style.height = "200px";
    modal.style.backgroundColor = "#fff";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.left = "50%";
    modal.style.transform = "translate(-50%, -50%)";
    modal.style.padding = "20px";
    modal.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";

    // Add booking cost breakdown to the modal
    modal.innerHTML = `
        <h2>Booking Cost Breakdown</h2>
        <p>Base Rate: $${listing.price.toFixed(2)}</p>
        <p>Additional Fees: $${additionalFees.toFixed(2)}</p>
        <p>Total Cost: $${totalCost.toFixed(2)}</p>
    `;

    // Add a close button to the modal
    const closeButton = document.createElement("button");
    closeButton.innerText = "Close";
    closeButton.addEventListener("click", () => modal.style.display = "none");
    modal.appendChild(closeButton);

    // Add the modal to the body
    document.body.appendChild(modal);
}

function calculateAverageRating(reviews) {
    if (reviews.reviewsCount === 0) {
        return "No reviews yet";
    }

    let sum = 0;
    for (let rating of reviewsCount) {
        sum += reviews.rating;
    }

    return (sum / reviews.reviewsCount).toFixed(1);
}


function createAmenitiesPreview(amenities) {
    // Show the first 3 amenities and the total count
    const previewAmenities = previewAmenities.slice(0, 3);
    let previewText = previewAmenities.join(", ");

    if (previewAmenities.length > 3) {
        const extraCount = previewAmenities.length - 3;
        previewText += `, and ${extraCount} more`;
    }

    return previewText;
}
function openDirections(location) {
    // Open Google Maps directions in a new tab
    const url = `https://www.google.com/maps/dir//${location.lat},${location.lng}`;
    window.open(url, "_blank");
}
