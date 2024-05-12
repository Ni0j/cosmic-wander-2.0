// const APIKEY = 'eAo7j1T8mqTJWpsugD5i9W99K6cF28SApCrsBu7U';
const container = document.querySelector('.container');
let usedFilters = [];

//没写但是需要的功能：
//1. canvas（也就是小行星图片）的width等比object的diameter 用km（api中的数值）
//2.canvas一开始先是和背景相同的颜色或者opacity0（目的是一开始看不见），然后hover后才会出现，双击就是捕获（记下这个小行星的数据包括应用的filter，api，图片，存入仓库（entry3）中 local storage），双击后先弹一个弹窗 - 对应html里提到的

//0509更新：
//


document.addEventListener("DOMContentLoaded", function(){

  // // 菜单
  // let menuShow = document.getElementById('menuShow')
  // // 书
  // let bookShow = document.getElementById('bookShow')
  // menuShow.style.opacity = 1;
  // setTimeout(() => {
  //   menuShow.style.opacity = 0;
  // }, 30000);
  // // 鼠标移入事件
  // menuShow.onmouseover = function () {
  //   menuShow.style.opacity = 1;
  //   bookShow.style.opacity = 1;
  //   setTimeout(() => {
  //     menuShow.style.opacity = 0;
  //     bookShow.style.opacity = 0;
  //   }, 30000);
  // }
 
  // bookShow.style.opacity = 1;
  // setTimeout(() => {
  //   bookShow.style.opacity = 0;
  // }, 30000);
  // // 鼠标移入事件
  // bookShow.onmouseover = function () {
  //   menuShow.style.opacity = 1;
  //   bookShow.style.opacity = 1;
  //   setTimeout(() => {
  //     menuShow.style.opacity = 0;
  //     bookShow.style.opacity = 0;
  //   }, 30000);
  // }
  let key = 'sb9he9Zvoc3hSM9nTOELsmLjplg7zhoOXlMPFpcU'
  let header = { mode: 'cors', 'Content-Type': 'application/json', 'Access-Control-Expose-Headers':'Content-Type,token'}
  
  const apiUrl = 'https://api.nasa.gov/neo/rest/v1/feed?api_key=' + key
  fetch(apiUrl, { header: header, method: "get", cache: 'default' })
  .then((response) => {
    // 需要在服务器后端那里配置一下才能获取到
    // 检查响应头中的X-RateLimit-Limit
    // let rateLimitLimit = response.headers.get('X-RateLimit-Limit');
    // // 检查响应头中的X-RateLimit-Remaining
    // let rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
    // console.log(response, "-=-=response")
    // console.log(response.headers.get('X-Rate-Limit-Limit'), "-=-=rateLimitLimit")
    // console.log(rateLimitRemaining, "-=-=rateLimitRemaining")

    if (response.status === 429) {
      alert("You've refreshed enough times and reached the hours’ limit,  rest your eyes for a while and welcome back after an hour ᯓ ᡣ𐭩")
    }
    return response.json();
  }).then((data) => {

      let totalMagnitude = 0;
      let count = 0;
      let averageMagnitude = 0;
      let displayedCount = 0;


      for (const date in data.near_earth_objects) {
        data.near_earth_objects[date].forEach(object => {
           if (object.absolute_magnitude_h !== undefined) {
              totalMagnitude += object.absolute_magnitude_h;
              count++;
           }
        });
     }

     if (count > 0) {
      averageMagnitude = totalMagnitude / count;
      const imageUrls = [];

      for (const date in data.near_earth_objects) {
        data.near_earth_objects[date].forEach(object => {
          if (object.absolute_magnitude_h !== undefined) {
            const probability = calculateProbability(object.absolute_magnitude_h, averageMagnitude);

            console.log(displayedCount,"--displayedCountdisplayedCountdisplayedCountdisplayedCountdisplayedCount");
            if (Math.random() < probability && imageUrls.length < 12) {
              const randomNumber = Math.floor(Math.random() * 21) + 1;
              const imageUrl = `./assets/aster${randomNumber}.png`;
              imageUrls.push({
                imageUrl: imageUrl,
                ...object
              });
            }
          }
        });
      }

      // 展示总共多少个小星星
      document.getElementById('totalAmount').textContent = imageUrls.length

      imageUrls.forEach(item => {

      const image = new Image();

      image.onload = function() {
        let width = roundToTwo(item.estimated_diameter.kilometers.estimated_diameter_min * 40) + 'rem'
        image.style.position = 'absolute';
        image.style.zIndex = 999;
        image.width = 100;
        image.height = 100;
        // image.style.width = width;
        // image.style.height = width;
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);

        canvas.style.position = 'absolute';
        canvas.style.zIndex = 999;
        canvas.style.width = width;
        canvas.style.height = width;
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this, 0, 0, this.width, this.height);

        let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        // Filter the image data
        const randomFilter = getRandomFilter();
        let newImgData = pixelsJS.filterImgData(imgData, randomFilter);

        // Replace the old image data with the new image data.
        ctx.putImageData(newImgData, 0, 0);
        //   const randomFilter = getRandomFilterName();
        //   pixelsJS.filterImg(image, randomFilter);

        item.randomFilter = randomFilter

        const randomLeft = Math.random() * (window.innerWidth * 4 - canvas.width);
          const randomTop = Math.random() * (window.innerHeight * 4 - canvas.height);
          canvas.style.left = `${randomLeft}px`;
          canvas.style.top = `${randomTop}px`;

          // 鼠标移入显示
          canvas.style.cursor = "pointer"
          canvas.style.opacity = 0;/////////
          canvas.style.transition ='opacity 1s ease';
          canvas.onmouseover = function () {
            canvas.style.opacity = 1;
    
          }
          let audioElement = new Audio('./assets/doubleclicked-sfx.ogg');

          canvas.addEventListener('dblclick', function dbClick1(event) {
            // 展示弹框
            audioElement.play();
            
            let showDetail = document.getElementById("windowShow")
            showDetail.style.display = 'block'
            let textId = document.getElementById("textId")
            textId.textContent = 'id:' + item.id
            let textName = document.getElementById("textName")
            textName.textContent = 'name:' + item.name
            

            // 展示弹框图层
            let detailImg = document.getElementById("detailImg")
            const imageItem = new Image();
            imageItem.onload = function () {
              imageItem.style.position = 'absolute';
              imageItem.style.zIndex = 999;
              imageItem.width = 200;
              imageItem.height = 200;

              detailImg.innerHTML = ''
              const canvasItem = document.createElement('canvas');
              detailImg.appendChild(canvasItem);
    
              canvasItem.style.width = 200;
              canvasItem.style.height = 200;
              canvasItem.width = 200;
              canvasItem.height = 200;
              const ctxItem = canvasItem.getContext("2d");
              ctxItem.drawImage(this, 0, 0, this.width, this.height);

              let imgDataItem = ctxItem.getImageData(0, 0, canvasItem.width, canvasItem.height);
              let newImgDataItem = pixelsJS.filterImgData(imgDataItem, randomFilter);

              ctxItem.putImageData(newImgDataItem, 0, 0);
              const randomLeft = Math.random() * (window.innerWidth * 4 - canvasItem.width);
              const randomTop = Math.random() * (window.innerHeight * 4 - canvasItem.height);
              canvasItem.style.left = `${randomLeft}px`;
              canvasItem.style.top = `${randomTop}px`;
            }
            imageItem.src = item.imageUrl;



            // let detailImg = document.getElementById("detailImg")
            // detailImg.src = item.imageUrl
            textId.addEventListener('click', function () {
              // window.location.href = item.nasa_jpl_url
              window.open(item.nasa_jpl_url)
            })

            // 捕获小星星
            let finishedList = []
            if (localStorage.getItem('finishedList')) {
              finishedList = JSON.parse(localStorage.getItem('finishedList'))
            }
            if (!finishedList.find(v => v.id === item.id)) {
              finishedList.push(item)
              localStorage.setItem('finishedList', JSON.stringify(finishedList))
            }
          });


          function getRandomFilter() {
            const filters = ["extra_offset_red", "specks_redscale", "pane", "diagonal_lines", "casino", "offset_blue", "sunset","bluescale","solange","crimson","teal_min_noise","coral","incbrightness","lemon","frontward","vintage","serenity","solange_grey","cosmic","purplescale","radio","twenties","ocean","a","pixel_blue","redgreyscale","retroviolet","rosetint"];

            // if used then reset
            if (usedFilters.length === filters.length) {
              usedFilters = [];
            }


            let randomFilter;
            do {
              const randomIndex = Math.floor(Math.random() * filters.length);
              randomFilter = filters[randomIndex];
            } while (usedFilters.includes(randomFilter)); // 检查是否已经使用过该滤镜


            usedFilters.push(randomFilter);

            return randomFilter;
          }

        console.log('image loaded and processed');
        displayedCount++;
      };

      image.src = item.imageUrl;

    });

  }
   })

   // 初始化彩蛋
  let eggListOld = localStorage.getItem('eggList') ? JSON.parse(localStorage.getItem('eggList')) : []
  if (eggListOld.length === 7) {
    document.getElementById('showEgg').style.display = 'block'
  }
})

function roundToTwo(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}





//这个概率好像没用上，要怎么用上呀
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







container.style.zIndex = '1';

let isDragging = false;
let startX, startY, translateX, translateY;

container.addEventListener('mousedown', (e) => {
  isDragging = true;
  startX = e.clientX;
  startY = e.clientY;
  translateX = container.offsetLeft;
  translateY = container.offsetTop;
});

container.addEventListener('mousemove', (e) => {
  if (!isDragging) return;
  const x = e.clientX - startX;
  const y = e.clientY - startY;
  container.style.left = `${translateX + x}px`;
  container.style.top = `${translateY + y}px`;
});

container.addEventListener('mouseup', () => {
  isDragging = false;
});


let lengthX, lengthY, oldX, oldY;
let isKeydownSDAW = false
let oldE
var sh; 
var setTimeFun;
document.addEventListener('keydown', (e) => {
  isKeydownSDAW = true
  let length = 50
  lengthX = 0;
  lengthY = 0;
  oldX = container.offsetLeft;
  oldY = container.offsetTop;
  switch (e.key) {
    case "s":
      lengthY -= length;
      break;
    case "d":
      lengthX -= length;
      break;
    case "a":
      lengthX += length;
      break;
    case "w":
      lengthY += length;
      break;
  }

  if (e.key === 's' || e.key === 'd' || e.key === 'a' || e.key === 'w') {
    setTimeFun = setTimeout(() => {
      if (isKeydownSDAW) {
        sh = setInterval(showEnter(e), 1500); 
      } else {
        try {
          clearTimeout(setTimeFun)
        } catch (error) {}
        try {
          clearInterval(sh)
        } catch (error) {}
      }
    }, 1000)
  }
});




function showEnter(e){
  if (isKeydownSDAW) {
    let length = 50
    lengthX = 0;
    lengthY = 0;
    oldX = container.offsetLeft;
    oldY = container.offsetTop;
    switch (e.key) {
      case "s":
        lengthY -= length;
        break;
      case "d":
        lengthX -= length;
        break;
      case "a":
        lengthX += length;
        break;
      case "w":
        lengthY += length;
        break;
    }
    if (e.key === 's' || e.key === 'd' || e.key === 'a' || e.key === 'w') {
      container.style.left = `${oldX + lengthX}px`;
      container.style.top = `${oldY + lengthY}px`;
    }
  }
} 


document.addEventListener("keyup", (e) => {     //按键松开，小方块滑动
  isKeydownSDAW = false
  try {
    clearTimeout(setTimeFun)
  } catch (error) {}
  try {
    clearInterval(sh)
  } catch (error) {}
  
  container.style.left = `${oldX + lengthX}px`;
  container.style.top = `${oldY + lengthY}px`;
  lengthX = 0;
  lengthY = 0;
  oldX = container.offsetLeft;
  oldY = container.offsetTop;
})

//这里可以改成按住就一直移动吗 松开停下

container.addEventListener('touchstart', (e) => {
  isDragging = true;
  startX = e.touches[0].clientX;
  startY = e.touches[0].clientY;
  translateX = container.offsetLeft;
  translateY = container.offsetTop;
});

container.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const x = e.touches[0].clientX - startX;
  const y = e.touches[0].clientY - startY;
  container.style.left = `${translateX + x}px`;
  container.style.top = `${translateY + y}px`;
});

container.addEventListener('touchend', () => {
  isDragging = false;
});


// 关闭弹框
function closeDialog() {
  let showDetail = document.getElementById("windowShow")
  showDetail.style.display = 'none'
}
// 弹窗出现后5秒自动关闭
function autoCloseWindow() {
  let showDetail = document.getElementById("windowShow");
  showDetail.style.transition = 'opacity 1s ease'; // 添加过渡效果
  showDetail.style.opacity = 0; // 透明度从1变为0，实现淡出效果
  setTimeout(function() {
      showDetail.style.display = 'none';
      showDetail.style.transition = ''; // 清除过渡效果
      showDetail.style.opacity = 1; // 恢复透明度
  }, 1000); // 等待1秒后隐藏弹窗
}

// 在需要的地方调用函数
setTimeout(autoCloseWindow, 5000); // 5秒延迟自动关闭弹窗


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
  if (eggListOld.length === 7) {
    document.getElementById('showEgg').style.display = 'block'
  }
}