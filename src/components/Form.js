import React, {useCallback, useRef, useState} from 'react';
import axios from "axios";

const Form = () => {
    const UPLOAD_AVATAR = 'http://localhost:8080/api/upload_avatar';
    const fileRef = useRef(null);
    const [ imgUrl1, setImgUrl1 ] = useState('');
    const [ imgUrl2, setImgUrl2 ] = useState('');
    const [ imgUrl1Front, setImgUrl1Front ] = useState('');
    const [ imgUrl2Front, setImgUrl2Front ] = useState('');
    const [ result, setResult ] = useState(null);
    const [ uuid, setUuid ] = useState(null);
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
                console.log('uidRequest')
                console.log(uidRequest)
                console.log('uidRequest.toString()')
                console.log(uidRequest.toString())
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
                .get('http://localhost:8080/api/receive/VGG19/' + uidRequest.uuidRequest)
                .then((res) => {
                    let resData = res.data
                    console.log(res)
                    console.log(res.data)
                    console.log(resData.isDone)
                    console.log(resData.description)
                    if(resData.description === 'Error has happened during image processing' ){
                        clearInterval(timerId);
                        alert('ПИТОН ЗАДУШИЛ САМ СЕБЯ');
                    }else if(resData.description === 'This request is not exist'){
                        alert('ТЫ КУДА ДОЛБИШЬСЯ?!!! ТУТ ЗАНЯТО, НАС НЕТ, ОБЕД ДО ОБЕДА')
                        clearInterval(timerId);
                    }else if(resData.isDone === true){
                        console.log('Изображения готовы')
                        clearInterval(timerId);
                    }else{
                        console.log('ЖДЕМ ПОКА ЗМЕЯ дУшиться')
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        }, 10000);

    }

    let url500 = 'http://localhost:8080/api/getoutput/VGG19/500/';
    let url1000 = 'http://localhost:8080/api/getoutput/VGG19/1000/';
    let url1500 = 'http://localhost:8080/api/getoutput/VGG19/1500/';
    let url2000 = 'http://localhost:8080/api/getoutput/VGG19/2000/';
    async function requests500(){
        axios
            .get(url500 + uidRequest.uuidRequest)
            .then((res) => {
                let resData = res.data
                console.log('500')
                console.log(res)
                console.log(resData)
                setResult(resData)

            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function requests1000(){
        axios
            .get(url1000 + uidRequest.uuidRequest)
            .then((res) => {
                let resData = res.data
                console.log('1000')
                console.log(res)
                console.log(resData)
                setResult(resData)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function requests1500(){
        axios
            .get(url1500 + uidRequest.uuidRequest)
            .then((res) => {
                let resData = res.data
                console.log('1500')
                console.log(res)
                console.log(resData)
                setResult(resData)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function requests2000(){
        axios
            .get(url2000 + uidRequest.uuidRequest)
            .then((res) => {
                let resData = res.data
                console.log('2000')
                console.log(res)
                console.log(resData)
                setResult(resData)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    const Example = (data) => <img src={`data:image/png;base64,${data}`} />


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
            <input onChange={e =>  setUuid(e.target.value)} type="text" />
            {uuid}
            <div onClick={requests500}>
                -------------------
                <br/>
                <br/>
                <br/>
                500
                <br/>
                <br/>
                <br/>
                -------------------
            </div>
            <div onClick={requests1000}>
                -------------------
                <br/>
                <br/>
                <br/>
                1000
                <br/>
                <br/>
                <br/>
                -------------------
            </div>
            <div  onClick={requests1500}>
                -------------------
                <br/>
                <br/>
                <br/>
                1500
                <br/>
                <br/>
                <br/>
                -------------------
            </div>
            <div  onClick={requests2000}>
                -------------------
                <br/>
                <br/>
                <br/>
                2000
                <br/>
                <br/>
                <br/>
                -------------------
            </div>
            <div>
                {Example(result)}
            </div>
        </form>

    );
};

export default Form;