import React, {useState} from 'react';

const FormImage = ({title, setImg}) => {

    const [ imgSrc, setImgSrc ] = useState('');


    const downloadImage = function(event) {
        let target = event.target;

        if (!FileReader) {
            alert('FileReader не поддерживается — облом');
            return;
        }

        if (!target.files.length) {
            alert('Ничего не загружено');
            return;
        }


        setImg(target.files);

        let fileReader = new FileReader();
        fileReader.onload = function() {
            setImgSrc(fileReader.result);
        }

        fileReader.readAsDataURL(target.files[0]);

    }

    return (
        <div>
            <h4>{title}</h4>
            <input onChange={e =>  downloadImage(e)} type="file" id="image-input-style" accept="image/jpeg, image/png, image/jpg"/>
            <div id="display-image-style">
                <img src={imgSrc} alt=""/>
            </div>
        </div>
    );
};

export default FormImage;