// const APIKEY = 'eAo7j1T8mqTJWpsugD5i9W99K6cF28SApCrsBu7U';
const container = document.querySelector('.index-content');
let usedFilters = [];
let count = 0; // 总共有多少颗星星
let currentPage = 1; // 当前在第几页
let allPage = 0; // 总共多少页
let pageSize = 18; // 每一页展示十八条
let currentPageList = [];// 当前页列表
let oldImgList = []
let imageUrls = [];
// 时间段
let startDate = ""
let endDate = ""

//完全copy entry1的javascript可以随便改

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

  fetch('data.json')
   .then((response) => response.json())
   .then((data) => {
      let totalMagnitude = 0;
      let averageMagnitude = 0;
      let displayedCount = 0;
      let dateList = [];
    
      // 已经捕获的星星图片
      oldImgList = localStorage.getItem('finishedList') ? JSON.parse(localStorage.getItem('finishedList')) : []

      for (const date in data.near_earth_objects) {
        data.near_earth_objects[date].forEach(object => {
          if (object.absolute_magnitude_h !== undefined) {
            totalMagnitude += object.absolute_magnitude_h;
            count++;
            const randomNumber = Math.floor(Math.random() * 21) + 1;
            const imageUrl = `./assets/aster${randomNumber}.png`;
            imageUrls.push({
              imageUrl: imageUrl,
              ...object
            });
          }
        });
        if (startDate === "") {
          startDate = date
          endDate = date
        }
        if (startDate > date) {
          startDate = date
        }
        if (endDate < date) {
          endDate = date
        }
      }
     document.getElementById('starTotal').textContent = count
     document.getElementById('timeDate').textContent = startDate + ' - ' + endDate
     
     // 计算分页
     allPage = parseInt(count / pageSize) + (count % pageSize > 0 ? 1 : 0)
     currentPageList = imageUrls.slice(0, pageSize)
   })
  // 初始化彩蛋
  let eggListOld = localStorage.getItem('eggList') ? JSON.parse(localStorage.getItem('eggList')) : []
  if (eggListOld.length === 7) {
    document.getElementById('showEgg').style.display = 'block'
  }
})

// 分页-上一页
function prePage() {
  if (currentPage === 1) {
    alert("already one page")
    return
  }
  currentPage--
  if (currentPage >= allPage && count % pageSize > 0) {
    currentPageList = imageUrls.slice(count - (count % pageSize + 1), count - 1)
  } else {
    currentPageList = imageUrls.slice(currentPage * pageSize - pageSize, currentPage * pageSize)
  }
  showStartList()
}
// 分页-下一页
function nextPage() {
  if (currentPage >= allPage) {
    alert("no more")
    return
  }
  currentPage ++
  if (currentPage >= allPage && count % pageSize > 0) {
    currentPageList = imageUrls.slice(count - (count % pageSize + 1), count - 1)
  } else {
    currentPageList = imageUrls.slice(currentPage * pageSize - pageSize, currentPage * pageSize)
  }
  showStartList()
}

function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}


// 展示当前页星星
function showStartList() {
  for (let index = 1; index < 19; index++) {
    let divImg = document.getElementById("imgDiv" + index)
    divImg.innerHTML = ''
  }
  currentPageList.forEach((item, index) => {
    // let imgName = document.getElementById("imgItem" + (index + 1))
    let divImg = document.getElementById("imgDiv" + (index + 1))
    if (divImg && item.imageUrl) {
      if (oldImgList.find(val => val.id === item.id)) {
        
        const image = new Image();
        image.onload = function () {
          image.style.position = 'absolute';
          image.style.zIndex = 999;
          image.width = 80;
          image.height = 80;

          divImg.innerHTML = ''
          const canvas = document.createElement('canvas');
          divImg.appendChild(canvas);
          const divHtml = document.createElement('div');
          divHtml.textContent = 'id:' + item.id
          divHtml.style.color = '#FFFFFF'
          divHtml.style.textAlign = 'center'
          divHtml.style.fontSize = '1rem'
          divImg.appendChild(divHtml);

          canvas.style.width = 80;
          canvas.style.height = 80;
          canvas.width = 80;
          canvas.height = 80;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(this, 0, 0, this.width, this.height);

          let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // Filter the image data
          const randomFilter = oldImgList.find(v => v.id === item.id)?.randomFilter;
          let newImgData = pixelsJS.filterImgData(imgData, randomFilter);

          // Replace the old image data with the new image data.
          ctx.putImageData(newImgData, 0, 0);
          const randomLeft = Math.random() * (window.innerWidth * 4 - canvas.width);
          const randomTop = Math.random() * (window.innerHeight * 4 - canvas.height);
          canvas.style.left = `${randomLeft}px`;
          canvas.style.top = `${randomTop}px`;
        }
        image.src = item.imageUrl;


      } else {
        divImg.innerHTML = ''
        const canvas = document.createElement('img');
        canvas.src = './assets/questionmark.png'
        canvas.style.width = 80;
        divImg.appendChild(canvas);

        const divHtml = document.createElement('div');
        // divHtml.textContent = 'id:' + item.id// 显示id就打开这个
        divHtml.textContent = 'id:???'
        divHtml.style.color = '#FFFFFF'
        divHtml.style.textAlign = 'center'
        divHtml.style.fontSize = '1rem'
        divImg.appendChild(divHtml);
        
      }

      divImg.addEventListener('click', () => {
        let diglogName = document.getElementById('showDetail')

        // 暂未捕获要不要展示弹框， 如果不要，就把这部分加上
        //  if (!oldImgList.find(val => val.id === item.id)) {
        //   alert('暂未捕获')
        //    diglogName.style.display = 'none'
        //   return
        // }


        diglogName.style.display = 'block'
        var myList = document.getElementById('detailUl');
        myList.innerHTML = ""
        for (ul in item) {
          if (ul !== 'imageUrl') {
            let content = ul + ":" + JSON.stringify(item[ul])
            let listString = `<li>${content}</li>`

            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = listString;
            // 获取新div中的所有子节点，并将它们追加到ul元素中
            while (tempDiv.firstChild) {
              myList.appendChild(tempDiv.firstChild);
            }
          }
          
        }
      })
    }
  });
}


function calculateProbability(value, averageValue) {
  const diff = Math.abs(value - averageValue);
  if (value > averageValue) {
    // 30%
    return 0.3;
  } else {
    // 70%
    return 0.7;
  }
}


// 翻开书
function openBook(params) {
    document.getElementById("closeBookShow").style.display = 'none'
    document.getElementById("openBookShow").style.display = 'inline-flex'
    if (count > 0) {
      showStartList(imageUrls)
    }
}

// 可拖动弹框
function dragStart(event) {
  var style = window.getComputedStyle(event.target, null);
  event.dataTransfer.setData("text/plain",
    (parseInt(style.getPropertyValue("left"), 10) - event.clientX) + ',' +
    (parseInt(style.getPropertyValue("top"), 10) - event.clientY));
}

document.addEventListener('dragover', function (event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
});

document.addEventListener('drop', function (event) {
  event.preventDefault();
  var offset = event.dataTransfer.getData("text/plain").split(',');
  var dm = event.target.closest('.modal');
  if (dm) {
    dm.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    dm.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
  } else {
    let showDetail = document.getElementById('showDetail')
    showDetail.style.left = (event.clientX + parseInt(offset[0], 10)) + 'px';
    showDetail.style.top = (event.clientY + parseInt(offset[1], 10)) + 'px';
  }

});

function closeDialog() {
  let diglogName = document.getElementById('showDetail')
  diglogName.style.display = 'none'
}
