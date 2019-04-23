var accessToken = "b84d75997aa8409fb740ac6a127fd963";
var baseUrl = "https://api.api.ai/v1/";

//ready document
$(document).ready(function() {
	$("input#user_input").keypress(function(event) {
		console.log("typed..")
		if (event.which == 13) {
			event.preventDefault();
			var user_input_value = $("input#user_input").val();
			$("div#Chat_Conversation").prepend("<div class='message row'><div class='right-msg animated bounceInRight'>"+user_input_value+"</div></div> ");
			send();
		}
	});
	$("#rec").click(function(event) {
		switchRecognition();
	});
});

var recognition;

function startRecognition() {
	recognition = new webkitSpeechRecognition();
	recognition.onstart = function(event) {
		updateRec();
	};
	recognition.onresult = function(event) {
		var text = "";
	    for (var i = event.resultIndex; i < event.results.length; ++i) {
	    	text += event.results[i][0].transcript;
	    }
	    setInput(text);
		stopRecognition();
	};
	recognition.onend = function() {
		stopRecognition();
	};
	recognition.lang = "en-US";
	//en-US
	recognition.start();
}

function stopRecognition() {
	if (recognition) {
		recognition.stop();
		recognition = null;
	}
	updateRec();
}

function switchRecognition() {
	if (recognition) {
		stopRecognition();
	} else {
		startRecognition();
	}
}

function setInput(text) {
	var voice = "vv"
	$("input#user_input").val(text);
	$("div#Chat_Conversation").prepend("<div class='message row' id='voice'><div class='right-msg animated bounceInRight'>"+text+"</div></div> ");	
	send(voice);
}

function updateRec() {
	if (recognition) {
		$(".sendIcon").addClass("pulse")
		$(".sendIcon").css("background", "#E91E63");
	} else {
		$(".sendIcon").removeClass("pulse")
		$(".sendIcon").css("background", "#f36c20");
	}
}

//without json resopnse
function send(vv) {
	var text = $("input#user_input").val();
	$.ajax({
		type: "POST",
		url: baseUrl + "query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + accessToken
		},
		data: JSON.stringify({ query: text, lang: "en", sessionId: "web-4839734773477" }),
		success: function(data) {
			$(".typing").addClass("hide");
			var respText = data.result.fulfillment.speech;
			$('input#user_input').val("");
			if (respText) {
				console.log("Respuesta: " + respText);
				//setResponse(respText);
				if (vv) {
					setResponse("<div class='message row'><div class='bot-loading'><img src='img/loading.svg' class='responsive-img chat-logo valign'></div><div class='left-msg animated bounceInLeft'>"+respText+"</div></div>");
					text_speech(respText);
				} else {
					setResponse("<div class='message row'><div class='left-msg animated bounceInLeft'>"+respText+"</div></div>");
				}
			} else {
				setResponse("<div class='message row'><div class='left-msg animated bounceInLeft'>Ooh you wrote something I didn't know about it yet🙄<br>but don't worry I will use my power of artificial intelligence to respond to this kind of text in the future 💪🏻😜</div></div>");
			}

		},
		error: function() {
			setResponse("<div class='message row'><div class='left-msg animated bounceInLeft'>Internal Server Error</div></div>");
		}
	});
	//setResponse("Thinking...");
	setResponse("<div class='message row'><div class='left-msg typing'><img src='img/typing.svg'></div></div>");
}


function text_speech(val) { 
	responsiveVoice.speak(val, "UK English Male");
	console.log("talking..");
	setTimeout(function(){
		$('.bot-loading').remove()
	}, 3000);
}


function setResponse(val) {
	const rollSound = new Audio("./img/typing.wav");
	rollSound.play();
	$("div#Chat_Conversation").prepend(val);
	//$("#response").text(val);
}
