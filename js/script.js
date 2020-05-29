jQuery(function ($) {
    $(document).ready(function () {

        //mask 
        $('.date').mask('99.99.9999');
        $('.phone').ForceNumericOnly();
        $('.textarea-group textarea').focusin(function () {
            $(this).parents('.textarea-group').addClass('focus-mode');
        });
        $('.textarea-group textarea').focusout(function () {
            $(this).parents('.textarea-group').removeClass('focus-mode');
        });
        $(".autoresizing").keyup(function (e) {
            while ($(this).outerHeight() < this.scrollHeight + parseFloat($(this).css("borderTopWidth")) + parseFloat($(this).css("borderBottomWidth"))) {
                $(this).height($(this).height() + 1);
            };
        });

        $('.questions-group textarea').focusin(function () {
            $(this).parents('.textarea-cont').addClass('focus-mode');
        });
        $('.questions-group textarea').focusout(function () {
            $(this).parents('.textarea-cont').removeClass('focus-mode');
        });
        $('.media-upload .audio-upload').click(function () {
            $('.file-audio').click();
        });
        $('.video-upload').click(function () {
            $('.file-video').click();
        });
        $('.image-upload').click(function () {
            $('.file-image').click();
        });
        $('.file-image').change(function () {
            console.log(this.files[0].name);
            $('.image-name').html(this.files[0].name);
        });
        $('.file-video').change(function () {
            $('.video-name').html(this.files[0].name);
        });
        $('.file-audio').change(function () {
            $('.audio-name').html(this.files[0].name);
            $('.media-upload .audio-cont img').attr('src', './img/upload-audio-active-2.png');
        });
        //show recording
        $('.media-record .audio-upload').click(function () {
            $('.record-wrapper').fadeIn();
            $('.media-record .audio-cont img').attr('src', './img/audio-active.png');
        });
        $('.cont-wrapp').click(function () {
            $('.record-wrapper').fadeIn();
            $('.media-record .audio-cont img').attr('src', './img/audio-active.png');
        });
    });
});
jQuery.fn.ForceNumericOnly =
    function () {
        return this.each(function () {
            $(this).keydown(function (e) {
                var max = 15;
                if ($('.phone').val().length < max) {
                    var key = e.charCode || e.keyCode || 0;
                    return (
                        key == 8 ||
                        key == 9 ||
                        key == 13 ||
                        key == 46 ||
                        key == 110 ||
                        key == 190 ||
                        (key >= 35 && key <= 40) ||
                        (key >= 48 && key <= 57) ||
                        (key >= 96 && key <= 105));
                }
            });
        });
    };
//audio recrding
//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;

var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb.
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);

function startRecording() {
    console.log("recordButton clicked");
    try { recordingsList.firstChild.parentNode.removeChild(recordingsList.firstChild) }
    catch (e) {

    }

    /*
        Simple constraints object, for more advanced audio features see
        https://addpipe.com/blog/audio-constraints-getusermedia/
    */

    var constraints = { audio: true, video: false }

    /*
       Disable the record button until we get a success or fail from getUserMedia()
   */

    recordButton.disabled = true;
    recordButton.innerHTML = "";
    recordButton.innerHTML = "<i class='record-icon'></i>  recording";
    stopButton.disabled = false;
    pauseButton.disabled = false;

    /*
        We're using the standard promise based getUserMedia()
        https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    */

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
        /*
            create an audio context after getUserMedia is called
            sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
            the sampleRate defaults to the one set in your OS for your playback device
        */
        audioContext = new AudioContext();
        //update the format
        document.getElementById("formats").innerHTML = "recording..."

        /*  assign to gumStream for later use  */
        gumStream = stream;

        /* use the stream */
        input = audioContext.createMediaStreamSource(stream);

        /*
            Create the Recorder object and configure to record mono sound (1 channel)
            Recording 2 channels  will double the file size
        */
        rec = new Recorder(input, { numChannels: 1 })

        //start the recording process
        rec.record()
        document.getElementById('stopwatch').hidden = false;
        StartStop();
        console.log("Recording started");

    }).catch(function (err) {
        //enable the record button if getUserMedia() fails
        recordButton.disabled = false;
        stopButton.disabled = true;
        pauseButton.disabled = true;
    });
}

function pauseRecording() {
    console.log("pauseButton clicked rec.recording=", rec.recording);
    if (rec.recording) {
        //pause
        rec.stop();
        PauseUnpause();
        pauseButton.innerHTML = "Возобновить";
        document.getElementById("formats").innerHTML = "Пауза";
    } else {
        //resume
        rec.record();
        PauseUnpause();
        pauseButton.innerHTML = "Пауза";
        document.getElementById("formats").innerHTML = "Запись...";
    }
}

function stopRecording() {
    console.log("stopButton clicked");

    //disable the stop button, enable the record too allow for new recordings
    stopButton.disabled = true;
    recordButton.disabled = false;
    // recordButton.innerHTML= "re-rec";
    recordButton.innerHTML = "<i class='re-rec-icon'></i>  re-rec";
    pauseButton.disabled = true;
    pauseButton.innerHTML = "Пауза";
    //reset button just in case the recording is stopped while paused

    //tell the recorder to stop the recording
    rec.stop();
    StartStop();
    document.getElementById('stopwatch').hidden = true;

    //stop microphone access
    gumStream.getAudioTracks()[0].stop();
    document.getElementById("formats").innerHTML = "Сохранено";

    //create the wav blob and pass it on to createDownloadLink
    rec.exportWAV(createDownloadLink);

}

function createDownloadLink(blob) {

    var url = URL.createObjectURL(blob);
    var au = document.createElement('audio');
    var li = document.createElement('li');


    //add controls to the <audio> element
    au.controls = true;
    au.src = url;

    //save to disk link
    //add the new audio element to li
    li.appendChild(au);

    //add the filename to the li


    //add the li element to the ol
    recordingsList.appendChild(li);
}

function sendAudio(blob) {
    var filename = new Date().toISOString();
    var xhr = new XMLHttpRequest();
    xhr.onload = function (e) {
        if (this.readyState === 4) {
            console.log("Server returned: ", e.target.responseText);
            form.submit();
        }
    };
    var fd = new FormData();
    fd.append('<?=Yii::$app->request->csrfParam?>', '<?=Yii::$app->request->csrfToken?>');
    fd.append('link_id', '<?=$link_id?>');
    fd.append('unique_id', '<?=$unique_id?>');
    fd.append("audio_data", blob, filename);
    xhr.open("POST", "upload-audio", true);
    xhr.send(fd);
}

//объявляем переменные
var base = 60;
var clocktimer, dateObj, dh, dm, ds, ms;
var readout = '';
var h = 1,
    m = 1,
    tm = 1,
    s = 0,
    ts = 0,
    ms = 0,
    init = 0;

//функция для очистки поля
function ClearСlock() {
    clearTimeout(clocktimer);
    h = 1;
    m = 1;
    tm = 1;
    s = 0;
    ts = 0;
    ms = 0;
    init = 0;
    readout = '00:00:00';
    document.getElementById('stopwatch').value = readout;

}

//функция для старта секундомера
function StartTIME() {
    var cdateObj = new Date();
    var t = (cdateObj.getTime() - dateObj.getTime()) - (s * 1000);
    if (t > 999) {
        s++;
    }
    if (s >= (m * base)) {
        ts = 0;
        m++;
    } else {
        ts = parseInt((ms / 100) + s);
        if (ts >= base) {
            ts = ts - ((m - 1) * base);
        }
    }
    if (m > (h * base)) {
        tm = 1;
        h++;
    } else {
        tm = parseInt((ms / 100) + m);
        if (tm >= base) {
            tm = tm - ((h - 1) * base);
        }
    }
    ms = Math.round(t / 10);
    if (ms > 99) {
        ms = 0;
    }
    if (ms == 0) {
        ms = '00';
    }
    if (ms > 0 && ms <= 9) {
        ms = '0' + ms;
    }
    if (ts > 0) {
        ds = ts;
        if (ts < 10) {
            ds = '0' + ts;
        }
    } else {
        ds = '00';
    }
    dm = tm - 1;
    if (dm > 0) {
        if (dm < 10) {
            dm = '0' + dm;
        }
    } else {
        dm = '00';
    }
    dh = h - 1;
    if (dh > 0) {
        if (dh < 10) {
            dh = '0' + dh;
        }
    } else {
        dh = '00';
    }
    readout = dh + ':' + dm + ':' + ds;
    document.getElementById('stopwatch').value = readout;
    clocktimer = setTimeout("StartTIME()", 1);
}

//Функция запуска и остановки
function StartStop() {
    if (init == 0) {
        ClearСlock();
        dateObj = new Date();
        StartTIME();
        init = 1;
    } else {
        clearTimeout(clocktimer);
        init = 0;
    }
}
function PauseUnpause() {
    if (init == 0) {
        StartTIME();
        console.log('1');
        init = 1;
    } else {
        clearTimeout(clocktimer);
        console.log('2');
        init = 0;
    }
}