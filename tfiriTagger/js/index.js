var labelList = [];
var fileSpecs = {};
var c = document.getElementById("canvasImg");
var ctx = c.getContext("2d");
var image = new Image();
var emptyTag = false;

$(document).ready(function(){
	loadSaveButton();
	$("#btn_save").on("click", saveXML);
});

$(document).click(loadSaveButton);

function handleFiles(input) {
	var imageUploader = $("#div_imageUploader");

	labelList = [];
	imageUploader.addClass("d-none");
	fileSpecs ={name:  input[0].name,
				width: "",
				height:""};

	$("#nav_upload").removeClass("active");
	$("#nav_upload").addClass("disabled");
	$("#nav_tag").removeClass("disabled");
	$("#nav_tag").addClass("active");
	drawInCanvas(input[0]);
}

function drawInCanvas(uploadedImg) {
	var label = {};
  	
  	var clicked = false;
  	var fPoint = {};
  	var idTagCounter = 1;

  	setInterval(redraw, 30);

  	image.onload = function(e) {
    	ctx.canvas.width = image.width;
        ctx.canvas.height = image.height;
        c.width = image.width;
        c.height = image.height;
        ctx.drawImage(image, 0, 0);
  	};

  	image.style.display="block";
  	
	assignFile2Image(uploadedImg, image);

  	c.onclick = function(e) {
    	var x = (image.width / c.scrollWidth) * e.offsetX;
       	var y = (image.height / c.scrollHeight) * e.offsetY;
       	if (!labelList.length == 0) {
       		emptyTag = checkEmptyLabel(label.id);
       	}
    	// First click, the first point was placed
    	if (!emptyTag) {
    		if (!clicked) {
	        	ctx.strokeStyle = "pink";
	        	ctx.fillStyle = "pink";
	        	ctx.beginPath();
	        	ctx.arc(x, y, 3, 0, 2*Math.PI, false);
	        	ctx.fill();
	        	fPoint = {
	          		x: x,
	          		y: y
	        	};
	        // Second click, the second point was placed, now we can draw
	    	} else {
	            var xMin;
	            var xMax;
	            var yMin;
	            var yMax;
	            if (x > fPoint.x) {
	            	xMax = x;
	                xMin = fPoint.x;
	            } else {
	                xMax = fPoint.x;
	                xMin = x;
	            }
	            if (y > fPoint.y) {
	              	yMax = y;
	              	yMin = fPoint.y;
	            } else {
	              	yMax = fPoint.y;
	              	yMin = y;
	            }


	            fPoint = {};
	            // Adds the coordinates to create a new label
	            label ={name: "", 
	            		id:   idTagCounter,
	            		xMin: Math.trunc(xMin),
	            		xMax: Math.trunc(xMax), 
	            		yMin: Math.trunc(yMin), 
	            		yMax: Math.trunc(yMax)};
	            idTagCounter += 1;
	            drawLabels(label, ctx);
	            emptyTag = true;
	            label = assignLabelName(label);
	            labelList.push(label);
	    	}
	    	clicked = !clicked;
    	}
  	};
}


function drawLabels(label, context) {
    var name = label.name;
	var xMin = label.xMin;
	var xMax = label.xMax;
	var yMin = label.yMin;
	var yMax = label.yMax;

	context.strokeStyle = "#00ff00";
    context.fillStyle = "#00ff00";
    context.rect(xMin, yMin, xMax - xMin, yMax - yMin);
    context.lineWidth="3";
    context.stroke();
    context.font = "10px Arial";
	//context.fillText("id: " + id, xMin,yMin);
}

function assignFile2Image(file, image) {
	if (file){
		var reader = new FileReader();

	    reader.onload = function (e) {
	    	image.src = e.target.result;
	    };
	    reader.readAsDataURL(file);
	}
}

function assignLabelName(label) {
	var tagListContainer = $("#div_tags");
	var tag = "";
	var id = label.id;
	tag = '<div class="row label">';
		tag += '<input id="'+ id +'" type="text" class="form-control col-md-8" id="0" placeholder="Etiqueta">';
		tag += '<button class="btn btn-primary col-md-2" id="btn_register" onclick="editLabel('+ id +')"><i class="fas fa-edit"></i></button>';
		tag += '<button class="btn btn-secondary col-md-2 d-none" id="btn_register" onclick="deleteLabel('+ id +')"><i class="fas fa-trash-alt"></i></button>';
	tag += '</div>',
	tagListContainer.append(tag);
	return label;
}

function editLabel(tagID) {
	var index;
	var txbContent = $("#"+tagID).val();

	index = searchLabelid(tagID, labelList);
	labelList[index].name = txbContent;

	checkEmptyLabel(tagID);
}

function deleteLabel(tagID) {
	var divLabel = $("#"+tagID).parent();

	index = searchLabelid(tagID, labelList);
	labelList.splice(index,1);
	divLabel.remove();
}

function searchLabelid(id, labelList) {
	for (var i = 0; i < labelList.length; i++) {
		if(labelList[i].id == id) {
			return i;
		}
	}
}

function redraw() {
	clearCanvas(c, ctx);
	loadImage();
	for (var i = 0; i < labelList.length; i++){
       	drawLabels(labelList[i], ctx);
   	}

}

function clearCanvas(canvas, context) {
	context.clearRect(0, 0, canvas.width, canvas.height);
}

function loadImage() {
	ctx.canvas.width = image.width;
    ctx.canvas.height = image.height;
    c.width = image.width;
    c.height = image.height;
    fileSpecs.width = image.width;
    fileSpecs.height = image.height;
   	ctx.drawImage(image, 0, 0);
}

function checkEmptyLabel(tagID) {
	var txbContent = $("#"+tagID);
	var btnDeleteLabel = txbContent.next().next();
	index = searchLabelid(tagID, labelList);

	if ( labelList.length == 0) {
		return false;
	} else {
		if (txbContent.val() == "" || labelList[index].name == "") {
			txbContent.addClass("is-invalid");
			btnDeleteLabel.addClass("d-none");
			return true
		} else {
			txbContent.removeClass("is-invalid");
			btnDeleteLabel.removeClass("d-none");
			return false;
		}
	}
}

function loadSaveButton () {
	if(labelList.length != 0 && !hasEmptyValues()) {
		$("#btn_save").removeClass("d-none");
	} else {
		$("#btn_save").addClass("d-none");
	}
}

function hasEmptyValues() {
	if(labelList.length != 0) {
		for(var i = 0; i < labelList.length; i++) {
			if (labelList[i].name == "") {
				return true;
			}
		}
		return false;
	}
}

function saveXML() {
  	var text = "";
  	var name = "tags";

  	text = "<annotation>";
  	text += "<folder>test</folder>";
  	text += "<filename>"+ fileSpecs.name +"</filename>";
  	text += "<path>C:/</path>";
  	text += "<source><database>Unknown</database></source>";

  	text += "<size>";
  		text += "<width>"+ fileSpecs.width +"</width>";
  		text += "<height>"+ fileSpecs.height +"</height>";
  		text += "<depth>3</depth>";
	text += "</size>";

	text += "<segmented>0</segmented>";

	for (var i = 0; i < labelList.length; i++) {
		text += "<object>";
			text += "<name>"+ labelList[i].name +"</name>";
			text += "<pose>Unspecified</pose>";
			text += "<truncated>0</truncated>";
			text += "<difficult>0</difficult>";
			text += "<bndbox>";
				text += "<xmin>"+ labelList[i].xMin +"</xmin>";
				text += "<ymin>"+ labelList[i].yMin +"</ymin>";
				text += "<xmax>"+ labelList[i].xMax +"</xmax>";
				text += "<ymax>"+ labelList[i].yMax +"</ymax>";
			text += "</bndbox>";
		text += "</object>";
	}

  	text += "</annotation>";

  	var a = document.getElementById("downloader");
  	var file = new Blob([text], {type: "text/xml"});
  	a.href = URL.createObjectURL(file);
  	a.download = name;
}