async function javaServer(res) {
  const javaRes = res || (await window.API.javaServer());
  // 打印 'javaRes'
  console.log(javaRes);
  const java_status = document.getElementById("java-status");
  java_status.innerText =
    javaRes[0].pm2_env.status == "online" ? "启动" : "停止";
}
async function nodeRedServer(res) {
  const nodeRedRes = res || (await window.API.nodeRed());
  // 打印 'nodeRedRes'
  console.log(nodeRedRes);
  const node_red_status = document.getElementById("node-red-status");
  node_red_status.innerText =
    nodeRedRes[0].pm2_env.status == "online" ? "启动" : "停止";
}
function javaClick(type) {
  window.API.javaMessage(type);
}
function nodeRedClick(type) {
  window.API.nodeRedMessage(type);
}
function getCode() {
  const devCode = document.getElementById("devCode");
  //创建ajax引擎对象
  let xhr = new XMLHttpRequest();

  //配置请求方式和请求地址
  xhr.open("post", "http://127.0.0.1:10301/license/generateCode");

  // 监听状态变化和接收数据
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // 处理数据
      let res = JSON.parse(xhr.responseText);
      //判定再渲染
      if (res.code == 200) {
        devCode.innerHTML = res.msg;
      }
    }
  };

  //请求头
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // 发送请求
  xhr.send();
}

function getCodeInfo() {
  const auth_status = document.getElementById("auth-status");
  const auth_deadline = document.getElementById("auth-deadline");
  const auth_time = document.getElementById("auth-time");
  //创建ajax引擎对象
  let xhr = new XMLHttpRequest();

  //配置请求方式和请求地址
  xhr.open("post", "http://127.0.0.1:10301/license/list");

  // 监听状态变化和接收数据
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // 处理数据
      let res = JSON.parse(xhr.responseText);
      //判定再渲染
      if (res.code == 200) {
        let list = res.data.list[0];
        auth_status.innerHTML = list.status;
        auth_deadline.innerHTML = list.expiryTime;
        auth_time.innerHTML = list.issuedTime;
      }
    }
  };

  //请求头
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  // 发送请求
  xhr.send();
}

function upload() {
  const input = document.getElementById("upload_input");
  var data = new FormData();
  data.append("file", input.files[0], "license.zip");
  //创建ajax引擎对象
  let xhr = new XMLHttpRequest();
  xhr.withCredentials = true;
  //配置请求方式和请求地址
  xhr.open("post", "http://127.0.0.1:10301/license/uploadLicense");

  // 监听状态变化和接收数据
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // 处理数据
      let res = JSON.parse(xhr.responseText);
      //判定再渲染
      if (res.code == 200) {
        console.log(res.msg);
        getCodeInfo();
        closePreview();
      } else if (res.code == 400) {
        console.log(res.msg);
        // nodeRedClick('stop')
        // javaClick('stop')
        // document.getElementById("nodered_restart_btn").disabled=true;
        // document.getElementById("java_restart_btn").disabled=true;
        closePreview();
      }
    }
  };
  // 发送请求
  xhr.send(data);
}
function uploadPreview() {
  const preview = document.getElementById("preview");
  console.log(input.files);
  if (input.files.length > 0) {
    document.getElementById("preview-wrapper").style.display = "inline-block";
    const span = document.createElement("span");
    span.textContent = input.files[0].name;
    preview.insertBefore(span, preview.firstChild);
  }
}
function closePreview() {
  const preview = document.getElementById("preview");
  document.getElementById("preview-wrapper").style.display = "none";
  preview.removeChild(preview.firstChild);
  input.value = null;
}
const init = () => {
  nodeRedClick("start");
  javaClick("start");
  window.API.javaListener(javaServer);
  window.API.nodeRedListener(nodeRedServer);
};

init();

const input = document.getElementById("upload_input");
input.addEventListener("change", uploadPreview);
