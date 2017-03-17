
 (function () {
    var IDNums = 1;
    var currentID = "shape" + IDNums;
    var colors = ["rgb(251,143,241)", "rgb(26,226,255)", "rgb(255,128,0)","rgb(255,255,55)", "rgb(102,0,204)", "rgb(26,26,255)", "rgb(255,26,26)", "rgb(26,222,26)",];

    var rectangleButton = document.querySelector(".rectangleButton");
    var ovalButton = document.querySelector(".ovalButton");
    var clearButton = document.querySelector(".clearButton");
    var deleteButton = document.querySelector(".deleteButton");
    var saveButton = document.querySelector(".saveButton");
    var loadButton = document.querySelector(".loadButton");
    var colorsPalette = document.querySelector(".colorsPalette");
    var saveInput = document.querySelector(".saveInput");

    
    var saveLocal = document.querySelector(".saveLocal");
    var loadLocal = document.querySelector(".loadLocal");
    var deleteLocal = document.querySelector(".deleteLocal");
    var saveOverlay =  document.querySelector(".saveOverlay");
    var loadSelect =  document.querySelector(".loadSelect");
    var loadOverlay =  document.querySelector(".loadOverlay");
    var saveX =  document.querySelector(".saveX");
    var loadX =  document.querySelector(".loadX");

    var body = document.querySelector("body");
    var board = document.querySelector(".board");

    var isDragging = false;
    var anchorIsPressed = false;

    var offsetX;
    var offsetY;
    var clientXAnchorPress;
    var clientYAnchorPress;

    var widthWhenAnchorPressed;
    var hightWhenAnchorPressed;

    var selectedShape;
    var selectedAnchor;
    var sideBar = document.querySelector(".sideBar");

    var userSavedWorks = {};

    board.addEventListener("mousedown", mousedownBoard);
    rectangleButton.addEventListener("click", renderShape);
    ovalButton.addEventListener("click", renderShape);
    clearButton.addEventListener("click", clearBoard);
    deleteButton.addEventListener("click", deleteShape);
    loadButton.addEventListener("click", loadBoardBox);
    saveButton.addEventListener("click",saveBoardBox);
    colorsPalette.addEventListener("click",changeColor);
    saveLocal.addEventListener("click",saveLocally);
    loadLocal.addEventListener("click",loadLocally);
    deleteLocal.addEventListener("click",deleteLocally);

    saveX.onclick = function(){
      saveOverlay.style.visibility = "hidden";
    };

    loadX.onclick = function(){
      loadOverlay.style.visibility = "hidden";
    };

    function saveLocally(e){
      e.preventDefault();
      userSavedWorks[saveInput.value] = board.innerHTML;
      localStorage.setItem('records',JSON.stringify(userSavedWorks));
      var option = document.createElement("option"); 
      var textnode = document.createTextNode(saveInput.value);      
      option.appendChild(textnode); 
      option.setAttribute("value", saveInput.value);                
      loadSelect.appendChild(option);
      saveOverlay.style.visibility = "hidden";
    }

    function loadLocally(e){
      e.preventDefault();
      var retrievedRecords = localStorage.getItem('records');
      userSavedWorks = JSON.parse(retrievedRecords);
      board.innerHTML = userSavedWorks[loadSelect.value];
      loadOverlay.style.visibility = "hidden";
    }

    function deleteLocally(e){
      e.preventDefault();
      var retrievedRecords = localStorage.getItem('records');
      userSavedWorks = JSON.parse(retrievedRecords);
      delete userSavedWorks[loadSelect.value];
      localStorage.setItem('records',JSON.stringify(userSavedWorks));
      loadSelect.innerHTML = '';
      for (var key in userSavedWorks) {
        var option = document.createElement("option"); 
        var textnode = document.createTextNode(key);      
        option.appendChild(textnode); 
        option.setAttribute("value", key);                
        loadSelect.appendChild(option);
      }
      loadOverlay.style.visibility = "hidden";
    }

    function changeColor(e){
      if (selectedShape) selectedShape.style.backgroundColor = e.target.style.backgroundColor;
    }

    function saveBoardBox(){
      saveOverlay.style.visibility = "visible";
      saveOverlay.style.opacity = "100";
      saveOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    }

    function loadBoardBox(){
      loadOverlay.style.visibility = "visible";
      loadOverlay.style.opacity = "100";
      loadOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
    }

    // listen for delete button on keyboard
    addEventListener("keydown", function(event) {
      if ((selectedShape)&&(event.keyCode === 46))
      {
        board.removeChild(selectedShape);
      }

    })

    // listen for delete button on menu
    function deleteShape() {
      if (selectedShape) board.removeChild(selectedShape);
    }

    function createAnchor(position, e) {
      selectedShape = e.target;
      var anchorDiv = document.createElement("div");
      anchorDiv.className = "anchor anchor-" + position;
      selectedShape.appendChild(anchorDiv);
      anchorDiv.addEventListener("mousedown", mousedownAnchor);
    }

    function removeAnchors(selectedShape) {
      if (selectedShape) selectedShape.innerHTML = '';
    }

    function mousedownShape(e){
      if (selectedShape) removeAnchors(selectedShape);
      selectedShape = e.target;
      e.stopPropagation();
      createAnchor("TL", e);
      createAnchor("TR", e);
      createAnchor("BL", e);
      createAnchor("BR", e);

      isDragging = true;
      offsetX = e.offsetX;
      offsetY = e.offsetY;
      selectedShape = e.target;
    }


     function mousedownAnchor(e){
      e.stopPropagation();
      anchorIsPressed = true;
      selectedAnchor = e.target;
      clientXAnchorPress = e.clientX;
      clientYAnchorPress = e.clientY;
      widthWhenAnchorPressed = +(selectedShape.style.width.slice(0, -2));
      hightWhenAnchorPressed = +(selectedShape.style.height.slice(0, -2));

    }

    // drag and drop + anchors
    board.onmousemove =  function(e){
      var selectedShapeLeft;

      if (isDragging){
         selectedShapeLeft = +(selectedShape.style.left.slice(0, -2));
        if ((selectedShapeLeft >= 0)&&(e.clientX - offsetX - sideBar.offsetWidth>0)){
          selectedShape.style.top = (e.clientY - offsetY )+"px";
          selectedShape.style.left = (e.clientX - offsetX - sideBar.offsetWidth)+"px";
        }

      }

      if(anchorIsPressed) {
        //offsetX - relative to the object
        //clientX - relative to the viewport

        if (selectedAnchor.className.indexOf("TL") !== -1) {
          selectedShape.style.left = e.clientX - sideBar.offsetWidth +"px"; 
          selectedShape.style.top = e.clientY +"px";
          selectedShape.style.width =  widthWhenAnchorPressed + (clientXAnchorPress - e.clientX)+"px";
          selectedShape.style.height =  hightWhenAnchorPressed + (clientYAnchorPress - e.clientY)+"px";
        }
        else if (selectedAnchor.className.indexOf("TR")!== -1) {
          selectedShape.style.top = e.clientY +"px";
          selectedShape.style.width =  widthWhenAnchorPressed + (e.clientX - clientXAnchorPress)+"px";
          selectedShape.style.height =  hightWhenAnchorPressed + (clientYAnchorPress - e.clientY)+"px";
        }
        else if (selectedAnchor.className.indexOf("BL")!== -1) {
          selectedShape.style.left = e.clientX - sideBar.offsetWidth +"px"; 
          selectedShape.style.width =  widthWhenAnchorPressed + (clientXAnchorPress - e.clientX)+"px";
          selectedShape.style.height =  hightWhenAnchorPressed + (e.clientY - clientYAnchorPress)+"px";
        }
        else if (selectedAnchor.className.indexOf("BR")!== -1) {
          selectedShape.style.width =  widthWhenAnchorPressed + (e.clientX - clientXAnchorPress)+"px";
          selectedShape.style.height =  hightWhenAnchorPressed + (e.clientY - clientYAnchorPress)+"px";
        }
      }
    };

    board.onmouseup = function(){
      isDragging = false;
      anchorIsPressed = false;
    };

    function mousedownBoard(e){
      removeAnchors(selectedShape);
    }

    function clearBoard(){
      board.innerHTML = '';
    }

    function createColorPalette(colors){
      var colorsPalette =  document.querySelector(".colorsPalette");
      for (var i = 0; i < colors.length; i++) {
        var colorDiv = document.createElement("div");
        colorDiv.className = "colorDiv";
        colorDiv.style.backgroundColor = colors[i];
        colorsPalette.appendChild(colorDiv);
      }
    }

    createColorPalette(colors);

    function renderShape(e){
      var shapeDiv = document.createElement("div");
      var newShape = new Shape(generateRandomShape()); 
      shapeDiv.id = newShape.id;
      shapeDiv.className = "shape";
      shapeDiv.style.height = newShape.height;
      shapeDiv.style.width = newShape.width;
      shapeDiv.style.top = newShape.x;
      shapeDiv.style.left = newShape.y;
      if (e.target.className === "ovalButton") {
      shapeDiv.style.borderRadius = "50%";
      }
      shapeDiv.style.backgroundColor = newShape.backgroundColor;
      board.appendChild(shapeDiv);
      shapeDiv.addEventListener("mousedown", mousedownShape);
    }

    function Shape(params){
      this.id = params.newId;
      this.height = params.height;
      this.width = params.width ;
      this.x = params.x ;
      this.y = params.y;
      this.backgroundColor = params.backgroundColor;
    }

    function generateRandomShape(){
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