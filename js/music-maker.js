// Array for mp3 samples, items are object having file source and name
const samples = []

samples.push({src: "audio/bass.mp3", name: "Bass", category: "Band"})
samples.push({src: "audio/drum.mp3", name: "Drum", category: "Band"})
samples.push({src: "audio/piano.mp3", name: "Piano", category: "Classic"})
samples.push({src: "audio/silence.mp3", name: "Silence", category: "Other"})
samples.push({src: "audio/strange-beat.mp3", name: "Strange Beat", category: "Other"})
samples.push({src: "audio/violin.mp3", name: "Violin", category: "Classic"})

// 2D array of tracks – so one track can have multiple samples in a row
let tracks = []
tracks.push([])
tracks.push([])
tracks.push([])
tracks.push([])

//Categories that hide or show objects based on their category
document.getElementById("bandCategory").addEventListener("click", ()=> {
    samples.forEach((sample, category) => {
        const button = addButtons.children[category];
        if(sample.category == "Band")   {
            button.style.display = "inline";
        }   else    {
            button.style.display ="none";
        }
    });
});

document.getElementById("otherCategory").addEventListener("click", ()=> {
    samples.forEach((sample, category) => {
        const button = addButtons.children[category];
        if(sample.category == "Other")   {
            button.style.display = "inline";
        }   else    {
            button.style.display ="none";
        }
    });
});

document.getElementById("classicalCategory").addEventListener("click", ()=> {
    samples.forEach((sample, category) => {
        const button = addButtons.children[category];
        if(sample.category == "Classic")   {
            button.style.display = "inline";
        }   else    {
            button.style.display ="none";
        }
    });
});


// Let's add these tracks to HTML page, so that user can see them
tracksDiv = document.getElementById("tracks")
for(let i = 0; i < tracks.length; i++) {
    let trackDiv = document.createElement("div")
    trackDiv.setAttribute("id", "trackDiv" + i)
    let trackDivHeader = document.createElement("h2")
    trackDivHeader.innerText = "Track " + (i + 1)
    trackDiv.appendChild(trackDivHeader)
    tracksDiv.appendChild(trackDiv)

    // separate class for css styles
    trackDiv.classList.add("oneTrack")

    // added dragover so tracks can receive items
    trackDiv.addEventListener('dragover', (event) => {
        event.preventDefault()
    })
    // added event handler when dropping happens on track
    trackDiv.addEventListener('drop', (event) => {
        event.preventDefault()

        const sampleNumber = event.dataTransfer.getData('text/plain')
        const sample = samples[sampleNumber]
        const audio = new Audio(sample.src)

        // audio duration for visual look
        audio.addEventListener("loadedmetadata", (event) => {
            const duration = audio.duration;

        tracks[i].push(sample)
        const newItem = document.createElement('div')
        newItem.innerText = samples[sampleNumber].name

        // style for the final dragged sample
        newItem.classList.add("sampleStyle");
        newItem.style.width = `${duration *15}px`;
        trackDiv.appendChild(newItem)
        })
    })
}

// Adding the sample buttons to the page, each sample will generate its own button
const addButtons = document.getElementById("addButtons")
let id = 0
samples.forEach((sample) => {
    console.log(sample.name)

    let newButton = document.createElement("button")
    newButton.setAttribute("data-id", id++)
    newButton.setAttribute("draggable", true)
    newButton.innerText = sample.name
    // dragstart / transfer data when dragstarts 
    newButton.addEventListener("dragstart", (event) =>{
        event.dataTransfer.setData("text/plain", event.target.dataset.id)
    })
    addButtons.appendChild(newButton)
    newButton.style.display ="none";


    // For button styles or icons
    newButton.classList.add("buttonStyle")

})


// By pressing the sample button the sample is added to the tracks array and to the track div
function addSample(addButton) {
    const sampleNumber = addButton.dataset.id
    const trackNumber = document.querySelector("input[name='track']:checked").value

    console.log("Sample number: " + sampleNumber)
    console.log("Track number: " + trackNumber)

    tracks[trackNumber].push(samples[sampleNumber])

    let trackDiv = document.getElementById("trackDiv" + trackNumber)
    let newItem = document.createElement("div")
    newItem.innerText = samples[sampleNumber].name
    trackDiv.appendChild(newItem)

}

const playButton = document.getElementById("play")
playButton.addEventListener("click", () => playSong())


musicPlaying = false;

// Song is played so that each track is started simultaneously 
function playSong() {
    if (musicPlaying == true){ // ensures that pressing play multiple times won't cause the track to overlap and multiply. 
        return;
    }
    musicPlaying = true;
    let i = 0;
    tracks.forEach((track) => {
        if(track.length > 0) {
            playTrack(track, i)
        }
        i++
       
    })
}
// Stops all playing audio and resets them to start
const stopButton = document.getElementById("stop")
stopButton.addEventListener("click", () => stopSong())
let audioNow = [];

function stopSong() {
    audioNow.forEach(audio => {
        audio.pause();
    });
    audioNow = [];
    musicPlaying = false;

}
// Track is looped – that means it is restarted each time its samples are playd through

function playTrack(track, trackNumber) {
    const volumeSlider = document.getElementById(`audioRange${trackNumber +1}`)
    let audio = new Audio()
    let i = 0
    

    audioNow.push(audio);
    audio.addEventListener("ended", () => {
        i = ++i < track.length ? i : 0
        audio.src = track[i].src
        audio.play()
        console.log("Starting: Track " + trackNumber + ", instrument " + track[i].name)
    }, true )
    // slider connected to volume
    volumeSlider.addEventListener("input", () => {
        audio.volume =volumeSlider.value / 100;
        
    });    
    audio.loop = false
    audio.src = track[0].src
    audio.play()
    console.log("Starting: Track " + trackNumber + ", instrument " + track[i].name)
}

// There is a upload button that adds a sample to samples array and a sample button with an event listener
const uploadButton = document.getElementById("upload")
uploadButton.addEventListener("click", () => {
    const file = document.getElementById("input-sample").files[0]
    let audioSrc = ""
    if(!file) return
    
    audioSrc = URL.createObjectURL(file)
    let sample = {src: audioSrc, name: "New Sample"}
    samples.push(sample)
    id = samples.length - 1

    let newButton = document.createElement("button")
    newButton.setAttribute("data-id", id)
    newButton.addEventListener("click", () => addSample(newButton))
    newButton.innerText = sample.name

    addButtons.appendChild(newButton)


})
selectedVolume = null;

document.addEventListener('keydown', (keycontrol) => {

    if (keycontrol.key == ' ') {
        event.preventDefault();
        if (musicPlaying)  {
            stopSong();
            musicPlaying = false;
        }   else    {
            playSong();
            musicPlaying = true;
        }

    }

    if (keycontrol.key == '1') {
        event.preventDefault();
        selectedVolume = 0; 
        const volumeSlider = document.getElementById(`audioRange${selectedVolume +1}`)

    }
    if (keycontrol.key == '2') {
        event.preventDefault();
        selectedVolume = 1; 
        const volumeSlider = document.getElementById(`audioRange${selectedVolume +1}`)

    }
    if (keycontrol.key == '3') {
        event.preventDefault();
        selectedVolume = 2; 
        const volumeSlider = document.getElementById(`audioRange${selectedVolume +1}`)

    }
    if (keycontrol.key == '4') {
        event.preventDefault();
        selectedVolume = 3; 
        const volumeSlider = document.getElementById(`audioRange${selectedVolume +1}`)

    }
    if (selectedVolume != null){
        
        const volumeSlider = document.getElementById(`audioRange${selectedVolume +1}`)
        if (keycontrol.key == 'ArrowLeft') {
            volumeSlider.value = volumeSlider.value -1;

            let volumeChange = new Event('input');
            volumeSlider.dispatchEvent(volumeChange);
            console.log(volumeSlider.value);
            //volumeSlider.dispatchEvent('input');
        }

        if (keycontrol.key == 'ArrowRight') {
            volumeSlider.value = Number(volumeSlider.value) +1;

            let volumeChange = new Event('input');
            volumeSlider.dispatchEvent(volumeChange);
            console.log(volumeSlider.value);
        }

    }   else    {
        console.log("Select track before changing volume.");
    }
});

