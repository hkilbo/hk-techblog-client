---
title: "IaC 기반 AWS Lambda 모노레포 구축기"
summary: "여러 서비스에서 사용하는 Lambda 함수와 배포 환경을 어떻게 효율적으로 관리할 수 있을까요? IaC를 기반으로 인프라 설정을 코드로 관리하고, Lambda Alias를 활용한 환경 분리와 API Gateway 라우트 자동화, GitHub Actions를 통한 배포 구조를 구축한 경험을 소개합니다."
category: tech
topic: frontend
tags: ["AWS Lambda", "IaC", "Monorepo", "Serverless Framework", "GitHub Actions"]
author: { name: "가을", role: "Frontend Engineer" }
publishedAt: 2026-11-06
readingMinutes: 11
cover: ./cover.svg
---

안녕하세요. 한국일보에서 프론트엔드 개발을 맡고 있는 가을입니다.

프론트엔드 서비스를 개발하다 보면 이미지 처리나 파일 업로드처럼 별도의 서버 로직이 필요한 상황이 생깁니다. 이러한 기능을 구현할 때 AWS Lambda를 활용하면 별도의 서버를 직접 운영하지 않고도 필요한 기능을 제공할 수 있습니다.

하지만 Lambda를 사용하는 서비스가 늘어나면서 함수마다 배포 방식과 인프라 설정을 개별적으로 관리해야 하는 문제가 생겼습니다. 새로운 서비스를 추가할 때마다 배포 파이프라인을 구성하고, API Gateway와 권한을 설정하는 과정도 반복되었습니다.

이러한 문제를 해결하기 위해 **IaC(Infrastructure as Code)를 기반으로 여러 서비스의 Lambda 함수와 인프라 설정을 하나의 저장소에서 관리하는 모노레포 구조**를 구축했습니다.

이번 글에서는 IaC를 도입한 이유부터 Lambda Alias를 활용한 환경 분리, API Gateway 라우트 자동화, GitHub Actions를 통한 배포 구조까지 구현 과정에서 고민했던 핵심 기술을 소개하겠습니다.

## 1. 왜 IaC 기반 모노레포를 구축했을까요?

기존에는 서비스마다 Lambda 함수의 배포 환경과 인프라 설정을 개별적으로 관리했습니다.

서비스가 적을 때는 큰 문제가 없었지만, 새로운 기능이 추가될수록 비슷한 배포 로직과 인프라 설정을 반복해서 관리해야 했습니다.

특히 AWS 콘솔에서 직접 설정한 리소스는 변경 이력을 추적하기 어렵고, 새로운 서비스를 추가하거나 기존 환경을 재구성할 때 동일한 설정을 다시 적용해야 하는 문제가 있었습니다.

이러한 문제를 해결하기 위해 **IaC(Infrastructure as Code)** 구조를 도입하고자 했습니다.

IaC는 서버, 네트워크, 권한 등 인프라 구성을 콘솔에서 수동으로 설정하는 대신 코드로 정의하고 관리하는 방식입니다.

이를 통해 인프라 설정을 Git으로 버전 관리하고, 코드 리뷰를 통해 변경 사항을 검토하며, 동일한 설정을 반복적으로 적용할 수 있습니다.

이번에는 다음과 같은 목표를 세웠습니다.

- 여러 서비스의 Lambda 코드와 인프라 설정을 하나의 저장소에서 관리합니다.
- 서비스별 배포는 독립적으로 수행하면서 공통 배포 로직을 재사용합니다.
- Lambda와 API Gateway 등 주요 인프라 설정을 코드로 선언하고 자동화합니다.
- 새로운 서비스를 추가할 때 반복적인 수동 설정을 최소화합니다.

이를 위해 **pnpm workspace와 Serverless Framework**를 기반으로 모노레포를 구성했습니다.

```text
lambda-monorepo/
├── .github/
│   └── workflows/
├── scripts/
│   ├── deploy.sh
│   └── build.mjs
├── plugins/
│   ├── master-alias-dev.js
│   └── routes.js
├── services/
│   ├── service-a/
│   │   ├── serverless.yml
│   │   ├── deploy.json
│   │   └── src/
│   └── service-b/
│       ├── serverless.yml
│       ├── deploy.json
│       └── src/
└── pnpm-workspace.yaml
```

각 서비스는 `services/` 디렉터리에서 독립적인 소스코드와 설정을 관리하고, 공통 배포 스크립트와 Serverless 플러그인은 저장소 루트에서 공유하도록 구성했습니다.

특히 `serverless.yml`에서 Lambda 함수와 환경별 설정을 선언하면 Serverless Framework가 CloudFormation을 통해 필요한 AWS 리소스를 생성하고 관리하도록 했습니다.

이렇게 하면 새로운 서비스를 추가하더라도 기존 배포 로직을 다시 구현할 필요 없이 동일한 구조를 활용할 수 있습니다.

## 2. Lambda Alias를 활용한 환경 분리

Lambda를 여러 환경에서 운영하려면 환경별로 함수를 각각 생성하거나, 하나의 함수에서 버전을 구분하는 방식을 사용할 수 있습니다.

이번에는 **서비스마다 Lambda 함수 하나를 생성하고, 환경은 Alias로 구분하는 방식**을 선택했습니다.

AWS Lambda에는 Version과 Alias라는 기능이 있습니다.

- **Version:** 특정 시점의 함수 코드와 주요 설정을 고정한 불변 버전입니다.
- **Alias:** 특정 Version을 참조하는 논리적인 이름입니다.

이를 활용하면 하나의 Lambda 함수에서 여러 환경이 서로 다른 버전을 참조하도록 구성할 수 있습니다.

```text
Lambda Function
    │
    ├── Version 1 ◀──── Alias C
    ├── Version 2 ◀──── Alias B
    └── Version 3 ◀──── Alias A
```

새로운 코드를 배포하면 Version이 생성되고, 배포 대상 Alias만 해당 Version을 가리키도록 변경합니다.

다른 Alias는 기존 Version을 그대로 참조하기 때문에 새로운 배포의 영향을 받지 않습니다. 또한 Version에는 환경변수와 실행 역할 등 주요 설정도 함께 고정되므로, 환경에 따라 서로 다른 리소스를 사용하도록 구성할 수 있습니다.

이 방식의 가장 큰 장점은 **문제가 발생했을 때 코드를 다시 빌드하거나 배포하지 않고 Alias를 이전 Version으로 변경해 롤백할 수 있다는 점**입니다.

### Serverless Framework와 Alias

환경별 배포에는 Serverless Framework와 Alias 플러그인을 활용했습니다.

Serverless Framework의 일반적인 배포 방식은 Stage를 기준으로 리소스를 구분하지만, 이번에는 Alias 플러그인을 통해 하나의 함수에서 여러 환경을 관리하도록 구성했습니다.

다만 사용한 플러그인은 최초 배포 시 Master Alias가 필요하다는 제약이 있었습니다. 이를 해결하기 위해 별도의 로컬 플러그인을 추가하고 초기 Alias를 자동으로 설정하도록 개선했습니다.

이를 통해 새로운 서비스를 추가할 때 별도의 수동 작업 없이 동일한 배포 구조를 활용할 수 있도록 했습니다.

## 3. API Gateway 라우트 자동화

Lambda 함수를 배포한 뒤에는 클라이언트가 호출할 수 있도록 API Gateway와 연결해야 합니다.

이번 구조에서는 **API Gateway가 Lambda의 환경별 Alias를 호출하도록 구성하는 것**이 중요했습니다.

하지만 사용한 Alias 플러그인과 Serverless Framework의 기본 HTTP API 설정만으로는 원하는 Alias에 라우트를 연결하기 어려웠습니다.

이를 해결하기 위해 **API Gateway 라우트를 자동으로 연결하는 로컬 Serverless 플러그인**을 구현했습니다.

### 선언형 라우트 관리

IaC 구조를 유지하기 위해 각 서비스의 `serverless.yml`에 필요한 API 라우트를 선언하도록 구성했습니다.

```yaml
custom:
  alias:
    dev:
      routes:
        - POST /example-dev
        - OPTIONS /example-dev
```

배포 과정에서 플러그인은 선언된 라우트를 확인하고, 해당 Lambda Alias를 대상으로 하는 API Gateway 통합과 호출 권한을 자동으로 구성합니다.

이미 동일한 설정이 존재하면 불필요한 변경을 수행하지 않으며, 다른 서비스에서 사용하는 라우트에는 영향을 주지 않도록 했습니다.

또한 라우트 설정을 AWS 콘솔이 아닌 코드에서 관리하도록 하여, **새로운 API를 추가하거나 변경할 때 `serverless.yml`만 수정하면 배포 과정에서 자동으로 반영되도록** 개선했습니다.

이를 통해 여러 서비스가 하나의 API Gateway를 공유하면서도 각 서비스의 라우트를 독립적으로 관리할 수 있도록 했습니다.

## 4. GitHub Actions와 OIDC를 활용한 배포

여러 서비스를 하나의 저장소에서 관리하면서 배포 파이프라인도 공통화할 필요가 있었습니다.

이를 위해 **GitHub Actions의 Reusable Workflow**를 활용했습니다.

각 서비스는 배포 대상과 Git 태그 등 필요한 정보만 전달하고, 실제 빌드와 배포는 공통 워크플로에서 수행하도록 구성했습니다.

전체적인 배포 흐름은 다음과 같습니다.

```text
GitHub Actions
      │
      ▼
Reusable Workflow
      │
      ▼
AWS OIDC 인증
      │
      ▼
IAM Role
      │
      ▼
Serverless Framework
      │
      ▼
CloudFormation
      │
      ▼
Lambda Version / Alias
      │
      ▼
API Gateway 라우트 연결
```

GitHub Actions에서 배포를 실행하면 공통 워크플로가 AWS 인증을 수행하고, Serverless Framework를 통해 인프라와 Lambda 함수를 배포합니다.

배포가 완료되면 로컬 플러그인이 선언된 API Gateway 라우트를 Lambda Alias에 연결합니다.

### OIDC 기반 인증

AWS 배포 권한을 관리하는 과정에서는 장기 Access Key 대신 <strong>OIDC(OpenID Connect)</strong>를 활용했습니다.

GitHub Actions가 실행될 때 AWS STS를 통해 임시 자격 증명을 발급받도록 구성해, 저장소에 장기 Access Key를 보관하지 않아도 되도록 했습니다.

또한 배포 역할의 권한은 함수 이름 규칙과 리소스 범위에 따라 제한했습니다.

예를 들어 Lambda 함수가 공통 접두사를 사용하는 이름 규칙을 따르도록 구성하면, 새로운 서비스를 추가하더라도 기존 IAM 정책을 재사용할 수 있습니다.

이를 통해 서비스마다 IAM 정책을 새로 작성해야 하는 부담을 줄이면서 배포 권한의 범위도 제한할 수 있었습니다.

### 배포와 롤백

배포 시에는 Git 태그를 기준으로 소스코드를 가져와 빌드하고, Serverless Framework를 통해 Lambda Version과 Alias를 갱신합니다.

배포 전에는 기존 Alias의 Version을 기록하고, 배포 이후에는 스모크 테스트를 실행해 정상 동작 여부를 확인하도록 구성했습니다.

롤백이 필요한 경우에는 이전 버전으로 다시 배포하거나, 긴급 상황에서 Alias를 이전 Version으로 직접 변경할 수 있습니다.

API Gateway가 Alias를 참조하고 있기 때문에 긴급 롤백 시 별도의 라우트 변경도 필요하지 않습니다.

이처럼 공통 워크플로를 통해 **서비스별로 일관된 배포 및 복구 절차**를 마련할 수 있었습니다.

## 5. 운영 과정에서 고려한 부분

IaC 기반의 모노레포 구조를 구축하면서 중요하게 고려한 것은 **인프라 리소스의 관리 주체와 서비스 간 의존성**이었습니다.

이번 구조에서는 Lambda 함수와 주요 인프라 리소스를 CloudFormation으로 관리하고, API Gateway 라우트는 로컬 Serverless 플러그인을 통해 설정하도록 구성했습니다.

이를 통해 공통 API Gateway를 유지하면서도 각 서비스에서 필요한 라우트를 코드로 선언하고 관리할 수 있었습니다.

또한 기존 서비스를 새로운 구조로 이관할 때는 리소스의 소유 관계를 확인하는 것이 중요했습니다. 여러 서비스가 공유하는 API Gateway를 특정 CloudFormation 스택이 관리하고 있다면, 해당 스택의 변경이 다른 서비스에도 영향을 줄 수 있기 때문입니다.

이러한 점을 고려해 신규 서비스부터 공통 구조를 적용하고, 기존 서비스는 인프라 의존성을 확인하면서 단계적으로 이관하도록 했습니다.

**IaC의 목적은 단순히 인프라 설정을 코드로 옮기는 것이 아니라, 리소스의 관리 주체를 명확히 하고 일관된 방식으로 운영할 수 있도록 만드는 것**이라고 생각합니다.

## 마치며

이번 작업은 여러 서비스에서 사용하는 Lambda 함수의 배포와 인프라 설정을 일관되게 관리하기 위한 고민에서 시작했습니다.

단순히 여러 서비스를 하나의 저장소로 합치는 것을 넘어, **IaC를 기반으로 인프라 구성을 코드로 관리하고 배포 과정에서 반복되는 작업을 자동화하는 것**에 집중했습니다.

그 과정에서 다음과 같은 구조를 마련할 수 있었습니다.

- **IaC 및 모노레포:** 여러 서비스의 Lambda 코드와 인프라 설정을 하나의 저장소에서 관리
- **Lambda Alias:** 하나의 함수에서 여러 환경을 구분하고 빠른 롤백 지원
- **Serverless Framework:** Lambda와 주요 인프라 리소스를 코드로 선언하고 관리
- **API Gateway 자동화:** 선언된 라우트를 Lambda Alias에 자동 연결
- **GitHub Actions 및 OIDC:** 공통 배포 파이프라인과 임시 자격 증명을 활용한 배포

물론 모노레포나 IaC 기반의 구조가 모든 상황에서 최선의 선택은 아닙니다. 서비스마다 기술 스택이나 운영 주체가 크게 다르다면 저장소와 인프라 관리 체계를 분리하는 편이 더 적합할 수도 있습니다.

하지만 비슷한 인프라 구조와 배포 방식을 사용하는 여러 Lambda 서비스를 관리해야 한다면, 공통 IaC 구성과 배포 파이프라인은 반복적인 작업을 줄이고 운영 방식의 일관성을 높이는 데 효과적인 방법이라고 생각합니다.

이번 경험을 통해 **인프라 설정을 코드로 관리하는 것뿐만 아니라, 새로운 서비스를 추가하고 운영하는 과정에서 반복적인 작업과 실수를 최소화할 수 있는 구조를 설계하는 것**이 중요하다는 점을 배웠습니다.
