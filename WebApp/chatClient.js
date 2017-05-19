/**
 * Created by Arik on 19-May-17.
 */
$(document).ready(function(){
    $(function (){

            var myName;
            var myColor;

            window.WebSocket = window.WebSocket || window.MozWebSocket;

            var connection = new WebSocket("ws://127.0.0.1:1337");

            connection.onopen = function(){
                console.log("Successfully connected");
                myName = prompt("Choose a name", "Stranger");
                $("#name").val(myName);
                connection.send(myName);
            }

            connection.onerror = function (){
                console.log("Failed to connect");
            }

            connection.onmessage = function (message){
                try{
                    var json = JSON.parse(message.data);
                }
                catch (e){
                    console.log ("Not a valid json");
                    return;
                }

                console.log(json);

                switch (json.type){
                    case "history":
                        var history = json.data;
                        $.each(history, function(index, message){
                            addMessage(message.author, message.text, message.color);
                        })
                        break;
                    case "color":
                        myColor = json.data;
                        break;
                    case "message":
                        console.log("got a message!", json.data)
                        addMessage(json.data.author, json.data.text, json.data.color);
                        break;
                }
            }


            $("#sendMessage").click(function (){
                addMessage(myName,$("#text").val(), myColor)
                connection.send($("#text").val())
            });

            function addMessage(name, text, color){
                var message = $("#messageTemplate").clone();
                message.attr("id", "");
                message.find(".name").text(name);
                message.find(".message").text(text);
                message.find(".message").attr("style", "color: " + color + ";");
                $(".messages").append(message);
            }

        }
    );
});