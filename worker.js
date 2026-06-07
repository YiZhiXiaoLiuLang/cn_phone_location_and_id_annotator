// 绑定 KV 命名空间（在 wrangler.toml 中配置）
// 键名 "2503_no_trie" 对应手机号段映射，格式如：
// {
//   "1300000": "山东-济南-中国联通",
//   "1300001": "江苏-常州-中国联通",
//   ...
// }
// 键名 "sfz" 对应身份证地址前缀映射，格式如：
// {
//   "110000": "北京市",
//   "110100": "北京市市辖区",
//   "110101": "北京市东城区",
//   ...
// }

export default {
  async fetch(request, env, ctx) {
    // 处理 CORS 预检请求
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // 只允许 GET 请求
    if (request.method !== 'GET') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    const url = new URL(request.url);
    const pathname = url.pathname;
    const searchParams = url.searchParams;

    // 路由处理
    // /phone/txt?phone=13333333333
    if (pathname === '/phone/txt') {
      const phone = searchParams.get('phone');
      return handlePhoneQuery(phone, 'txt', env);
    }
    // /phone/json?phone=13333333333
    else if (pathname === '/phone/json') {
      const phone = searchParams.get('phone');
      return handlePhoneQuery(phone, 'json', env);
    }
    // /sfz/txt?sfz=11010119900307663X
    else if (pathname === '/sfz/txt') {
      const sfz = searchParams.get('sfz');
      return handleSfzQuery(sfz, 'txt', env);
    }
    // /sfz/json?sfz=11010119900307663X
    else if (pathname === '/sfz/json') {
      const sfz = searchParams.get('sfz');
      return handleSfzQuery(sfz, 'json', env);
    }
    else if (pathname === '/') {
      return new Response(
        "<!DOCTYPE html><html><head><meta charset=\"UTF-8\"><title>API文档</title></head><body><p>以下是完整的 API 文档：</p>\n<h1 id=\"-api-\">手机号/身份证归属地查询 API 文档</h1>\n<h2 id=\"-\">概述</h2>\n<p>基于 Cloudflare Workers 的归属地查询服务，支持手机号段查询和身份证地址码查询，提供 JSON 和纯文本两种输出格式。</p>\n<h2 id=\"-\">基础信息</h2>\n<ul>\n<li><strong>基础URL</strong>: <code>https://your-worker-domain.com</code></li>\n<li><strong>请求方式</strong>: <code>GET</code></li>\n<li><strong>字符编码</strong>: UTF-8</li>\n<li><strong>CORS</strong>: 支持跨域请求</li>\n</ul>\n<h2 id=\"-\">通用响应头</h2>\n<p>所有接口均返回以下响应头：</p>\n<table>\n<thead>\n<tr>\n<th>响应头</th>\n<th>值</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>Access-Control-Allow-Origin</code></td>\n<td><code>*</code></td>\n<td>允许所有域名跨域访问</td>\n</tr>\n<tr>\n<td><code>Content-Type</code></td>\n<td><code>application/json</code> 或 <code>text/plain</code></td>\n<td>根据请求格式返回对应类型</td>\n</tr>\n</tbody>\n</table>\n<hr>\n<h2 id=\"-\">接口列表</h2>\n<h3 id=\"1-json-\">1. 手机号段查询 (JSON格式)</h3>\n<p>查询手机号归属地，返回 JSON 格式数据。</p>\n<p><strong>请求URL</strong>: <code>/phone/json</code></p>\n<p><strong>请求方法</strong>: <code>GET</code></p>\n<p><strong>请求参数</strong>:</p>\n<table>\n<thead>\n<tr>\n<th>参数名</th>\n<th>类型</th>\n<th>必填</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>phone</code></td>\n<td>string</td>\n<td>是</td>\n<td>手机号码（至少7位数字）</td>\n</tr>\n</tbody>\n</table>\n<p><strong>响应示例</strong>:</p>\n<pre><code class=\"lang-json\"><span class=\"hljs-comment\">// 成功响应 (200 OK)</span>\n{\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"1500291\"</span>,\n  <span class=\"hljs-string\">\"location\"</span>: <span class=\"hljs-string\">\"陕西-西安-中国移动\"</span>,\n  <span class=\"hljs-string\">\"phone\"</span>: <span class=\"hljs-string\">\"15000000000\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 号段不存在 (404 Not Found)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Not found\"</span>,\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"1500291\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 参数错误 (400 Bad Request)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Missing required parameter: phone\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 服务器错误 (500 Internal Server Error)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Internal server error\"</span>,\n  <span class=\"hljs-string\">\"details\"</span>: <span class=\"hljs-string\">\"错误详情\"</span>\n}\n</code></pre>\n<p><strong>使用示例</strong>:</p>\n<pre><code class=\"lang-bash\"><span class=\"hljs-attribute\">curl</span> <span class=\"hljs-string\">\"https://api.example.com/phone/json?phone=15000000000\"</span>\n</code></pre>\n<hr>\n<h3 id=\"2-\">2. 手机号段查询 (文本格式)</h3>\n<p>查询手机号归属地，返回纯文本格式。</p>\n<p><strong>请求URL</strong>: <code>/phone/txt</code></p>\n<p><strong>请求方法</strong>: <code>GET</code></p>\n<p><strong>请求参数</strong>:</p>\n<table>\n<thead>\n<tr>\n<th>参数名</th>\n<th>类型</th>\n<th>必填</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>phone</code></td>\n<td>string</td>\n<td>是</td>\n<td>手机号码（至少7位数字）</td>\n</tr>\n</tbody>\n</table>\n<p><strong>响应示例</strong>:</p>\n<pre><code class=\"lang-text\"><span class=\"hljs-meta\"># 成功响应 (200 OK)</span>\n陕西-西安-中国移动\n\n<span class=\"hljs-meta\"># 失败响应 - 号段不存在 (404 Not Found)</span>\nSegment <span class=\"hljs-number\">1500291</span> not found\n\n<span class=\"hljs-meta\"># 失败响应 - 参数错误 (400 Bad Request)</span>\nMissing required parameter: phone\n\n<span class=\"hljs-meta\"># 失败响应 - 服务器错误 (500 Internal Server Error)</span>\nInternal server error: 错误详情\n</code></pre>\n<p><strong>使用示例</strong>:</p>\n<pre><code class=\"lang-bash\"><span class=\"hljs-attribute\">curl</span> <span class=\"hljs-string\">\"https://api.example.com/phone/txt?phone=15000000000\"</span>\n</code></pre>\n<hr>\n<h3 id=\"3-json-\">3. 身份证归属地查询 (JSON格式)</h3>\n<p>根据身份证号查询户籍所在地，返回 JSON 格式数据。支持自动向上级匹配（精确6位 → 市级4位 → 省级2位）。</p>\n<p><strong>请求URL</strong>: <code>/sfz/json</code></p>\n<p><strong>请求方法</strong>: <code>GET</code></p>\n<p><strong>请求参数</strong>:</p>\n<table>\n<thead>\n<tr>\n<th>参数名</th>\n<th>类型</th>\n<th>必填</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>sfz</code></td>\n<td>string</td>\n<td>是</td>\n<td>身份证号码（至少6位）</td>\n</tr>\n</tbody>\n</table>\n<p><strong>响应示例</strong>:</p>\n<pre><code class=\"lang-json\"><span class=\"hljs-comment\">// 成功响应 - 精确匹配 (200 OK)</span>\n{\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"110101\"</span>,\n  <span class=\"hljs-string\">\"original_code\"</span>: <span class=\"hljs-string\">\"110101\"</span>,\n  <span class=\"hljs-string\">\"location\"</span>: <span class=\"hljs-string\">\"北京市东城区\"</span>,\n  <span class=\"hljs-string\">\"sfz\"</span>: <span class=\"hljs-string\">\"11010119900307663X\"</span>\n}\n\n<span class=\"hljs-comment\">// 成功响应 - 市级匹配 (200 OK)</span>\n{\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"440100\"</span>,\n  <span class=\"hljs-string\">\"original_code\"</span>: <span class=\"hljs-string\">\"440100\"</span>,\n  <span class=\"hljs-string\">\"location\"</span>: <span class=\"hljs-string\">\"广州市\"</span>,\n  <span class=\"hljs-string\">\"sfz\"</span>: <span class=\"hljs-string\">\"440100199001011234\"</span>\n}\n\n<span class=\"hljs-comment\">// 成功响应 - 省级匹配 (200 OK)</span>\n{\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"440000\"</span>,\n  <span class=\"hljs-string\">\"original_code\"</span>: <span class=\"hljs-string\">\"440999\"</span>,\n  <span class=\"hljs-string\">\"location\"</span>: <span class=\"hljs-string\">\"广东省\"</span>,\n  <span class=\"hljs-string\">\"sfz\"</span>: <span class=\"hljs-string\">\"440999199001011234\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 地址码不存在 (404 Not Found)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Not found\"</span>,\n  <span class=\"hljs-string\">\"code\"</span>: <span class=\"hljs-string\">\"999999\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 参数错误 (400 Bad Request)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Missing required parameter: sfz\"</span>\n}\n\n<span class=\"hljs-comment\">// 失败响应 - 服务器错误 (500 Internal Server Error)</span>\n{\n  <span class=\"hljs-string\">\"error\"</span>: <span class=\"hljs-string\">\"Internal server error\"</span>,\n  <span class=\"hljs-string\">\"details\"</span>: <span class=\"hljs-string\">\"错误详情\"</span>\n}\n</code></pre>\n<p><strong>使用示例</strong>:</p>\n<pre><code class=\"lang-bash\"><span class=\"hljs-attribute\">curl</span> <span class=\"hljs-string\">\"https://api.example.com/sfz/json?sfz=11010119900307663X\"</span>\n</code></pre>\n<hr>\n<h3 id=\"4-\">4. 身份证归属地查询 (文本格式)</h3>\n<p>根据身份证号查询户籍所在地，返回纯文本格式。支持自动向上级匹配。</p>\n<p><strong>请求URL</strong>: <code>/sfz/txt</code></p>\n<p><strong>请求方法</strong>: <code>GET</code></p>\n<p><strong>请求参数</strong>:</p>\n<table>\n<thead>\n<tr>\n<th>参数名</th>\n<th>类型</th>\n<th>必填</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td><code>sfz</code></td>\n<td>string</td>\n<td>是</td>\n<td>身份证号码（至少6位）</td>\n</tr>\n</tbody>\n</table>\n<p><strong>响应示例</strong>:</p>\n<pre><code class=\"lang-text\"><span class=\"hljs-meta\"># 成功响应 - 精确匹配 (200 OK)</span>\n北京市东城区\n\n<span class=\"hljs-meta\"># 成功响应 - 市级匹配 (200 OK)</span>\n广州市\n\n<span class=\"hljs-meta\"># 成功响应 - 省级匹配 (200 OK)</span>\n广东省\n\n<span class=\"hljs-meta\"># 失败响应 - 地址码不存在 (404 Not Found)</span>\nAddress code <span class=\"hljs-number\">999999</span> not found\n\n<span class=\"hljs-meta\"># 失败响应 - 参数错误 (400 Bad Request)</span>\nMissing required parameter: sfz\n\n<span class=\"hljs-meta\"># 失败响应 - 身份证过短 (400 Bad Request)</span>\nID number too <span class=\"hljs-keyword\">short</span>, need at least <span class=\"hljs-number\">6</span> digits (address prefix)\n\n<span class=\"hljs-meta\"># 失败响应 - 格式错误 (400 Bad Request)</span>\nInvalid ID number, first <span class=\"hljs-number\">6</span> digits must be numbers\n\n<span class=\"hljs-meta\"># 失败响应 - 服务器错误 (500 Internal Server Error)</span>\nInternal server error: 错误详情\n</code></pre>\n<p><strong>使用示例</strong>:</p>\n<pre><code class=\"lang-bash\"><span class=\"hljs-attribute\">curl</span> <span class=\"hljs-string\">\"https://api.example.com/sfz/txt?sfz=11010119900307663X\"</span>\n</code></pre>\n<hr>\n<h2 id=\"-\">错误码说明</h2>\n<table>\n<thead>\n<tr>\n<th>HTTP状态码</th>\n<th>说明</th>\n<th>常见原因</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>200</td>\n<td>成功</td>\n<td>查询成功</td>\n</tr>\n<tr>\n<td>400</td>\n<td>请求错误</td>\n<td>缺少必填参数、参数格式错误、参数长度不足</td>\n</tr>\n<tr>\n<td>404</td>\n<td>未找到</td>\n<td>号段或地址码在数据库中不存在</td>\n</tr>\n<tr>\n<td>405</td>\n<td>方法不允许</td>\n<td>使用了非 GET 请求方法</td>\n</tr>\n<tr>\n<td>500</td>\n<td>服务器错误</td>\n<td>KV 数据读取失败、JSON 解析错误等</td>\n</tr>\n</tbody>\n</table>\n<hr>\n<h2 id=\"-\">匹配规则说明</h2>\n<h3 id=\"-\">手机号段匹配规则</h3>\n<ul>\n<li>自动提取手机号前7位作为查询键</li>\n<li>要求手机号至少7位数字</li>\n<li>只支持纯数字，不包含空格、连字符等</li>\n</ul>\n<h3 id=\"-\">身份证地址码匹配规则</h3>\n<p>采用逐级向上匹配策略：</p>\n<ol>\n<li><strong>优先精确匹配6位</strong>：直接查询前6位地址码</li>\n<li><strong>次级匹配市级（4位）</strong>：若无结果，取前4位 + &quot;00&quot; 进行匹配</li>\n<li><strong>最后匹配省级（2位）</strong>：若无结果，取前2位 + &quot;0000&quot; 进行匹配</li>\n</ol>\n<p><strong>示例</strong>：</p>\n<ul>\n<li>输入 <code>440305199001011234</code> → 精确匹配 <code>440305</code> → 返回 &quot;深圳市南山区&quot;</li>\n<li>输入 <code>440300199001011234</code> → 精确匹配失败 → 匹配 <code>440300</code> → 返回 &quot;深圳市&quot;</li>\n<li>输入 <code>449999199001011234</code> → 市级匹配失败 → 匹配 <code>440000</code> → 返回 &quot;广东省&quot;</li>\n</ul>\n<hr>\n<h2 id=\"-\">快速测试</h2>\n<pre><code class=\"lang-bash\"><span class=\"hljs-comment\"># 测试手机号查询（JSON）</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/phone/json?phone=15000000000\"</span>\n\n<span class=\"hljs-comment\"># 测试手机号查询（文本）</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/phone/txt?phone=15000000000\"</span>\n\n<span class=\"hljs-comment\"># 测试身份证查询（JSON）</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/sfz/json?sfz=11010119900307663X\"</span>\n\n<span class=\"hljs-comment\"># 测试身份证查询（文本）</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/sfz/txt?sfz=11010119900307663X\"</span>\n\n<span class=\"hljs-comment\"># 测试错误参数</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/phone/json\"</span>\ncurl \"https:<span class=\"hljs-comment\">//your-worker.dev/sfz/txt?sfz=123\"</span>\n</code></pre>\n<hr>\n<h2 id=\"-\">前端调用示例</h2>\n<h3 id=\"javascript-fetch-api-\">JavaScript (Fetch API)</h3>\n<pre><code class=\"lang-javascript\"><span class=\"hljs-comment\">// 手机号查询（JSON格式）</span>\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">queryPhone</span>(<span class=\"hljs-params\">phone</span>) </span>{\n  <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/phone/json?phone=<span class=\"hljs-subst\">${phone}</span>`</span>);\n  <span class=\"hljs-keyword\">const</span> data = <span class=\"hljs-keyword\">await</span> response.json();\n  <span class=\"hljs-built_in\">console</span>.log(data);\n}\n\n<span class=\"hljs-comment\">// 手机号查询（文本格式）</span>\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">queryPhoneText</span>(<span class=\"hljs-params\">phone</span>) </span>{\n  <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/phone/txt?phone=<span class=\"hljs-subst\">${phone}</span>`</span>);\n  <span class=\"hljs-keyword\">const</span> location = <span class=\"hljs-keyword\">await</span> response.text();\n  <span class=\"hljs-built_in\">console</span>.log(location);\n}\n\n<span class=\"hljs-comment\">// 身份证查询（JSON格式）</span>\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">querySfz</span>(<span class=\"hljs-params\">sfz</span>) </span>{\n  <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/sfz/json?sfz=<span class=\"hljs-subst\">${sfz}</span>`</span>);\n  <span class=\"hljs-keyword\">const</span> data = <span class=\"hljs-keyword\">await</span> response.json();\n  <span class=\"hljs-built_in\">console</span>.log(data.location);\n}\n\n<span class=\"hljs-comment\">// 身份证查询（文本格式）</span>\n<span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">querySfzText</span>(<span class=\"hljs-params\">sfz</span>) </span>{\n  <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/sfz/txt?sfz=<span class=\"hljs-subst\">${sfz}</span>`</span>);\n  <span class=\"hljs-keyword\">const</span> location = <span class=\"hljs-keyword\">await</span> response.text();\n  <span class=\"hljs-built_in\">console</span>.log(location);\n}\n\n<span class=\"hljs-comment\">// 使用示例</span>\nqueryPhone(<span class=\"hljs-string\">'15000000000'</span>);\nquerySfz(<span class=\"hljs-string\">'11010119900307663X'</span>);\n</code></pre>\n<h3 id=\"jquery\">jQuery</h3>\n<pre><code class=\"lang-javascript\">$.ajax({\n  <span class=\"hljs-attr\">url</span>: <span class=\"hljs-string\">'/phone/json'</span>,\n  <span class=\"hljs-attr\">data</span>: { <span class=\"hljs-attr\">phone</span>: <span class=\"hljs-string\">'15000000000'</span> },\n  <span class=\"hljs-attr\">dataType</span>: <span class=\"hljs-string\">'json'</span>,\n  <span class=\"hljs-attr\">success</span>: <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span>(<span class=\"hljs-params\">data</span>) </span>{\n    <span class=\"hljs-built_in\">console</span>.log(data.location);\n  }\n});\n</code></pre>\n<h3 id=\"axios\">Axios</h3>\n<pre><code class=\"lang-javascript\"><span class=\"hljs-selector-tag\">axios</span><span class=\"hljs-selector-class\">.get</span>(<span class=\"hljs-string\">'/sfz/json'</span>, {\n  <span class=\"hljs-attribute\">params</span>: { <span class=\"hljs-attribute\">sfz</span>: <span class=\"hljs-string\">'11010119900307663X'</span> }\n})<span class=\"hljs-selector-class\">.then</span>(response =&gt; {\n  <span class=\"hljs-selector-tag\">console</span><span class=\"hljs-selector-class\">.log</span>(response.data.location);\n});\n</code></pre>\n<h3 id=\"html-\">HTML 表单示例</h3>\n<pre><code class=\"lang-html\"><span class=\"hljs-meta\">&lt;!DOCTYPE html&gt;</span>\n<span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">html</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">head</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">title</span>&gt;</span>归属地查询<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">title</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">head</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">body</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">h2</span>&gt;</span>手机号归属地查询<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">h2</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">input</span> <span class=\"hljs-attr\">type</span>=<span class=\"hljs-string\">\"text\"</span> <span class=\"hljs-attr\">id</span>=<span class=\"hljs-string\">\"phone\"</span> <span class=\"hljs-attr\">placeholder</span>=<span class=\"hljs-string\">\"请输入手机号\"</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">button</span> <span class=\"hljs-attr\">onclick</span>=<span class=\"hljs-string\">\"queryPhone()\"</span>&gt;</span>查询<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">button</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span> <span class=\"hljs-attr\">id</span>=<span class=\"hljs-string\">\"phoneResult\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span>\n\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">h2</span>&gt;</span>身份证归属地查询<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">h2</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">input</span> <span class=\"hljs-attr\">type</span>=<span class=\"hljs-string\">\"text\"</span> <span class=\"hljs-attr\">id</span>=<span class=\"hljs-string\">\"sfz\"</span> <span class=\"hljs-attr\">placeholder</span>=<span class=\"hljs-string\">\"请输入身份证号\"</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">button</span> <span class=\"hljs-attr\">onclick</span>=<span class=\"hljs-string\">\"querySfz()\"</span>&gt;</span>查询<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">button</span>&gt;</span>\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">div</span> <span class=\"hljs-attr\">id</span>=<span class=\"hljs-string\">\"sfzResult\"</span>&gt;</span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">div</span>&gt;</span>\n\n  <span class=\"hljs-tag\">&lt;<span class=\"hljs-name\">script</span>&gt;</span><span class=\"javascript\">\n    <span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">queryPhone</span>(<span class=\"hljs-params\"></span>) </span>{\n      <span class=\"hljs-keyword\">const</span> phone = <span class=\"hljs-built_in\">document</span>.getElementById(<span class=\"hljs-string\">'phone'</span>).value;\n      <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/phone/json?phone=<span class=\"hljs-subst\">${phone}</span>`</span>);\n      <span class=\"hljs-keyword\">const</span> data = <span class=\"hljs-keyword\">await</span> response.json();\n      <span class=\"hljs-built_in\">document</span>.getElementById(<span class=\"hljs-string\">'phoneResult'</span>).innerHTML = data.location || data.error;\n    }\n\n    <span class=\"hljs-keyword\">async</span> <span class=\"hljs-function\"><span class=\"hljs-keyword\">function</span> <span class=\"hljs-title\">querySfz</span>(<span class=\"hljs-params\"></span>) </span>{\n      <span class=\"hljs-keyword\">const</span> sfz = <span class=\"hljs-built_in\">document</span>.getElementById(<span class=\"hljs-string\">'sfz'</span>).value;\n      <span class=\"hljs-keyword\">const</span> response = <span class=\"hljs-keyword\">await</span> fetch(<span class=\"hljs-string\">`/sfz/json?sfz=<span class=\"hljs-subst\">${sfz}</span>`</span>);\n      <span class=\"hljs-keyword\">const</span> data = <span class=\"hljs-keyword\">await</span> response.json();\n      <span class=\"hljs-built_in\">document</span>.getElementById(<span class=\"hljs-string\">'sfzResult'</span>).innerHTML = data.location || data.error;\n    }\n  </span><span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">script</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">body</span>&gt;</span>\n<span class=\"hljs-tag\">&lt;/<span class=\"hljs-name\">html</span>&gt;</span>\n</code></pre>\n<hr>\n<h2 id=\"-\">配置说明</h2>\n<h3 id=\"wrangler-toml-\">wrangler.toml 配置</h3>\n<pre><code class=\"lang-toml\"><span class=\"hljs-attr\">name</span> = <span class=\"hljs-string\">\"location-query\"</span>\n<span class=\"hljs-attr\">main</span> = <span class=\"hljs-string\">\"src/index.js\"</span>\n<span class=\"hljs-section\">\n[[kv_namespaces]]</span>\n<span class=\"hljs-attr\">binding</span> = <span class=\"hljs-string\">\"PHONE_KV\"</span>\n<span class=\"hljs-attr\">id</span> = <span class=\"hljs-string\">\"your-kv-namespace-id\"</span>\n</code></pre>\n<h3 id=\"kv-\">KV 数据结构</h3>\n<h4 id=\"-2503_no_trie-\">手机号段 (键名: <code>2503_no_trie</code>)</h4>\n<pre><code class=\"lang-json\">{\n  <span class=\"hljs-attr\">\"1300000\"</span>: <span class=\"hljs-string\">\"山东-济南-中国联通\"</span>,\n  <span class=\"hljs-attr\">\"1500291\"</span>: <span class=\"hljs-string\">\"陕西-西安-中国移动\"</span>,\n  <span class=\"hljs-attr\">\"1888888\"</span>: <span class=\"hljs-string\">\"广东-深圳-中国电信\"</span>\n}\n</code></pre>\n<h4 id=\"-sfz-\">身份证地址码 (键名: <code>sfz</code>)</h4>\n<pre><code class=\"lang-json\">{\n  <span class=\"hljs-attr\">\"110000\"</span>: <span class=\"hljs-string\">\"北京市\"</span>,\n  <span class=\"hljs-attr\">\"110100\"</span>: <span class=\"hljs-string\">\"北京市市辖区\"</span>,\n  <span class=\"hljs-attr\">\"110101\"</span>: <span class=\"hljs-string\">\"北京市东城区\"</span>,\n  <span class=\"hljs-attr\">\"110102\"</span>: <span class=\"hljs-string\">\"北京市西城区\"</span>,\n  <span class=\"hljs-attr\">\"440000\"</span>: <span class=\"hljs-string\">\"广东省\"</span>,\n  <span class=\"hljs-attr\">\"440100\"</span>: <span class=\"hljs-string\">\"广州市\"</span>,\n  <span class=\"hljs-attr\">\"440300\"</span>: <span class=\"hljs-string\">\"深圳市\"</span>,\n  <span class=\"hljs-attr\">\"440305\"</span>: <span class=\"hljs-string\">\"深圳市南山区\"</span>\n}\n</code></pre>\n<hr>\n<h2 id=\"-\">注意事项</h2>\n<ol>\n<li><strong>参数长度</strong>：手机号至少需要7位，身份证至少需要6位</li>\n<li><strong>字符限制</strong>：手机号只能包含数字；身份证前6位必须为数字</li>\n<li><strong>大小写</strong>：参数名区分大小写，必须使用小写 <code>phone</code> 和 <code>sfz</code></li>\n<li><strong>编码</strong>：建议对参数值进行 URL 编码</li>\n<li><strong>频率限制</strong>：注意 Cloudflare Workers 的免费套餐限制（10万请求/天）</li>\n<li><strong>数据更新</strong>：KV 数据更新后需要等待全球同步（通常几秒到几分钟）</li>\n</ol>\n<hr>\n<h2 id=\"-\">更新日志</h2>\n<table>\n<thead>\n<tr>\n<th>版本</th>\n<th>日期</th>\n<th>说明</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>1.0.0</td>\n<td>2026-06-06</td>\n<td>初始版本，支持手机号和身份证归属地查询</td>\n</tr>\n</tbody>\n</table>\n<hr>\n<h2 id=\"-\">联系方式</h2>\n<p>如有问题或建议，请联系开发者。</p>\n</body></html>", {
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
      },
    });

    }
    // 404 - 未找到路由
    else {
      return new Response(
        JSON.stringify({
          error: 'Not found',
          usage: {
            '/phone/txt?phone=13333333333': '手机号段查询，返回纯文本',
            '/phone/json?phone=13333333333': '手机号段查询，返回JSON',
            '/sfz/txt?sfz=11010119900307663X': '身份证归属地查询，返回纯文本',
            '/sfz/json?sfz=11010119900307663X': '身份证归属地查询，返回JSON',
          },
        }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};

/**
 * 处理手机号段查询
 * @param {string} phone 手机号
 * @param {string} format 输出格式 'json' 或 'txt'
 * @param {object} env 环境变量
 */
async function handlePhoneQuery(phone, format, env) {
  // 检查参数是否存在
  if (!phone) {
    const errorMsg = 'Missing required parameter: phone';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // 验证手机号长度（至少7位）
  if (phone.length < 7) {
    const errorMsg = 'Phone number too short, need at least 7 digits';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // 提取前7位作为号段
  const prefix = phone.slice(0, 7);

  // 验证是否为7位数字
  if (!/^\d{7}$/.test(prefix)) {
    const errorMsg = 'Invalid phone number, must contain only digits';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  try {
    // 从 KV 中读取手机号段数据
    const kvData = await env.PHONE_KV.get('2503_no_trie');
    if (!kvData) {
      const errorMsg = 'KV data not found (key "2503_no_trie")';
      if (format === 'txt') {
        return new Response(errorMsg, {
          status: 500,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        return new Response(JSON.stringify({ error: errorMsg }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    const mapping = JSON.parse(kvData);
    const location = mapping[prefix];

    if (location) {
      if (format === 'txt') {
        // 纯文本格式输出
        return new Response(location, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        // JSON 格式输出
        return new Response(
          JSON.stringify({
            code: prefix,
            location: location,
            phone: phone,
          }),
          {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
          }
        );
      }
    } else {
      const errorMsg = `Segment ${prefix} not found`;
      if (format === 'txt') {
        return new Response(errorMsg, {
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        return new Response(JSON.stringify({ error: 'Not found', code: prefix }), {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
  } catch (err) {
    const errorMsg = `Internal server error: ${err.message}`;
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }
}
/**
 * 解析身份证号信息
 * @param {string} sfz 身份证号
 * @returns {object} 包含出生日期、年龄、性别的对象
 */
function parseIdCardInfo(sfz) {
  // 只支持15位或18位身份证
  if (sfz.length !== 15 && sfz.length !== 18) {
    return null;
  }
  
  let birthStr = '';
  let genderCode = '';
  
  if (sfz.length === 18) {
    // 18位身份证：第7-14位是出生年月日
    birthStr = sfz.substring(6, 14);
    // 第17位是性别，奇数为男，偶数为女
    genderCode = sfz.charAt(16);
  } else if (sfz.length === 15) {
    // 15位身份证：第7-12位是出生年月日（年份只有2位）
    birthStr = '19' + sfz.substring(6, 12);
    // 第15位是性别
    genderCode = sfz.charAt(14);
  }
  
  // 解析出生日期
  const year = parseInt(birthStr.substring(0, 4));
  const month = parseInt(birthStr.substring(4, 6));
  const day = parseInt(birthStr.substring(6, 8));
  
  // 验证日期是否有效
  const birthDate = new Date(year, month - 1, day);
  if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
    return null;
  }
  
  // 计算年龄
  const today = new Date();
  let age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
    age--;
  }
  
  // 判断性别
  const gender = parseInt(genderCode) % 2 === 1 ? '男' : '女';
  
  return {
    birthDate: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    year: year,
    month: month,
    day: day,
    age: age,
    gender: gender
  };
}

/**
 * 格式化生日显示（用于txt输出）
 * @param {object} info 身份证解析信息
 * @returns {string} 格式化的生日文本
 */
function formatBirthdayText(info) {
  if (!info) return '';
  return `${info.birthDate} (${info.age}岁)`;
}
/**
 * 处理身份证归属地查询
 * @param {string} sfz 身份证号
 * @param {string} format 输出格式 'json' 或 'txt'
 * @param {object} env 环境变量
 */
async function handleSfzQuery(sfz, format, env) {
  // 检查参数是否存在
  if (!sfz) {
    const errorMsg = 'Missing required parameter: sfz';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // 验证身份证号长度（至少6位，最多18位）
  if (sfz.length < 6) {
    const errorMsg = 'ID number too short, need at least 6 digits (address prefix)';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // 提取前6位作为地址码
  const addressCode = sfz.slice(0, 6);

  // 验证前6位是否为数字
  if (!/^\d{6}$/.test(addressCode)) {
    const errorMsg = 'Invalid ID number, first 6 digits must be numbers';
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 400,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: errorMsg }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }

  // 解析身份证信息（仅当长度为15或18时）
  let idInfo = null;
  if (sfz.length === 15 || sfz.length === 18) {
    idInfo = parseIdCardInfo(sfz);
  }

  try {
    // 从 KV 中读取身份证地址数据
    const kvData = await env.PHONE_KV.get('sfz');
    if (!kvData) {
      const errorMsg = 'KV data not found (key "sfz")';
      if (format === 'txt') {
        return new Response(errorMsg, {
          status: 500,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        return new Response(JSON.stringify({ error: errorMsg }), {
          status: 500,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }

    const mapping = JSON.parse(kvData);
    
    // 身份证地址码匹配策略：
    // 优先精确匹配6位，如果没有则尝试匹配前4位（市级），再尝试前2位（省级）
    let location = null;
    let matchedCode = null;
    let downgradeLevel = null; // 记录降级级别: 'none', 'city', 'province'
    
    if (mapping[addressCode]) {
      location = mapping[addressCode];
      matchedCode = addressCode;
      downgradeLevel = 'none';
    } else {
      // 尝试匹配前4位（市级）
      const cityCode = addressCode.slice(0, 4) + '00';
      if (mapping[cityCode]) {
        location = mapping[cityCode];
        matchedCode = cityCode;
        downgradeLevel = 'city';
      } else {
        // 尝试匹配前2位（省级）
        const provinceCode = addressCode.slice(0, 2) + '0000';
        if (mapping[provinceCode]) {
          location = mapping[provinceCode];
          matchedCode = provinceCode;
          downgradeLevel = 'province';
        }
      }
    }

    if (location) {
      // 构建降级提示文本
      let downgradeText = '';
      if (downgradeLevel === 'city') {
        downgradeText = '（已降级至前4位市级）';
      } else if (downgradeLevel === 'province') {
        downgradeText = '（已降级至前2位省级）';
      }
      
      if (format === 'txt') {
        // 纯文本格式输出
        let output = location + downgradeText;
        
        // 添加身份证解析信息
        if (idInfo) {
          output += `-${formatBirthdayText(idInfo)}`;
          output += `-${idInfo.gender}`;
        } else if (sfz.length >= 6 && sfz.length !== 15 && sfz.length !== 18) {
          output += `\n提示：身份证号长度${sfz.length}位，无法解析出生日期和性别（仅支持15位或18位）`;
        }
        
        return new Response(output, {
          status: 200,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        // JSON 格式输出
        const responseData = {
          code: matchedCode,
          original_code: addressCode,
          location: location,
          sfz: sfz,
        };
        
        // 添加降级信息
        if (downgradeLevel !== 'none') {
          responseData.downgrade = true;
          responseData.downgrade_level = downgradeLevel === 'city' ? 'city' : 'province';
          responseData.downgrade_message = downgradeLevel === 'city' 
            ? 'Matched to city level (first 4 digits)' 
            : 'Matched to province level (first 2 digits)';
        }
        
        // 添加身份证解析信息
        if (idInfo) {
          responseData.birth_date = idInfo.birthDate;
          responseData.age = idInfo.age;
          responseData.gender = idInfo.gender;
          responseData.birth_year = idInfo.year;
          responseData.birth_month = idInfo.month;
          responseData.birth_day = idInfo.day;
        } else if (sfz.length >= 6 && sfz.length !== 15 && sfz.length !== 18) {
          responseData.warning = `ID length ${sfz.length} digits, cannot parse birth date and gender (only support 15 or 18 digits)`;
        }
        
        return new Response(JSON.stringify(responseData), {
          status: 200,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    } else {
      const errorMsg = `Address code ${addressCode} not found`;
      if (format === 'txt') {
        let output = errorMsg;
        
        // 即使地址未找到，仍然尝试显示身份证信息
        if (idInfo) {
          output += `\n出生日期：${formatBirthdayText(idInfo)}`;
          output += `\n性别：${idInfo.gender}`;
        }
        
        return new Response(output, {
          status: 404,
          headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
        });
      } else {
        const errorResponse = { error: 'Not found', code: addressCode };
        
        // 添加身份证解析信息
        if (idInfo) {
          errorResponse.birth_date = idInfo.birthDate;
          errorResponse.age = idInfo.age;
          errorResponse.gender = idInfo.gender;
        }
        
        return new Response(JSON.stringify(errorResponse), {
          status: 404,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        });
      }
    }
  } catch (err) {
    const errorMsg = `Internal server error: ${err.message}`;
    if (format === 'txt') {
      return new Response(errorMsg, {
        status: 500,
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Access-Control-Allow-Origin': '*' },
      });
    } else {
      return new Response(JSON.stringify({ error: 'Internal server error', details: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      });
    }
  }
}
