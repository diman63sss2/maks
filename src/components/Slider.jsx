import React, {useEffect} from 'react';

const Slider = ({img, resultImg}) => {
    console.log('Slider')
    console.log(img)
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