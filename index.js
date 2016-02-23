var canvas = document.querySelector('canvas'),
    opt = document.querySelector('#opt'),
    textarea = document.querySelector('textarea'),
    color = document.querySelector('#color'),
    ctx = canvas.getContext('2d');

function Img(url) {
    var img = new Image;
    img.onload = function() {
        var w = document.body.offsetWidth,
            h = document.body.offsetHeight;
        //高之比大于宽之比
        if (this.width > w * .6 || this.height > h * .6) {
            if (this.height / h > this.width / w) {
                this.width  = this.width * h * .6 / this.height;
                this.height = h * .6;
            } else {
                this.height = this.height * w * .6 / this.width;
                this.width  = w * .6;
            }

        }
        canvas.width  = this.width;
        canvas.height = this.height;
        opt.style.height = this.height + 'px';
        ctx.drawImage(this, 0, 0, canvas.width, canvas.height);
    }
    img.src = url;
    return img;
}

var img = Img('demo.jpg');

var data = {
    text: null,
    size: 24,
    textRect: {
        x: 0,
        y: 0,
        w: 0,
        h: 0
    }
}


textarea.addEventListener('input', function() {
    data.text = this.value;
    FillText(data.text);
});

color.addEventListener('change', function() {
    FillText(data.text);
});

function FillText(s) {
    var li = s.split('\n');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.fillStyle = color.value;
    ctx.font = data.size + 'px Consolas';
    ctx.textBaseline = 'top';
    li.forEach(function(e, i, arr) {
        data.textRect.w < ctx.measureText(e).width ?
            data.textRect.w = ctx.measureText(e).width : 0;
        ctx.fillText(e, data.textRect.x, data.textRect.y + i * data.size);
        data.textRect.h = (i + 1) * data.size;
    });
}

Monitor();
function Monitor() {
    var dx, dy,
        down = false;
    canvas.addEventListener('mousemove', function(e) {
        this.className = this.className.replace(' active', '');
        if (e.layerX > data.textRect.x && e.layerX < data.textRect.x + data.textRect.w) {
            if (e.layerY > data.textRect.y && e.layerY < data.textRect.y + data.textRect.h) {
                if (this.className.indexOf('active') === -1) {
                    this.className += ' active';
                }
            }
        }
        if (down) {
            data.textRect.x = e.layerX - dx;
            data.textRect.y = e.layerY - dy;
            FillText(data.text);
        }
    });

    canvas.addEventListener('mousedown', function(e) {
        if (this.className.indexOf('active') !== -1) {
            down = true;
            dx = e.layerX - data.textRect.x;
            dy = e.layerY - data.textRect.y;
        }
    });

    canvas.addEventListener('drop', function(e) {
        e.stopPropagation();
        e.preventDefault();
        if (e.dataTransfer.files[0].type.indexOf('image') !== -1) {
            var reader = new FileReader;
            reader.onload = function(e) {
                img = Img(this.result);
            }
            reader.readAsDataURL(e.dataTransfer.files[0]);
        }
    });
    canvas.addEventListener('dragover', function(e) {
        e.stopPropagation();
        e.preventDefault();
    });

    document.addEventListener('mouseup', function(e) {
        down = false;
    });

}

init();
function init() {
    var i, e;
    var sel = document.querySelector('#font-size');
    for (i = 0; i < 25; i++) {
        e = document.createElement('option');
        i == 12 ? e.selected = 'selected' : 0;
        e.innerHTML = 12 + i;
        sel.appendChild(e);
    }
    sel.addEventListener('change', function(e) {
        data.size = this.selectedOptions[0].value;
        FillText(data.text);
    });
}
