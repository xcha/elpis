<!DOCTYPE html>
<html class="dark">
  <head>
    <link href="../static/normolize.css" rel="stylesheet" />
    <link href="../static/logo.jpg" rel="icon" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page 1 - Elpis</title>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
  <script defer src="http://127.0.0.1:9002/public/dist/dev/js/vendor_c6af9989.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/common_83a4c2ed.bundle.js"></script><script defer src="http://127.0.0.1:9002/public/dist/dev/js/entry.page1_79c0c19b.bundle.js"></script></head>
  <body>
    <div id="root">
      <div class="container">
        <input type="hidden" id="env" value="{{ env }}" />
        <input type="hidden" id="options" value="{{ options }}" />
        <div class="badge">{{ name }}</div>
        <h1>Page 1</h1>
        <img class="logo" src="../static/logo.jpg" alt="logo" />
        <p>这是您的第一个页面，简洁、优雅且充满可能。</p>
        <p>通过 Elpis 框架，您可以轻松构建现代化的 Web 应用。</p>
        <p>我们 抓紧了所谓的人生。</p>

        <button id="getListBtn" onclick="handleClick()">获取项目列表</button>
      </div>
    </div>
  </body>
  <script type="text/javascript">
    try {
      window.env = document.getElementById("env").value;
      const options = document.getElementById("options").value;
      window.options = JSON.parse(options);
    } catch (e) {
      console.error("Error parsing options:", e);
    }
  </script>
</html>
<style></style>
