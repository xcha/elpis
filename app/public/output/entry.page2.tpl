<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page 2 - Elpis</title>
    <style>
        :root {
            --primary-color: #e54646ff;
            --bg-color: #f9fafb;
            --text-color: #111827;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
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
    </style>
</head>
<body>
    <div class="container">
        <div class="badge">Welcome</div>
        <h1>Page 2</h1>
        <p>这是您的第一个页面，简洁、优雅且充满可能。</p>
        <p>通过 Elpis 框架，您可以轻松构建现代化的 Web 应用。</p>
    </div>
</body>
</html>
