var slideIndex = 0;
var playingSlideshow = false;
var currentTimeout;
var appSettings = null;
let shiftHolder = 0;
var infoDiv = document.getElementById("info");

/**
 *
 * @param {*} evt
 */
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
    document.getElementById("logo").classList.add("fade");
    document.body.style.backgroundColor = "green";
}

/**
 *
 * @param {*} evt
 */
function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    document.getElementById("logo").classList.remove("fade");
    document.body.style.backgroundColor = "";
}

/**
 *
 * @param {*} evt
 */
async function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    document.body.style.backgroundColor = "";

    var files = evt.dataTransfer.files;
    // put slides in first div
    let keystoneContainer = document.createElement("div");
    document.body.appendChild(keystoneContainer);
    keystoneContainer.className = "keystoneContainer";
    keystoneContainer.id = "slides";
    infoDiv.innerHTML = "loading files...";
    let imgDivs = await parseFiles(files);
    imgDivs = imgDivs.join("");
    keystoneContainer.innerHTML = imgDivs;
    Maptastic(keystoneContainer);
    showSlides(0);
}

/**
 *
 * @param {
 * }
 */

// create function which return resolved promise
// with data:base64 string
function imageGetBase64(file) {
    const reader = new FileReader();
    return new Promise(resolve => {
        reader.onload = ev => {
            resolve(ev.target.result);
        };
        reader.readAsDataURL(file);
    });
}

async function parseFiles(fileList) {
    console.log(fileList);
    // here will be array of promisified functions
    const promises = [];
    // loop through fileList with for loop
    for (let i = 0; i < fileList.length; i++) {
        if (
            fileList[i].name.slice(-3) != "mov" &&
            fileList[i].name.slice(-3) != "MOV" &&
            fileList[i].name.slice(-3) != "mp4" &&
            fileList[i].name.slice(-3) != "MP4" &&
            fileList[i].name.slice(-3) != "avi" &&
            fileList[i].name.slice(-3) != "AVI"
        ) {
            let imgData = await imageGetBase64(fileList[i]);
            promises.push(
                '<div class="mySlides fade"><img src="' +
                    imgData +
                    '" height="100%" width= "100%"></div>'
            );
        } else {
            //if movie file
            let vidData = await imageGetBase64(fileList[i]);
            promises.push(
                '<div class="videoContainer"><div class="mySlides fade"><video controls="controls" poster="MEDIA" src="' +
                    vidData +
                    '"width=100% height=100%"></video></div></div>'
            );
        }
    }
    // array with base64 strings
    return await Promise.all(promises);
}

/**
 *
 * @param {
 * }
 */

//on click go to next/prev slide
function nextSlide() {
    slideIndex++;
    showSlides(slideIndex);
}

function prevSlide() {
    slideIndex--;
    showSlides(slideIndex);
}

/**
 *
 * @param {
 * }
 */

//feed the inner div with the relevant slide content
function showSlides(n) {
    var slides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (n == slides.length) {
        slideIndex = 0;
    } else if (n < 0) {
        slideIndex = slides.length - 1;
    }
    if (slides[slideIndex].querySelector("video")) {
        let video = slides[slideIndex].querySelector("video");
        video.currentTime = 0;
        video.pause();
        video.onended = function() {
            showSlides(n);
        };

        video.addEventListener("progress", function() {
            var loadedPercentage = video.end(0) / video.duration;
            infoDiv.innerHTML = loadedPercentage.toString();
        });

        video.addEventListener(
            "canplaythrough",
            function() {
                video.play();
            },
            false
        );
    }
    infoDiv.innerHTML =
        "playing slide " + (slideIndex + 1).toString() + " of " + slides.length;
    slides[slideIndex].style.display = "block";
}

/**
 *
 * @param {
 * }
 */

//autoplay when press P
function autoSlideShow() {
    let interval = document.getElementById("slidesInterval").value;
    if (!interval)
        interval = document.getElementById("slidesInterval").placeholder;
    // go to next slide
    if (playingSlideshow == true) {
        nextSlide();
        currentTimeout = setTimeout(autoSlideShow, interval * 1000);
    }
}

/**
 *
 * @param {
 * }
 */

function togglePlayPause() {
    if (playingSlideshow == true) {
        playingSlideshow = false;
        clearTimeout(currentTimeout);
    } else {
        playingSlideshow = true;
        autoSlideShow();
    }
}

/**
 *
 * @param {
 * }
 */
function shiftContent(translateAmount) {
    shiftHolder = shiftHolder + translateAmount;
    let allslides = document.getElementsByClassName("mySlides");
    for (let i = 0; i < allslides.length; i++) {
        allslides[i].style.transform = "translate(" + shiftHolder + "%, 0)";
    }
}

/**
 *
 * @param {
 * }
 */

//go full screen
function toggleFullScreen() {
    var doc = window.document;
    var docElement = doc.documentElement;
    //
    var requestFullScreen =
        docElement.requestFullscreen ||
        docElement.mozRequestFullScreen ||
        docElement.webkitRequestFullScreen ||
        docElement.msRequestFullscreen;
    //
    var cancelFullScreen =
        doc.exitFullscreen ||
        doc.mozCancelFullScreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;
    //
    if (
        !doc.fullscreenElement &&
        !doc.mozFullScreenElement &&
        !doc.webkitFullscreenElement &&
        !doc.msFullscreenElement
    ) {
        requestFullScreen.call(docElement);
    } else {
        cancelFullScreen.call(doc);
    }
}

/**
 *
 * @param {
 * }
 */

// INTERACTION

//interaction
document.body.addEventListener(
    "keydown",
    event => {
        const keyName = event.key;
        const keyCode = event.keyCode;

        if (keyName == "ArrowLeft") {
            prevSlide();
        } else if (keyName == "ArrowRight") {
            nextSlide();
        } else if (keyCode == 70) {
            toggleFullScreen();
            let ui = document.getElementById("logo");
            if (ui.style.display !== "none") {
                ui.style.display = "none";
            } else {
                ui.style.display = "block";
            }
        } else if (keyName == "P") {
            togglePlayPause();
        }
    },
    false
);

// key combiations
document.onkeydown = KeyPress;
function KeyPress(e) {
    var evtobj = window.event ? event : e;
    if (evtobj.keyCode == 68 && evtobj.ctrlKey) {
        alert("Ctrl+d pressed, clearing local storage");
        localStorage.clear();
        location.reload();
    }
}

if (window.File && window.FileReader && window.FileList && window.Blob) {
    var dropZone = document.getElementById("logo");
    dropZone.addEventListener("dragover", handleDragOver, false);
    dropZone.addEventListener("dragleave", handleDragLeave, false);
    dropZone.addEventListener("drop", handleFileSelect, false);
}

// folder input
document.getElementById("folderInput").addEventListener("change", async function() {
    var files = this.files;
    let keystoneContainer = document.createElement("div");
    document.body.appendChild(keystoneContainer);
    keystoneContainer.className = "keystoneContainer";
    keystoneContainer.id = "slides";
    infoDiv.innerHTML = "loading files...";
    let imgDivs = await parseFiles(files);
    imgDivs = imgDivs.join("");
    keystoneContainer.innerHTML = imgDivs;
    Maptastic(keystoneContainer);
    showSlides(0);
});

