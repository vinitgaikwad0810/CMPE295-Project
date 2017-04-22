// QRCODE reader Copyright 2011 Lazar Laszlo
// http://www.webqr.com

var gCtx = null;
var gCanvas = null;
var c=0;
var stype=0;
var gUM=false;
var webkit=false;
var moz=false;
var v=null;
var strm;

var imghtml='<div id="qrfile"><canvas id="out-canvas" width="320" height="240"></canvas>'+
    '<div id="imghelp">drag and drop a QRCode here'+
    '<br>or select a file'+
    '<input type="file" onchange="handleFiles(this.files)"/>'+
    '</div>'+
    '</div>';

var vidhtml = '<video id="v" autoplay></video>';

var timeOutArray = [];


function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}
function drop(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    if(files.length>0)
    {
        handleFiles(files);
    }
    else
    if(dt.getData('URL'))
    {
        qrcode.decode(dt.getData('URL'));
    }
}

function handleFiles(f)
{
    var o=[];

    for(var i =0;i<f.length;i++)
    {
        var reader = new FileReader();
        reader.onload = (function(theFile) {
            return function(e) {
                gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

                qrcode.decode(e.target.result);
            };
        })(f[i]);
        reader.readAsDataURL(f[i]);
    }
}

function initCanvas(w,h)
{
    gCanvas = document.getElementById("qr-canvas");
    gCanvas.style.width = w + "px";
    gCanvas.style.height = h + "px";
    gCanvas.width = w;
    gCanvas.height = h;
    gCtx = gCanvas.getContext("2d");
    gCtx.clearRect(0, 0, w, h);
}


function captureToCanvas() {
    if(stype!=1)
        return;
    if(gUM)
    {
        try{
            gCtx.drawImage(v,0,0);
            try{
                qrcode.decode();
            }
            catch(e){
                timeOutArray.push(setTimeout(captureToCanvas, 2000));
            };
        }
        catch(e){
            timeOutArray.push(setTimeout(captureToCanvas, 2000));
        };
    }
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function isCanvasSupported(){
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
}

function success(stream) {
    strm = stream;
    if(webkit)
        v.src = window.URL.createObjectURL(stream);
    else
    if(moz)
    {
        v.mozSrcObject = stream;
        v.play();
    }
    else
        v.src = stream;
    gUM=true;
    timeOutArray.push(setTimeout(captureToCanvas, 2000));
}

function error(error) {
    gUM=false;
    return;
}

function load(callbackFn)
{
    // if(isCanvasSupported() && window.File && window.FileReader)    {
    //     //initCanvas(800, 600);
    //     qrcode.callback = read;
    //     setwebcam();
    // }
    if(isCanvasSupported() && window.File && window.FileReader)
    {
        initCanvas(800, 600);
        qrcode.callback = callbackFn;
        // qrcode.callback = read;
        setwebcam();
    }
}

function setwebcam()
{

    var options = true;
    if(navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
    {
        try{
            navigator.mediaDevices.enumerateDevices()
                .then(function(devices) {
                    devices.forEach(function(device) {
                        if (device.kind === 'videoinput') {
                          console.log(device);
                            if(device.label.toLowerCase().search("back") >-1)
                                options={'deviceId': {'exact':device.deviceId}, 'facingMode':'environment'} ;
                        }
                    });
                    setwebcam2(options);
                });
        }
        catch(e)
        {
        }
    }
    else{
        console.log("no navigator.mediaDevices.enumerateDevices" );
        setwebcam2(options);
    }

}

function setwebcam2(options)
{
    // if(stype==1)
    // {
    //     timeOutArray.push(setTimeout(captureToCanvas, 2000));
    //     return;
    // }
    var n=navigator;
    document.getElementById("outdiv").innerHTML = vidhtml;
    v=document.getElementById("v");


    if(n.getUserMedia)
    {
        webkit=true;
        n.getUserMedia({video: options, audio: false}, success, error);
    }
    else
    if(n.webkitGetUserMedia)
    {
        webkit=true;
        n.webkitGetUserMedia({video:options, audio: false}, success, error);
    }
    else
    if(n.mozGetUserMedia)
    {
        moz=true;
        n.mozGetUserMedia({video: options, audio: false}, success, error);
    }

    stype=1;
    timeOutArray.push(setTimeout(captureToCanvas, 2000));
}

function closeQRScanner(){
  for(var x=0; x<timeOutArray.length; x++){
    clearTimeout(timeOutArray[x]);
  }

  strm.getVideoTracks()[0].stop();

  $('#myModal').modal("hide");
}
