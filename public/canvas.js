
let canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


let mouseDown = false;

let pencilColor = document.querySelectorAll(".pencil-color");
let pencilWidthElem = document.querySelector(".pencil-width");
let eraserWidthElem = document.querySelector(".eraser-width");
let download = document.querySelector(".download");
let redo = document.querySelector(".redo");
let undo = document.querySelector(".undo");

let penColor = "red";
let eraserColor = "white";
let penWidth = pencilWidthElem.value;
let eraserWidth = eraserWidthElem.value;


let undoRedoTracker = []; //Data
let track = 0; 
let tool = canvas.getContext("2d");

tool.strokeStyle = penColor;
tool.lineWidth = penWidth;

canvas.addEventListener("mousedown" , (e)=>{
    mouseDown = true;

    let data = {
        x : e.clientX,
        y : e.clientY
    }
    socket.emit("beginPath" , data);
})

canvas.addEventListener("mousemove" , (e)=>{
    if(mouseDown){

        let data = {
            x : e.clientX,
            y : e.clientY,
            color: eraserFlag ? eraserColor : penColor,
            width: eraserFlag ? eraserWidth : penWidth
        }
        socket.emit("drawstroke" , data);
    }
    
})

canvas.addEventListener("mouseup" , (e)=>{
    mouseDown = false; 

    let url = canvas.toDataURL();
    undoRedoTracker.push(url);
    track = undoRedoTracker.length-1;

})

undo.addEventListener("click" , (e)=>{
    if(track > 0){
        track--;
    }

    let data = {
        trackvalue: track,
        undoRedoTracker
    }
    socket.emit("undoredocanvas", data);
})

redo.addEventListener("click" , (e)=>{
    if(track < undoRedoTracker.length-1){
        track++;
    }
    let data = {
        trackvalue: track,
        undoRedoTracker
    }
    socket.emit("undoredocanvas", data);
})

function undoredocanvas(trackobj){

    track = trackobj.trackvalue;
    undoRedoTracker = trackobj.undoRedoTracker;
    
    let url = undoRedoTracker[track];
    let img = new Image();
    img.src = url;
    img.onload = (e) => {
        tool.drawImage(img,0,0,canvas.width , canvas.height);
    }
}

function beginPath(strokeobj){
    tool.beginPath();
    tool.moveTo(strokeobj.x , strokeobj.y);
}

function drawstroke(strokeobj){
    tool.strokeStyle = strokeobj.color;
    tool.lineWidth = strokeobj.width;
    tool.lineTo(strokeobj.x, strokeobj.y);
    tool.stroke();
}

pencilColor.forEach((colorelem) => {
    colorelem.addEventListener("click" , (e)=>{
        let color = colorelem.classList[0];
        penColor = color;
        tool.strokeStyle = penColor;
    })
})

pencilWidthElem.addEventListener("change" , (e)=>{
    penWidth = pencilWidthElem.value;
    tool.lineWidth = penWidth;
})
eraserWidthElem.addEventListener("change" , (e)=>{
    eraserWidth = eraserWidthElem.value;
    tool.lineWidth = eraserWidth;
})

eraser.addEventListener("click" , (e)=>{
    if(eraserFlag){
        tool.strokeStyle = eraserColor;
        tool.lineWidth = eraserWidth
    }
    else{
        tool.strokeStyle = penColor;
        tool.lineWidth = penWidth;
    }
})

download.addEventListener("click" , (e)=>{


    let url = canvas.toDataURL();
    let a = document.createElement("a");
    a.href = url;
    a.download = "board.jpg";
    a.click();
})

socket.on("beginPath" , (data)=>{

    beginPath(data);
})
socket.on("drawstroke" , (data)=>{

    drawstroke(data);
})
socket.on("undoredocanvas", (data) => {
    undoredocanvas(data);
})