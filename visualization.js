const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const coordinatesTable = document.getElementById('coordinates-table');

let points = [];
let scale = 1.0;

const visualizationMessage = document.getElementById('visualization-message');

updateVisualizationMessage();

function updateVisualizationMessage() {
    if (points.length === 0) {
        visualizationMessage.innerText = 'Click to add a city';
    } else {
        visualizationMessage.innerText = '';
    }
}

function drawPoints(hoveredPoint = null) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.scale(scale, scale);

    points.forEach(point => {
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10 / scale, 0, Math.PI * 2);
        if(point === hoveredPoint) {
            ctx.fillStyle = 'red';
        }
        else{
            if (localStorage.getItem('theme') === 'light'){
                ctx.fillStyle = 'black';
            }
            else{
                ctx.fillStyle = 'white';
            }
            
        }
        ctx.fill();
        ctx.closePath();
    });

    ctx.restore();

    if (bestRoute.length > 0) {
        drawRoute(bestRoute);
    }
}

function clearAllPoints() {
    points = [];
    cities = [];

    const rows = coordinatesTable.querySelectorAll('tr');
    rows.forEach((row, index) => {
        if (index > 0) {
            row.remove();
        }
    });

    drawPoints();
    updateVisualizationMessage();

    population = [];
    generation = 0;
}



function drawRoute(route) {
    if (!route || route.length === 0) return;

    ctx.save();
    ctx.scale(scale, scale);

    ctx.beginPath();
    ctx.moveTo(route[0].x, route[0].y);

    for (let i = 1; i < route.length; i++) {
        ctx.lineTo(route[i].x, route[i].y);
    }

    ctx.lineTo(route[0].x, route[0].y);
    if(localStorage.getItem('theme') === 'light') {
        ctx.strokeStyle = '#000000';
    }
    else{
        ctx.strokeStyle = '#ffffff';
    }
    ctx.lineWidth = 2 / scale;
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
}

function displayCoordinates(x, y) {
    ctx.save();
    ctx.scale(1 / scale, 1 / scale);
    ctx.fillStyle = 'lightblue';
    ctx.font = '16px Roboto';
    ctx.fillText(`(${x.toFixed(2)}, ${y.toFixed(2)})`, x * scale + 10, y * scale - 15);
    ctx.restore();
}

canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = (event.clientX - rect.left) / scale;
    const mouseY = (event.clientY - rect.top) / scale;

    let pointToRemove = null;

    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
        
        if (distance < 10 / scale) {
            pointToRemove = i;
            break;
        }
    }

    if (pointToRemove !== null) {
        points.splice(pointToRemove, 1);

        coordinatesTable.deleteRow(pointToRemove + 1);

        drawPoints();
        updateVisualizationMessage();
    } else {
        points.push({ x: mouseX, y: mouseY });

        const newRow = coordinatesTable.insertRow();
        newRow.insertCell(0).textContent = mouseX;
        newRow.insertCell(1).textContent = mouseY;

        drawPoints();
        updateVisualizationMessage();
    }
});

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();

    const mouseX = (event.clientX - rect.left) / scale;
    const mouseY = (event.clientY - rect.top) / scale;

    let hoveredPoint = null;
    points.forEach(point => {
        const distance = Math.sqrt((mouseX - point.x) ** 2 + (mouseY - point.y) ** 2);
        if (distance < 10 / scale) {
            hoveredPoint = point;
        }
    });

    drawPoints(hoveredPoint);

    if (hoveredPoint) {
        displayCoordinates(hoveredPoint.x, hoveredPoint.y);
    }
});

function zoomIn() {
    scale *= 1.2;
    drawPoints();
}

function zoomOut() {
    scale /= 1.2;
    drawPoints();
}

document.getElementById('zoom-in').addEventListener('click', zoomIn);
document.getElementById('zoom-out').addEventListener('click', zoomOut);

function resizeCanvas() {
    const visualizationDiv = document.querySelector('.visualization');
    canvas.width = visualizationDiv.clientWidth - 40; 
    canvas.height = visualizationDiv.clientHeight - 40;
    drawPoints();
}

window.addEventListener('resize', resizeCanvas);

resizeCanvas();