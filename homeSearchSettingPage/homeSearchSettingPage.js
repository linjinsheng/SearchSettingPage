//备注：搜索设置和结果
//备注：搜索设置和结果
//备注：搜索设置和结果
//备注：搜索设置和结果

var app = getApp();
var common = require('../../utils/common.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 输入显示
    inputShowed: false,
    // 输入值
    inputVal: "",
    // 进行搜索
    isSearched: false,
    isProjectSelected:false,
    isConditionExpanded:false,
    isTurnExpanded:false,
    isFieldExpanded: false,
    finishConditionSelected:false,
    windowHeight: null,
    windowWidth: null,
    hotSearchStrings:[],
    searchHistoryStrings:[],
    hotSpotCityList: [],
    competitorSortList: [],
    filterDateTypeList: [],

    isSortSelected: false,
    selectSortVal: "默认排序",
    sortMenuShow:false,
    selectSortIndex:0,

    filterDateTypeVal: "",
    selectFilterDateType:0,
    
    showLoading: true,
    showMore: true,
    finishLoadInfo: false,
    channelDisplayNewsList: [],
    competitorInfoList: [],
    attentionInfoList: [],
    turnList:[],
    fieldList: [],
    provinceList: [],
    cityList: [],
    pageNumber: 1,
    pageSize: 10,
    lastNewsSimplifyId: 0,
    lastCompetitorId: 0,
    textFocus:false,
    activeIndex: 0,
    turnVal: "",
    multiSelecteTurnList:[],
    fieldVal: "",
    provinceVal: "",
    cityVal: "",
    selectConditionVal: "",
    conditionExpandCon: "../../image/notExpandTwo.png",
    turnExpandText:"展开",
    turnExpandCon: "../../image/notExpandTwo.png",
    fieldExpandText: "展开",
    fieldExpandCon: "../../image/notExpandTwo.png",
    provinceIndex: 0,
    cityIndex: 0,
    sortCon: " ../../image/notExpandOne.png",
    types: [
      { "dataId": "0", "name": "相关资讯", "state": 1 },
      { "dataId": "1", "name": "相关项目", "state": 0 }
    ]
  },

  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (){
    var that = this;
    var isCustomSite = wx.getStorageSync('isCustomSite')
    console.log("用户的isCustomSite为：" + isCustomSite);

    if (isCustomSite == 1) {
      var currentTypes = [{ "dataId": "0", "name": "相关资讯", "state": 1 },
        { "dataId": "1", "name": "相关项目", "state": 0 },
      { "dataId": "2", "name": "我的关注", "state": 0 }];
      that.setData({
        types: currentTypes,
      });
    }

    wx.getSystemInfo({
      success: (res) => {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
        console.log('windowHeight为😄😄😄' + res.windowHeight)
        console.log('windowWidth为😄😄😄' + res.windowWidth)
      }
    })

    that.loadSearchHistoryAndHotSearchList();
    that.loadHotSpotCityList();
    that.loadCompetitorSortList();
    that.loadFilterDateTypeList();
    that.loadTurnList();
    that.loadFieldList();
    that.loadRegionList();

    var inputProTitleValue = wx.getStorageSync('inputProTitle')
    console.log("查找inputProTitle为" + inputProTitleValue);

    if (inputProTitleValue){
      that.inputProTitleSearch();
    }

    that.showInput();
  },


/**
 * 进行搜索
 */
  inputProTitleSearch: function () {  //输入框根据查询条件搜索点击事件
    var that = this;
    // 获取用户输入框中的值
    var inputString = wx.getStorageSync('inputProTitle')
    console.log("查找inputProTitle为" + inputString);

    if (inputString.length > 0) {
      that.setData({
        isSearched: true,
        showLoading: true,
        showMore: true,
        pageNumber: 1,
        lastNewsSimplifyId: 0,
        lastCompetitorId: 0,
        channelDisplayNewsList: [],
        competitorInfoList: [],
        attentionInfoList: [],
        inputVal: inputString,
        isConditionExpanded: false,
        isTurnExpanded: false,
        isFieldExpanded: false,
        finishConditionSelected: false,
      })

      that.deleteProvince();
      that.deleteCity();
      that.deleteAllTurn();
      that.deleteField();
      that.deleteFilterDateType();
    }

    console.log("当前选中的类型为" + that.data.activeIndex);
    if (that.data.activeIndex == 0) {
      that.loadInfoList(that.data.pageNumber);
    } else if (that.data.activeIndex == 1 && that.data.finishConditionSelected == false) {
      that.loadCompetitorInfoListByDefault(that.data.pageNumber);
    } else if (that.data.activeIndex == 2) {
      that.loadAttentionInfoList(that.data.pageNumber);
    }

    wx.removeStorageSync('inputProTitle');

    var inputStringAfterRemoval = wx.getStorageSync('inputProTitle')
    console.log("清除缓存后的inputStringAfterRemoval为" + inputStringAfterRemoval);
  },


/**
* 加载搜索历史和热门搜索列表
*/
  loadSearchHistoryAndHotSearchList: function () {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    console.log("加载搜索列表");
    var that = this;
    //获取搜索列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }

    console.log("param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/get_user_search_page_info", JSON.stringify(param), function (res) {
      console.log('返回搜索列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取搜索列表成功');

        that.data.hotSearchStrings = res.data.hotSearchKeywords;
        that.data.searchHistoryStrings = res.data.oneselfSearchLogs;

        if (that.data.hotSearchStrings.length > 0) {
          that.setData({
            hotSearchStrings: that.data.hotSearchStrings,
          })
        }

        if (that.data.searchHistoryStrings.length > 0) {
          that.setData({
            searchHistoryStrings: that.data.searchHistoryStrings,
          })
        }
      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

  /**
   * 加载热门城市列表
   */
  loadHotSpotCityList: function () {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取热门城市列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }
    console.log("热门城市列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/region/hot_spot_city_list", JSON.stringify(param), function (res) {
      console.log('返回热门城市列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取热门城市列表成功');

        var curHotSpotCityList = res.data;
        if (curHotSpotCityList.length > 0) {
          console.log('成功获取curHotSpotCityList' + curHotSpotCityList);
          that.setData({
            hotSpotCityList: curHotSpotCityList,
          })
        }

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

/**
 * 加载项目排序列表
 */
  loadCompetitorSortList: function () {
    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取项目排序列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }

    console.log("项目排序列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/competitor_sort_list", JSON.stringify(param), function (res) {
      console.log('返回项目排序列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取项目排序列表成功');

        var curCompetitorSortList = res.data;

        if (curCompetitorSortList.length > 0) {
          console.log('成功获取curCompetitorSortList' + curCompetitorSortList);
          that.setData({
            competitorSortList: curCompetitorSortList,
          })
        }

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

 /**
 * 加载时间段列表
 */
  loadFilterDateTypeList: function () {
    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取时间段列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }

    console.log("时间段列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/filter_date_type", JSON.stringify(param), function (res) {
      console.log('返回时间段列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取时间段列表成功');

        var curFilterDateTypeList = res.data;

        if (curFilterDateTypeList.length > 0) {
          console.log('成功获取curFilterDateTypeList' + curFilterDateTypeList);
          that.setData({
            filterDateTypeList: curFilterDateTypeList,
          })
        }

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

  /**
   * 加载轮次列表
   */
  loadTurnList: function (){
    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取轮次列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }

    console.log("轮次列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/turn_list", JSON.stringify(param), function (res) {
      console.log('返回轮次列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取轮次列表成功');

        var curTurnList = res.data;

        if (curTurnList.length > 0) {
          for (var index in curTurnList) {
            curTurnList[index].selected = false;
          }
          console.log('成功获取curTurnList' + curTurnList);
          that.setData({
            turnList: curTurnList,
          })
        }

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

  /**
   * 加载领域列表
   */
  loadFieldList: function () {
    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取领域列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "fieldId": "0"
      }
    }

    console.log("领域列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/child_field_list", JSON.stringify(param), function (res) {
      console.log('返回领域列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取领域列表成功');

        var curFieldList = res.data;

        if (curFieldList.length > 0) {
          for (var index in curFieldList) {
            curFieldList[index].selected = false;
          }
          console.log('成功获取curFieldList' + curFieldList);
          that.setData({
            fieldList: curFieldList,
          })
        }

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

  /**
   * 加载地区列表
   */
  loadRegionList: function () {
    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //获取地区列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "supRegionId": "1",
        "supRegionName": "中国"
      }
    }

    console.log("地区列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/child_region_list", JSON.stringify(param), function (res) {
      console.log('返回地区列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取地区列表成功');

        that.setData({
          provinceList: res.data
        })

      } else {
        common.showTip("网络故障", "loading")
      }
    })
  },

  /**
   * 输入显示
   */
  showInput: function () {
    this.setData({
      inputShowed: true,
      textFocus:true
    });
  },

  /**
   * 输入隐藏
   */
  hideInput: function () {
    var that = this;

    var isCustomSite = wx.getStorageSync('isCustomSite')
    console.log("用户的isCustomSite为：" + isCustomSite);

    if (isCustomSite == 1) {
      var currentTypes = [{ "dataId": "0", "name": "相关资讯", "state": 1 },
      { "dataId": "1", "name": "相关项目", "state": 0 },
      { "dataId": "2", "name": "我的关注", "state": 0 }];
      that.setData({
        types: currentTypes,
      });
    }else{
      that.setData({
        types: [
          { "dataId": "0", "name": "相关资讯", "state": 1 },
          { "dataId": "1", "name": "相关项目", "state": 0 }
        ]
      });
    }

    that.setData({
      inputVal: "",
      inputShowed: false,
      textFocus:false,
      isSearched:false,
      isProjectSelected: false,
      isConditionExpanded: false,
      conditionExpandCon: "../../image/notExpandTwo.png",
      isTurnExpanded: false,
      isFieldExpanded: false,
      finishConditionSelected: false,
      turnExpandText: "展开",
      turnExpandCon: "../../image/notExpandTwo.png",
      fieldExpandText: "展开",
      fieldExpandCon: "../../image/notExpandTwo.png",
      pageNumber: 1,
      lastNewsSimplifyId: 0,
      lastCompetitorId: 0,
      activeIndex: 0,
      channelDisplayNewsList: [],
      competitorInfoList: [],
      attentionInfoList: [],
      turnVal: "",
      fieldVal: "",
      provinceVal: "",
      cityVal: "",
      selectConditionVal: "",

      isSortSelected: false,
      selectSortVal: "默认排序",
      sortMenuShow: false,
      selectSortIndex: 0,

      filterDateTypeVal: "",
      selectFilterDateType: 0
    })

    that.deleteProvince();
    that.deleteCity();
    that.deleteAllTurn();
    that.deleteField();
    that.deleteFilterDateType();
  },

  /**
   * 输入清除
   */
  clearInput: function () {
    var that = this;

    var isCustomSite = wx.getStorageSync('isCustomSite')
    console.log("用户的isCustomSite为：" + isCustomSite);

    if (isCustomSite == 1) {
      var currentTypes = [{ "dataId": "0", "name": "相关资讯", "state": 1 },
      { "dataId": "1", "name": "相关项目", "state": 0 },
      { "dataId": "2", "name": "我的关注", "state": 0 }];
      that.setData({
        types: currentTypes,
      });
    } else {
      that.setData({
        types: [
          { "dataId": "0", "name": "相关资讯", "state": 1 },
          { "dataId": "1", "name": "相关项目", "state": 0 }
        ]
      });
    }

    that.setData({
      inputVal: "",
      isSearched: false,
      isProjectSelected: false,
      isConditionExpanded: false,
      conditionExpandCon: "../../image/notExpandTwo.png",
      isTurnExpanded: false,
      isFieldExpanded: false,
      finishConditionSelected: false,
      turnExpandText: "展开",
      turnExpandCon: "../../image/notExpandTwo.png",
      fieldExpandText: "展开",
      fieldExpandCon: "../../image/notExpandTwo.png",
      pageNumber: 1,
      lastNewsSimplifyId: 0,
      lastCompetitorId: 0,
      activeIndex: 0,
      channelDisplayNewsList: [],
      competitorInfoList: [],
      attentionInfoList: [],
      turnVal: "",
      fieldVal: "",
      provinceVal: "",
      cityVal: "",
      selectConditionVal: "",

      isSortSelected: false,
      selectSortVal: "默认排序",
      sortMenuShow: false,
      selectSortIndex: 0,

      filterDateTypeVal: "",
      selectFilterDateType: 0
    })
    that.deleteProvince();
    that.deleteCity();
    that.deleteAllTurn();
    that.deleteField();
    that.deleteFilterDateType();
    console.log("clearInput输入清除");
  },

  /**
   * 输入信息
   */
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    })
    console.log("输入的关键词是" + e.detail.value);
    console.log("inputTyping输入");
  },

  /**
   * 进行搜索
   */
  inputSearch: function (e) {  //输入框根据查询条件搜索点击事件
    var that = this;
    // 获取用户输入框中的值
    let inputString = e.detail.value['search-input'] ? e.detail.value['search-input'] : e.detail.value;
    if (!inputString) {
      throw new Error('search input contents con not empty!');
      return;
    }
    console.log("搜索关键词为" + inputString);
    if (inputString.length > 0) {
      that.setData({
        isSearched: true,
        showLoading: true,
        showMore: true,
        pageNumber:1,
        lastNewsSimplifyId: 0,
        lastCompetitorId: 0,
        channelDisplayNewsList: [],
        competitorInfoList: [],
        attentionInfoList: [],
        inputVal: inputString,
        isConditionExpanded: false,
        isTurnExpanded: false,
        isFieldExpanded: false,
        finishConditionSelected: false,

        isSortSelected: false,
        selectSortVal: "默认排序",
        sortMenuShow: false,
        selectSortIndex: 0,

        filterDateTypeVal: "",
        selectFilterDateType: 0,

        selectConditionVal: "",
        conditionExpandCon: "../../image/notExpandTwo.png",
      })

      that.deleteProvince();
      that.deleteCity();
      that.deleteAllTurn();
      that.deleteField();
      that.deleteFilterDateType();
    }

    console.log("当前选中的类型为" + that.data.activeIndex);
    if (that.data.activeIndex == 0 ){
      that.loadInfoList(that.data.pageNumber);
    } else if (that.data.activeIndex == 1 && that.data.finishConditionSelected == false ){
      if (that.data.selectSortIndex == 0) {
        that.loadCompetitorInfoListByDefault(that.data.pageNumber);
      } else {
        that.loadCompetitorInfoListBySort(that.data.pageNumber);
      }
    } else if (that.data.activeIndex == 2) {
      that.loadAttentionInfoList(that.data.pageNumber);
    }
  },

  /**
   * 搜索历史
   */
  searchHistoryInfo: function (e) {
    var that = this;
    console.log("选择的的为" + e.currentTarget.dataset.keyword);
    var inputString = e.currentTarget.dataset.keyword;
    if (inputString.length > 0) {
      that.setData({
        isSearched: true,
        showLoading: true,
        showMore: true,
        inputVal: inputString,
        pageNumber: 1,
        lastNewsSimplifyId: 0,
        lastCompetitorId: 0,
        activeIndex: 0,
        channelDisplayNewsList: [],
        competitorInfoList: [],
        attentionInfoList: [],
        inputShowed: true,
        textFocus: false
      })
    }
    that.loadInfoList(that.data.pageNumber);
  },


/**
 * 热门搜索
 */
  hotSearchInfo: function (e) {
    var that = this;
    console.log("选择的的为" + e.currentTarget.dataset.keyword);
    var inputString = e.currentTarget.dataset.keyword;
    if (inputString.length > 0) {
      that.setData({
        isSearched: true,
        showLoading: true,
        showMore: true,
        inputVal: inputString,
        pageNumber: 1,
        lastNewsSimplifyId: 0,
        lastCompetitorId: 0,
        activeIndex: 0,
        channelDisplayNewsList: [],
        competitorInfoList: [],
        attentionInfoList: [],
        inputShowed: true,
        textFocus: false
      })
    }
    that.loadInfoList(that.data.pageNumber);
  },

/**
 * 热门城市
 */
  hotSpotCitySearchInfo: function (e) {
    var that = this;
    console.log("选择的的为" + e.currentTarget.dataset.keyword);
    var inputString = e.currentTarget.dataset.keyword;
    if (inputString.length > 0) {
      that.setData({
        isSearched: true,
        showLoading: true,
        showMore: true,
        inputVal: inputString,
        pageNumber: 1,
        lastNewsSimplifyId: 0,
        lastCompetitorId: 0,
        activeIndex: 0,
        channelDisplayNewsList: [],
        competitorInfoList: [],
        attentionInfoList: [],
        inputShowed: true,
        textFocus: false
      })
    }
    that.loadInfoList(that.data.pageNumber);
  },

/**
 * 进到相关资讯、相关项目、我的关注选择类型
 */
  select_type: function (e) {
    var index = e.currentTarget.dataset.id;
    console.log("😁😁😄当前选项的state值为" + this.data.types[index].state);
    var currentState = this.data.types[index].state;
    if (!this.data.inputVal || this.data.inputVal.length == 0 )return;
    if (currentState == 1) return;
    //console.log("😁😁😄index的值为" + index);

    for (var i = 0; i < this.data.types.length; i++) {
      this.data.types[i].state = 0;
    }

    this.data.types[index].state = 1;
    this.setData({
      types: this.data.types,
      activeIndex: index,
      pageNumber: 1,
      lastNewsSimplifyId: 0,
      selectSortIndex:0,
      lastCompetitorId: 0,
      channelDisplayNewsList: [],
      competitorInfoList: [],
      attentionInfoList: [],
      showLoading: true,
      showMore: true,

      isSortSelected: false,
      selectSortVal: "默认排序",
      sortMenuShow: false,
      selectSortIndex: 0,

      filterDateTypeVal: "",
      selectFilterDateType: 0,

    });

    if (index == 0 && this.data.channelDisplayNewsList.length == 0 && this.data.competitorInfoList.length == 0 && this.data.attentionInfoList.length == 0) {
      console.log("😁😁😄选中类型为创投资讯");

      this.setData({
        isProjectSelected: false,
        selectConditionVal: "",
        finishConditionSelected: false,
        isTurnExpanded: false,
        isFieldExpanded: false,
        turnExpandText: "展开",
        turnExpandCon: "../../image/notExpandTwo.png",
        fieldExpandText: "展开",
        fieldExpandCon: "../../image/notExpandTwo.png",
      });
      this.deleteProvince();
      this.deleteCity();
      this.deleteAllTurn();
      this.deleteField();
      this.deleteFilterDateType();

      this.loadInfoList(this.data.pageNumber);
    } else if (index == 1 && this.data.channelDisplayNewsList.length == 0 && this.data.competitorInfoList.length == 0 && this.data.attentionInfoList.length == 0) {
      console.log("😁😁😄选中类型为相关项目");

      this.setData({
        isProjectSelected: true,
      });

      this.loadCompetitorInfoListByDefault(this.data.pageNumber);

    } else if (index == 2 && this.data.channelDisplayNewsList.length == 0 && this.data.competitorInfoList.length == 0 && this.data.attentionInfoList.length == 0){
      console.log("😁😁😄选中类型为我的关注");

      this.setData({
        isProjectSelected: false,
        selectConditionVal: "",
        finishConditionSelected: false,
        isTurnExpanded: false,
        isFieldExpanded: false,
        turnExpandText: "展开",
        turnExpandCon: "../../image/notExpandTwo.png",
        fieldExpandText: "展开",
        fieldExpandCon: "../../image/notExpandTwo.png",
      });
      this.deleteProvince();
      this.deleteCity();
      this.deleteAllTurn();
      this.deleteField();
      this.deleteFilterDateType();

      this.loadAttentionInfoList(this.data.pageNumber);
    }
  },

/**
 * 进到资讯内容搜索列表
 */
  loadInfoList: function (pageNumber) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //内容搜索
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "originSimplifyNewsId": that.data.lastNewsSimplifyId,
      }
    }

    console.log("param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/info/news/home_page_search_news_list", JSON.stringify(param), function (res) {

      if (typeof res == "object") {
        console.log('返回内容搜索列表res为' + JSON.stringify(res));
      }

      if (typeof res == "string") {
        console.log('res是字符串');
        console.log('返回内容搜索列表res存在换行为' + res.indexOf("\n"));
        res = res.replace(/\n/g, '');
        console.log('返回内容搜索列表res为' + res);
        var resObj = JSON.parse(res);
        console.log('返回内容搜索列表res为' + JSON.stringify(resObj));
        res = resObj;
      }

      if (res.code == 200000) {
        console.log('获取内容搜索列表成功');
        console.log('返回搜索列表res为' + JSON.stringify(res));
        
        var currentChannelDisplayNewsList = res.data;
        console.log("currentChannelDisplayNewsList为" + currentChannelDisplayNewsList);
        var lastIndex = currentChannelDisplayNewsList.length - 1;
        var lastNewsSimplifyId = 0;
        if (lastIndex >= 0) {
          lastNewsSimplifyId = currentChannelDisplayNewsList[lastIndex].newsSimplifyId;
          console.log('新闻列表的newsSimplifyId为' + lastNewsSimplifyId);
        }

        if (currentChannelDisplayNewsList.length > 0) {
          that.setData({
            channelDisplayNewsList: that.data.channelDisplayNewsList.concat(currentChannelDisplayNewsList),
            lastNewsSimplifyId: lastNewsSimplifyId,
            pageNumber: pageNumber + 1,
          })
        }
        console.log('currentChannelDisplayNewsList的长度为' + currentChannelDisplayNewsList.length);
        if (currentChannelDisplayNewsList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },

  /**
   *我的关注搜索列表
   */
  loadAttentionInfoList: function (pageNumber) {
    var currentid = new Date().getTime();
    var currentSign = common.getSign();

    var that = this;
    //我的关注搜索
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "originSimplifyNewsId": that.data.lastNewsSimplifyId,
      }
    }

    console.log("param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/focusinfo/focus_info_search_news_list", JSON.stringify(param), function (res) {

      if (typeof res == "object") {
        console.log('返回我的关注搜索列表res为' + JSON.stringify(res));
      }

      if (typeof res == "string") {
        console.log('res是字符串');
        console.log('返回我的关注搜索列表res存在换行为' + res.indexOf("\n"));
        res = res.replace(/\n/g, '');
        console.log('返回我的关注搜索列表res为' + res);
        var resObj = JSON.parse(res);
        console.log('返回我的关注搜索列表res为' + JSON.stringify(resObj));
        res = resObj;
      }

      if (res.code == 200000) {
        console.log('获取我的关注搜索列表成功');
        console.log('返回我的关注搜索列表res为' + JSON.stringify(res));

        var currentAttentionInfoList = res.data;
        console.log("currentAttentionInfoList为" + currentAttentionInfoList);
        var lastIndex = currentAttentionInfoList.length - 1;
        var lastNewsSimplifyId = 0;
        if (lastIndex >= 0) {
          lastNewsSimplifyId = currentAttentionInfoList[lastIndex].newsSimplifyId;
          console.log('我的关注的newsSimplifyId为' + lastNewsSimplifyId);
        }

        if (currentAttentionInfoList.length > 0) {
          that.setData({
            attentionInfoList: that.data.attentionInfoList.concat(currentAttentionInfoList),
            lastNewsSimplifyId: lastNewsSimplifyId,
            pageNumber: pageNumber + 1,
          })
        }
        console.log('currentAttentionInfoList的长度为' + currentAttentionInfoList.length);
        if (currentAttentionInfoList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },

  /**
  * 筛选删除
  */
  deleteSortItem: function () {
    var that = this;

    that.deleteProvince();
    that.deleteCity();
    that.deleteAllTurn();
    that.deleteField();
    that.deleteFilterDateType();

    that.setData({
      selectConditionVal: "",
      lastCompetitorId: 0,
      pageNumber:1,
      competitorInfoList: [],
      showLoading: true,
      showMore: true,
      isTurnExpanded: false,
      isFieldExpanded: false,
      turnExpandText: "展开",
      turnExpandCon: "../../image/notExpandTwo.png",
      fieldExpandText: "展开",
      fieldExpandCon: "../../image/notExpandTwo.png",
      finishConditionSelected:false,

      filterDateTypeVal: "",
      selectFilterDateType: 0,

    })

    if (that.data.selectSortIndex == 0) {
      that.loadCompetitorInfoListByDefault(that.data.pageNumber);
    } else {
      that.loadCompetitorInfoListBySort(that.data.pageNumber);
    }

  },

  /**
   * 按默认排序规则根据搜索关键字查找符合条件的竞品项目
   */
  loadCompetitorInfoListByDefault: function (pageNumber) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //项目搜索
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "competitorSort": that.data.selectSortIndex,
        "competitorId": that.data.lastCompetitorId,
      }
    }

    console.log("按默认排序规则根据搜索关键字查找符合条件的竞品项目param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/competitor/search_competitor_info_list_by_default", JSON.stringify(param), function (res) {
      console.log('返回按默认排序规则根据搜索关键字查找符合条件的竞品项目列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取按默认排序规则根据搜索关键字查找符合条件的竞品项目列表成功');
        console.log('返回按默认排序规则根据搜索关键字查找符合条件的竞品项目列表res为' + JSON.stringify(res));

        var currentCompetitorInfoList = res.data.competitorInfoList;
        console.log("currentCompetitorInfoList为" + currentCompetitorInfoList);
        var lastIndex = currentCompetitorInfoList.length - 1;
        var lastCompetitorId = 0;
        if (lastIndex >= 0) {
          lastCompetitorId = currentCompetitorInfoList[lastIndex].competitorId;
          console.log('按默认排序规则根据搜索关键字查找符合条件的竞品项目的lastCompetitorId为' + lastCompetitorId);
        }

        if (currentCompetitorInfoList.length > 0) {
          that.setData({
            competitorInfoList: that.data.competitorInfoList.concat(currentCompetitorInfoList),
            lastCompetitorId: lastCompetitorId,
            pageNumber: pageNumber + 1,
          })
        }

        if (currentCompetitorInfoList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },

  /**
   * 按给定排序规则搜索关键字查找符合条件的竞品项目
   */
  loadCompetitorInfoListBySort: function (pageNumber) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //项目搜索
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "competitorSort": that.data.selectSortIndex,
        "competitorId": that.data.lastCompetitorId,
      }
    }

    console.log("按给定排序规则搜索关键字查找符合条件的竞品项目param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/competitor/search_competitor_info_list_by_sort", JSON.stringify(param), function (res) {
      console.log('返回按给定排序规则搜索关键字查找符合条件的竞品项目res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取按给定排序规则搜索关键字查找符合条件的竞品项目成功');
        console.log('返回按给定排序规则搜索关键字查找符合条件的竞品项目res为' + JSON.stringify(res));

        var currentCompetitorInfoList = res.data.competitorInfoList;
        console.log("currentCompetitorInfoList为" + currentCompetitorInfoList);
        var lastIndex = currentCompetitorInfoList.length - 1;
        var lastCompetitorId = 0;
        if (lastIndex >= 0) {
          lastCompetitorId = currentCompetitorInfoList[lastIndex].competitorId;
          console.log('按给定排序规则搜索关键字查找符合条件的竞品项目列表的lastCompetitorId为' + lastCompetitorId);
        }

        if (currentCompetitorInfoList.length > 0) {
          that.setData({
            competitorInfoList: that.data.competitorInfoList.concat(currentCompetitorInfoList),
            lastCompetitorId: lastCompetitorId,
            pageNumber: pageNumber + 1,
          })
        }

        if (currentCompetitorInfoList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },


  /**
   * 滚动加载更多
   */
  scrolltolower: function () {
    if (this.data.showMore == false) return;
    if (this.data.finishLoadInfo == false) return;
    console.log("滚动时候当前选中的类型为" + this.data.activeIndex);
    if (this.data.activeIndex == 0) {
      this.loadInfoList(this.data.pageNumber);
    } else if (this.data.activeIndex == 1 && this.data.finishConditionSelected == false) {
      if (this.data.selectSortIndex == 0) {
        this.loadCompetitorInfoListByDefault(this.data.pageNumber);
      } else {
        this.loadCompetitorInfoListBySort(this.data.pageNumber);
      }
    } else if (this.data.activeIndex == 1 && this.data.finishConditionSelected == true){
      if (this.data.selectSortIndex == 0) {
        this.loadSeniorSearchCompetitorInfoListByDefault(this.data.pageNumber);
      } else {
        this.loadSeniorSearchCompetitorInfoListBySort(this.data.pageNumber);;
      }
    } else if (this.data.activeIndex == 2) {
      this.loadAttentionInfoList(this.data.pageNumber);
    }

    console.log('😄😄😄😄😄😄加载更多当前页' + this.data.pageNumber);
  },

  /**
   * 点击资讯详情
   */
  onArticleClicked: function (e) {

    var that = this;
    var aid = e.currentTarget.dataset.aid;
    console.log("😁😁😄资讯id的值为" + aid);

    wx.navigateTo({
      url: '../infoDetail/infoDetail?newsSimplifyId=' + aid
    })
  },


  /**
   * 点击项目详情
   */
  onProjectClicked: function (e) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);
    
    var that = this;
    var aid = e.currentTarget.dataset.aid;
    console.log("😁😁😄项目id的值为" + aid);

    //获取个人详细信息
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid
      }
    }

    console.log("param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/get_mini_prg_user_detail_info", JSON.stringify(param), function (res) {
      console.log('返回个人详细信息res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取个人详细信息');
        var isValidMember = res.data.isValidMember;
        var checkMember = res.data.checkMember;
        
        if (checkMember == 0){
          console.log('不要检查会员信息');

          wx.navigateTo({
            url: '../projectDetail/projectDetail?competitorId=' + aid
          })
        } else if(checkMember == 1){
          console.log('要检查会员信息');
          
          if (isValidMember == true) {
            wx.navigateTo({
              url: '../projectDetail/projectDetail?competitorId=' + aid
            })
          } else {
            wx.showModal({
              title: '你目前还不是会员',
              content: '若想查看项目详情，请选择会员服务',
              confirmText: "确认",
              cancelText: "取消",
              success: function (res) {
                console.log(res);
                if (res.confirm) {
                  console.log('用户点击主操作')
                  wx.navigateTo({
                    url: '../myMemberService/myMemberService'
                  })
                } else {
                  console.log('用户点击辅助操作')
                }
              }
            });
          }
        }

      } else {
        common.showTip("网络故障", "loading")
        //  console.log('提交用户的投票信息出现问题！')
      }
    })
  },

  // 如果是收缩的话，则变为展开
  // 如果是展开的话，则变为收缩
  /**
  * 筛选点击操作
  */
  expandConditionSelectPage: function () {
    var that = this;
    if (!that.data.inputVal || that.data.inputVal.length == 0) return;
    var curConditionExpand = !that.data.isConditionExpanded;
    if (curConditionExpand == true){
      that.setData({
        isConditionExpanded: true,
        conditionExpandCon: "../../image/expandTwo.png",
      })

    }else{
      that.setData({
        isConditionExpanded: false,
        conditionExpandCon: "../../image/notExpandTwo.png",
      })
    }
  },

  // 开始是默认排序
  // 第一次点击则显示排序菜单，再次点击则隐藏排序菜单
  // 选中排序菜单中某项则更新排序
  // isSortSelected为Yes则加载遮盖，点击遮盖则隐藏并且退出排序菜单选择，isSortSelected为false

  /**
  * 排序菜单点击
  */
  sortAction: function () {
    var that = this;
    var curSortSelected = !that.data.isSortSelected;
    if (curSortSelected == true){
      that.setData({
        isSortSelected: true,
      })
      console.log("进行排序");
    }else{
      that.setData({
        isSortSelected: false,
      })
      console.log("取消排序");
    }
  },

  /**
  * 排序选择操作
  */
  sortSelectTap: function (e) {
    var that = this;
    var curIndex = e.currentTarget.dataset.aid;
    var curSortVal = e.currentTarget.dataset.keyword;
    console.log("选择的项目排序index为" + curIndex);
    console.log("选择的项目排序内容为" + curSortVal);

    var curTurnVal = that.data.turnVal;
    var curProvinceVal = that.data.provinceVal;
    var cityVal = that.data.cityVal;
    var curFieldVal = that.data.fieldVal;
    var curFilterDateTypeVal;
    if (that.data.filterDateTypeVal == "全部") {
      curFilterDateTypeVal = "";
      that.setData({
        filterDateTypeVal: "",
        selectFilterDateType: 0
      }
      )
    } else {
      curFilterDateTypeVal = that.data.filterDateTypeVal;
    }

    var curSelectFilterDateType = that.data.selectFilterDateType;
    console.log('确认筛选条件curTurnVal长度为' + curTurnVal.length);
    console.log('确认筛选条件curProvinceVal长度为' + curProvinceVal.length);
    console.log('确认筛选条件cityVal长度为' + cityVal.length);
    console.log('确认筛选条件curFieldVal长度为' + curFieldVal.length);
    console.log('确认筛选条件curFilterDateTypeVal长度为' + curFilterDateTypeVal.length);
    var selectConditionVal = curTurnVal + " " + curProvinceVal + " " + cityVal + " " + curFieldVal + " " + curFilterDateTypeVal;
    console.log('确认筛选条件selectConditionVal为' + selectConditionVal);
    var totalLength = curTurnVal.length + curProvinceVal.length + cityVal.length + curFieldVal.length + curFilterDateTypeVal.length;
    console.log('确认筛选条件totalLength为' + totalLength);

    if (totalLength <= 0) {
      that.setData({
        selectConditionVal: "",
        finishConditionSelected: false,
        lastCompetitorId: 0,
        competitorInfoList: [],
        pageNumber: 1,
      }
      )
      console.log('确认筛选条件finishConditionSelected为没有选择要素');
    } else {
      that.setData({
        selectConditionVal: selectConditionVal,
        lastCompetitorId: 0,
        finishConditionSelected: true,
        competitorInfoList: [],
        pageNumber: 1,
      }
      )
    }

    that.setData({
      isConditionExpanded: false,
      conditionExpandCon: "../../image/notExpandTwo.png",
      isTurnExpanded: false,
      isFieldExpanded: false,
      isSortSelected: false,
      selectSortVal: curSortVal,
      selectSortIndex: curIndex,
    })

    if (totalLength > 0) {
      if (that.data.selectSortIndex == 0) {
        that.loadSeniorSearchCompetitorInfoListByDefault(that.data.pageNumber);
      } else {
        that.loadSeniorSearchCompetitorInfoListBySort(that.data.pageNumber);;
      }
    } else {
      if (that.data.selectSortIndex == 0) {
        that.loadCompetitorInfoListByDefault(that.data.pageNumber);
      } else {
        that.loadCompetitorInfoListBySort(that.data.pageNumber);
      }
    }

  },

  /**
  * 轮次的展开收缩操作
  */
  changeTurnList: function () {
    console.log('改变轮次条件')
    var that = this;
    var curTurnExpanded = !that.data.isTurnExpanded;
    if (curTurnExpanded == true) {
      that.setData({
        isTurnExpanded: true,
        turnExpandCon: "../../image/expandTwo.png",
        turnExpandText:"收缩"
      })

    } else {
      that.setData({
        isTurnExpanded: false,
        turnExpandCon: "../../image/notExpandTwo.png",
        turnExpandText: "展开"
      })
    }
  },

  /**
  * 领域的展开收缩操作
  */
  changeFieldList: function () {
    console.log('改变领域条件')
    var that = this;
    var curFieldExpanded = !that.data.isFieldExpanded;
    if (curFieldExpanded == true) {
      that.setData({
        isFieldExpanded: true,
        fieldExpandCon: "../../image/expandTwo.png",
        fieldExpandText: "收缩"
      })

    } else {
      that.setData({
        isFieldExpanded: false,
        fieldExpandCon: "../../image/notExpandTwo.png",
        fieldExpandText: "展开"
      })
    }
  },

  /**
  * 省份选择器
  */
  bindProvincePickerChange: function (e) {
    console.log('省选择器' + e.detail.value)
    this.setData({
      provinceIndex: e.detail.value
    })
    var index = e.detail.value;
    var selectProvince = this.data.provinceList[index].regionName;
    var selectProvinceId = this.data.provinceList[index].regionId;
    console.log('省选择器selectProvince为' + selectProvince);
    console.log('省选择器selectProvinceId为' + selectProvinceId);

    this.setData({
      provinceVal: selectProvince,
      cityVal:""
    })

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;

    //获取地区列表
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "supRegionId": selectProvinceId,
        "supRegionName": selectProvince
      }
    }

    console.log("地区列表param为：" + JSON.stringify(param));
    common.sendRequest("/ipmMiniPrg/logon/child_region_list", JSON.stringify(param), function (res) {
      console.log('返回地区列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取地区列表成功');

        that.setData({
          cityList: res.data
        })

      } else {
        common.showTip("网络故障", "loading")
        //  console.log('提交用户的投票信息出现问题！')
      }
    })
  },


  /**
  * 城市选择器
  */
  bindCityPickerChange: function (e) {
    console.log('市选择器' + e.detail.value)
    var that = this;
    that.setData({
      cityIndex: e.detail.value
    })
    var index = e.detail.value;
    var selectCity = this.data.cityList[index].regionName;
    var selectCityId = this.data.cityList[index].regionId;
    console.log('市选择器selectCity为' + selectCity);
    console.log('市选择器selectCityId为' + selectCityId);

    that.setData({
      cityVal: selectCity
    })
  },

  /**
  * 省份删除
  */
  deleteProvince: function () {
    this.setData({
      provinceVal: "",
      cityVal: ""
    })
  },

  /**
  * 城市删除
  */
  deleteCity: function () {
    this.setData({
      cityVal: ""
    })
  },

  /**
  * 轮次单个删除
  */
  deleteTurn: function (e) {
    var that = this
    var aid = e.currentTarget.dataset.aid;
    var keyword = e.currentTarget.dataset.keyword;

    var selectTurnList = that.data.multiSelecteTurnList;
    
    for (var i = 0; i < selectTurnList.length; i++) {
      if (selectTurnList[i].value == aid) {
        selectTurnList[i].selected = false;
      }
    }

    var curSelectTurnList = [];
    for (var i = 0; i < selectTurnList.length; i++) {
      if (selectTurnList[i].selected == true) {
        curSelectTurnList.push(selectTurnList[i]);
      }
    }

    var curTurnList = that.data.turnList;

    for (var i = 0; i < curTurnList.length; i++) {
      if (curTurnList[i].value == aid) {
        curTurnList[i].selected = false;
      }
    }

    that.setData({
      turnList: curTurnList,
      multiSelecteTurnList: curSelectTurnList
    })

    var curTurnVal = "";
    for (var i = 0; i < curTurnList.length; i++) {
      if (curTurnList[i].selected == true) {
        curTurnVal = curTurnVal + curTurnList[i].name + ',';
      }
    }

    curTurnVal = curTurnVal.substring(0, curTurnVal.lastIndexOf(','));

    console.log("😁😁😄轮次curTurnVal的值为" + curTurnVal);

    that.setData({
      turnVal: curTurnVal
    })

  },

/**
* 轮次全部删除
*/
deleteAllTurn:function(){
  var that = this
  var curTurnList = that.data.turnList;
  for (var i = 0; i < curTurnList.length; i++) {
    curTurnList[i].selected = false;
  }

  that.setData({
    multiSelecteTurnList:[],
    turnVal: "",
    turnList: curTurnList
  })

},

  /**
  * 领域删除
  */
  deleteField: function () {
    var that = this
    var curFieldList = that.data.fieldList;
    for (var i = 0; i < curFieldList.length; i++) {
      curFieldList[i].selected = false;
    }

    that.setData({
      fieldVal: "",
      fieldList: curFieldList
    })
  },

  /**
  * 删除选择时间段类型
  */
  deleteFilterDateType: function ()  {
    var that = this
    var curFilterDateTypeList = that.data.filterDateTypeList;
    for (var i = 0; i < curFilterDateTypeList.length; i++) {
      curFilterDateTypeList[i].selected = false;
    }

    that.setData({
      filterDateTypeVal: "",
      selectFilterDateType: 0,
      filterDateTypeList: curFilterDateTypeList
    })
  },

  /**
  * 轮次多选，最多3个
  */
  multiSelectTurn: function (e) {
    var that = this
    var aid = e.currentTarget.dataset.aid;
    var keyword = e.currentTarget.dataset.keyword;
    console.log("😁😁😄轮次id的值为" + aid);
    console.log("😁😁😄轮次keyword的值为" + keyword);

    var curTurnList = that.data.turnList;
    var selectTurnList = [];

    for (var i = 0; i < curTurnList.length; i++) {

      if (curTurnList[i].value == aid) {
        curTurnList[i].selected = !curTurnList[i].selected;
      }

      if (curTurnList[i].selected == true){
        selectTurnList.push(curTurnList[i]);

        if (selectTurnList.length == 4){
            common.showTip("最多三个", "loading")
            curTurnList[i].selected = false;
            return;
        }
      }

      that.setData({
        multiSelecteTurnList: selectTurnList
      })
    }

    console.log('选中的轮次selectTurnList' + selectTurnList);
    that.setData({
      turnList: curTurnList
    })
    console.log('选中以后的turnList' + curTurnList);

    var curTurnVal = "";
    for (var i = 0; i < curTurnList.length; i++) {
      if (curTurnList[i].selected == true) {
        curTurnVal = curTurnVal + curTurnList[i].name + ',';
      }
    }

    curTurnVal = curTurnVal.substring(0, curTurnVal.lastIndexOf(','));
    
    console.log("😁😁😄轮次curTurnVal的值为" + curTurnVal);

      this.setData({
        turnVal: curTurnVal
      })
  },

  /**
  * 领域单选
  */
  singleSelectField: function (e) {
    var that = this
    var aid = e.currentTarget.dataset.aid;
    var keyword = e.currentTarget.dataset.keyword;
    console.log("😁😁😄领域id的值为" + aid);
    console.log("😁😁😄领域keyword的值为" + keyword);

    var curFieldList = that.data.fieldList;

    for (var i = 0; i < curFieldList.length; i++) {
      if (curFieldList[i].fieldClassId == aid) {
        curFieldList[i].selected = !curFieldList[i].selected;
      }
      else {
        curFieldList[i].selected = false;//其他false
      }
    }

    that.setData({
      fieldList: curFieldList
    })

    var curFieldVal = "";
    for (var i = 0; i < curFieldList.length; i++) {
      if (curFieldList[i].selected == true) {
        curFieldVal = curFieldList[i].fieldClassName;
      }
    }

    console.log("😁😁😄领域curFieldVal的值为" + curFieldVal);

      this.setData({
        fieldVal: curFieldVal
      })
  },

  /**
  * 时间段单选
  */
  singleSelectFilterDateType: function (e) {
    var that = this
    var aid = e.currentTarget.dataset.aid;
    var keyword = e.currentTarget.dataset.keyword;
    console.log("😁😁😄时间段id的值为" + aid);
    console.log("😁😁😄时间段keyword的值为" + keyword);

    var curFilterDateTypeList = that.data.filterDateTypeList;

    for (var i = 0; i < curFilterDateTypeList.length; i++) {
      if (curFilterDateTypeList[i].value == aid) {
        curFilterDateTypeList[i].selected = !curFilterDateTypeList[i].selected;
      }
      else {
        curFilterDateTypeList[i].selected = false;//其他false
      }
    }

    that.setData({
      selectFilterDateType: aid,
      filterDateTypeList: curFilterDateTypeList
    })

    var curFilterDateTypeVal = "";
    var curFilterDateType = 0;
    for (var i = 0; i < curFilterDateTypeList.length; i++) {
      if (curFilterDateTypeList[i].selected == true) {
        curFilterDateTypeVal = curFilterDateTypeList[i].name;
        curFilterDateType = curFilterDateTypeList[i].value;
      }
    }

    console.log("😁😁😄时间段curFilterDateTypeVal的值为" + curFilterDateTypeVal);
    console.log("😁😁😄时间段curFilterDateType的值为" + curFilterDateType);

    this.setData({
      filterDateTypeVal: curFilterDateTypeVal,
      selectFilterDateType: curFilterDateType
    })
  },

   /**
   * 筛选条件确认
   */
  confirmSelectCondition: function () {
    var that = this;
    var curTurnVal = that.data.turnVal;
    var curProvinceVal = that.data.provinceVal;
    var cityVal = that.data.cityVal;
    var curFieldVal = that.data.fieldVal;
    var curFilterDateTypeVal;
    if (that.data.filterDateTypeVal == "全部"){
        curFilterDateTypeVal = "";
        that.setData({
          filterDateTypeVal: "",
          selectFilterDateType: 0
        }
      )
    }else{
      curFilterDateTypeVal  = that.data.filterDateTypeVal;
    }
    
    var curSelectFilterDateType = that.data.selectFilterDateType;
    console.log('确认筛选条件curTurnVal长度为' + curTurnVal.length);
    console.log('确认筛选条件curProvinceVal长度为' + curProvinceVal.length);
    console.log('确认筛选条件cityVal长度为' + cityVal.length);
    console.log('确认筛选条件curFieldVal长度为' + curFieldVal.length);
    console.log('确认筛选条件curFilterDateTypeVal长度为' + curFilterDateTypeVal.length);
    var selectConditionVal = curTurnVal + " " + curProvinceVal + " " + cityVal + " " + curFieldVal + " " + curFilterDateTypeVal; 
    console.log('确认筛选条件selectConditionVal为' + selectConditionVal);
    var totalLength = curTurnVal.length + curProvinceVal.length + cityVal.length + curFieldVal.length + curFilterDateTypeVal.length;
    console.log('确认筛选条件totalLength为' + totalLength);

    if (totalLength <= 0 ){
        that.setData({
              selectConditionVal: "",
              finishConditionSelected: false,   
              lastCompetitorId: 0,     
              competitorInfoList: [],
              pageNumber: 1,
            }
        )
        console.log('确认筛选条件finishConditionSelected为没有选择要素' );
    }else{
      that.setData({
        selectConditionVal: selectConditionVal,
        lastCompetitorId: 0,
        finishConditionSelected: true,
        competitorInfoList: [],
        pageNumber: 1,
        }
      )
    }

    that.setData({
      isConditionExpanded: false,
      conditionExpandCon: "../../image/notExpandTwo.png",
    })
    
    if (totalLength > 0){
      if (that.data.selectSortIndex == 0) {
        that.loadSeniorSearchCompetitorInfoListByDefault(that.data.pageNumber);
      } else {
        that.loadSeniorSearchCompetitorInfoListBySort(that.data.pageNumber);;
      }
    }else{
      if (that.data.selectSortIndex == 0) {
        that.loadCompetitorInfoListByDefault(that.data.pageNumber);
      } else {
        that.loadCompetitorInfoListBySort(that.data.pageNumber);
      }
    }
  },


  /**
   * 按默认排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目
   */
  loadSeniorSearchCompetitorInfoListByDefault: function (pageNumber) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);
    
    var that = this;
    //项目筛选
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "competitorId": that.data.lastCompetitorId,
        "searchRoundOfFinancingName": that.data.turnVal,
        "searchProvinceName": that.data.provinceVal,
        "searchCityName": that.data.cityVal,
        "searchFieldName": that.data.fieldVal,
        "competitorSort": 0,
        "eventDatePeriod": that.data.selectFilterDateType,
      }
    }

    console.log("项目筛选param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/competitor/senior_search_competitor_info_list_by_default", JSON.stringify(param), function (res) {
      console.log('返回项目筛选列表res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取项目筛选列表成功');
        console.log('返回项目筛选列表res为' + JSON.stringify(res));

        var currentCompetitorInfoList = res.data.competitorInfoList;
        console.log("currentCompetitorInfoList为" + currentCompetitorInfoList);
        var lastIndex = currentCompetitorInfoList.length - 1;
        var lastCompetitorId = 0;
        if (lastIndex >= 0) {
          lastCompetitorId = currentCompetitorInfoList[lastIndex].competitorId;
          console.log('项目列表的lastCompetitorId为' + lastCompetitorId);
        }

        if (currentCompetitorInfoList.length > 0) {
          that.setData({
            competitorInfoList: that.data.competitorInfoList.concat(currentCompetitorInfoList),
            lastCompetitorId: lastCompetitorId,
            pageNumber: pageNumber + 1,
          })
        }

        if (currentCompetitorInfoList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },

 /**
 * 按给定排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目
 */
  loadSeniorSearchCompetitorInfoListBySort: function (pageNumber) {

    var currentid = new Date().getTime();
    var currentSign = common.getSign();
    console.log("进到homeSearchSettingPage的currentid为：" + currentid);
    console.log("进到homeSearchSettingPage的currentSign为：" + currentSign);

    var that = this;
    //项目筛选
    var param = {
      "id": currentid,
      "caller": app.globalData.caller,
      "sign": currentSign,
      "data": {
        "ipmDsn": app.globalData.ipmDsn,
        "ipmUidString": app.globalData.ipmUidString,
        "openid": app.globalData.userInfo.openid,
        "pageSize": that.data.pageSize,
        "pageNumber": that.data.pageNumber,
        "searchString": that.data.inputVal,
        "competitorId": that.data.lastCompetitorId,
        "searchRoundOfFinancingName": that.data.turnVal,
        "searchProvinceName": that.data.provinceVal,
        "searchCityName": that.data.cityVal,
        "searchFieldName": that.data.fieldVal,
        "competitorSort": that.data.selectSortIndex,
        "eventDatePeriod": that.data.selectFilterDateType,
      }
    }

    console.log("按给定排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目param为：" + JSON.stringify(param));

    that.setData({
      showLoading: false,
      finishLoadInfo: false
    })

    common.sendRequest("/ipmMiniPrg/competitor/senior_search_competitor_info_list_by_sort", JSON.stringify(param), function (res) {
      console.log('返回按给定排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目res为' + JSON.stringify(res));
      if (res.code == 200000) {
        console.log('获取按给定排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目列表成功');
        console.log('返回项目筛选列表res为' + JSON.stringify(res));

        var currentCompetitorInfoList = res.data.competitorInfoList;
        console.log("currentCompetitorInfoList为" + currentCompetitorInfoList);
        var lastIndex = currentCompetitorInfoList.length - 1;
        var lastCompetitorId = 0;
        if (lastIndex >= 0) {
          lastCompetitorId = currentCompetitorInfoList[lastIndex].competitorId;
          console.log('按给定排序规则根据搜索关键字和筛选条件查找符合条件的竞品项目列表的lastCompetitorId为' + lastCompetitorId);
        }

        if (currentCompetitorInfoList.length > 0) {
          that.setData({
            competitorInfoList: that.data.competitorInfoList.concat(currentCompetitorInfoList),
            lastCompetitorId: lastCompetitorId,
            pageNumber: pageNumber + 1,
          })
        }

        if (currentCompetitorInfoList.length >= 10) {
          that.setData({
            showMore: true,
            finishLoadInfo: true
          })
        } else {
          that.setData({
            showMore: false
          })
        }
      } else {
        common.showTip(res.message, "loading")
      }
    })
  },

  /**
   * 吐槽
   */
  handleFeedback: function () {
    wx.navigateTo({
      url: '../myFeedback/myFeedback'
    })
  },

  /**
  * 页面渲染完成
  */
  onReady: function () {

    
  },

  /**
  * 页面显示
  */
  onShow: function () {
  },

  /**
  * 页面隐藏
  */
  onHide: function () {
  },


  /**
  * 页面关闭
  */
  onUnload: function () {
  }

})

