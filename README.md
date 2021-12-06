<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Nest is [MIT licensed](LICENSE).

# microservice-nestjs-template

## Setup

install [cz-cli](https://github.com/commitizen/cz-cli)

```
npm install --save-dev commitizen

npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

## Build template

> template 從 0 開始的建立步驟，此 template 皆已處理完畢

install [cz-cli](https://github.com/commitizen/cz-cli)

```
npm install --save-dev commitizen

npx commitizen init cz-conventional-changelog --save-dev --save-exact

npm install --save-dev @commitlint/{config-conventional,cli}

# Configure commitlint to use conventional config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

```

install [husky](https://typicode.github.io/husky/#/)

```
npx husky add .husky/prepare-commit-msg "exec < /dev/tty && npx cz --hook || true"

npx husky add .husky/commit-msg "npx --no-install commitlint --edit $1"

npx husky add .husky/pre-commit "npx lint-staged"
```

install [lint-staged](https://github.com/okonet/lint-staged#installation-and-setup)

```
add
{
    ...

    "lint-staged": {
        "**/*.ts?(x)": "bash -c tsc -p tsconfig.json --noEmit",
        "{src,apps,libs,test}/**/*.ts": "eslint --fix",
        "*.{js,jsx,ts, tsx,md,html,css}": "prettier --write"
    }
}
```

renovate [doc](https://docs.renovatebot.com/)

install [semantic-release](https://semantic-release.gitbook.io/semantic-release/)

```
npm install --save-dev semantic-release

npm install --save-dev @semantic-release/git @semantic-release/changelog
```

add file .releaserc

```
{
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    ["@semantic-release/npm", {
      "npmPublish": false,
      "tarballDir": "dist",
    }],
    ["@semantic-release/github", {
      "assets": ["dist/**"]
      }],
    "@semantic-release/git"
  ]
}

```

create `.github/`

create `pull_request_template.md` 及 `workflows/release.yml` in `.github/`

install [dotenv-safe](https://github.com/motdotla/dotenv#readme)

```

npm install --save dotenv-safe

touch .env.example

```

create `setup-env.ts`

```js
import * as dotenv from 'dotenv-safe';

dotenv.config();
```

load env main.ts

```js
import './setup-env';
```

config [nest openApi](https://docs.nestjs.com/openapi/introduction)

```
npm install --save @nestjs/swagger swagger-ui-express

```

#### 開發守則

1. 程式碼應避免使用任何語言的種族歧視性言語

```
    正例：日本人/ 印度人/ blockList / allowList / secondary
    反例：RIBENGUIZI/ Asan/ blackList / whiteList / slave
```

2. 命名風格
   2.1. Class name 使用 `UpperCamelCase` 風格，但以下情形例外 `BO / DTO / AO/ PO/ URL` 等多單字縮寫
   2.2. Function name 使用 `lowCamelCase` 風格

3. `Abstract` 用 `Abstract` 開頭; `Interface` 用 `I` 開頭; 錯誤類別用 `EXCEPTION` 結尾; 測試類別命名以測試類的名稱開始，以 `Test` 結尾

4. 常量名稱全部大寫，單詞間用底線區隔，力求語意清楚，不要嫌名字長

```
    正例：MAX_STOCK_COUNT / CACHE_EXPIRED_TIME
    反例：MAX_COUNT / EXPIRED_TIME
```

5. 如果參數的結構是 `array` 請加上 s

6. 杜絕完全不規範的縮寫，以免不清楚意思

```
    反例：AbstractClass“縮寫”命名成 AbsClass；condition“縮寫”命名成 condi，此類隨意縮寫嚴重降低了可讀性
```

7. `Enum / BO / DTO / AO/ PO` 命名須加在結尾; `BO` 與 `AO` 開頭用 `function` 名稱命名，相關命名方式可看開發規範的 13, 14 條，共用的或非特定給某個 function 使用則不限於此

8. 當 http action 在 `controller function` 命名有特定規則的開頭 如下：

```
    post => create
    delete => delete
    get => find
    put => update
```

9. 開發過程應避免：內容耦合、共用耦合、控制耦合。詳細請見[參考資料](#####開發守則-參考文獻) 中的相依及耦合

   - 內容耦合(content coupling)

     ```
     內容耦合是指直接相依耦合對象的內部實裝內容。
     可以舉出的其中一個極端例子是從外部直接跳到某個 procedure 的特定標籤。
     在近代的程式語言中，大多是透過限制跳躍方法，使這種內容耦合難以產生。
     但是若編寫了相依於某個物件的內部狀態的程式碼，就會變成與內容耦合同等的強耦合。
     ```

   - 共用耦合 (common coupling)

     ```
     此一耦合為使用全域變數、可變單例模式物件或檔案等單一外部resource並共享狀態時發生的耦合。
     雖然在大多數情況下，不得不使用檔案等resource，但全域變數與可變單例模式物件應盡可能避免使用。
     若將可變物件維持為全域變數，將會使管理變困難。
     例如除了無法限制生命週期或參照源，也難以替換為其他物件來變更規格或做測試。
     ```

   - 控制耦合 (control coupling)

     ```
     控制耦合是指依參數不同而使動作不同的相依關係。
     例如撰寫「接收真假値或列舉型的値，再依據所接收的值執行不同動作」的 procedure，即會產生控制耦合。
     特別是當該不同動作間共用的部分少或分歧範圍廣泛時，應減少耦合。在減少控制耦合的方法中，有以下幾項。

     1. 分離procedure，刪除條件分岐
     2. 不以條件而以對象區分邏輯
     3. 使用策略模式
     ```

10. 封裝屬性的繼承使用方式 `BO / DTO / AO/ PO` 等

- extends=> 當`繼承者`與`被繼承者`兩者屬性一模一樣或當`繼承者要`增加屬性
- implements => 會有一個 DB schema 的 interface (請參考`開發規範 11`)，`PO` 的第一個基礎類別 跟 `entity` 的類別一定要 implements 此 interface ，如果 `DTO` 需要可斟酌使用
- PartialType => `為 nestjs 提供的 function` 與 `extends` 一起使用，但繼承後全部會變成可選，當`繼承者`與`被繼承者`兩者屬性一模一樣或當`繼承者要`增加屬性時可以搭配使用 \*\*\*此參數應該只有 DTO 可用
- omittype => `為 nestjs 提供的 function` 與 `extends` 一起使用，當使用只有繼承被選中的屬性，例如更改密碼可用此參數取得 `password` 的定義與 `decorator` ，搭配 `extends & PartialType` 使用

11. interface 先定義基礎的 table schema 然後由 `entity` 與 `po` 分別實現; 命名 `I` 開頭 `BASE` 結尾

可以參考 [src/users/interface/user.interface.ts](src/users/interface/user.interface.ts) 裡的 IUserBase

12. `BO / DTO / AO/ PO` 等定義看 [名詞解釋](####名詞解釋)，如有不符合之情境，如 pipe 等 middleware 請將`參數型態`定義在 common 的相對應之資料夾內，例：[src/common/dto/exception.dto.ts](src/common/dto/exception.dto.ts)．
    若情境是使用既有定義，則可不用額外定義，例如： controller function 要求參數為某 service function 的回傳值 (`BO`)，則可不為該 controller function 參數新定義 `DTO`

13. `DTO` 的命名組成及情境如下，內容參數後方加上 ? 為 optional，action type 可參考開發規範 8 <br>
    > 此處僅規範 API 接口之 function，內部 function 則不適用

- 當使用在 API 參數內時
  `{action type?} + {受詞} + {api request parameter type?} + DTO`<br>

  api request parameter type 有以下三種

  - Query
  - Param
  - Body

####_如有不符合上述情境之狀況，則力求語意完整且免重複即可_

14. `function` 的命名組成如下：<br>
    `動詞 + 受詞`<br>
    `動詞` 可參考`開發規範 8` 的 `action type` <br>
    如 function 內有傳入參數則在結尾加上 by 如下：<br>
    `動詞 + 受詞 + by`<br>
    如 function 名稱有重複則在 by 後寫參數名稱(以 and 連接)或是簡寫 `DTO` 如下：<br>
    `動詞 + 受詞 + by + {DTO or 參數名稱}`<br>

####_如有不符合上述情境之狀況，則力求語意完整且免重複即可_

15. 註解風格，詳細請見[參考資料](#####開發守則-參考文獻) 中的 `程式碼中的特殊註釋`

    - TODO => 英語翻譯為待辦事項，備忘錄。如果程式碼中有該標識，說明在標識處有功能程式碼待編寫，`待實現的功能在說明中會簡略說明`
    - FIXME => 如果程式碼中有該標識，說明標識處程式碼需要修正，甚至程式碼是錯誤的，不能工作，需要修復，`如何修正會在說明中簡略說明`
    - XXX => 如果程式碼中有該標識，說明標識處程式碼雖然實現了功能，但是實現的方法有待商榷，希望將來能改進，`要改進的地方會在說明中簡略說明`
    - HACK => 如果程式碼中有該標識，代表這段 code 目前雖然是 work 但是做法非常爛，`請在後面簡略說明缺點，及困難`。[參考資料](#####開發守則-參考文獻) 中的 `FIXME 套件`

    例如：

```javascript
// TODO 之後應該回傳使用者資訊
// FIXME 此數時區應該改用 UTC 時間
```

16. `function` 參數最多只能三個，如果超過三個請包成 `DTO`

17. 若定義可能為多 microservice 共用 (例如分頁)，則可放至 template，microservice 更新時再自行決定是否使用

##### 開發守則-參考文獻

- [命名規範-阿里巴巴開發手冊（華山版 1.5.0）](https://developer.aliyun.com/special/tech-java 'Title')
- [相依及耦合-Line engineer](https://engineering.linecorp.com/zh-hant/blog/code-readability-vol4/ 'Title')
- [程式碼中的特殊註釋](https://www.jianshu.com/p/7f581c7aa638/ 'Title')
- [FIXME 套件](https://github.com/JohnPostlethwait/fixme/ 'Title')

#### RESTFUL API 命名規範

1. 資源 URI 應該要依據名詞 (資源) 而不是動詞 (在資源上的作業)。

```
    https://adventure-works.com/orders // Good
    https://adventure-works.com/create-order // Avoid
```

2. 資源不一定要以單一實體資料項目為基礎。 例如，訂單資源可能會以關聯式資料庫中數個資料表的形式在內部實作，但以單一實體的形式呈現給用戶端。 請避免建立只是反映資料庫內部結構的 API。 REST 的目的在於將實體，以及應用程式能在這些實體上所執行的作業加以模型化。 用戶端不應向內部實作公開。

```
    https://adventure-works.com/orders
```

3. 在 URI 中請採用一致的命名慣例。 一般而言，在參考集合的 URI 中使用複數名詞比較有效益。 將集合的 URI 和項目組織成階層是很好的做法。 例如，/customers 是客戶集合的路徑，而 /customers/5 則是其 ID 等於 5 的客戶路徑。 這個方法有助於維持 Web API 的直覺性。 此外，許多 Web API 架構可根據參數化的 URI 路徑來路由傳送要求，因此您可以定義路徑 /customers/{id} 的路由。
4. 將不同類型之資源間的關聯性，以及公開這些關聯的方式納入考量。 例如，`/customers/5/orders` 可能代表客戶 5 的所有訂單。 您也可以嘗試從另一個方向切入；從訂單倒推具有如 `/orders/99/customer` URI 的客戶，來表示其關聯性。 不過，過度擴充此模型可能會導致難以實作。

5. uri 設計應該盡量保持單純，提供可讓用戶端導覽數個層級關聯性 (例如 /customers/1/orders/99/products) 會很吸引人，不過資源之間的關聯性在未來發生變更，這種程度的複雜度不僅難以維持，也缺乏彈性。 應該可以使用這個參考來尋找與該資源相關的項目。 用 `URI /customers/1/orders` 來取代上述查詢，找出客戶 1 的所有訂單，然後用 `/orders/99/products`來尋找此順序中的產品。

6. Error 的錯誤訊息格式應該要有以下資訊

- 自訂錯誤回傳值
- 追蹤 log 的 id
- 提供前端足夠的資訊能夠修正 request

```
"type": "{可以留 rfc 的網址"},
"message or title": "{錯誤的 title}",
"status": 404,
"traceId": "{留下我們 log 儲存的 Id}"
 "errors": [
        {
            "error": "auth-0001",
            "message": "Incorrect username and password",
            "detail": "Ensure that the username and password included in the request are correct",
            "help": "https://example.com/help/error/auth-0001"
        },
        ...
    ]
```

6. `以後優化` 版本控制改成用 header with content-type 的方式 目前不支援

- [追蹤 issue](https://github.com/nestjs/nest/issues/5065 'Title')

7. `以後優化` 回傳的 `header` 需要有

- `api-supported-version` 回傳最高支援的版本
- `api-deprecated-version` 回傳已廢棄的版本

##### RESTFUL API 命名規範-參考文獻

- [API 設計指南](https://docs.microsoft.com/zh-tw/azure/architecture/best-practices/api-design 'Title')
- [API sorting, pagination 等的好處](https://www.moesif.com/blog/technical/api-design/REST-API-Design-Filtering-Sorting-and-Pagination/ 'Title')
- [Error handling best practice](https://www.baeldung.com/rest-api-error-handling-best-practices 'Title')
- [API Design 教學影片](https://app.pluralsight.com/course-player?clipId=99f94033-94d1-4125-abf8-eb20f82503b3 'Title')
- [content-type 跟 accept 詳解](https://observersupport.viavisolutions.com/html_doc/current/index.html#page/rest_api/rest_api_headers.html 'Title')

#### 事件命名

格式：`{service-name}:{event-name}`

使用 kebab-case，並用 `:` 分隔，動詞使用過去式

#### project structure

```
install tree

tree -I "node_modules|dist"
```

```
project
├── CHANGELOG.md
├── README.md
├── commitlint.config.js
├── nest-cli.json
├── package-lock.json
├── package.json
├── src
│   ├── app.controller.spec.ts
│   ├── app.controller.ts
│   ├── app.module.ts
│   ├── app.service.ts
│   ├── common // common 資料夾存放位址為 src/common
│   │   ├── ao
│   │   │   ├── collection.ao.ts
│   │   │   ├── link.ao.ts
│   │   │   └── pagination.ao.ts
│   │   ├── dto
│   │   │   ├── exception.dto.ts // 裡面的 exception dto 為 filters 內的 dto (以使用 nestjs 之視角描述)
│   │   │   ├── order-by.dto.ts
│   │   │   └── pagination.dto.ts
│   │   ├── enum
│   │   │   └── order.enum.ts
│   │   └── filters
│   │       └── http-exception.filter.ts
│   ├── main.ts
│   └── users
│       ├── ao
│       │   └── user.ao.ts
│       ├── bo
│       │   └── user.bo.ts
│       ├── dto
│       │   └── user.dto.ts
│       ├── entities
│       │   └── user.entity.ts
│       ├── enum
│       │   └── user.enum.ts
│       ├── interface
│       │   └── user.interface.ts
│       ├── po
│       │   └── user.po.ts
│       ├── users.controller.spec.ts
│       ├── users.controller.ts
│       ├── users.module.ts
│       ├── users.repository.ts
│       ├── users.service.spec.ts
│       └── users.service.ts
├── test
│   ├── app.e2e-spec.ts
│   ├── jest-e2e.json
│   └── nestjs-swagger-transformer.js
├── tsconfig.build.json
└── tsconfig.json
```

#### 常用 Http Status Code

######2xx 成功

1. 200 OK

   - 請求已成功，請求所希望的回應頭或資料體將隨此回應返回。
     實際的回應將取決於所使用的請求方法。
     在`GET`請求中，回應將包含與請求的資源相對應的實體。
     在`POST`請求中，回應將包含描述或操作結果的實體，如果沒有回傳值則用`204 No Content`。

2. 201 Created

   - 請求已經被實現，而且有一個新的資源已經依據請求的需要而建立。
     假如需要的資源無法及時建立的話，應當返回`202 Accepted`。

3. 202 Accepted

   - 伺服器已接受請求，但尚未處理。
     最終該請求可能會也可能不會被執行，並且可能在處理發生時被禁止。

4. 204 No Content
   - 伺服器成功處理了請求，沒有返回任何內容。如果有回傳值請用`200 OK`。

######4xx 客戶端錯誤

1. 400 Bad Request
   - 由於明顯的客戶端錯誤（例如，格式錯誤的請求語法，太大的大小，無效的請求訊息或欺騙性路由請求），伺服器不能或不會處理該請求。
2. 401 Unauthorized

   - 類似於 403 Forbidden，401 語意即「未認證」，即用戶沒有必要的憑據。

3. 403 Forbidden
   - 伺服器已經理解請求，但是拒絕執行它。與 401 回應不同的是，身分驗證並不能提供任何幫助，而且這個請求也不應該被重複提交。
     如果不想讓用戶知道原因可以回覆 404
4. 404 Not Found

   - 請求失敗，請求所希望得到的資源未被在伺服器上發現，但允許用戶的後續請求

5. 408 Request Timeout

   - 請求逾時。根據 HTTP 規範，客戶端沒有在伺服器預備等待的時間內完成一個請求的傳送，客戶端可以隨時再次提交這一請求而無需進行任何更改。

6. 415 Unsupported Media Type
   - 對於當前請求的方法和所請求的資源，請求中提交的網際網路媒體類型並不是伺服器中所支援的格式，因此請求被拒絕。
7. 429 Too Many Requests
   - 用戶在給定的時間內傳送了太多的請求。旨在用於網路限速。

##### 常用 Http Status Code -參考文獻

- [HTTP 狀態碼-維基百科](https://zh.wikipedia.org/zh-tw/HTTP%E7%8A%B6%E6%80%81%E7%A0%81 'Title')
- [RFC2616](https://tools.ietf.org/html/rfc2616 'Title')

#### 名詞解釋

- `DTO` 為 function 的傳入參數
- `PO` 為 repository 層的 response schema
- `BO` 為 service 層的 response schema
- `AO` 為 controller 層的 response schema

## 建立新的 microservice repository

基於此 template 建立新的 microservice

建議使用自動化流程

### 自動流程

#### 1. 建立 repository

在 github 上先建立新的 microservice repository，例如： `aom-microservice-<microservice name>`

#### 2. clone template

```
git clone git@github.com:CYRArea/microservice-nestjs-template.git aom-microservice-<microservice name>
```

#### 3. 自動初始化 project

- `npm run project:init`
- 確認初始化沒問題
- `git add .`
- `git commit`
- `git push -u origin master`

### 手動流程

#### 1. 建立 repository

在 github 上先建立新的 microservice repository，例如： `aom-microservice-<microservice name>`

#### 2. clone template

clone template 及修改 remote

```
git clone git@github.com:CYRArea/microservice-nestjs-template.git aom-microservice-<microservice name>
git remote rename origin upstream
git remote add origin git@github.com:CYRArea/aom-microservice-<microservice name>.git
```

#### 3. 修改 package.json

1. 修改 `name`
2. 及 `version` (從 `1.0.0` 開始)
3. 修改 `author`, `contributors`

#### 4. 刪除 CHANGELOG.md

刪除 template 既有的 `CHANGELOG.md`

#### 5. 重設 branch upstream

`npm install` 及 commit 後

```
git push -u origin master
```

#### 6. template 更新時，microservice 更新方式

如果第一次 merge 需先執行 `git config --global merge.ours.driver true`

```
npm run template:merge
```

## git

### branch naming

use kebab-case

follow conventional commit type:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- ci: Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs)
- chore: Other changes that don't modify src or test files
- revert: Reverts a previous commit
