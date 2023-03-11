import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import axios from "axios";
import {bytesToBase64} from "byte-base64";
import FormImages from "./FormImage";
import FormImage from "./FormImage";
import {findAllByDisplayValue} from "@testing-library/react";
import VariationImg from "./VariationImg";


const Form = () => {

    const [ result, setResult ] = useState(null);
    const [ uuid, setUuid ] = useState();
    const [ flager, setFlager ] = useState('');
    let uuidComp = '';



    const [imgStyle, setImgStyle] = useState('');
    const [imgToStyle, setImgToStyle] = useState('');

    const url = 'http://localhost:8080/api/receive/VGG19';

    const handleSubmit = async(event) => {
        event.preventDefault()
        let fileOriginal = imgStyle[0];
        let fileStyle = imgToStyle[0];
        const formData = new FormData();
        formData.append("original_image", fileOriginal);
        formData.append("style_image", fileStyle);
        if(typeof fileOriginal !== "undefined" && typeof fileStyle !== "undefined"){
            axios
                .post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((res) => {
                    setUuid(res.data.uuidRequest);
                    successfulPost(res.data.uuidRequest);
                    console.log('uuid: ' . res.data.uuidRequest);

                })
                .catch((err) => {
                    console.log(err);
                });
        } else
            alert("Задайте все изображения");

    }

    const successfulPost = async(uuid) =>  {
        // повторить с интервалом 2 секунды
        let timerId = setInterval(() => {
            axios
                .get('http://localhost:8080/api/receive/VGG19/' + uuid)
                .then((res) => {
                    let resData = res.data
                    if(resData.description === 'Error has happened during image processing' ){
                        clearInterval(timerId);
                        alert('Error has happened during image processing');
                    }else if(resData.description === 'This request is not exist'){
                        alert('This request is not exist')
                        clearInterval(timerId);
                    }else if(resData.isDone === true){
                        alert('Изображения готовы')
                        clearInterval(timerId);
                    }else{
                        console.log('Ожидайте кончания работы программы')
                    }

                })
                .catch((err) => {
                    console.log(err);
                });
        }, 5000);

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
        <div>
            <form id="form" method="post"  onSubmit={handleSubmit}>
                <FormImage
                    title={'Upload image to style'}
                    setImg={setImgToStyle}
                />
                <FormImage
                    title={'Upload image style'}
                    setImg={setImgStyle}
                />
                <button id="submit">
                    Отправить
                </button>
                {uuid}
            </form>

            {
                imgStyle &&
                <div>
                    <VariationImg title={'500'} img={imgStyle} uuid={uuid} url={'http://localhost:8080/api/getoutput/VGG19/500/'}/>
                    <VariationImg title={'1000'} img={imgStyle} uuid={uuid} url={'http://localhost:8080/api/getoutput/VGG19/1000/'}/>
                    <VariationImg title={'1500'} img={imgStyle} uuid={uuid} url={'http://localhost:8080/api/getoutput/VGG19/1500/'}/>
                    <VariationImg title={'2000'} img={imgStyle} uuid={uuid} url={'http://localhost:8080/api/getoutput/VGG19/2000/'}/>
                </div>
            }
            <div className="img-comp-container">
                <div className="img-comp-img">
                    <img src={imgStyle} width="300" height="200"/>
                </div>
                <div className="img-comp-img img-comp-overlay">
                    <img src={'data:image/png;base64,' + result} width="300" height="200"/>
                </div>
            </div>
        </div>


    );
};

export default Form;