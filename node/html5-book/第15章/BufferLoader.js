function BufferLoader(context, urlList, callback) {
    this.context = context;//设置AudioContext对象
    this.urlList = urlList;//设置由多个需要被播放的文件的URL地址所构成的数组
    this.onload = callback;//设置解码音频数据成功时执行的回调函数
    this.bufferList = new Array();//初始化AudioBuffer对象数组
    this.loadCount = 0;//初始化已创建的AudioBuffer对象的计数器
}
//加载服务器端音频数据
BufferLoader.prototype.loadBuffer = function(url, index) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    var loader = this;
    //执行获取到来自服务器端音频数据时执行的函数
    request.onload = function() {
        //解码request.response中保存的音频文件中的数据 
        loader.context.decodeAudioData(          
            request.response,//来自服务器端的未被解码的音频数据
            //解码成功时执行的回调函数
            function(buffer) 
            {
                if (!buffer) //AudioBuffer对象没有被创建成功
                {
                    alert('不能解码' + url+'中的数据');
                    return;
                }
                 
                loader.bufferList[index] = buffer;//将AudioBuffer对象填入本类的bufferList数组
                if (++loader.loadCount == loader.urlList.length)//如果urlList数组中所指定的音频文件全部加载完毕
                    loader.onload(loader.bufferList);//播放AudioBuffer对象数组中存放的所有音频数据
            }
        );
    }

    request.onerror = function() {
        alert('来自BufferLoader类中的错误: XHR error');
    }
    //加载服务器端音频数据
    request.send();
}
BufferLoader.prototype.load = function() {
    for (var i = 0; i < this.urlList.length; ++i)
        this.loadBuffer(this.urlList[i], i);
}