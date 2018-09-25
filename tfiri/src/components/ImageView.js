import React, { Component } from 'react';
import '../App.css';

class ImageView extends Component {
	constructor(props) {
		super(props);
		this.imgRef = React.createRef();
	}

	loadImage(uploadedImg){
		var imageViewer = this.imgRef.current;
		console.log(uploadedImg);
		if (uploadedImg){
			var reader = new FileReader();

		    reader.onload = function (e) {
		    	imageViewer.src = e.target.result;
		    };

		    reader.readAsDataURL(uploadedImg);
		}
	}

	componentDidMount() {
		this.loadImage(this.props.uploadedImg);
	}

	render() {

		var uploadedImg = this.props.uploadedImg;

		return(
			<div>
				<img ref={this.imgRef} src="/"/>
				IMAGEN
        	</div>
		);
	}
}

export default ImageView;