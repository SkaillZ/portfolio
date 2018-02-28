const SCROLL_CONTAINER_SELECTOR = 'main';
const VIDEO_PAGE_INDEX = 1;
const VIDEO_SYNC_THRESHHOLD = .2;

function getSectionByIndex(index) {
    return document.querySelector('[data-index="' + index + '"]');
}

function getNumberOfSections() {
    return document.querySelector(SCROLL_CONTAINER_SELECTOR).childElementCount;
}

function syncVideos(primary, secondary) {
    if (Math.abs(secondary.currentTime - primary.currentTime) > VIDEO_SYNC_THRESHHOLD)
        secondary.currentTime = primary.currentTime;
}

function registerLightboxHandlers() {
    Array.prototype.forEach.call(document.getElementsByClassName('images'), element => {
        element.addEventListener('click', () => {
            if (!element.dataset.images)
                return;
            let images = element.dataset.images.split(' ');
            lightGallery(element, {
                dynamic: true,
                download: false,
                dynamicEl: images.map(img => ({ src: img }))
            })
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    let bgImageContainer1 = document.getElementById('bg-image1');
    let bgImageContainer2 = document.getElementById('bg-image2');
    let bgImage1 = document.querySelector('#bg-image1 img');
    let bgImage2 = document.querySelector('#bg-image2 img');
    let bgVideoContainer = document.getElementById('bg-video')
    let bgVideo = document.querySelector('#bg-video video');
    let logoVideo = document.getElementById('logo-video');

    let shouldSync = false;

    function pausePlayback() {
        bgVideo.pause();
        logoVideo.pause();
        shouldSync = false;
    }

    function resumePlayback() {
        syncVideos(logoVideo, bgVideo);
        bgVideo.play();
        logoVideo.play();
        shouldSync = true;
    }

    function beforeMove(index) {
        index = parseInt(index); // 1-based
        let lastIndex = getNumberOfSections();

        let section = getSectionByIndex(index);
        if (section.dataset.dark && section.dataset.dark.toLowerCase() === 'true') { // data-dark is a string
            document.body.classList.add('dark-pagination');
        }
        else {
            document.body.classList.remove('dark-pagination');
        }

        let bgimage = section.dataset.bgimage;
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
            if (index === VIDEO_PAGE_INDEX || index === lastIndex) {
                bgVideo.style.display = '';
                bgVideoContainer.classList.remove('hiding');
            }
            else {
                pausePlayback();
                bgVideoContainer.classList.add('hiding');
            }
        }
    }

    function afterMove(index) {
        index = parseInt(index);
        let lastIndex = getNumberOfSections();

        if (bgVideo) {
            if (index === VIDEO_PAGE_INDEX || index === lastIndex) {
                resumePlayback();
            }
            else {
                bgVideo.style.display = 'none';
            }
        }
    }

    document.getElementById('loading').classList.add('hidden');

    logoVideo.addEventListener('timeupdate', () => {
        syncVideos(logoVideo, bgVideo);
    });

    onePageScroll(SCROLL_CONTAINER_SELECTOR, {
        sectionContainer: 'section',     // sectionContainer accepts any kind of selector in case you don't want to use section
        // "ease-out", "ease-in-out", or even cubic bezier value such as "cubic-bezier(0.175, 0.885, 0.420, 1.310)
        pagination: true,                // You can either show or hide the pagination. Toggle true for show, false for hide.
        updateURL: false,                // Toggle this true if you want the URL to be updated automatically when the user scroll to each page.
        beforeMove: beforeMove,
        afterMove: afterMove,
        loop: false,                     // You can have the page loop back to the top/bottom when the user navigates at up/down on the first/last page.
        keyboard: true,                  // You can activate the keyboard controls
        responsiveFallback: false        // You can fallback to normal page scroll by defining the width of the browser in which
        // you want the responsive fallback to be triggered. For example, set this to 600 and whenever 
        // the browser's width is less than 600, the fallback will kick in.
    });

    registerLightboxHandlers();
});

/*
    The onepagescroll library does not seem to support anchor links.
    TODO: replace this workaround
*/

function scrollToId(id) {
    let scrollContainer = document.querySelector(SCROLL_CONTAINER_SELECTOR);
    let index = -1;
    // Iterate through all children
    for (let i = 0; i < scrollContainer.children.length; i++) {
        // If a child has the right ID, i is equal to the index of the section we are searching for
        let child = scrollContainer.children[i];
        if (child.id === id) {
            index = i;
            break;
        }
    }

    if (index != -1)
        moveTo(SCROLL_CONTAINER_SELECTOR, index + 1);
    else
        throw new Error('No section found with id ' + id);
}

window.addEventListener('click', evt => {
    if (!event.target || !event.target.hash)
        return;

    // Only execute if the link doesn't leave the page
    if (event.target.pathname !== window.location.pathname || event.target.host != window.location.host)
        return;

    let hash = event.target.hash;
    let id = hash.substr(1);

    // Ignore numeric ID's
    if (!isNaN(id))
        return;

    evt.preventDefault();
    scrollToId(id);
});