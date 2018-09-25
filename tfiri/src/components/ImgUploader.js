import React, { Component } from 'react';
import '../App.css';


class ImgUploader extends Component {
	constructor(props) {
		super(props);
		this.handleImages = this.handleImages.bind(this);
		this.state = {selectedFile: null};
	}


	handleImages(event) {
		this.setState({
			selectedFile: event.target.files[0]
		}, () => {this.props.uploadedImg(this.state.selectedFile)});
		
	}

	render() {
		return(
			<div>
				<input	type="file"
						accept="image/*"
						onChange={this.handleImages}/>
        	</div>
        );
	}
}

export default ImgUploader;