import { React, useState, useEffect } from "react";
import "./mask.css";
import * as tf from "@tensorflow/tfjs";

import ima from "../assets/img.avif";

async function loadModel() {
  const model = await tf.loadLayersModel(
    "https://fahadsmodel.s3.amazonaws.com/model.json"
  );
  return model;
}

const Mask = () => {
  const [image, setImage] = useState(ima);
  const [textVal, setTextVal] = useState("Press Process");
  const [model, setModel] = useState("null");
  const [prediction, setPrediction] = useState("null");

  // useEffect(() => {
  //   loadModel().then(setModel);
  // }, []);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };
  async function predict() {
    let input = new Image();
    input.src = image;
    console.log("getting here 1");
    // input = input.reshape([150, 150]);
    input = tf.browser.fromPixels(input).div(255.0);
    input = tf.image.resizeBilinear(input, [150, 150]);
    console.log("getting here 2");

    // Crop the tensor to remove the padded zeros
    input = input.expandDims(0);
    // input = input.cast("float32");
    console.log("getting here 3");

    // const imgArray = Array.from(input);
    // console.log(input);
    // const img9 = tf.tensor(imgArray, [1, 150, 150, 3], "float32");
    let model = loadModel();
    model.then(
      (res) => {
        const pred = res.predict(input);
        let prd = pred.dataSync()[0];
        console.log("getting here 4");

        if (prd > 0.5) {
          setTextVal("Mask Not Found");
        } else {
          setTextVal("Mask Found");
        }
      },
      function (err) {
        console.log(err);
      }
    );
  }

  return (
    <div className="container">
      <div id="button-wrap">
        <label className="button" htmlFor="browseBTN">
          Upload File
        </label>

        <input type="file" id="browseBTN" onChange={handleImageUpload} />
      </div>
      {/* <input type="file" id="browseBTN" onChange={handleImageUpload} /> */}
      <div className="imgDiv">
        {image && <img id="imgDis" src={image} alt="Uploaded image" />}
      </div>
      {/* Img display div ends here */}
      {/* <textarea
        disabled
        value={textVal}
        id="infoField"
        cols="39"
        rows="3"
      ></textarea> */}
      <h1 id="infoField">{textVal}</h1>
      <div className="submitDiv">
        <button type="button" id="submitBTN" onClick={predict}>
          Process
        </button>
      </div>
    </div> // container div ends here
  );
};

export default Mask;
