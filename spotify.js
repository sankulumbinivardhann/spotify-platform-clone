console.log("welcome to Our Websitee..");
let currentSong = new Audio();
let songs;
let currFolder;

let playy = document.querySelector(".playy");

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
    }
    //show all the songs in the libraryyy...
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `<li>
                                <div class="img-name flex justify-content align-items">
                            <img class="invert" src="music.svg" alt="">
                            <div class="songInfo">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Vardhan</div>
                            </div>
                            </div>
                            <div class="playNow">
                                <img class="invert" src="play_now.svg" alt="">Play Now
                            </div>
                        </li>`;
    }
    //Attach an event listener to all the songs....

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".img-name").children[1].firstElementChild.innerHTML);
            playMusic(e.querySelector(".img-name").children[1].firstElementChild.innerHTML);
        });
    })

    return songs;
}
function formatTime(seconds) {
    seconds = Math.floor(seconds);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

const playMusic = (track, pause = false) => {
    currentSong.src = `/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        playy.src = "pause.svg";
    }
    document.querySelector(".songNames").innerText = decodeURI(track);
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let cardContainer = document.querySelector(".cardContainer");
    let anchors = div.getElementsByTagName("a");
    console.log(anchors);
    let array = Array.from(anchors);
    for(let i = 2; i < array.length; i++){
        const e = array[i];
        if(e.href.includes("/songs")) {
            let folder = e.href.split("/songs/").slice(-1)[0];
            console.log(folder);
            //get the meta data of the folder..
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response = await a.json();
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${folder}" class="cards rounded">
                        <img class="card-play" src="green-play.svg" alt="">

                        <img aria-hidden="false" draggable="false" loading="lazy"
                            src="/songs/${folder}/cover.jpg"
                            data-testid="card-image" alt=""
                            class="LBM25IAoFtd0wh7k3EGM Z3N2sU3PRuY4NgvdEz55 DlkUu3oBOxXLc2LtOd3N PgTMmU2Gn7AESFMYhw4i">
                        <h3 style="margin-left: 10px;">${response.title}</h3>
                        <p style="margin-left: 10px;">${response.description}</p>
                    </div>`;
        }
    }
    Array.from(document.getElementsByClassName("cards")).forEach(e => {
            e.addEventListener("click", async item => {
                songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
                playMusic(songs[0]);
            });
        });
}

async function main() {
    await getSongs("songs/baahubali");

    playMusic(songs[0], true);

    //display all the albums in the page..
    displayAlbums();

    //Attach an event listener to play, next and previous buttons...
    playy.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            playy.src = "pause.svg";
        }
        else {
            currentSong.pause();
            playy.src = "play_now.svg";
        }
    })



    //listen for time update event..
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".time").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)} `;
        document.querySelector(".circle").style.left = (currentSong.currentTime) / (currentSong.duration) * 100 + "%";
    });

    //add an event listener to seek bar...
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    });

    //add an event listener to Hamberger...

    document.querySelector(".hamberger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    document.querySelector(".left-close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    //add event listener for previous and next;

    document.querySelector(".previous").addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) playMusic(songs[index - 1]);
    })

    document.querySelector(".next").addEventListener("click", () => {
        currentSong.pause();
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index + 1 < songs.length) playMusic(songs[index + 1]);
    })

    // add an event to volume....

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100;
    })

    //add event listener to mute the trackk..
    document.querySelector(".volume>img").addEventListener("click", (e)=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg");
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg");
            currentSong.volume = 0.10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main()