var stack = [];
var type = [];
var count = [];
var circles = [];
var minRadius;

//Random color method
function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

//Drawing circles
function drawCircles() {
    var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
    for (var i = 0; i < circles.length; i++) {
        context.beginPath();
        context.fillStyle = getRandomColor();
        context.arc(circles[i].x, circles[i].y, circles[i].r, 0, 2 * Math.PI);
        context.fill();
        context.closePath();

        context.beginPath();
        context.font = circles[i].fontSize + "px Arial";
        context.fillStyle = '#000000'
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(type[i], circles[i].x, circles[i].y);
        context.closePath();
    }
}

//Setting circles params.
function setCircles(radiusMultiplier) {
    var circle;
    for (var i = 0; i < type.length; i++) {
        var radius = minRadius + (radiusMultiplier * count[i]);
        circle = { x: 0, y: 0, r: radius, collision: false, fontSize: radius / 2 };
        circles.push(circle);
        setPosition(i);
    }
}

function setMinRadius(_minRadius) {
    minRadius = _minRadius;
}

//Debug: check collisions
function checkAllCollisions() {
    for (var i = 0; i < circles.length; i++) {
        for (var j = 0; j < circles.length; j++) {
            if (i == j) {
                continue;
            }
            if (checkCollision(i, j)) {
                circles[i].collision = true;
            }
        }
    }
}

//Set all circles position in "circles" array
function setCirclesPosition() {
    for (var i = 0; i < circles.length; i++) {
        setCirclePosition(i);
    }
}

//Check a circle position
function setCirclePosition(index) {
    for (var i = 0; i < circles.length; i++) {
        if (i == index) {
            continue;
        }
        if (checkCollision(index, i)) {
            setPosition(index);
            setCirclePosition(index);
        }
    }
}


//Setting a circle position
function setPosition(index) {
    var canvas = document.getElementById("canvas");
    var valueX = (Math.floor(Math.random() * canvas.width));
    var valueY = (Math.floor(Math.random() * canvas.height));
    if ((valueX - circles[index].r) < 0) {
        valueX += circles[index].r;
    }
    else if ((valueX + circles[index].r) > canvas.width) {
        valueX -= circles[index].r;
    }
    if ((valueY - circles[index].r) < 0) {
        valueY += circles[index].r;
    }
    else if ((valueY + circles[index].r) > canvas.width) {
        valueY -= circles[index].r;
    }

    circles[index].x = valueX;
    circles[index].y = valueY;
}


//Checking collision
function checkCollision(circleIndex1, circleIndex2) {
    var circle1 = circles[circleIndex1];
    var circle2 = circles[circleIndex2];


    var dx = (circle1.x) - (circle2.x);
    var dy = (circle1.y) - (circle2.y);
    var distance = Math.floor(Math.sqrt(dx * dx + dy * dy));

    if (distance < circle1.r + circle2.r)
        return true;
    else
        return false;

}

//getting all tag in a stack
function tagStack() {
    var myList = document.getElementsByTagName("*");
    for (var i = 0; i < myList.length; i++) {
        var str = myList[i].tagName;
        stack.push(str.toLowerCase());
    }
}
//preparing tags
function processing() {
    while (stack.length > 0) {
        var item = stack.pop();
        var index;
        for (var i = 0; i < type.length; i++) {
            if (type[i] == item) {
                temp = item;
                index = i;
                break;
            }
        }
        if (type[index] == item) {
            count[i]++;
        }
        else {
            type.push(item);
            count.push(1);
        }
    }
}
//This is load method. Need set minimum circle radius and cirle radius multiplier
function startDrawing(minCircleRadius, circleRadiusMultiplier) {
    tagStack();
    processing();
    setMinRadius(minCircleRadius);
    setCircles(circleRadiusMultiplier);
    try {
        setCirclesPosition();
    } catch (e) {
        alert("Please try with bigger canvas, too many html tag in the site");
    }
    checkAllCollisions();
    writeConsole();
    drawCircles();
}

//write console
function writeConsole() {
    for (var i = 0; i < circles.length; i++) {
        console.log(type[i] + ", count:" + count[i] + ", x:" + circles[i].x + ", y:" + circles[i].y + ", r:" + circles[i].r + ", collision:" + circles[i].collision + ", fontsize:" + circles[i].fontSize);
    }
}
