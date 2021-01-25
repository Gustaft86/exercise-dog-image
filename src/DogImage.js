import React from 'react';
import './App.css';

class DogImage extends React.Component {
  constructor() {
    super();

    this.state = {
      dogImage: {
        imageId: undefined,
        imagePath: undefined,
        pathArray: [],
      },
      loading:  true,
      storedImagesDog: [],
    }

    this.dogImageElement=this.dogImageElement.bind(this);
    this.saveDogImage=this.saveDogImage.bind(this);
    this.fetch=this.fetch.bind(this);
  }

  async fetchDog() {
    console.log("fetchDog");
    this.setState(
      { loading: true },
      () => this.fetch()
    )
  }

  async fetch() {
    const requestReturn = await fetch('https://dog.ceo/api/breeds/image/random');
    const requestObject = await requestReturn.json();

    const imagePath = requestObject.message;
    const pathArray = imagePath.split('/');
    const imageId = pathArray[pathArray.length - 1];

    this.setState({ 
      dogImage: {
        imageId,
        imagePath,
        pathArray,
      },
      loading: false,
    })
  }

  componentDidMount() {
    console.log("componentDidMount")
    this.fetchDog()
  }

  shouldComponentUpdate(nextProps, { dogImage: { imagePath } }) {
    console.log("shouldComponentUpdate");
    if (imagePath) {
      if (imagePath.includes("terrier")) {
        this.fetch();
        return false;
      }
    }
    return true;
  }

  componentDidUpdate() {
    console.log("componentDidUpdate");
    const { imagePath } = this.state.dogImage;
    if(imagePath) {
    localStorage.setItem("dogURL", imagePath);
    const dogBreed = imagePath.split("/")[4];
    alert(dogBreed);
    }
  }

  saveDogImage() {
    console.log("saveDogImage");
    this.setState(({ dogImage, storedImagesDog }) => ({
      storedImagesDog: [...storedImagesDog, dogImage]
    }))
    this.fetchDog();
  }


  dogImageElement() {
    console.log("dogImageElement");
    const { imageId, imagePath } = this.state.dogImage;
      return (
      <div className="elements">
        <img src={ imagePath } alt={ imageId } />
        <button type="button" onClick={this.saveDogImage}>
          Salvar foto!
        </button>
      </div>
    );
  }


  render() {
    console.log("render()");
    const { loading, storedImagesDog } = this.state;
    
    const loadingElement = <span>Loading...</span>;

    return (
      <div className="elements"> 
        {storedImagesDog.map(({ imagePath, imageId }) => (
            <img src={ imagePath } alt={ imageId } key={ imageId } />
          )
        )}
        { loading ? loadingElement : this.dogImageElement() }
      </div>
    );
  }
} 

export default DogImage;
