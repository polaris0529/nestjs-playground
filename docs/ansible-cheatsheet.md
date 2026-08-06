# Ansible 실전 치트시트

이 문서는 `nestjs-playground/ansible` 기준으로 바로 쓰는 Ansible 옵션과 패턴만 모은다. 실제 서버 값은 `ansible/.env`에 두고, 문서에는 남기지 않는다.

## 현재 구조

```text
ansible/
├── ansible.cfg                 # 기본 inventory, 로그, become 설정
├── .env                        # 로컬 실행 시 export할 배포/접속 값
├── .env.example                # .env 샘플
├── run.sh                      # .env를 읽고 ansible-playbook 실행
├── inventory/hosts.yml         # 호스트 목록
├── host_vars/remoteOne.yml     # remoteOne 전용 변수
├── playbooks/deploy.yml        # 배포 playbook
└── logs/ansible.log            # 실행 로그
```

## 가장 많이 쓰는 명령

`ansible/` 밖에서 실행:

```bash
./ansible/run.sh playbooks/deploy.yml
```

체크 모드로 변경 사항 미리 보기:

```bash
./ansible/run.sh playbooks/deploy.yml --check
```

상세 로그 보기:

```bash
./ansible/run.sh playbooks/deploy.yml -v
./ansible/run.sh playbooks/deploy.yml -vv
./ansible/run.sh playbooks/deploy.yml -vvv
```

특정 호스트만 실행:

```bash
./ansible/run.sh playbooks/deploy.yml --limit remoteOne
```

문법 검사:

```bash
./ansible/run.sh playbooks/deploy.yml --syntax-check
```

태그만 실행:

```bash
./ansible/run.sh playbooks/deploy.yml --tags deploy
```

태그 제외:

```bash
./ansible/run.sh playbooks/deploy.yml --skip-tags docker
```

## `.env` 쓰는 방식

Ansible은 `.env`를 자동으로 읽지 않는다. 이 프로젝트는 `run.sh`가 `.env`를 export한 뒤 `ansible-playbook`을 실행한다.

```bash
./ansible/run.sh playbooks/deploy.yml
```

`.env` 예시:

```dotenv
DEPLOY_REPO=https://github.com/<owner>/<repo>.git
DEPLOY_DEST=/home/<user>/<repo>
DEPLOY_VERSION=master

REMOTE_HOST=<hostname-or-ip>
REMOTE_PORT=22
REMOTE_USER=<ssh-user>
```

playbook이나 host vars에서 읽기:

```yaml
repo: "{{ lookup('env', 'DEPLOY_REPO') }}"
dest: "{{ lookup('env', 'DEPLOY_DEST') }}"
version: "{{ lookup('env', 'DEPLOY_VERSION') }}"
```

기본값 주기:

```yaml
deploy_version: "{{ lookup('env', 'DEPLOY_VERSION', default='master') }}"
```

필수값으로 강제:

```yaml
deploy_repo: "{{ lookup('env', 'DEPLOY_REPO', default=undef()) }}"
```

숫자로 변환:

```yaml
ansible_port: "{{ lookup('env', 'REMOTE_PORT') | int }}"
```

주의: `lookup('env', ...)`는 원격 서버가 아니라 Ansible을 실행하는 로컬 환경변수를 읽는다.

## Inventory 핵심 옵션

`inventory/hosts.yml`:

```yaml
all:
  hosts:
    remoteOne:
```

`host_vars/remoteOne.yml`:

```yaml
ansible_host: "{{ lookup('env', 'REMOTE_HOST') }}"
ansible_port: "{{ lookup('env', 'REMOTE_PORT') | int }}"
ansible_user: "{{ lookup('env', 'REMOTE_USER') }}"
```

자주 쓰는 접속 옵션:

| 옵션 | 의미 | 예시 |
| --- | --- | --- |
| `ansible_host` | 실제 접속 IP/도메인 | `192.168.0.10` |
| `ansible_port` | SSH 포트 | `22` |
| `ansible_user` | SSH 사용자 | `ubuntu` |
| `ansible_password` | SSH 비밀번호 | vault 권장 |
| `ansible_ssh_private_key_file` | SSH 개인키 | `~/.ssh/id_rsa` |
| `ansible_connection` | 연결 방식 | `ssh`, `local`, `docker` |
| `ansible_python_interpreter` | 원격 Python 경로 | `/usr/bin/python3` |

SSH host key 확인 끄기:

```yaml
ansible_ssh_common_args: "-o StrictHostKeyChecking=no"
```

## Playbook 기본 뼈대

```yaml
---
- name: Deploy app
  hosts: remoteOne
  become: false
  vars:
    deploy_repo: "{{ lookup('env', 'DEPLOY_REPO', default=undef()) }}"
    deploy_dest: "{{ lookup('env', 'DEPLOY_DEST', default=undef()) }}"
    deploy_version: "{{ lookup('env', 'DEPLOY_VERSION', default='master') }}"
  tasks:
    - name: Pull latest code
      ansible.builtin.git:
        repo: "{{ deploy_repo }}"
        dest: "{{ deploy_dest }}"
        version: "{{ deploy_version }}"
      register: git_result

    - name: Rebuild and restart docker containers
      community.docker.docker_compose_v2:
        project_src: "{{ deploy_dest }}"
        build: always
        state: present
        recreate: always
      when: git_result.changed
```

## Task 제어 옵션

조건 실행:

```yaml
when: git_result.changed
```

결과 저장:

```yaml
register: git_result
```

실패해도 계속:

```yaml
ignore_errors: true
```

변경으로 표시하지 않기:

```yaml
changed_when: false
```

실패 조건 직접 지정:

```yaml
failed_when: result.rc != 0
```

반복:

```yaml
loop:
  - docker
  - git
```

태그:

```yaml
tags:
  - deploy
  - docker
```

## 권한 상승 옵션

play 전체에 sudo 적용:

```yaml
- name: Deploy app
  hosts: remoteOne
  become: true
  become_method: sudo
  become_user: root
```

task 하나에만 sudo 적용:

```yaml
- name: Restart service
  ansible.builtin.service:
    name: nginx
    state: restarted
  become: true
```

sudo 비밀번호가 필요하면 inventory 변수로 넣을 수 있지만, 평문 대신 `ansible-vault`를 권장한다.

```yaml
ansible_become_password: "{{ vault_become_password }}"
```

## 자주 쓰는 모듈

파일/디렉토리:

```yaml
- name: Ensure directory exists
  ansible.builtin.file:
    path: /opt/app
    state: directory
    mode: "0755"
```

파일 복사:

```yaml
- name: Copy env file
  ansible.builtin.copy:
    src: .env.production
    dest: /opt/app/.env
    mode: "0600"
```

템플릿 렌더링:

```yaml
- name: Render config
  ansible.builtin.template:
    src: app.conf.j2
    dest: /etc/app/app.conf
```

명령 실행:

```yaml
- name: Run command
  ansible.builtin.command:
    cmd: docker ps
```

쉘 기능이 필요할 때:

```yaml
- name: Run shell
  ansible.builtin.shell:
    cmd: "docker compose ps | grep app"
```

패키지 설치:

```yaml
- name: Install packages
  ansible.builtin.apt:
    name:
      - git
      - docker.io
    state: present
    update_cache: true
  become: true
```

서비스:

```yaml
- name: Ensure docker is running
  ansible.builtin.service:
    name: docker
    state: started
    enabled: true
  become: true
```

Git:

```yaml
- name: Pull repository
  ansible.builtin.git:
    repo: "{{ deploy_repo }}"
    dest: "{{ deploy_dest }}"
    version: "{{ deploy_version }}"
```

Docker Compose v2:

```yaml
- name: Up docker compose
  community.docker.docker_compose_v2:
    project_src: "{{ deploy_dest }}"
    build: always
    state: present
    recreate: always
```

## 원격 환경변수와 task environment

task 실행 시 원격 프로세스에 환경변수 전달:

```yaml
- name: Run npm install with env
  ansible.builtin.command:
    cmd: npm ci
    chdir: "{{ deploy_dest }}"
  environment:
    NODE_ENV: production
```

원격 서버의 기존 환경변수는 facts 수집 후 `ansible_env`로 읽을 수 있다.

```yaml
- name: Show remote home
  ansible.builtin.debug:
    msg: "{{ ansible_env.HOME }}"
```

`gather_facts: false`이면 `ansible_env`가 없을 수 있다.

## Debug 패턴

변수 출력:

```yaml
- name: Show deploy path
  ansible.builtin.debug:
    var: deploy_dest
```

메시지 출력:

```yaml
- name: Show status
  ansible.builtin.debug:
    msg: "Updated to {{ git_result.after[:7] }}"
```

전체 host vars 확인:

```yaml
- name: Show host vars
  ansible.builtin.debug:
    var: hostvars[inventory_hostname]
```

## Secret 관리

평문으로 저장하지 말 것:

```yaml
ansible_password: plain-password
ansible_become_password: plain-password
```

권장:

```bash
ansible-vault create group_vars/all/vault.yml
ansible-vault edit group_vars/all/vault.yml
```

실행:

```bash
./ansible/run.sh playbooks/deploy.yml --ask-vault-pass
```

playbook에서 참조:

```yaml
ansible_password: "{{ vault_ansible_password }}"
```

## 문제 해결 체크리스트

SSH 접속 실패:

- `REMOTE_HOST`, `REMOTE_PORT`, `REMOTE_USER` 확인
- 로컬에서 `ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST"` 직접 확인
- 포트포워딩/방화벽 확인

`.env` 값이 비어 있음:

- 반드시 `./ansible/run.sh ...`로 실행
- `.env` 파일 위치가 `ansible/.env`인지 확인
- `KEY=value` 형식 확인

`docker_compose_v2` 실패:

- 원격 서버에 Docker Compose v2 설치 확인
- 원격 서버에서 `docker compose version` 확인
- `project_src` 경로에 `docker-compose.yml`이 있는지 확인

`git` task 실패:

- 원격 서버에 `git` 설치 확인
- private repo라면 원격 서버 SSH key 또는 token 설정 확인
- `dest` 경로 권한 확인

sudo 실패:

- `become: true`가 필요한 task인지 확인
- 원격 유저가 sudo 권한을 갖는지 확인
- sudo 비밀번호가 필요하면 vault로 관리

## 이 프로젝트 추천 패턴

배포 경로, repo, branch는 `.env`에 둔다.

```dotenv
DEPLOY_REPO=https://github.com/<owner>/<repo>.git
DEPLOY_DEST=/home/<user>/<repo>
DEPLOY_VERSION=master
```

접속 정보는 `.env`에서 읽어 `host_vars/remoteOne.yml`에만 둔다.

```yaml
ansible_host: "{{ lookup('env', 'REMOTE_HOST') }}"
ansible_port: "{{ lookup('env', 'REMOTE_PORT') | int }}"
ansible_user: "{{ lookup('env', 'REMOTE_USER') }}"
```

playbook에서는 하드코딩 대신 vars로 모은 뒤 참조한다.

```yaml
vars:
  deploy_repo: "{{ lookup('env', 'DEPLOY_REPO', default=undef()) }}"
  deploy_dest: "{{ lookup('env', 'DEPLOY_DEST', default=undef()) }}"
  deploy_version: "{{ lookup('env', 'DEPLOY_VERSION', default='master') }}"
```

Docker Compose는 git 변경이 있을 때만 재시작한다.

```yaml
when: git_result.changed
```
