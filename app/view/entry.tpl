<!DOCTYPE html>
<html class="dark">
  <head>
    <meta charset="utf-8" />
    <link href="/static/normalize.css" rel="stylesheet" />
    <link href="/static/logo.png" rel="icon" type="image/x-icon" />
    <title>{{ __ELPIS_NAME__ }}</title>
  </head>
  <body style="margin: 0">
    <div id="app"></div>
  </body>
  <script type="text/javascript">
    window.__ELPIS_ENTRY_NAME__ = '{{ __ELPIS_ENTRY_NAME__ }}'
    window.__ELPIS_PROJ_KEY__ = '{{ __ELPIS_PROJ_KEY__ }}'
    window.__ELPIS_OPTIONS__ = '{{ __ELPIS_OPTIONS__ | safe }}'
    try {
      window.__ELPIS_OPTIONS__ = JSON.parse(window.__ELPIS_OPTIONS__)
    } catch (error) {
      console.error('__ELPIS_OPTIONS__ 解析失败', error)
    }
  </script>
</html>
