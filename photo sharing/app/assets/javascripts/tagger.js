function Tagger(id, parent, div_width, div_height, x_coord, y_coord) {
    this.id = id; 
    this.div_height = div_height;
    this.div_width = div_width;
    this.y_coord = y_coord;
    this.x_coord = x_coord; 
    this.image = document.getElementById(parent);
    this.isMouseDown = false;
    this.element = document.getElementById(id);
    var obj = this;
    this.image.onmousedown = function(event) { 
        obj.mouseDown(event)
    }
}

Tagger.prototype.mouseDown = function(event) {
    event.preventDefault();
    this.element.style.width = "1px"; 
    this.element.style.height = "1px"; 
    this.element.style.left = event.pageX + "px";
    this.element.style.top = event.pageY + "px";
    this.originalX = event.pageX - this.image.offsetLeft; 
    this.originalY = event.pageY - this.image.offsetTop;
    console.log(this.originalY); 
    console.log(this.originalX); 
    var obj = this; 
    document.body.onmousemove = function(event) {
        obj.mouseMove(event);
    }
    this.oldUpHandler = document.body.onmouseup;
    document.body.onmouseup = function(event) {
        obj.mouseUp(event);
    }
    this.isMouseDown = true;
}

Tagger.prototype.mouseMove = function(event) {
    var div_width = (event.pageX - this.element.offsetLeft + 1) + "px";
    var div_height = (event.pageY - this.element.offsetTop + 1) + "px"; 
    var currentX = event.pageX - this.image.offsetLeft; 
    var currentY = event.pageY - this.image.offsetTop;
    if (!this.isMouseDown) {
        return;
    }  
    if(event.pageX > (this.image.offsetLeft + this.image.offsetWidth - 4)){
        return; 
    }
    if((event.pageY - this.image.offsetTop + 5) > this.image.offsetHeight) {
        return; 
    }
    if((event.pageY - this.image.offsetTop) <= 0) {
        return; 
    }
    if(event.pageX < this.image.offsetLeft + 2) {
        return; 
    }
    if(currentY < this.originalY && currentX > this.originalX){
        div_height = (this.originalY - currentY) + "px";
        this.element.style.top = (currentY + this.image.offsetTop) + "px"; 
    } 
    if(currentX < this.originalX && currentY > this.originalY) {
        div_width = (this.originalX - currentX) + "px";
        this.element.style.left = (currentX + this.image.offsetLeft) + "px";
    }
    if(currentY < this.originalY && currentX < this.originalX){
        div_height = (this.originalY - currentY) + "px";
        this.element.style.top = (currentY + this.image.offsetTop) + "px"; 
        this.element.style.left = (currentX + this.image.offsetLeft) + "px";
        div_width = (this.originalX - currentX) + "px";
    }
    this.element.style.width =  div_width; //
    this.element.style.height = div_height; //
}


Tagger.prototype.mouseUp = function(event) {
    this.isMouseDown = false;
    document.getElementById(this.div_width).value = this.element.style.width; 
    document.getElementById(this.div_height).value = this.element.style.height; 
    document.getElementById(this.x_coord).value = this.element.style.left; 
    document.getElementById(this.y_coord).value = this.element.style.top; 
}