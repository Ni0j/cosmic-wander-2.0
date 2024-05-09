// const APIKEY = 'eAo7j1T8mqTJWpsugD5i9W99K6cF28SApCrsBu7U';
const container = document.querySelector('.background');
let usedFilters = [];
let finishedList = []

//展示entry1玩家捕获到的小行星
//width还是根据api对应的width
//小行星会随机自由移动，和dvd屏保同理，但是移动速度根据小行星对应的velocity（api数值）

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

   // 获取捕捉到的小行星
   finishedList = localStorage.getItem('finishedList') ? JSON.parse(localStorage.getItem('finishedList')) : []
   finishedList.forEach(item => {

      const image = new Image();

      image.onload = function () {
         let width = roundToTwo(item.estimated_diameter.kilometers.estimated_diameter_min * 40) + 'rem'
         let width1 = roundToTwo(item.estimated_diameter.kilometers.estimated_diameter_min * 4)
         image.style.position = 'absolute';
         image.style.zIndex = 999;
         image.width = width1 * 100;
         image.height = width1 * 100;
         // image.style.width = width;
         // image.style.height = width;
         const canvas = document.createElement('canvas');
         container.appendChild(canvas);

         canvas.style.position = 'absolute';
         canvas.style.zIndex = 999;
         canvas.style.width = width;
         canvas.style.height = width;
         canvas.width = width1 * 100;
         canvas.height = width1 * 100;
         const ctx = canvas.getContext("2d");
         ctx.drawImage(this, 0, 0, this.width, this.height);

         let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

         const randomFilter = item.randomFilter;
         let newImgData = pixelsJS.filterImgData(imgData, randomFilter);

         ctx.putImageData(newImgData, 0, 0);

         let time = 3
         if (item.close_approach_data && item.close_approach_data.length > 0 && item.close_approach_data[0].relative_velocity) {
            time = parseInt(item.close_approach_data[0].relative_velocity.kilometers_per_second)
         }

         // canvas.style.transition = 'top ' + time + 's'
         // canvas.style.transition = 'left ' + time + 's'
         
         canvas.style.opacity = 0// 第一次滑行到随机位置时，隐藏起来
         canvas.style.transition = 'transform ' + 0.1 + 's'// 第一次让它快点滑倒随机位置
         // 初始化位置
         function randomPosition() {
            var maxLeft = canvas.parentNode.offsetWidth - canvas.offsetWidth;
            var maxTop = canvas.parentNode.offsetHeight - canvas.offsetHeight;
            var left = Math.random() * maxLeft;
            var top = Math.random() * maxTop;
            canvas.style.transform = 'translate(' + left + 'px, ' + top + 'px)';
         }

         
         randomPosition(); // 初始化位置固定位置左上角
         randomPosition(); // 定位到随机位置


         // 开始显示并且随机滑动星星
         setTimeout(() => {
            canvas.style.transition = 'transform ' + time + 's'// 使用api种的速度滑行
            randomPosition(); // 再次调用，星星开始滑动
            canvas.style.opacity = 1

            // 定时器进行随机滑动
            setInterval(function () {
               randomPosition();
            }, time * 500); // 每几秒更新一次位置
         }, 500);

      };

      image.src = item.imageUrl;

   });


  fetch('data.json')
   .then((response) => response.json())
   .then((data) => {
      console.log('Near Earth Object data:', data);
      console.log('Total items:', data.element_count);
   });

   // 获取玩家姓名并且显示
   let userName = localStorage.getItem('userName')
   document.getElementById('userNameShow').textContent = userName

   // 初始化彩蛋
   let eggListOld = localStorage.getItem('eggList') ? JSON.parse(localStorage.getItem('eggList')) : []
   if (eggListOld.length === 7) {
      document.getElementById('showEgg').style.display = 'block'
   }
})

function roundToTwo(num) {
   return Math.round((num + Number.EPSILON) * 100) / 100;
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
   
   if (eggListOld.length === 7) {
      document.getElementById('showEgg').style.display = 'block'
   }
}