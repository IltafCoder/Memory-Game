
// all necessary variables

var click_count = 0
var all_images = []
var all_images_shuffled = []
var matrix = []

var r_odd = 0
var c_odd = 0
var r_even = 0
var c_even = 0
var temp_card = ""

var pointer_even = []
var pointer_odd = []

var countdownInterval;
var win_condition = false

// all music files
const bg_music = new Audio("./bg_music.mp3")
bg_music.volume = 0.2
const click_sound = new Audio("./click.mp3")

document.addEventListener("DOMContentLoaded", () => {

    startTimer()

    // create an empty array
    for (let i = 1; i <= 8; i++) {
        all_images.push(`./Images/${i}.png`)
    }

    // double the elements in array
    all_images = all_images.concat(all_images)

    // shuffle the array
    all_images_shuffled = shuffleArray(all_images)

    // covert it to matrix
    matrix = convertToMatrix(all_images_shuffled, 4, 4)

    let container = document.getElementsByClassName("game-board")
    let r = 0
    let c = 0

    // set row and column number to each card
    matrix.map((row) => {

        row.map((block) => {

            let y = document.createElement("div")
            y.setAttribute("data-image", `url(${block})`)
            y.dataset.value = `${r} ${c}`
            container[0].appendChild(y)
            if (c < 3) {
                c += 1
            }
            else {
                c = 0
            }

        })
        r += 1
    })

    // plays music and shows image on each card
    let data = Array.from(document.querySelectorAll(".game-board div"))
    data.forEach((e) => {
        e.addEventListener("click", () => {
            bg_music.play()
            showImages(e)
        })
    })

    // this resets the game by refreshing the page
    const reset_game = document.querySelector("button")
    reset_game.addEventListener("click", () => {
        location.reload()
    })

})

// method to shuffle an array
const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// method to convert a list to matrix
const convertToMatrix = (array, rows, cols) => {
    let matrix = [];
    for (let i = 0; i < rows; i++) {
        matrix.push(array.slice(i * cols, (i + 1) * cols));
    }
    return matrix;
}

const showImages = (e) => {

    // plays the click sound effect
    click_sound.play()
    e.style.backgroundImage = e.getAttribute("data-image")

    let first_try = e.dataset.value
    let nums = first_try.split(" ")

    // when the click count is an odd number
    if (click_count % 2 !== 0) {
        let r = nums[0]
        let c = nums[1]
        pointer_odd = [r, c]
        r_odd = matrix[r]
        c_odd = r_odd[c]

        // when the user clicks the same card twice
        if (pointer_even[0] === pointer_odd[0] && pointer_even[1] === pointer_odd[1]) {
            return
        }

        // when the two card matches
        if (c_odd === c_even) {
            e.dataset.value += " matched"

            let data = Array.from(document.querySelectorAll(".game-board div"))

            for (let i = 0; i < data.length; i++) {
                if (data[i].dataset.value.includes("matched")) {
                    win_condition = true
                }
                else {
                    win_condition = false
                    break
                }
            }
            if (win_condition) {
                // if the user wins
                countdownTime = 0
                const win_msg = document.querySelector(".timer p")
                document.querySelector(".game-board").style.display = "none"
                win_msg.textContent = "You Won!"
                const i = document.querySelector(".timer i")
                win_msg.style.margin = "20px"
                win_msg.style.fontSize = "3rem"
                win_msg.style.width = "300px"
                win_msg.style.textAlign = "center"
                i.remove()
                clearInterval(countdownInterval)
            }

        }
        else {
            // when the click count is an even number
            temp_card.dataset.value = temp_card.dataset.value.replace(" matched", "")
            hideAllImages()
        }
    }
    else {
        // when card do not match
        e.dataset.value += " matched"
        temp_card = e
        let r = nums[0]
        let c = nums[1]
        pointer_even = [r, c]
        r_even = matrix[r]
        c_even = r_even[c]
    }

    // increments the click count
    click_count += 1

}

const hideAllImages = () => {

    let data = Array.from(document.querySelectorAll(".game-board div"))

    // remove all attached event listeners
    data.forEach((x) => {
        let n = x.cloneNode(true)
        x.parentNode.replaceChild(n, x)

    })

    setBackground()
}

const setBackground = () => {

    // this method removes the images and sets a plain background for each card

    let data = Array.from(document.querySelectorAll(".game-board div"))

    setTimeout(() => {
        data.forEach((e) => {
            if (!e.dataset.value.includes("matched")) {
                e.style.backgroundImage = ""
            }
        })
    }, 500)

    setTimeout(() => {
        data.forEach((e) => {
            e.addEventListener("click", () => {
                showImages(e)
            })
        })
    }, 500)

}

const startTimer = () => {

    // set the countdown time in seconds
    var countdownTime = 80
    var m2 = Math.floor(countdownTime / 60)
    var s2 = countdownTime % 60
    total_mins = m2
    total_secs = s2

    const updateCountdown = () => {

        current_count_down = countdownTime
        var minutes = Math.floor(countdownTime / 60)
        var seconds = countdownTime % 60;

        // display the time in the format MM:SS
        let display = document.querySelector(".timer p")
        display.textContent = padZero(minutes) + ':' + padZero(seconds)

        if (countdownTime > 0) {
            countdownTime-- // decrease the countdown time
        } 
        else {
            // when timer is over
            display.textContent = "Game Over!"
            const data = document.querySelector(".game-board")
            const p = document.querySelector(".timer p")
            const i = document.querySelector(".timer i")
            p.style.color = "red"
            p.style.margin = "20px"
            p.style.fontSize = "3rem"
            p.style.width = "300px"
            p.style.textAlign = "center"
            i.remove()
            data.style.display = "none"
            clearInterval(countdownInterval)
        }
    }

    // initial call to set the initial display
    updateCountdown()

    // set up the timer to update the countdown every second
    countdownInterval = setInterval(updateCountdown, 1000)
}

// method to add zero's to the timestamp
const padZero = (value) => {
    return value < 10 ? '0' + value : value
}