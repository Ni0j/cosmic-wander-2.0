let nowPage = '0'

document.addEventListener("DOMContentLoaded", function(){
    // 菜单
    let menuShow = document.getElementById('menuShow')
    menuShow.style.opacity = 1;
    setTimeout(() => {
        menuShow.style.opacity = 0;
    }, 30000);
    // 鼠标移入事件
    menuShow.onmouseover = function () {
        menuShow.style.opacity = 1;
        setTimeout(() => {
            menuShow.style.opacity = 0;
        }, 30000);
    }


   const container = document.querySelector('.title');
   const screenWidth = window.innerWidth;
   const screenHeight = window.innerHeight;
   const containerWidth = container.offsetWidth;
   const containerHeight = container.offsetHeight;

   function getRandomPosition() {
     const randomX = Math.random() * (screenWidth - containerWidth);
     const randomY = Math.random() * (screenHeight - containerHeight);
     return { x: randomX, y: randomY };
   }

   function floatContainer() {
     const newPosition = getRandomPosition();
     container.style.transform = `translate(${newPosition.x}px, ${newPosition.y}px)`;
   }

   setInterval(floatContainer, 2000);

   // 点击名字后出现intro- container
    let nameDiv = document.getElementById('name');
    nameDiv.addEventListener('click', function() {
        document.getElementById('introContainerShow').style.display="inline-flex";
        document.getElementById('introContainerShow').style.height="auto";
        document.getElementById('introContainerShow2').style.display = "none";
        document.getElementById('title').style.zIndex = 0;
    });

    // btnFlip按钮点击
    let btnFlip = document.getElementById('btnFlip');
    btnFlip.addEventListener('click', function() {
        document.getElementById('introContainerShow').style.display="none";
        document.getElementById('introContainerShow2').style.height="auto";
        document.getElementById('introContainerShow2').style.display="inline-flex";
    });

    // 输入限制校验
    let limitInputLength = document.getElementById('inputContent');
    limitInputLength.addEventListener('blur', function() {
        if (limitInputLength.value.length > 12) {
            alert("sry maximum 12 letters(˚ ˃̣̣̥⌓˂̣̣̥)")
        }
    });

    // 跳转页面按钮
    let btnGo = document.getElementById('btnGo');
    btnGo.addEventListener('click', function() {
        let inputLength = document.getElementById('inputContent').value.length
        if (inputLength === 0) {
            alert("If you can't figure out what to enter just type in some random numbers ᡣ𐭩ྀིྀི")
        } else if (inputLength > 12) {
            alert("sry maximum 12 letters(˚ ˃̣̣̥⌓˂̣̣̥)")
        } else {
            localStorage.setItem('userName', document.getElementById('inputContent').value)
            // window.location.href = "./entry1/index.html"
            // 转场动画
            goPages('1')
        }
    });
    initGoPage()
})

// 判断初始应该在哪个页面
function initGoPage() {
    let curretPageSave = localStorage.getItem('curretPageSave')
    if (curretPageSave && (curretPageSave === '1' || curretPageSave === '3')) {
        goPages(curretPageSave)
    }
}

function goPages(page) {
    if (nowPage === page) {
        return
    }
    console.log(page, "-=-???");
    if (nowPage === '0') {
        goPageFirstOrThird(page)
    } else {
        showMain(true)
        setTimeout(() => {
            goPageFirstOrThird(page)
        }, 4000)
    }
}

// 到达1或2页面
function goPageFirstOrThird(page) {
    hiddenMainPageALL()
    let iframe1 = document.getElementById('iframe' + page)
    let loading = document.getElementById('loading')
    let mainHtml = document.getElementById('mainHtml')
    mainHtml.classList.add("main-page-big")
    
    setTimeout(() => {
        iframe1.classList.add("show-page" + page)
        iframe1.style.zIndex = '100000'
        iframe1.style.display = 'block'
        mainHtml.style.zIndex = '1'
    }, 1000)
    setTimeout(() => {
        mainHtml.style.display = 'none'
        mainHtml.classList.remove("main-page-big");
        iframe1.classList.remove("show-page" + page);
        iframe1.style.zIndex = '1'
        showAllBtn()
        nowPage = page
        iframe1.contentWindow.postMessage({ action: 'callMethod' + page }, '*');
        localStorage.setItem('curretPageSave', nowPage)
    }, 2000)
}

// 跳转首页 isTransition true-只是过渡，不展示首页，
function showMain(isTransition) {
    let nowPageOld = nowPage
    nowPage = '0'
    localStorage.setItem('curretPageSave', nowPage)
    let loading = document.getElementById('loading')
    let mainHtml = document.getElementById('mainHtml')
    let iframe1 = document.getElementById('iframe' + nowPageOld)

    iframe1.classList.add("hidden-page" + nowPageOld)
    iframe1.style.zIndex = '100000'
    mainHtml.classList.add("main-page-small")
    mainHtml.style.display = 'block'
    mainHtml.style.zIndex = '1'

    setTimeout(() => {
        iframe1.style.display = 'none'
    }, 3000)
    setTimeout(() => {
        mainHtml.style.display = 'none'
        mainHtml.classList.remove("main-page-small");
        iframe1.classList.remove("hidden-page" + nowPageOld);
        if (!isTransition) {
            mainHtml.style.display = 'block'
            hiddenLogin()
            hiddenAllBtn()
        }
    }, 4000)
}

// 展示菜单
function showAllBtn() {
    let menuShowAll = document.getElementById('menuShowAll')
    menuShowAll.style.display = 'inline-flex'
}

// 隐藏所有菜单
function hiddenAllBtn() {
    let menuShowAll = document.getElementById('menuShowAll')
    menuShowAll.style.display = 'none'
}

// 隐藏首页所有内容
function hiddenMainPageALL() {
    let mainHtml = document.getElementById('mainHtml')
    let introContainerShow = document.getElementById('introContainerShow');
    let introContainerShow2 = document.getElementById('introContainerShow2');
    let menuShow = document.getElementById('menuShow');
    let nameDiv = document.getElementById('title');
    mainHtml.style.display = 'block'
    nameDiv.style.display = 'none'
    introContainerShow.style.display = 'none'
    introContainerShow2.style.display = 'none'
    menuShow.style.display = 'none'
}

// 初始化首页的框
function hiddenLogin() {
    let introContainerShow = document.getElementById('introContainerShow');
    let introContainerShow2 = document.getElementById('introContainerShow2');
    let menuShow = document.getElementById('menuShow');
    let nameDiv = document.getElementById('title');
    nameDiv.style.display = 'block'
    menuShow.style.display = 'block'
    introContainerShow.style.display = 'none'
    introContainerShow2.style.display = 'none'
}

// 彩蛋
function clickEgg(name) {
    let eggListOld = localStorage.getItem('eggList') ? JSON.parse(localStorage.getItem('eggList')) : []
    if (!eggListOld.find(val => val === name)) {
        eggListOld.push(name)
        setTimeout(() => {
            document.getElementsByClassName(name)[0].style.display = 'none'
        }, 1000);
        localStorage.setItem('eggList', JSON.stringify(eggListOld))
    }
    
}

/**
 * 播放音乐
 * type: play-播放； pause-暂停
 */
function music(type, name) {
    let music = document.getElementById("bgMusic" + name);
    let musicPlay = document.getElementById("musicPlay" + name);
    let musicPause = document.getElementById("musicPause" + name);
    if (type === 'play') {
        music.play()
        musicPlay.style.display = 'none'
        musicPause.style.display = 'block'
    } else {
        music.pause()
        musicPlay.style.display = 'block'
        musicPause.style.display = 'none'
    }
}