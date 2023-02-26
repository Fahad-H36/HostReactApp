import React, { useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
// import mod from "../assets/jsmodel/model.json";

// Load the model
async function loadModel() {
  const model = await tf.loadLayersModel(
    "https://fahadsmodel.s3.amazonaws.com/modeljs/model.json"
  );
  console.log(model || "not found");
  return model;
}

export default function MyApp() {
  const [model, setModel] = useState(null);
  const [prediction, setPrediction] = useState(null);

  // Load the model when the component mounts
  useEffect(() => {
    loadModel().then(setModel);
  }, []);

  // Make a prediction when the user selects an image
  async function handleImageUpload(event) {
    const file = event.target.files[0];
    const image = await loadImage(file);
    const prediction = await predictImage(image);
    setPrediction(prediction);
  }

  // Convert the input image into a tensor that can be fed into the model
  async function loadImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const image = new Image();
        image.onload = () => resolve(tf.browser.fromPixels(image));
        image.onerror = reject;
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  }

  // Use the loaded model to make a prediction on the input image
  async function predictImage(image) {
    console.log(model);

    // const input = image.reshape([1, 150, 150, 3]);
    const output = model.predict(input);
    const prediction = output.dataSync(); // extract the prediction from the tensor
    return prediction;
  }

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {prediction && <div>Prediction: {prediction}</div>}
    </div>
  );
}
