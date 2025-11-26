# 数学题目验证系统 后端接口文档

本文档描述了前端页面与后端服务器进行交互的 API 接口规范。

## 基本信息

- **URL 前缀**: `/api` (建议，实际请根据服务器配置)
- **数据格式**: JSON
- **字符编码**: UTF-8

---

## 1. 获取未验证题目列表

从数据库中随机或按顺序获取一批未验证的题目（每次最多 10 题）。

- **接口地址**: `GET /problems`
- **描述**: 拉取一组需要人工验证的题目数据。

### 请求参数 (Query Parameters)

| 参数名 | 类型   | 必选 | 描述                                     |
| :----- | :----- | :--- | :--------------------------------------- |
| `key`  | string | 是   | 认证 Key (当前固定为 `12345abc`)         |
| `limit`| number | 否   | 获取数量，默认为 10                      |

### 响应结果 (Response)

返回一个包含题目对象的 JSON 数组。

```json
[
  {
    "id": "PAPER_2023_001",
    "question_number": 1,
    "img_url": "https://example.com/images/q1.png",
    "markdown": "已知函数 $$ f(x) = \\ln(x^2 + 1) $$...",
    "knowledge_points": ["导数", "链式法则"],
    "methods": ["直接计算法"]
  },
  {
    "id": "PAPER_2023_001",
    "question_number": 2,
    "img_url": "",
    "markdown": "解方程...",
    "knowledge_points": ["一元二次方程"],
    "methods": ["因式分解法"]
  }
]
```

### 字段说明

- `id` (string): 试卷ID，不同题目的试卷ID可能相同。
- `question_number` (number): 题号 (1-10等)。
- `img_url` (string, optional): 题目的图片地址，可能为空字符串或 null。
- `markdown` (string): 题目文本，支持 Markdown 和 LaTeX 公式（使用 `$$` 包裹）。
- `knowledge_points` (string[]): 知识点列表。
- `methods` (string[]): 解题方法列表。

---

## 2. 提交验证结果

将老师验证后的结果批量提交给后端。

- **接口地址**: `POST /submit`
- **描述**: 提交当前批次题目的验证状态，包括确认正确的和经过修改的数据。

### 请求参数 (Query Parameters)

| 参数名 | 类型   | 必选 | 描述                             |
| :----- | :----- | :--- | :------------------------------- |
| `key`  | string | 是   | 认证 Key (当前固定为 `12345abc`) |

### 请求体 (Request Body)

JSON 数组，包含每道题的验证结果。

```json
[
  {
    "id": "PAPER_2023_001",
    "question_number": 1,
    "modified": false,
    "final_knowledge_points": ["导数", "链式法则"],
    "final_methods": ["直接计算法"]
  },
  {
    "id": "PAPER_2023_001",
    "question_number": 2,
    "modified": true,
    "final_knowledge_points": ["一元二次方程", "韦达定理"],
    "final_methods": ["公式法"]
  }
]
```

### 字段说明

- `id` (string): 题目所属试卷ID。
- `question_number` (number): 题号。
- `modified` (boolean): 是否被修改。
  - `false`: 表示用户点击了“正确”，未修改内容。
  - `true`: 表示用户点击了“修改”并保存了新内容。
- `final_knowledge_points` (string[]): 最终确认的知识点列表（无论是原样还是修改后）。
- `final_methods` (string[]): 最终确认的方法列表。

### 响应结果 (Response)

```json
{
  "success": true,
  "message": "提交成功"
}
```

---

## 错误代码

如果发生错误，后端应返回非 200 状态码及错误信息。

```json
{
  "error": "Invalid API Key",
  "code": 401
}
```
