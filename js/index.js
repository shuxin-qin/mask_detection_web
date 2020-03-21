
const id2class = {0:"有口罩", 1:"无口罩"};
let model;
//const webcam = document.getElementById('webcam');

let video;
// 初始化函数
async function setup() {
    await loadModel();
  
    try {
        video = await loadVideo();
    } catch (e) {
        throw e;
    }
    detectFace(video);
}

async function detectFace(video) {
    while (true) {
        
        boxes = await detect(video);
        // alert(boxes);
        clearRects();
        for(bboxInfo of boxes) {
            bbox = bboxInfo[0];
            classID = bboxInfo[1];
            score = bboxInfo[2];
            //console.log(bbox[0], bbox[1], bbox[2], bbox[3], classID);
            drawRect(bbox[0], bbox[1], bbox[2]-bbox[0], bbox[3]-bbox[1], classID, score);
        };

        await tf.nextFrame();
    }
}

const webcamElem = document.getElementById('webcam-wrapper');

function drawRect(x, y, w, h, classID, score) {
    const rect = document.createElement('div');
    rect.classList.add('rect');
    rect.style.left = x+"px";
    rect.style.top = y+"px";
    rect.style.width = w+"px";
    rect.style.height = h+"px";
    rect.style.position = "absolute";
    
    if (classID == 0) {
        rect.style.border = 3+"px solid #00FF00";
    }
    else {
        rect.style.border = 3+"px solid #FF0000";
    }
    className = id2class[classID];
    text = className + " (" + Math.round(score*100) + "%)";
    const label = document.createElement('div');
    label.classList.add('label');
    label.innerText = text;
    label.style.cssText = "background: rgba(255, 255, 255, 0.2);";
    rect.appendChild(label);

    webcamElem.appendChild(rect);
}

function clearRects() {
    const rects = document.getElementsByClassName('rect');
    while(rects[0]) {
        rects[0].parentNode.removeChild(rects[0]);
    }
}

const videoWidth = 640;
const videoHeight = 480;
async function setupCamera() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
    }

    const video = document.getElementById('webcam');
    video.width = videoWidth;
    video.height = videoHeight;

    const stream = await navigator.mediaDevices.getUserMedia({
        'audio': false,
        'video': {
            facingMode: 'user',
            width: videoWidth,
            height: videoHeight,
        },
    });
    video.srcObject = stream;

    return new Promise((resolve) => {
        video.onloadedmetadata = () => {
            resolve(video);
        };
    });
}

async function loadVideo() {
    const video = await setupCamera();
    video.play();
    return video;
}

setup();