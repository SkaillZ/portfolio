function getSectionByIndex(index) {
    return document.querySelector('[data-index="' + index + '"]');
}

var VIDEO_PAGE_INDEX = 1;
var bgImageContainer1 = document.getElementById('bg-image1');
var bgImageContainer2 = document.getElementById('bg-image2');
var bgImage1 = document.querySelector('#bg-image1 img');
var bgImage2 = document.querySelector('#bg-image2 img');
var bgVideoContainer = document.getElementById('bg-video')
var bgVideo = document.querySelector('#bg-video video');
var logoVideo = document.getElementById('logo-video');

var shouldSync = false;
var syncThreshhold = .1;

onePageScroll('main', {
    sectionContainer: 'section',     // sectionContainer accepts any kind of selector in case you don't want to use section
                                     // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)
    pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
    updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
    beforeMove: function(index) {
        index = parseInt(index);
        var section = getSectionByIndex(index);
        if (section.dataset.dark) {
            document.body.classList.add('dark-pagination');
        }
        else {
            document.body.classList.remove('dark-pagination');
        }
        
        var bgimage = section.dataset.bgimage;
        if (bgimage) {
            if (index % 2 == 0 && bgImage1) {
                bgImage1.src = bgimage;
                bgImageContainer1.classList.remove('hiding');
                bgImageContainer2.classList.add('hiding');
            }
            else if (bgImage2) {
                bgImage2.src = bgimage;
                bgImageContainer2.classList.remove('hiding');
                bgImageContainer1.classList.add('hiding');
            }
        }

        if (bgVideo) {
            if (index === VIDEO_PAGE_INDEX) {
                bgVideo.style.display = '';
                bgVideoContainer.classList.remove('hiding');
            }
            else {
                bgVideo.pause();
                logoVideo.pause();
                bgVideoContainer.classList.add('hiding');
                shouldSync = false;
            }
        }
    },  // This option accepts a callback function. The function will be called before the page moves.
    afterMove: function(index) {
        index = parseInt(index);
        if (bgVideo) {
            if (index === VIDEO_PAGE_INDEX) {
                bgVideo.play();
                logoVideo.play();
                shouldSync = true;
            }
            else {
                bgVideo.style.display = 'none';
            }
        }
    },   // This option accepts a callback function. The function will be called after the page moves.
    loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
    keyboard: true,                  // You can activate the keyboard controls
    responsiveFallback: false        // You can fallback to normal page scroll by defining the width of the browser in which
                                     // you want the responsive fallback to be triggered. For example, set this to 600 and whenever 
                                     // the browser's width is less than 600, the fallback will kick in.
 });

 function syncVideos(primary, secondary) {
    if (Math.abs(secondary - primary) > syncThreshhold)
        secondary.currentTime = primary.currentTime;
 }

 logoVideo.addEventListener('timeupdate', function() {
     syncVideos(logoVideo, bgVideo);
 })