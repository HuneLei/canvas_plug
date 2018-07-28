// pages/canvas/canvas.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    touch: {
      distance: 0,
      scale: 1,
      baseWidth: null,
      baseHeight: null,
      scaleWidth: null,
      scaleHeight: null
    },
    myCanvas: false,
    imageW: 60,
    imageH: 60,
    scale: 1,
    x: 0,
    y: 1
  },
  moveX: 0,
  moveY: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  ctx: null,
  url: 'https://wx.qlogo.cn/mmopen/vi_32/1M0IXDDhAU1o6tQbJ4OF5aZ6D4ibhpTe4QvGUh250P0yZzdLalBicfeoicLbSjFo7unVpbrWvQ8Gkr8R53Sibwhs1g/132',
  chooseImage2() {
    this.ctx.drawImage(this.url, 0, 0, 60, 60)
    this.ctx.draw()
  },
  //加缩图片时候获取图片大小
  // onScale(e) {
  // },
  //手指触摸后移动
  touchstartCallback: function(e) {
    // 单手指缩放开始，也不做任何处理 
    if (e.touches.length == 1) return
    console.log('双手指触发开始')
    // 注意touchstartCallback 真正代码的开始 
    // 一开始我并没有这个回调函数，会出现缩小的时候有瞬间被放大过程的bug 
    // 当两根手指放上去的时候，就将distance 初始化。 
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    this.setData({
      'touch.distance': distance,
    })
  },
  touchmoveCallback: function(e) {
    let touch = this.data.touch
    // 单手指缩放我们不做任何操作 
    if (e.touches.length == 1) return
    console.log('双手指运动')
    let xMove = e.touches[1].clientX - e.touches[0].clientX;
    let yMove = e.touches[1].clientY - e.touches[0].clientY;
    // 新的 ditance 
    let distance = Math.sqrt(xMove * xMove + yMove * yMove);
    let distanceDiff = distance - touch.distance;
    let newScale = touch.scale + 0.005 * distanceDiff
    // 为了防止缩放得太大，所以scale需要限制，同理最小值也是 
    if (newScale >= 2) {
      newScale = 2.5
    }
    if (newScale <= 0.6) {
      newScale = 0.6
    }
    let scaleWidth = newScale * touch.baseWidth
    let scaleHeight = newScale * touch.baseHeight
    // 赋值 新的 => 旧的 
    this.setData({
      'touch.distance': distance,
      'touch.scale': newScale,
      'touch.scaleWidth': scaleWidth,
      'touch.scaleHeight': scaleHeight,
      'touch.diff': distanceDiff
    })
  },
  bindload: function(e) {
    // bindload 这个api是<image>组件的api类似<img>的onload属性 
    this.setData({
      'touch.baseWidth': 60,
      'touch.baseHeight': 60,
      'touch.scaleWidth': 60,
      'touch.scaleHeight': 60
    })
  },
  //加图片
  addImage() {
    if (this.data.scale >= 4) {
      wx.showToast({
        title: '已经最大了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      scale: this.data.scale + 0.1
    })
  },
  //减图片
  cutImage() {
    if (this.data.scale <= 0.5) {
      wx.showToast({
        title: '已经最小了',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      scale: this.data.scale - 0.1
    })
  },
  // 移动过程中获取x,y轴的信息
  bindchange(event) {
    let detail = event.detail;
    this.moveX = event.detail.x;
    this.moveY = event.detail.y;
  },
  // 选择图片
  chooseImage() {
    console.log(123)
    wx.chooseImage({
      count: 1, // 默认9
      success: (res) => {
        // console.log('res', res);
        // 获取图片的高宽
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: (res1) => {
            // console.log('res1', res1);
            // 获取canvas标签节点的高宽
            const canvasWidth = this.canvasWidth;
            const canvasHeight = this.canvasHeight;
            const w = res1.width;
            const h = res1.height;
            const dw = canvasWidth / w; //canvas与图片的宽高比
            const dh = canvasHeight / h;
            // 裁剪图片中间部分
            this.ctx.drawImage(res.tempFilePaths[0], 0, 0, w * dw, h * dh)
            // if ((w > canvasWidth && h > canvasHeight) || (w < canvasWidth && h < canvasHeight)) {
            //   if (dw > dh) {
            //     this.ctx.drawImage(res.tempFilePaths[0], 0, (h - canvasHeight / dw) / 2, w, canvasHeight / dw, 0, 0, canvasWidth, canvasHeight);
            //   } else {
            //     this.ctx.drawImage(res.tempFilePaths[0], (w - canvasWidth / dh) / 2, 0, canvasWidth / dh, h, 0, 0, canvasWidth, canvasHeight);
            //   }
            // } else {
            //   // 拉伸图片
            //   if (w < canvasWidth) {
            //     this.ctx.drawImage(res.tempFilePaths[0], 0, (h - canvasHeight / dw) / 2, w, canvasHeight / dw, 0, 0, canvasWidth, canvasHeight);
            //   } else {
            //     this.ctx.drawImage(res.tempFilePaths[0], (w - canvasWidth / dh) / 2, 0, canvasWidth / dh, h, 0, 0, canvasWidth, canvasHeight);
            //   }
            // }
            this.ctx.draw();
          },
        });
      },
    })
  },
  // 保存图片
  saveImage() {
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '图片保存成功',
              icon: 'success',
              duration: 2000
            })
          }
        });
        // console.log(res.tempFilePath);
      },
    });
  },

  //生成合成海报
  changeImage() {
    wx.createSelectorQuery().select('#movable_image').boundingClientRect((rect) => {
      console.log(rect.height)
      console.log(rect.width)
      this.setData({
        imageH: rect.height,
        imageW: rect.width,
      })
    }).exec();
    this.setData({
      myCanvas: !this.data.myCanvas
    })
    // 获取canvas标签节点信息--高和宽
    wx.createSelectorQuery().select('#myCanvas').boundingClientRect((rect) => {
      console.log(rect)
      this.canvasWidth = rect.width;
      this.canvasHeight = rect.height;
      this.ctx = wx.createCanvasContext('myCanvas')
      wx.getImageInfo({
        src: '../../img/test.jpg',
        success: (res1) => {
          console.log(res1)
          const canvasWidth = this.canvasWidth;
          const canvasHeight = this.canvasHeight;
          const w = res1.width;
          const h = res1.height;
          const dw = canvasWidth / w; //canvas与图片的宽高比
          const dh = canvasHeight / h;
          // 裁剪图片中间部分
          this.ctx.drawImage('../../img/test.jpg', 0, 0, w * dw, h * dh)
          this.ctx.drawImage('../../img/WEIXING.png', this.moveX, this.moveY, this.data.imageW, this.data.imageH)
          this.ctx.draw()
        }
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
})