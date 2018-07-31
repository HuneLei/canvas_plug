// pages/loading/loading.js
var app = getApp();
var PageCount = 0; //总页数
var PageIndex = 1; //当前页码
var PageSize = 10; //每页容量
var Data_List = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchLoading: false, //"正在加载"的变量，默认false，隐藏
    searchLoadingComplete: false, //“全部加载完成”的变量，默认false，隐藏
    isHideLoadMore: false, //"上拉加载更多"的变量，默认false，隐藏
    isNoData: false, //没有数据变量
    DataList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showToast({
      title: '正在加载...',
      icon: 'loading',
      duration: 1000
    });
    PageCount = 0; //总页数
    PageIndex = 1; //当前页码
    PageSize = 8; //每页容量
    Data_List = [];
    this.Load(this);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    PageCount = 0; //总页数
    PageIndex = 1; //当前页码
    PageSize = 10; //每页容量
    Data_List = [];
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    this.Load(this);
    setTimeout(function(e) {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    }, 1500);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    PageIndex = PageIndex + 1;
    if (PageIndex <= PageCount) {
      // if 有更多 加载 并且隐藏加载更多
      that.setData({
        searchLoading: true,
        isHideLoadMore: false,
        searchLoadingComplete: false,
        isNoData: false
      });
      wx.showToast({
        title: '正在加载...',
        icon: 'loading',
        duration: 2000,
        success: function(e) {
          setTimeout(function() {
            console.log(333)
            that.Load(that);
          }, 2000);
        }
      });
    } else { //if 没有更多 显示已加载全部
      that.setData({
        searchLoading: false,
        searchLoadingComplete: true,
        isHideLoadMore: false,
        isNoData: false
      });
    }
  },
  renderTime(date) {
    var da = date.replace("T", " ");
    return da;
  },
  Load: function(e) {
    console.log(123)
    var that = e;
    var param = {
      action: "HistoryPatrolTaskList",
      PageIndex: PageIndex,
      PageSize: PageSize,
      StaffID: wx.getStorageSync('StaffID')
    };
    // wx.request({
    //   method: 'GET',
    //   dataType: "json",
    //   header: {
    //     'content-type': 'application/json' // 默认值
    //   },
      // data: param,
      // url: app.data.https,
      // success: function(res) {
      //   console.log(res.data);
      //   if (res.data.Status > 0) {
      //     PageCount = res.data.PageCount; //总页数
      //     if (res.data.TotalCount == 0) { //如果没有数据
      //       that.setData({
      //         searchLoadingComplete: true,
      //         isHideLoadMore: false,
      //         searchLoading: false
      //       });
      //     } else { //有数据
            // if (PageCount == 1) { //只有一页
            //   that.setData({
            //     searchLoadingComplete: true,
            //     isHideLoadMore: false,
            //     searchLoading: false,
            //     isNoData: false
            //   });
            // } else { //如果不止一页
              // that.setData({
              //   searchLoadingComplete: false,
              //   isHideLoadMore: true,
              //   searchLoading: false,
              //   isNoData: false
              // });
            // }
          // }
          // var items = res.data.Data;
          // for (var i = 0; i < items.length; i++) {
          //   items[i].AddTime = renderTime(items[i].AddTime);
          //   Data_List.push(items[i]);
          // }
          // that.setData({
          //   DataList: Data_List
          // });
        // } else {
        //   wx.showModal({
        //     title: '提示',
        //     content: res.data.SuccessStr,
        //     showCancel: false,
        //     confirmColor: "#1C78FF"
        //   });
        // }
      // }
    // })
  },
})