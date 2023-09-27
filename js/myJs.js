//inititalise empty array to hold saved articles/images
let savedData = [];
let savedImages = [];
if(localStorage.length != 0){
  savedData = JSON.parse(localStorage.getItem("savedForLater"))
  savedImages = JSON.parse(localStorage.getItem("savedImages"))
}



//get all instances of elements in the document with the class name 'save-button'
let saveButtons = document.querySelectorAll(".save-button")

//function that gets called when the body elements finish loading
const onLoad = () => {
    //conditional statement to check if code has run before or not
  if(localStorage.getItem("hasCodeRunBefore") === null){
    //put savedData (savedforlater array) into local storage as string
    localStorage.setItem("savedForLater", JSON.stringify(savedData));
    localStorage.setItem("savedImages", JSON.stringify(savedImages));
    //put a new object "hasCodeRunBefore" with the key of true to check if code has run on load
    localStorage.setItem("hasCodeRunBefore", true)
  }
    
}

//function to load saved articles
const loadSavedArticles = () => {
  //update array to current array in local storage
  savedData = JSON.parse(localStorage.getItem("savedForLater"));
  //for each article inside the array
  savedData.forEach(article => {
      //create a list item for each article in array
      const listItem = document.createElement('li');
      //add bootstrap class to new element
      listItem.classList.add('list-group-item')
      //add new div to dom
      const listCard = document.createElement('div')
      //add bootstrap classes to new element
      listCard.classList.add('card')
      //append new card div to list item
      listItem.appendChild(listCard)
      //add new div to dom
      const cardBody = document.createElement('div')
      //add bootstrap classes to card body element
      cardBody.classList.add('card-body')
      //append card body to card div
      listCard.appendChild(cardBody);
      //create heading for card
      const cardTitle = document.createElement('h5')
      //add bootstrap classes to card title 
      cardTitle.classList.add('card-title')
      //set text content of card title to title of article
      cardTitle.textContent = article.title;
      //append title to card body
      cardBody.appendChild(cardTitle);
      //create card text element
      const textBody = document.createElement('p')
      //add boostrap classes to card body
      textBody.classList.add('card-text')
      //set text of card content to text of article
      textBody.textContent = article.text
      //append card content to body element
      cardBody.appendChild(textBody)
      
      //get parent element to append articles in array to
      const savedForLaterList = document.getElementById("savedForLater")
      console.log(savedForLaterList);
      //append new element to list
      savedForLaterList.appendChild(listItem)
      
      
  })
  //same process as above but slightly modified to build a card with an image
  savedImages = JSON.parse(localStorage.getItem("savedImages"))
  savedImages.forEach(img =>{
    const listItem = document.createElement('li')
    listItem.classList.add('list-group-item')
    const listCard = document.createElement('div')
    listCard.classList.add('card')
    listItem.appendChild(listCard)
    const cardImg = document.createElement('img')
    listCard.appendChild(cardImg)
    cardImg.src = img.imgSrc
    const imgList = document.getElementById('savedImages')
    imgList.appendChild(listItem)
  })
}


let imageSaveButtons = document.querySelectorAll('.image-save-button')

  imageSaveButtons.forEach(btn => {
    btn.addEventListener('click', function(){
      const closestImage = this.closest('.bg-image')
      const image = closestImage.querySelector('img')
      const imgId = image.getAttribute('id')
      const imgSrc = image.getAttribute('src')
      const isImageSaved = savedImages.some(img => img.imgId === imgId);
      if(!isImageSaved) {
        savedImages.push({
          imgId: imgId,
          imgSrc: imgSrc
        })
        localStorage.setItem("savedImages", JSON.stringify(savedImages))
      } else {
        alert("Image has already been saved")
      }
          toggleLike(btn);
          initializeButtonState(btn);
    });

    // Initialize button state on page load
    
    
  });

  


// forEach on the returned nodeList array in order to add an event listener to each button
saveButtons.forEach(button => {
    // Add an event listener to each button
    button.addEventListener('click', function () {
      // Function called when the button is clicked
      // Get the parent element of the element that was clicked
      const parentElement = this.closest('.card');
      // Get the ID of the parent element
      const parentSectionId = parentElement.getAttribute('id');
      //add disabled to change styling of element
      this.setAttribute("disabled", "")
      // Check if the article is already saved in the savedData array
      const isArticleSaved = savedData.some(article => article.parentSectionId === parentSectionId);
      if (!isArticleSaved) {
        // Push the article into the saved for later array as an object
        
         savedData.push({
           // Section ID pushed as the key of sectionID property
           parentSectionId: parentSectionId,
           // Text content of the title of the article from the element set as the key of 'title' property
           title: parentElement.querySelector('.card-title').textContent,
           text: parentElement.querySelector('.card-text').textContent
          });
        // Put the updated array of saved articles into local storage
        localStorage.setItem("savedForLater", JSON.stringify(savedData));
        //alert the amount of items saved
        alert("You have saved " + savedData.length + " articles")
        console.log("local storage item set")
        
      } else {
        alert("You have already saved this article");
      }
    });
});



//code to handle comment section

//check if current document contains the comment section

const commentSection = document.getElementById("commentSection")

//if element exists, execute script to handle comments

if(commentSection){
  //load comments from local storage (if any)
  const comments = JSON.parse(localStorage.getItem("comments")) || [];
  //get references to input and button for comment section
  const commentInput = document.getElementById("commentInput")
  const commentSubmitButton = document.getElementById("commentSubmit")
  const commentList = document.getElementById("commentList")
  //function to update the comment list
  const updateCommentList = () => {
    //iterate through comments using for of loop
      for(const comment of comments){
        //create new list item
        const listItem = document.createElement("li")
        //add bootstrap classes to list item
        listItem.classList.add('list-group-item')
        //append list item to the comment list
        commentList.appendChild(listItem);
        listItem.textContent = comment + " - Anonymous"
      }
  }
  //function called here to update comment list
  updateCommentList()
  //event listener
  commentSubmitButton.addEventListener('click', function(){
    //get text from input
    const commentText = commentInput.value
    //check if text is an actual string
    if(commentText.trim() !== ""){
      //push comment into the array
      comments.push(commentText);
      //update comment list
      updateCommentList()
      //save the updated list to local storage
      localStorage.setItem("comments", JSON.stringify(comments));
      //clear input field
      commentInput.value = "";
    }
  })
}

//select all the like buttons in the document
// Get all like buttons
const likeButtons = document.querySelectorAll('.like-button');

// Function to toggle the button's style
function toggleLike(button) {
    const icon = button.querySelector('i');
    const isLiked = icon.classList.contains("fas");
    if (isLiked) {
        icon.classList.remove("fas");
        icon.classList.add("far");
        localStorage.setItem(`likeState-${button.id}`, "unliked");
    } else {
        icon.classList.add("fas");
        icon.classList.remove("far");
        localStorage.setItem(`likeState-${button.id}`, "liked");
    }
}

// Function to initialize each button's state based on Local Storage
function initializeButtonState(button) {
    const icon = button.querySelector('i');
    const likeState = localStorage.getItem(`likeState-${button.id}`);
    
    if (likeState === "liked") {
        icon.classList.add("fas");
        icon.classList.remove("far");
    } else {
        icon.classList.remove("fas");
        icon.classList.add("far");
    }
}

// Add click event listeners to the like buttons
likeButtons.forEach(button => {
    button.addEventListener('click', function () {
        toggleLike(button);
    });

    // Initialize button state on page load
    initializeButtonState(button);
});



//
