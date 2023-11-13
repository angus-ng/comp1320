/*
 * Project: Milestone 1
 * File Name: worker-thread.js
 * Description: Math used by applyFilterCalc in IOhandler.js for processing image pixels on a separate thread
 *
 * Created Date: 09/11/23
 * Author: Angus Ng
 *
 */

const { parentPort } = require("node:worker_threads");
const data = require("worker_threads").workerData;


if (data.filter === "grayscale") {
    for (let i = 0; i < data.pixels.length; i+=4) {
        let R = data.pixels[i];
        let G = data.pixels[i+1];
        let B = data.pixels[i+2];

        let grayscale = 0.3*R + 0.6*G + 0.1*B;
        let desaturation = 1; // 0 - 1 (0-100%)

        data.pixels[i] = R + desaturation * (grayscale - R);
        data.pixels[i+1] = G + desaturation * (grayscale - G);
        data.pixels[i+2] =  B + desaturation * (grayscale - B);
    }
} else if (data.filter === "sepia") {
    for (let i = 0; i < data.pixels.length; i+=4) {
        let R = data.pixels[i];
        let G = data.pixels[i+1];
        let B = data.pixels[i+2];
    
    
        let newRed = (0.393*R + 0.769*G + 0.189*B);
        let newGreen = (0.349*R + 0.686*G + 0.168*B);
        let newBlue = (0.272*R + 0.534*G + 0.131*B);
    
        if (newRed > 255){
         data.pixels[i] = 255;
        } else {
         data.pixels[i] = newRed;
        }
    
        if (newGreen > 255){
         data.pixels[i+1] = 255;
        } else {
         data.pixels[i+1] = newGreen;
        }
    
        if (newBlue > 255){
         data.pixels[i+2] = 255;
        } else {
         data.pixels[i+2] = newBlue;
        }
      }
    }

  parentPort.postMessage(data.pixels);