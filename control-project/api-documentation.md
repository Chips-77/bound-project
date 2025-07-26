# API接口文档

## 文档说明
本文档详细描述了控制系统的所有API接口，包括接口地址、请求方法、参数说明、响应格式等信息。

## 基础规范

### 接口URL
所有接口统一使用`/api`前缀，格式为：`/api/v1/[模块名]/[接口名]`

### 请求头
| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| Content-Type | string | 是 | 请求内容类型，通常为`application/json` |
| Authorization | string | 否 | 认证令牌，格式为`Bearer {token}`，登录接口不需要此参数 |

### 响应格式
所有接口返回格式统一为JSON，包含以下字段：
```json
{
  "code": 200,        // 状态码，200表示成功，其他表示失败
  "message": "success", // 提示信息
  "data": {}          // 响应数据，根据接口不同而变化
}
```

### 错误码说明
| 错误码 | 描述 |
|--------|------|
| 200 | 成功 |
| 400 | 参数错误 |
| 401 | 未认证 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 1. 认证相关接口

### 1.1 用户登录
- **描述**: 用户登录系统，获取认证令牌
- **URL**: `/api/v1/auth/login`
- **方法**: `POST`
- **请求参数**: 
  ```json
  {
    "username": "string", // 用户名，必填
    "password": "string", // 密码，必填
    "rememberMe": boolean  // 是否记住我，选填，默认false
  }
  ```
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "token": "string",       // 认证令牌
      "userInfo": {
        "id": "string",       // 用户ID
        "username": "string", // 用户名
        "avatar": "string",   // 头像URL
        "roles": []            // 角色列表
      }
    }
  }
  ```

### 1.2 用户登出
- **描述**: 用户退出登录
- **URL**: `/api/v1/auth/logout`
- **方法**: `POST`
- **请求参数**: 无
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success"
  }
  ```

### 1.3 获取用户信息
- **描述**: 获取当前登录用户的信息
- **URL**: `/api/v1/auth/userInfo`
- **方法**: `GET`
- **请求参数**: 无
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",       // 用户ID
      "username": "string", // 用户名
      "avatar": "string",   // 头像URL
      "email": "string",    // 邮箱
      "phone": "string",    // 手机号
      "roles": []            // 角色列表
    }
  }
  ```

## 2. 入库相关接口

### 2.1 创建入库单
- **描述**: 创建新的入库单
- **URL**: `/api/v1/inbound`
- **方法**: `POST`
- **请求参数**: 
  ```json
  {
    "supplierId": "string",  // 供应商ID，必填
    "warehouseId": "string", // 仓库ID，必填
    "inDate": "string",      // 入库日期，必填，格式：YYYY-MM-DD
    "operator": "string",    // 经办人，必填
    "remarks": "string",     // 备注，选填
    "productList": [          // 商品列表，必填
      {
        "productId": "string", // 商品ID，必填
        "quantity": number,     // 数量，必填
        "unitPrice": number     // 单价，必填
      }
    ]
  }
  ```
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",    // 入库单ID
      "orderNo": "string" // 入库单号
    }
  }
  ```

### 2.2 获取入库单历史
- **描述**: 查询入库单历史记录
- **URL**: `/api/v1/inbound/history`
- **方法**: `GET`
- **请求参数**: 
  - `page`: 页码，必填，默认1
  - `pageSize`: 每页条数，必填，默认10
  - `startDate`: 开始日期，选填，格式：YYYY-MM-DD
  - `endDate`: 结束日期，选填，格式：YYYY-MM-DD
  - `supplierId`: 供应商ID，选填
  - `warehouseId`: 仓库ID，选填
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "id": "string",        // 入库单ID
          "orderNo": "string",   // 入库单号
          "supplierName": "string", // 供应商名称
          "warehouseName": "string", // 仓库名称
          "inDate": "string",    // 入库日期
          "operator": "string",  // 经办人
          "totalAmount": number,  // 总金额
          "status": "string"     // 状态
        }
      ]
    }
  }
  ```

### 2.3 获取入库单详情
- **描述**: 获取指定入库单的详细信息
- **URL**: `/api/v1/inbound/{id}`
- **方法**: `GET`
- **请求参数**: 
  - `id`: 入库单ID，必填，位于URL路径中
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",        // 入库单ID
      "orderNo": "string",   // 入库单号
      "supplierId": "string", // 供应商ID
      "supplierName": "string", // 供应商名称
      "warehouseId": "string", // 仓库ID
      "warehouseName": "string", // 仓库名称
      "inDate": "string",    // 入库日期
      "operator": "string",  // 经办人
      "remarks": "string",   // 备注
      "totalAmount": number,  // 总金额
      "status": "string",    // 状态
      "productList": [        // 商品列表
        {
          "productId": "string", // 商品ID
          "productName": "string", // 商品名称
          "sku": "string",       // 商品SKU
          "specification": "string", // 规格
          "quantity": number,     // 数量
          "unitPrice": number,    // 单价
          "amount": number        // 金额
        }
      ]
    }
  }
  ```

## 3. 出库相关接口

### 3.1 创建出库单
- **描述**: 创建新的出库单
- **URL**: `/api/v1/outbound`
- **方法**: `POST`
- **请求参数**: 
  ```json
  {
    "customerId": "string",  // 客户ID，必填
    "warehouseId": "string", // 仓库ID，必填
    "outDate": "string",     // 出库日期，必填，格式：YYYY-MM-DD
    "operator": "string",    // 经办人，必填
    "remarks": "string",     // 备注，选填
    "productList": [          // 商品列表，必填
      {
        "productId": "string", // 商品ID，必填
        "quantity": number,     // 数量，必填
        "unitPrice": number     // 单价，必填
      }
    ]
  }
  ```
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",    // 出库单ID
      "orderNo": "string" // 出库单号
    }
  }
  ```

### 3.2 获取出库单历史
- **描述**: 查询出库单历史记录
- **URL**: `/api/v1/outbound/history`
- **方法**: `GET`
- **请求参数**: 
  - `page`: 页码，必填，默认1
  - `pageSize`: 每页条数，必填，默认10
  - `startDate`: 开始日期，选填，格式：YYYY-MM-DD
  - `endDate`: 结束日期，选填，格式：YYYY-MM-DD
  - `customerId`: 客户ID，选填
  - `warehouseId`: 仓库ID，选填
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "id": "string",        // 出库单ID
          "orderNo": "string",   // 出库单号
          "customerName": "string", // 客户名称
          "warehouseName": "string", // 仓库名称
          "outDate": "string",   // 出库日期
          "operator": "string",  // 经办人
          "totalAmount": number,  // 总金额
          "status": "string"     // 状态
        }
      ]
    }
  }
  ```

### 3.3 获取出库单详情
- **描述**: 获取指定出库单的详细信息
- **URL**: `/api/v1/outbound/{id}`
- **方法**: `GET`
- **请求参数**: 
  - `id`: 出库单ID，必填，位于URL路径中
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",        // 出库单ID
      "orderNo": "string",   // 出库单号
      "customerId": "string", // 客户ID
      "customerName": "string", // 客户名称
      "warehouseId": "string", // 仓库ID
      "warehouseName": "string", // 仓库名称
      "outDate": "string",   // 出库日期
      "operator": "string",  // 经办人
      "remarks": "string",   // 备注
      "totalAmount": number,  // 总金额
      "status": "string",    // 状态
      "productList": [        // 商品列表
        {
          "productId": "string", // 商品ID
          "productName": "string", // 商品名称
          "sku": "string",       // 商品SKU
          "specification": "string", // 规格
          "quantity": number,     // 数量
          "unitPrice": number,    // 单价
          "amount": number        // 金额
        }
      ]
    }
  }
  ```

### 3.4 删除库存记录
- **描述**: 删除指定的库存记录
- **URL**: `/api/v1/inventory/{id}`
- **方法**: `DELETE`
- **请求参数**: 
  - `id`: 库存记录ID，必填，位于URL路径中
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success"
  }
  ```

## 4. 设置相关接口

### 4.1 上传头像
- **描述**: 上传用户头像
- **URL**: `/api/v1/user/upload-avatar`
- **方法**: `POST`
- **请求头**: 
  - `Content-Type`: `multipart/form-data`
- **请求参数**: 表单数据
  - `avatar`: 文件，必填，图片格式
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "avatarUrl": "string" // 头像URL
    }
  }
  ```

### 4.2 更新个人信息
- **描述**: 更新用户个人信息
- **URL**: `/api/v1/user/update-info`
- **方法**: `POST`
- **请求参数**: 
  ```json
  {
    "username": "string", // 用户名，选填
    "email": "string",    // 邮箱，选填
    "phone": "string"     // 手机号，选填
  }
  ```
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success"
  }
  ```

## 5. 统计相关接口

### 5.1 查询库存列表
- **描述**: 查询库存信息
- **URL**: `/api/v1/inventory/query`
- **方法**: `GET`
- **请求参数**: 
  - `page`: 页码，必填，默认1
  - `pageSize`: 每页条数，必填，默认10
  - `warehouseId`: 仓库ID，选填
  - `productId`: 商品ID，选填
  - `keyword`: 搜索关键词，选填，可搜索商品名称或SKU
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "productId": "string",    // 商品ID
          "productName": "string",  // 商品名称
          "sku": "string",          // 商品SKU
          "specification": "string", // 规格
          "warehouseId": "string",  // 仓库ID
          "warehouseName": "string", // 仓库名称
          "quantity": number         // 库存数量
        }
      ]
    }
  }
  ```

### 5.2 获取商品列表
- **描述**: 获取商品列表
- **URL**: `/api/v1/products`
- **方法**: `GET`
- **请求参数**: 
  - `keyword`: 搜索关键词，选填，可搜索商品名称或SKU
  - `page`: 页码，选填，默认1
  - `pageSize`: 每页条数，选填，默认20
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "id": "string",       // 商品ID
          "name": "string",     // 商品名称
          "sku": "string",      // 商品SKU
          "specification": "string", // 规格
          "category": "string", // 分类
          "unit": "string",     // 单位
          "price": number        // 价格
        }
      ]
    }
  }
  ```

### 5.3 更新库存数量
- **描述**: 更新指定商品在指定仓库的库存数量
- **URL**: `/api/v1/inventory/update`
- **方法**: `POST`
- **请求参数**: 
  ```json
  {
    "productId": "string",  // 商品ID，必填
    "warehouseId": "string", // 仓库ID，必填
    "quantity": number        // 新的库存数量，必填
  }
  ```
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success"
  }
  ```

### 5.4 获取供应商列表
- **描述**: 获取供应商列表
- **URL**: `/api/v1/suppliers`
- **方法**: `GET`
- **请求参数**: 
  - `keyword`: 搜索关键词，选填
  - `page`: 页码，选填，默认1
  - `pageSize`: 每页条数，选填，默认20
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "id": "string",       // 供应商ID
          "name": "string",     // 供应商名称
          "contact": "string",  // 联系人
          "phone": "string",    // 联系电话
          "address": "string"   // 地址
        }
      ]
    }
  }
  ```

### 5.4 获取客户列表
- **描述**: 获取客户列表
- **URL**: `/api/v1/customers`
- **方法**: `GET`
- **请求参数**: 
  - `keyword`: 搜索关键词，选填
  - `page`: 页码，选填，默认1
  - `pageSize`: 每页条数，选填，默认20
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "total": number,     // 总记录数
      "list": [
        {
          "id": "string",       // 客户ID
          "name": "string",     // 客户名称
          "contact": "string",  // 联系人
          "phone": "string",    // 联系电话
          "address": "string"   // 地址
        }
      ]
    }
  }
  ```

### 5.5 获取仓库列表
- **描述**: 获取仓库列表
- **URL**: `/api/v1/warehouses`
- **方法**: `GET`
- **请求参数**: 无
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": [
      {
        "id": "string",       // 仓库ID
        "name": "string",     // 仓库名称
        "location": "string", // 位置
        "category": "string"  // 仓库分类: 'finished'（成品仓）或 'material'（材料仓）
      }
    ]
  }
  ```

## 6. 商品相关接口

### 6.1 获取商品详情
- **描述**: 获取商品详细信息
- **URL**: `/api/v1/products/{id}`
- **方法**: `GET`
- **请求参数**: 
  - `id`: 商品ID，必填，位于URL路径中
- **返回值**: 
  ```json
  {
    "code": 200,
    "message": "success",
    "data": {
      "id": "string",       // 商品ID
      "name": "string",     // 商品名称
      "sku": "string",      // 商品SKU
      "specification": "string", // 规格
      "category": "string", // 分类
      "unit": "string",     // 单位
      "price": number,       // 价格
      "description": "string", // 描述
      "images": ["string"]  // 图片URL列表
    }
  }
  ```