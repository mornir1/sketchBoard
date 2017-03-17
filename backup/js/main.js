
 (function () {
    var IDNums = 1;
    var currentID = "shape" + IDNums;
    var colors = ["rgb(251,143,241)", "rgb(26,226,255)", "rgb(255,128,0)","rgb(255,255,55)", "rgb(102,0,204)", "rgb(26,26,255)", "rgb(255,26,26)", "rgb(26,222,26)",];

    var rectangleButton = document.querySelector(".rectangleButton");
    var ovalButton = document.querySelector(".ovalButton");
    var clearButton = document.querySelector(".clearButton");
    var board = document.querySelector(".board");


    board.addEventListener("mousedown", mousedownEventsSort);
    rectangleButton.addEventListener("click", renderShape);
    ovalButton.addEventListener("click", renderShape);
    clearButton.addEventListener("click", clearBoard);


    function mousedownEventsSort(e){
      // e.stopPropagation();
      console.log(e.target.className);
      if (e.target.className === "shape") {
        mousedownShape(e)
      }
      else if (e.target.className === "board") {
        mousedownBoard(e)
      }
      else if (e.target.className === "anchor") {
        mousedownAnchor(e)
      }

    }

     function mousedownShape(e){

      var selectedShape = document.querySelector("#"+ e.target.id);

      var anchorDiv = document.createElement("div");
      anchorDiv.className = "anchor anchor-TL";
      selectedShape.appendChild(anchorDiv);
      
      anchorDiv = document.createElement("div");
      anchorDiv.className = "anchor anchor-TR";
      selectedShape.appendChild(anchorDiv);

      anchorDiv = document.createElement("div");
      anchorDiv.className = "anchor anchor-BL";
      selectedShape.appendChild(anchorDiv);

      anchorDiv = document.createElement("div");
      anchorDiv.className = "anchor anchor-BR";
      selectedShape.appendChild(anchorDiv);


    }

     function mousedownAnchor(e){

    }

    function mousedownBoard(e){

    }

    function clearBoard(){
      // var board = document.querySelector(".board");
      board.innerHTML = '';
    }


    function createColorPalette(colors){
      var colorsPalette =  document.querySelector(".colorsPalette");
      console.log(colorsPalette);
      for (var i = 0; i < colors.length; i++) {
        var colorDiv = document.createElement("div");
        colorDiv.className = "colorDiv";
        colorDiv.style.backgroundColor = colors[i];
        colorsPalette.appendChild(colorDiv);
      }
    }

    createColorPalette(colors);

    function renderShape(e){
      // e.stopPropagation();
      var shapeDiv = document.createElement("div");
      var newShape = new Shape(randomParams()); 
      shapeDiv.id = newShape.id;
      shapeDiv.className = "shape";
      shapeDiv.style.height = newShape.height;
      shapeDiv.style.width = newShape.width;
      shapeDiv.style.top = newShape.x;
      shapeDiv.style.left = newShape.y;
      console.log(e.target.className);
      if (e.target.className === "ovalButton") {
      shapeDiv.style.borderRadius = "50%";
      }
      shapeDiv.style.backgroundColor = newShape.backgroundColor;
      // var board = document.querySelector(".board");
      board.appendChild(shapeDiv);

    }

    function Shape(params){
      this.id = params.newId;
      // this.type = "rectangle";
      this.height = params.height;
      this.width = params.width ;
      this.x = params.x ;
      this.y = params.y;
      this.backgroundColor = params.backgroundColor;
    }

    function randomParams(){
      var params = {
        newId : currentID,
        height :Math.floor(Math.random()*(170)+30) +"px",
        width:Math.floor(Math.random()*(170)+30) +"px",
        x:Math.floor(Math.random()*(170)+30) +"px",
        y:Math.floor(Math.random()*(170)+30) +"px",
        backgroundColor:colors[Math.floor(Math.random() * 8)]
      }
      IDNums++;
      return params;
    }
    
 })();