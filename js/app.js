const contanir = document.querySelector('.contanir');
const musicImage = document.querySelector('.img-area img');
const musicName = document.querySelector('.song-name');
const musicArtist = document.querySelector('.song-artist');
const musicAudio = document.getElementById('main-audio');
const palyPause = document.querySelector('.paly-pause');
const nextBth = document.getElementById('next');
const prevBtn = document.getElementById('prev');
const progressArea = document.querySelector('.progress-area');
const progressBar = document.querySelector('.progress-bar');
const currentTime = document.querySelector('.current-time');
const maxTime = document.querySelector('.max-time');
const repeatPlis = document.getElementById('repeat-plis');
const moreMusic = document.getElementById('more-music');
const musicList = document.querySelector('.music-list');
const closeBtn = document.querySelector('#close');
const ulTag = musicList.querySelector('ul');

// console.log(palyPause);
let musicIndex = 0
let isMusicPaused = true;

// Load Event
window.addEventListener('load', () => {
    loadMusic(musicIndex);
    loadMusicList();
})

// Load Function
function loadMusic(indexNum) {
    const songs = allMusic[indexNum];
    musicName.textContent = songs.name;
    musicArtist.textContent = songs.artist;
    musicImage.src = `img/${songs.img}.jpg`;
    musicAudio.src = `song/${songs.src}.mp3`;
    highlightPlaySong();
}

// Paly Music Function
function palyMusic() {
    musicAudio.play();
    isMusicPaused = false
    palyPause.querySelector('i').innerText = "pause";
    highlightPlaySong();
}

// Pasuse Music Function
function pauseMusic() {
    musicAudio.pause();
    isMusicPaused = true;
    palyPause.querySelector('i').innerText = "play_arrow";
    highlightPlaySong();
}

// Play Pause Click Event
palyPause.addEventListener('click', () => {
    isMusicPaused ? palyMusic() : pauseMusic()
})


function next() {
    musicIndex = (musicIndex + 1) % allMusic.length;
    loadMusic(musicIndex);
    palyMusic();
}

// Next Function Event
nextBth.addEventListener('click', next)


function prev() {
    musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
    loadMusic(musicIndex);
    palyMusic();
}
// Prev Function  Event
prevBtn.addEventListener('click', prev);


musicAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    if (duration) {
        const progressWidth = (currentTime / duration) * 100;
        progressBar.style.width = `${progressWidth}%`
        updateCurrentTime(currentTime);
    }
})

function updateCurrentTime(current_Time) {
    const currentMin = Math.floor(current_Time / 60);
    const currentSec = Math.floor(current_Time % 60).toString().padStart(2, "0");
    currentTime.textContent = `${currentMin}:${currentSec}`
}

musicAudio.addEventListener("loadeddata", () => {
    const duration = musicAudio.duration;
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration % 60).toString().padStart(2, "0");
    maxTime.textContent = `${totalMin}:${totalSec}`
})

progressArea.addEventListener("click", (e) => {
    const progressWidth = progressArea.clientWidth;
    const clickedOffsetX = e.offsetX;
    const songDuration = musicAudio.duration;
    musicAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
    palyMusic();
})

repeatPlis.addEventListener('click', () => {
    const getText = repeatPlis.innerText;
    switch (getText) {
        case "repeat":
            repeatPlis.innerText = "repeat_one";
            repeatPlis.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatPlis.innerText = "shuffle";
            repeatPlis.setAttribute("title", "Playback shuffled");
            break;
        case "shuffle":
            repeatPlis.innerText = "repeat";
            repeatPlis.setAttribute("title", "Playlist looped");
            break;
    }
})

musicAudio.addEventListener('ended', () => {
    const getText = repeatPlis.innerText;
    switch (getText) {
        case "repeat":
            next();
            break;
        case "repeat_one":
            musicAudio.currentTime = 0;
            loadMusic(musicIndex);
            palyMusic();
            break;
        case "shuffle":
            shuffleMusic();
            break;
    }
})

function shuffleMusic() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * allMusic.length);
    } while (randomIndex === musicIndex);
    musicIndex = randomIndex;
    loadMusic(musicIndex);
    palyMusic();
}

moreMusic.addEventListener('click', () => {
    musicList.classList.toggle("active");
})

closeBtn.addEventListener('click', () => {
    musicList.classList.remove("active");
})

function loadMusicList() {
    ulTag.innerHTML = "";

    allMusic.forEach((song, index) => {
        const li = document.createElement("li");
        li.setAttribute("li-index", index);

        li.innerHTML = `
        <div class="row">
            <span>${song.name}</span>
            <span>${song.artist}</span>
        </div>
         <span class="audio-duration" id="audio-${index}">00:00</span>
        <audio src="song/${song.src}.mp3" id="song-${index}"></audio>
        `;
        ulTag.appendChild(li);

        const audioTag = li.querySelector(`#song-${index}`);
        const durationTag = li.querySelector(`#audio-${index}`);

        audioTag.addEventListener('loadeddata', () => {
            const totalMin = Math.floor(audioTag.duration / 60);
            const totalSec = Math.floor(audioTag.duration % 60).toString().padStart(2, "0");
            durationTag.innerText = `${totalMin}:${totalSec}`;
            durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
        })

        li.addEventListener('click', () => {
            musicIndex = index;
            loadMusic(musicIndex);
            palyMusic();
            musicList.classList.remove("active");
        })
    })
}

function highlightPlaySong() {
    const allLiTags = ulTag.querySelectorAll('li');
    allLiTags.forEach(li => li.classList.remove("playing"));
    allLiTags[musicIndex]?.classList.add("playing");    
}
