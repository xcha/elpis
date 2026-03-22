<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <link href="../static/normolize.css" rel="stylesheet" />
    <link href="../static/logo.jpg" rel="icon" />
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Page 1 - Elpis</title>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/js-md5@0.8.3/src/md5.min.js"></script>
  </head>
  <body>
    <div class="container">
      <input type="hidden" id="env" value="{{ env }}" />
      <input type="hidden" id="options" value="{{ options }}" />
      <div class="badge">{{ name }}</div>
      <h1>Page 1</h1>
      <img class="logo" src="../static/logo.jpg" alt="logo" />
      <p>这是您的第一个页面，简洁、优雅且充满可能。</p>
      <p>通过 Elpis 框架，您可以轻松构建现代化的 Web 应用。</p>
      <button id="getListBtn" onclick="handleClick()">获取项目列表</button>
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

    const handleClick = () => {
      const signKey = "zdx20040921";
      const st = Date.now();
      const sgin = md5(`${signKey}_${st}`);
      axios
        .request({
          url: "/api/project/list",
          method: "get",
          headers: {
            s_sign: sgin,
            s_t: st,
          },
          params: {
            proj_key: "test",
            a: 1,
            b: 2,
          },
        })
        .then((res) => {
          console.log(res);
        });
    };
  </script>
</html>
<style>
  :root {
    --primary-color: #4f46e5;
    --bg-color: #f9fafb;
    --text-color: #111827;
  }
  body {
    font-family:
      -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
      sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }
  .container {
    text-align: center;
    padding: 2rem;
    background: white;
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
    transition: transform 0.3s ease;
  }
  .container:hover {
    transform: translateY(-5px);
  }
  h1 {
    color: var(--primary-color);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }
  p {
    color: #6b7280;
    line-height: 1.6;
  }
  .badge {
    display: inline-block;
    background: #e0e7ff;
    color: var(--primary-color);
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
  .logo {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
  }
</style>
