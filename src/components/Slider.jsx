import React, {useEffect} from 'react';

const Slider = ({img, resultImg}) => {
    useEffect(()=>{
        initComparisons()
        console.log('useEffect slider')
        console.log('resultImg')
        console.log(resultImg)
        console.log('img')
        console.log(img)
    })

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
        <div className="img-comp-container">
            <div className="img-comp-img">
                <img src={img} width="300" height="200"/>
            </div>
            <div className="img-comp-img img-comp-overlay">
                <img src={'data:image/png;base64,' + resultImg} width="300" height="200"/>
            </div>
        </div>
    );
};

export default Slider;