import React, { Component } from 'react';
import '../App.css';

import ImgUploader from './ImgUploader';

class Toolbar extends Component {

	state = {selectedFile: null}

	handleUploadedImg = (imgPath) => {
	  this.setState({selectedFile: imgPath}, () => {
	  	this.props.uploadedImg(this.state.selectedFile);
	  })
	}

	render() {
		return(
			<div>
				<nav className="navbar navbar-expand-sm bg-light">
					<ul className="navbar-nav">
						
						<li className="nav-item">
							<a className="nav-link" href="">Upload Image</a>
						</li>
						
						<li className="nav-item">
							<a className="nav-link" href="">Tag Image</a>
						</li>

						<li className="nav-item">
							<a className="nav-link" href="">Save Tags</a>
						</li>
					</ul>
				</nav>
				<ImgUploader uploadedImg={this.handleUploadedImg}/>
        	</div>
        );
	}
}

export default Toolbar;