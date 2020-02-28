const XMUBuild = [["南强二","群贤二","集美一","同安一","嘉庚二","嘉庚五","联兴楼","学生公寓教学楼","海韵教学楼","法学院教学楼"], ["文宣楼","学武楼","坤銮楼","和木楼","成伟楼","成义楼","成智楼","爱礼楼","系平楼","周隆泉楼"]];
const WEEK = ["星期日","星期一","星期二","星期三","星期四","星期五","星期六"];
const TIME = [8,9,10,11,12,13,14,15,16,17,18,19,20,21];
const TIMEEND = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22];
const MINUTE = ["00","05","10","15","20","25","30","35","40","45","50","55"];
Page({
  //数据
  data: {
    //头图参数
    indicatorDots: true,
    autoplay: true,
    interval: 8000,
    duration: 1000,
    circular: true,
    background: ['../home.jpg','../sub.jpg'],

    //教室选择
    campus:"思明校区",
    build:"南强二",
    multiArray:[["思明校区","翔安校区"],XMUBuild[0]],
    multiIndex:[0,0],

    //日期参数
    selectToday:true,
    startTime:[0,0],
    endTime:[0,0],
    startHourArray:TIME,
    endHourArray:TIMEEND,
    minArray:MINUTE,
    toastCount:true,
  },
  //教室选择事件
  pickClass: function (event) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex,
      campus:"",
      build:""
    };
    let [pre,cur] = event.detail.value;
    data.multiIndex = [pre,cur];
    data.multiArray[1] = XMUBuild[pre];
    data.campus = data.multiArray[0][pre];
    data.build = data.multiArray[1][cur];
    this.setData(data);
  },

  pickClassColumnChange: function (event) {
    if(event.detail.column === 0){
      let data = {
        multiArray:this.data.multiArray,
        multiIndex:this.data.multiIndex
      };
      let cur = event.detail.value;
      data.multiArray[1] = XMUBuild[cur];
      data.multiIndex = [cur,0];
      this.setData(data);
    }
  },
  //时间选择事件
    //日期选择
  handleToday: function(){
    if(this.data.selectToday == false){
      this.setData({
        selectToday : true
      })
    }
  },
  handleTomorrow: function(){
    if(this.data.selectToday == true){
      this.setData({
        selectToday : false,
      })
    }
  },
  changeTime: function(event){
    let [h, m] = event.detail.value;
    this.setData({
      startTime:[h,m]
    });
    let hour = this.data.startHourArray[h],
        endHour = this.data.endHourArray[this.data.endTime[0]];
    if((endHour < hour) || (endHour == hour && m > this.data.endTime[1])){
      this.setData({
        endTime:[this.data.endHourArray.indexOf(hour), m]
      });
    }
  },
  changeTimeEnd:function(event){
    let [h, m] = event.detail.value;
    let endHour = this.data.endHourArray[h],
        hour = this.data.startHourArray[this.data.startTime[0]];
    if(endHour < hour || (endHour == hour && m < this.data.startTime[1])){
      if(this.data.toastCount){
        this.setData({
          toastCount:false
        })
        wx.showToast({
          title: '结束时间需大于起始时间',
          icon:'none',
          duration:2000
        })
      }
      this.setData({
        endTime:[this.data.endHourArray.indexOf(hour),this.data.startTime[1]]
      })
    }else{
        this.setData({
          endTime: event.detail.value
        });
    }

  },
  handleInquire: function(){
    let {build,selectToday,startTime,endTime} = this.data
    let queryString = `build=${build}&today=${selectToday}&start=${startTime}&end=${endTime}`;
    wx.navigateTo({
      url: '../detail/home?'+queryString,
    })
  },
  handleToast(){
    wx.showModal({
      title:'公共教室暂停开放通知',
      content:'为全力做好新型冠状病毒疫情的防控工作，避免人流聚集的传染风险，切实保障广大师生的健康安全，根据学校指示要求：从1月27日起，全校所有公共教室暂停开放，重新开放时间另行通知。',
      showCancel:false
    })
  },
  //生命周期函数
  onLoad: function () {
    let now = new Date(), hour = now.getHours();
    let hourIndex = hour < 8 || hour > 21 ? 0 : hour - 8;
    this.setData({
      weekToday: WEEK[now.getDay()],
      weekTomorrow: WEEK[(now.getDay()+1)%7],
      startTime:[hourIndex,0],
      endTime:[hourIndex+1,0]
    })
  },
  onShareAppMessage: function () {
  }
})