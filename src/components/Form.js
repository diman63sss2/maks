import React, {useCallback, useRef, useState} from 'react';
import axios from "axios";

const Form = () => {
    const UPLOAD_AVATAR = 'http://localhost:8080/api/upload_avatar';
    const fileRef = useRef(null);
    const [ imgUrl1, setImgUrl1 ] = useState('');
    const [ imgUrl2, setImgUrl2 ] = useState('');
    const [ imgUrl1Front, setImgUrl1Front ] = useState('');
    const [ imgUrl2Front, setImgUrl2Front ] = useState('');
    const [ answer, setAnswer ] = useState(null);
    const [ loading, setLoading ] = useState(false);


    const myImgonChange1 = function(event) {
        let target = event.target;

        if (!FileReader) {
            alert('FileReader не поддерживается — облом');
            return;
        }

        if (!target.files.length) {
            alert('Ничего не загружено');
            return;
        }

        setImgUrl1(target.files);

        let fileReader = new FileReader();
        fileReader.onload = function() {
            setImgUrl1Front(fileReader.result);
        }

        fileReader.readAsDataURL(target.files[0]);
    }

    const myImgonChange2 = function(event) {
        let target = event.target;

        if (!FileReader) {
            alert('FileReader не поддерживается — облом');
            return;
        }

        if (!target.files.length) {
            alert('Ничего не загружено');
            return;
        }


        setImgUrl2(target.files);

        let fileReader = new FileReader();
        fileReader.onload = function() {
            setImgUrl2Front(fileReader.result);
        }

        fileReader.readAsDataURL(target.files[0]);

    }

    let url = 'http://localhost:8080/api/receive/VGG19';
    let uidRequest = '';

    const handleSubmit = async(event) => {
        event.preventDefault()
        let fileOriginal = imgUrl1[0];
        let fileStyle = imgUrl2[0];
        console.log(fileOriginal)
        console.log(fileStyle)
        const formData = new FormData();
        formData.append("original_image", fileOriginal);
        formData.append("style_image", fileStyle);
        axios
            .post("http://localhost:8080/api/receive/VGG19", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((res) => {
                uidRequest = res.data;
                console.log(uidRequest)
                successfulPost(uidRequest);

            })
            .catch((err) => {
                console.log(err);
            });
    }

    const successfulPost = async() =>  {
        // повторить с интервалом 2 секунды
        let timerId = setInterval(() => {
            axios
                .get('http://localhost:8080/api/receive/VGG19/' + uidRequest.toString())
                .then((res) => {
                    console.log(res)
                    console.log(res.data)
                })
                .catch((err) => {
                    console.log(err);
                });
            if(true){
                clearInterval(timerId);
            }
        }, 2000);

    }


    return (
        <form id="form" method="post"  onSubmit={handleSubmit}>
            <input onChange={e =>  myImgonChange1(e)} type="file" id="image-input-to-style" accept="image/jpeg, image/png, image/jpg"/>
            <div id="display-image-to-style">
                <img src={imgUrl1Front} alt=""/>
            </div>
            <h4>Upload style image</h4>
            <input onChange={e =>  myImgonChange2(e)} type="file" id="image-input-style" accept="image/jpeg, image/png, image/jpg"/>
            <div id="display-image-style">
                <img src={imgUrl2Front} alt=""/>
            </div>
            <button id="submit">
                Отправить
            </button>
        </form>
    );
};

export default Form;