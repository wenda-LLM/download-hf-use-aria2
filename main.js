
app = new Vue({
    el: '#app',
    vuetify: new Vuetify(),
    data: () => ({
        Aria2_url: 'ws://127.0.0.1:6800/jsonrpc',
        Aria2_token: '',
        HF地址: "https://hf-mirror.com",
        项目ID: "TheBloke/SUS-Chat-34B-AWQ",
        线程数: 8,
        files: [],
        b_Aria2_已连接: false,
        loading:false,
        downloading:false,
    }),
    methods: {
    }
})

// child_process = require("child_process")
get_files = async () => {
    f = await fetch(app.HF地址 + "/api/models/" + app.项目ID)
    j = await f.json()
    return j.siblings
}
del_file = (name) => {
  let file_index = app.files.findIndex((a) => a.name == name);;
  app.files.splice(file_index, 1);
};
get_url = (file_name) => {
    return `${app.HF地址}/${app.项目ID}/resolve/main/${file_name}`//"https://hf-mirror.com/api/models/TheBloke/SUS-Chat-34B-AWQ/"
}
down_file = (url, file_dir, file) => {
    // child_process.execFile(process.execPath.replace(/wd-down.+/, "wd-down\\") + "aria2c.exe",
    //     ['-x', app.线程数, '-k', '1M', '-c', url, "-d", file_dir, "-o", file.name],
    //     { cwd: process.execPath.replace(/wd-down.+/, "wd-down\\model") },
    //     function (error, stdout, stderr) {
    //         app.error = stderr || "无"
    //         app.stdout = stdout || "无"
    //         console.log([error]);
    //         console.log([stdout]);
    //         if (error && stderr.indexOf("unable to access") > -1) {
    //             alert("网络连接失败，请过一段时间重试")
    //             alert(stderr)
    //         }
    //         if (!error) {
    //             console.log(file.name, "下载成功")
    //             file.state = "下载成功"
    //         }
    //     });

    let options = {
        "dir": file_dir,
        "min-split-size": "4M",
        "split": app.线程数-1,
        "max-connection-per-server": app.线程数,
        "user-agent": "Opera\/9.80 (Windows NT 6.0) Presto\/2.12.388 Version\/12.14",
        out: file.name
    };
    let json = {}
    json.id = file.name;
    json.jsonrpc = "2.0";
    json.method = "aria2.addUri";
    json.params = [];
    if (app.Aria2_token != "") {
        json.params.push("token:" + app.Aria2_token);
    }
    json.params.push([url]);
    json.params.push(options);
    ws.send(JSON.stringify(json));
}
获取文件列表 = async () => {
    app.loading=true
    app.files = (await get_files()).map(i => ({ name: i.rfilename, state: '未下载', id: '' }))
    app.loading=false
}
下载 = async () => {
    app.downloading=true
    app.files.forEach(element => {
        down_file(get_url(element.name), app.项目ID.split('/')[1], element)

    });
}
连接 = async (show = true) => {
    window.ws = new WebSocket(app.Aria2_url);
    let connected=false
    ws.onerror = function (evt) {
        if (show) alert("Aria2连接失败")
        app.b_Aria2_已连接 = false
    }
    ws.onclose = function (evt) {
        if (connected)  alert("Aria2连接断开")
        app.b_Aria2_已连接 = false
    }
    ws.onopen = function (evt) {
        if (show) alert("Aria2连接成功")
        app.b_Aria2_已连接 = true
        connected=true
    }
    ws.onmessage = function (evt) {
        //console.log(evt.data);
        evt = JSON.parse(evt.data)
        if (evt.id) {
            try {
                (app.files.find(file => file.name == evt.id)).id = evt.result
            } catch (error) {
                evt.result.forEach(i => {
                    try {
                        (app.files.find(file => file.id == i.gid)).state = formatFileSize(i.downloadSpeed) + "(" + Math.round(i.completedLength / i.totalLength * 100) + "%)"
                    } catch (error) { 
                        console.log('未知任务，可能由其他程序创建',i)
                        app.files.push(    { name: i.files[0].path, state: '现有任务', id: i.gid })
                    
                    }
                })
            }
        }
        if (evt.method == "aria2.onDownloadStart") {
            evt.params.forEach(i => {
                (app.files.find(file => file.id == i.gid)).state = '正在下载'
            })
        }

        if (evt.method == "aria2.onDownloadComplete") {
            evt.params.forEach(i => {
                (app.files.find(file => file.id == i.gid)).state = '下载完成'
            })
        }

    };
}
连接(false)
setInterval(() => {
    if (!app.b_Aria2_已连接) return
    let json = {}
    json.id = 1111111111111;
    json.jsonrpc = "2.0";
    json.method = "aria2.tellActive";
    var token = '';
    if (token != "") {
        json.params.push("token:" + token);
    }
    ws.send(JSON.stringify(json));
}, 1000)
function formatFileSize(bytes, decimalPoint = 2) {
    if (bytes == 0) return "0 Bytes";
    let k = 1000,
        sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
        i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
        parseFloat((bytes / Math.pow(k, i)).toFixed(decimalPoint)) + " " + sizes[i]
    );
}