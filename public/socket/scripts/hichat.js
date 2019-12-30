
window.onload = function() {
    var hichat = new HiChat();
    hichat.init();
};
var HiChat = function() {
    this.socket = null;
};
HiChat.prototype = {
    init: function() {

        var that = this;
        this.socket = io.connect();
       
        this.socket.on('connect', function() {
            document.getElementById('info').textContent = 'get yourself a nickname :)';
            document.getElementById('nickWrapper').style.display = 'block';
            document.getElementById('nicknameInput').focus();
        });
        this.socket.on('nickExisted', function() {
            document.getElementById('info').textContent = '!nickname is taken, choose another pls';
        });
        this.socket.on('loginSuccess', function() {
            document.title = 'hichat | ' + document.getElementById('nicknameInput').value;
            document.getElementById('loginWrapper').style.display = 'none';
            document.getElementById('messageInput').focus();
        });
        this.socket.on('error', function(err) {
            if (document.getElementById('loginWrapper').style.display == 'none') {
                document.getElementById('status').textContent = '!fail to connect :(';
            } else {
                document.getElementById('info').textContent = '!fail to connect :(';
            }
        });
        this.socket.on('system', function(nickName, userCount, type) {
            var msg = nickName + (type == 'login' ? ' joined' : ' left');
          //  that._displayNewMsg('system ', msg, 'red');
            document.getElementById('status').textContent = userCount + (userCount > 1 ? ' users' : ' user') + ' online';
        });
        this.socket.on('newMsg', function(user, msg, color,senderId) {
            that._displayNewMsg(user, msg, color,senderId);
        });
        this.socket.on('newImg', function(user, img, color) {
            that._displayImage(user, img, color);
        });
            var nickName = document.getElementById('nicknameInput').value;
            if (nickName.trim().length != 0) {
                that.socket.emit('login', nickName);
            }
        document.getElementById('nicknameInput').addEventListener('keyup', function(e) {
            if (e.keyCode == 13) {
                var nickName = document.getElementById('nicknameInput').value;
                if (nickName.trim().length != 0) {
                    that.socket.emit('login', nickName);
                };
            };
        }, false);
        document.getElementById('sendBtn').addEventListener('click', function() {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                sender = document.getElementById('login_id').value;
                color = document.getElementById('colorStyle').value;
            messageInput.value = '';
            messageInput.focus();
            if (msg.trim().length != 0) {
                conversationId = document.getElementById('conversationId').value;
                that.socket.emit('postMsg', msg, color,sender,conversationId);
                login_id = document.getElementById('login_id').value;
                
                that._displayNewMsg('me', msg, color,login_id);
                return;
            };
        }, false);
        document.getElementById('messageInput').addEventListener('keyup', function(e) {
            var messageInput = document.getElementById('messageInput'),
                msg = messageInput.value,
                color = document.getElementById('colorStyle').value;
                sender = document.getElementById('login_id').value;
            if (e.keyCode == 13 && msg.trim().length != 0) {
                messageInput.value = '';
                conversationId = document.getElementById('conversationId').value;
                that.socket.emit('postMsg', msg, color,sender,conversationId);
                login_id = document.getElementById('login_id').value;
                
                that._displayNewMsg('me', msg, color,login_id);
            };
        }, false);
        document.getElementById('clearBtn').addEventListener('click', function() {
            document.getElementById('historyMsg').innerHTML = '';
        }, false);
        document.getElementById('sendImage').addEventListener('change', function() {
            if (this.files.length != 0) {
                var file = this.files[0],
                    reader = new FileReader(),
                    color = document.getElementById('colorStyle').value;
                if (!reader) {
                    that._displayNewMsg('system', '!your browser doesn\'t support fileReader', 'red','');
                    this.value = '';
                    return;
                };
                reader.onload = function(e) {
                    this.value = '';
                    that.socket.emit('img', e.target.result, color);
                    that._displayImage('me', e.target.result, color);
                };
                reader.readAsDataURL(file);
            };
        }, false);
        this._initialEmoji();
        document.getElementById('emoji').addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            emojiwrapper.style.display = 'block';
            e.stopPropagation();
        }, false);
        document.body.addEventListener('click', function(e) {
            var emojiwrapper = document.getElementById('emojiWrapper');
            if (e.target != emojiwrapper) {
                emojiwrapper.style.display = 'none';
            };
        });
        document.getElementById('emojiWrapper').addEventListener('click', function(e) {
            var target = e.target;
            if (target.nodeName.toLowerCase() == 'img') {
                var messageInput = document.getElementById('messageInput');
                messageInput.focus();
                messageInput.value = messageInput.value + '[emoji:' + target.title + ']';
            };
        }, false);
         this.fetch_messsages();
    },
    _initialEmoji: function() {
        var emojiContainer = document.getElementById('emojiWrapper'),
            docFragment = document.createDocumentFragment();
        for (var i = 69; i > 0; i--) {
            var emojiItem = document.createElement('img');
            emojiItem.src = '../socket/content/emoji/' + i + '.gif';
            emojiItem.title = i;
            docFragment.appendChild(emojiItem);
        };
        emojiContainer.appendChild(docFragment);
    },
    _displayNewMsg: function(user, msg, color,senderId) {
        var messages = document.getElementById("messages");
        login_id = document.getElementById('login_id').value;
        var timedate = new Date().toLocaleTimeString(); // for now
       // d.getHours(); // => 9
        if(login_id==senderId)
        {
        messages.insertAdjacentHTML('beforeend','<div class="container_message darker"> <img src="/socket/img/img_avatar2.png" alt="Avatar" class="right" style="width:100%;"> <p>'+msg+'</p> <span class="time-left">'+timedate+'</span> </div>');
        }
        else
        {
        messages.insertAdjacentHTML('beforeend','<div class="container_message"> <img src="/socket/img/img_avatar2.png" alt="Avatar" style="width:100%;"> <p>'+msg+'</p> <span class="time-right">'+timedate+'</span> </div>');
        }
    },
    _displayImage: function(user, imgData, color) {
        var container = document.getElementById('historyMsg'),
            msgToDisplay = document.createElement('p'),
            date = new Date().toTimeString().substr(0, 8);
        msgToDisplay.style.color = color || '#000';
        msgToDisplay.innerHTML = user + '<span class="timespan">(' + date + '): </span> <br/>' + '<a href="' + imgData + '" target="_blank"><img src="' + imgData + '"/></a>';
        container.appendChild(msgToDisplay);
        container.scrollTop = container.scrollHeight;
    },
    _showEmoji: function(msg) {
        var match, result = msg,
            reg = /\[emoji:\d+\]/g,
            emojiIndex,
            totalEmojiNum = document.getElementById('emojiWrapper').children.length;
        while (match = reg.exec(msg)) {
            emojiIndex = match[0].slice(7, -1);
            if (emojiIndex > totalEmojiNum) {
                result = result.replace(match[0], '[X]');
            } else {
                result = result.replace(match[0], '<img class="emoji" src="../socket/content/emoji/' + emojiIndex + '.gif" />');//todo:fix this in chrome it will cause a new request for the image
            };
        };
        return result;
    },

    fetch_messsages:function()
    {

        $("#messages").empty();
         var messages = document.getElementById("messages");
         login_id = document.getElementById('login_id').value;
         conversationId = document.getElementById('conversationId').value;
        (function() {
  fetch("/messages/get-all/"+conversationId)
    .then(data => {
      return data.json();
    })
    .then(json => {
      json.map(data => {
        if(login_id==data.senderId._id)
        {
        messages.insertAdjacentHTML('beforeend','<div class="container_message darker"> <img src="/socket/img/img_avatar2.png" alt="Avatar" class="right" style="width:100%;"> <p>'+data.message+'</p> <span class="time-left">'+data.date+'</span> </div>');
        }
        else
        {
        messages.insertAdjacentHTML('beforeend','<div class="container_message"> <img src="/socket/img/img_avatar2.png" alt="Avatar" style="width:100%;"> <p>'+data.message+'</p> <span class="time-right">'+data.date+'</span> </div>');
        }
        
      });
       
    });
})();
    },

    changeUsername:function(name,id)
    {
       $('#user_name').text(name); 
       $('#conversationId').val(id); 
       this.fetch_messsages();
    }
};
