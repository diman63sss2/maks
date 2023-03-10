import React, {useEffect, useState} from 'react';
import axios from "axios";
import Slider from "./Slider";

const VariationImg = ({uuid, url, title, img}) => {

    const [result, setResult] = useState();

    async function request(){
        console.log('request' + uuid)
        axios
            .get(url + uuid)
            .then((res) => {
                let resData = res.data
                setResult(resData.imageInBytes)

            })
            .catch((err) => {
                console.log(err);
            });
    }



    return (
        <div>
            <div>
                -------------------
                <br/>
                <br/>
                <br/>
                <button onClick={()=> request()}>
                    {title}
                </button>
                <br/>
                <br/>
                <br/>
                -------------------
            </div>
            {
                result &&
                <Slider img={img} resultImg={result}/>
            }

        </div>

    );
};

export default VariationImg;