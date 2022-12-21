import React, {useCallback, useRef, useState} from 'react';
import axios from "axios";
import {bytesToBase64} from "byte-base64";


const Form = () => {

    const [ imgUrl1, setImgUrl1 ] = useState('');
    const [ imgUrl2, setImgUrl2 ] = useState('');
    const [ imgUrl1Front, setImgUrl1Front ] = useState('');
    const [ imgUrl2Front, setImgUrl2Front ] = useState('');
    const [ result, setResult ] = useState(null);
    const [ result2, setResult2 ] = useState(null);
    const [ uuid, setUuid ] = useState(null);




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
                uidRequest = res.data.uuidRequest;
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
                .get('http://localhost:8080/api/receive/VGG19/' + uidRequest)
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
                        initComparisons()
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
        console.log(uuid)
        axios
            .get(url500 + uuid)
            .then((res) => {
                let resData = res.data
                console.log('500')
                console.log(res)
                console.log(resData)
                console.log('resData.absolutePath')
                console.log(resData.absolutePath)
                setResult(resData.imageInBytes)

            })
            .catch((err) => {
                console.log(err);
            });

    }

    async function requests1000(){
        console.log(uuid)
        axios
            .get(url1000 + uuid)
            .then((res) => {
                let resData = res.data
                console.log('1000')
                console.log(res)
                console.log(resData)
                console.log('resData.absolutePath')
                console.log(resData.absolutePath)
                setResult(resData.imageInBytes)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function requests1500(){
        console.log(uuid)
        axios
            .get(url1500 + uuid)
            .then((res) => {
                let resData = res.data
                console.log('1500')
                console.log(res)
                console.log(resData)
                console.log('resData.absolutePath')
                console.log(resData.absolutePath)
                setResult(resData.imageInBytes)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    async function requests2000(){
        console.log(uuid)
        axios
            .get(url2000 + uuid)
            .then((res) => {
                let resData = res.data
                console.log('2000')
                console.log(res)
                console.log(resData)
                console.log('resData.absolutePath')
                console.log(resData.absolutePath)
                setResult(resData.imageInBytes)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function testFunction(){
        console.log(1)
    }

    function uuidSet(value) {
        console.log(value)
        uidRequest = value;
        console.log(uidRequest)
        setUuid(value)
    }

    function initComparisons() {
        let x, i;
        /*найти все элементы с классом "overlay":*/
        x = document.getElementsByClassName("img-comp-overlay");
        for (i = 0; i < x.length; i++) {
            /*один раз для каждого элемента "overlay":
              передайте элемент "overlay" в качестве параметра при выполнении функции сравнения изображений:*/
            compareImages(x[i]);
        }
        function compareImages(img) {
            var slider, img, clicked = 0, w, h;
            /*получить ширину и высоту элемента img*/
            w = img.offsetWidth;
            h = img.offsetHeight;
            /*установите ширину элемента img на 50%:*/
            img.style.width = (w / 2) + "px";
            /*создать слайдер:*/
            slider = document.createElement("DIV");
            slider.setAttribute("class", "img-comp-slider");
            /*вставить ползунок*/
            img.parentElement.insertBefore(slider, img);
            /*расположите ползунок посередине:*/
            slider.style.top = (h / 2) - (slider.offsetHeight / 2) + "px";
            slider.style.left = (w / 2) - (slider.offsetWidth / 2) + "px";
            /*выполнение функции при нажатии кнопки мыши:*/
            slider.addEventListener("mousedown", slideReady);
            /*и еще одна функция при отпускании кнопки мыши:*/
            window.addEventListener("mouseup", slideFinish);
            /*или прикоснулся (для сенсорных экранов:*/
            slider.addEventListener("touchstart", slideReady);
            /*и выпущенный (для сенсорных экранов:*/
            window.addEventListener("touchstop", slideFinish);
            function slideReady(e) {
                /*предотвратите любые другие действия, которые могут произойти при перемещении по изображению:*/
                e.preventDefault();
                /*теперь ползунок нажат и готов к перемещению:*/
                clicked = 1;
                /*выполнение функции при перемещении ползунка:*/
                window.addEventListener("mousemove", slideMove);
                window.addEventListener("touchmove", slideMove);
            }
            function slideFinish() {
                /*ползунок больше не нажимается:*/
                clicked = 0;
            }
            function slideMove(e) {
                var pos;
                /*если ползунок больше не нажат, выйдите из этой функции:*/
                if (clicked == 0) return false;
                /*получить х положения курсора :*/
                pos = getCursorPos(e)
                /*не допускайте расположения ползунка вне изображения:*/
                if (pos < 0) pos = 0;
                if (pos > w) pos = w;
                /*выполните функцию, которая изменит размер наложенного изображения в соответствии с курсором:*/
                slide(pos);
            }
            function getCursorPos(e) {
                var a, x = 0;
                e = e || window.event;
                /*получить x позиции изображения:*/
                a = img.getBoundingClientRect();
                /*вычислите координату х курсора относительно изображения:*/
                x = e.pageX - a.left;
                /*рассмотрим любую прокрутку страницы:*/
                x = x - window.pageXOffset;
                return x;
            }
            function slide(x) {
                /*изменение размера изображения:*/
                img.style.width = x + "px";
                /*расположите ползунок:*/
                slider.style.left = img.offsetWidth - (slider.offsetWidth / 2) + "px";
            }
        }
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
            <input onChange={e => uuidSet(e.target.value)} type="text" />
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
                <img src={'data:image/png;base64,' + result} alt={'img'}/>
                <img onClick={testFunction} src={'data:image/png;base64,' + result2} alt={'Нажми на меня'}/>
            </div>
            <div className="img-comp-container">
                <div className="img-comp-img">
                    <img src={imgUrl1Front} width="300" height="200"/>
                </div>
                <div className="img-comp-img img-comp-overlay">
                    <img src={'data:image/png;base64,' + result} width="300" height="200"/>
                </div>
            </div>
        </form>


    );
};

export default Form;