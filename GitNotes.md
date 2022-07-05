** RESET <br/>
git reset --hard HEAD^  // 하드모드로 리셋 ^은 HEAD에서 첫번째로 리셋... 현재 HEAD가 어디에 있는지는 git log로 확인 가능
  - 하드모드는 working directory, repository (commit한거), staging 모두 리셋시킴

git reset --mixed HEAD^ (mixed 생략 가능) // 마지막 커밋은 사라짐. staging도 사라짐. working directory는 삭제안됨

git reset --soft HEAD^ // staging, working directory 다 살아있음


** .gitignore <br/>
git rm -rf --cached . <br/>
git add .  <br/>

** BRANCH <br/>
한번이라도 커밋하지 않은 상태로 branch 생성하려고 하면 에러 <br/>
git branch // branch 목록 조회 <br/>
git branch my_branch // branch 생성 <br/>
git checkout my_branch // branch로 이동 <br/>

- my_branch에서 작업한 내용을 master에 반영하고 싶은 경우 <br/>
git checkout master // 받는 대상에 가야함 <br/>
git merge my_branch <br/>


** Diff & Revert <br/>
git diff를 이용해 5번 commit 이 4번 commit을 기준으로 무엇이 바뀌었는지 알아보기 <br/>
git diff 비교대상commit 기준 commit <br/>
git diff <이 commit에 비해> <이 commit은 무엇이 달라졌니?> <br/>
git diff f7fe(4번 커밋) 2845(5번 커밋) <br/>

- 원격 저장소와 로컬 저장소 간의 비교 <br/>
git diff <비교대상 branch이름> origin/<branch 이름> <br/>

- 이전 commit 과 전전 commit의 비교 <br/>
git diff HEAD HEAD^ (5번 커밋에 비해 4번 커밋이 뭐가 달라졌나? = E 가없다) <br/>
git diff HEAD^ HEAD (4번 커밋에 비해 5번 커밋이 뭐가 달라졌나? = E 추가됨) <br/>

- 브랜치간의 비교 <br/>
git diff <비교대상 branch 이름> <기준 branch 이름> <br/>

-- git revert <br/>
git revert <되돌리고 싶은 commit> <br/>
- reset과의 차이 => commit 이력이 사라지냐 안 사라지냐의 차이 <br/>

** 원격저장소를 이용하여 작업 <br/>
git remote -v <br/>
git remote add origin <url> // <url>에 있는 원격저장소를 origin이라는 이름으로 추가하기 <br/>
git push -u origin master // 내 repository의 master 브랜치를 origin의 master 브랜치로 push해라 <br/>
git pull origin master // origin을 내 repository의 master 브랜치로 갖고와라(merge) <br/>
git fetch (origin master) // 동기화시키지는 말고 (merge하지는 말고 origin을 내 repository의 master 브랜치로 일단 갖고와라) <br/>
git clone <url> // origin 자동생성 <br/>

** 원격저장소와의 상호작용 <br/>
git remote rm <단축이름> <br/>
git push -u prac1 master // -u를 줬기 때문에 다음 push 땐 git push 하면됨 <br/>
git fetch 후 git checkout origin/master로 하면 뭐가 바꼈는지 확인 가능 <br/>

** 협업 시나리오 <br/>
- 내 로컬 저장소는 변했는데 원격 저장소는 변함없는 경우 <br/>
  - 그냥 push <br/>
- 내 로컬 저장소는 변함없는데 원격 저장소는 변한 경우 <br/>
  - git pull로 동기화 후 push하기 <br/>
- 내 로컬 저장소는 변했는데 원격 저장소도 변한 경우 <br/>
  - 1) rebase, 2) pull request를 날리기 <br/>
pull request = 내 코드를 받아줘! 내 코드를 원격저장소에 pull해줘 <br/>

내꺼 변화 + 원격저장소 변화일 때 <br/>
  - pull받으면 깃에서 차이를 보여줄 것이고 (<<<<, ======, >>>>>) <br/>

- collaboration <br/>
  - settings에서 추가 가능 (권장하지는 않음, 원격으로 협업하거나 대규모 프로젝트에선 적합하지 않음... pull request로 하나의 repository를 공유하는 방법 쓰기) <br/>

- PULL REQUEST 단계 <br/>
  1) 협업 대상 repository fork하기 (github에서)... 내용들이 복사가됨 <br/> <br/> <br/>
  2) clone하기 (원래 repository가 아니라 fork한 계정에서 하기) <br/> <br/>
  3) branch를 만들고 작성하고자 하는 코드(commit) 작성 <br/>
    - git branch newBranch, git checkout newBranch (하나의 명령어로: git checkout -b newBranch) <br/>
  4) git push origin newBranch (origin은 fork해온... 우리 계정안에 있는 repository) <br/>
  5) pull request하면 base repository: sig-kr/co-practice | base: master   <- head repository: sample/co-practice | compare: newBranch <br/>
     가 보일거임
  6) create pull request 하면 sig-kr/co-practice에 pull request가 생성됨 <br/>
    - confirm merge <br/>
  7) pull request 날린 branch는 지우기... github에서 또는 직접 terminal에서(git branch -D newBranch) <br/>


** Rebase <br/>
현재 내가 작업하고 있는 branch의 base를 옮긴다 <br/>
base = 현재 내가 작업하고 잇는 branch와 합치려는 branch의 공통 조상 <br/>

![image](https://user-images.githubusercontent.com/46738034/153879182-1f04185c-5f15-47ab-8be3-04ba1cc6196a.png)

로 되는거임
합치고자 하는 branch의 최신 commit으로 base를 옮긴다 (M2가 base가 됨, 쓸때없는 commit이 생기지 않앗다(history관리 용이)) <br/>

커밋들의 history관리가 중요한 경우, 커밋의 흐름을 관리 잘 해야하는 경우 rebase <br/>
그럴 필요없고 병합을 간편하게, 충돌관리도 간편하게 하고픈 경우 merge <br/>

그래프로 표현 <br/>
git log --all --decorate --graph --oneline <br/>

1) git checkout branch1 <br/>
2) git rebase master (어디로 base를 바꿔줄거냐, master branch로 base를 바꿔줄거야) <br/>
