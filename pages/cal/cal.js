Page({
  data:{
   backspace:"back",
   reset:"clear",
   negative:"negative",
   id11:"+",
   id9:"9",
   id8:"8",
   id7:"7",
   id12:"-",
   id6:"6",
   id5:"5",
   id4:"4",
   id13:"×",
   id3:"3",
   id2:"2",
   id1:"1",
   id14:"÷",
   id10:"0",
   dot:".",
   records:"history",
   equal:"=",
   screenData:"0",
   lastIsOperator:false,
   arr:[],
   logs:[]
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
   
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
  
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
   
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏
    
  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载
    
  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作
    
  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    
  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: 'title', // 分享标题
      desc: 'desc', // 分享描述
      path: 'path' // 分享路径
    }
  },
  history:function(){
      wx.navigateTo({
        url: '../list/list',
        success: function(res){
          // success
        },
        fail: function(res) {
          // fail
        },
        complete: function(res) {
          // complete
        }
      })
  },
  clickButton:function(event){

    console.log(event.target.id);
      var id=event.target.id;
      if(id==this.data.backspace){//退格
          var data=this.data.screenData;
          if(data==0){
            return;
          }
          data=data.substring(0,data.length-1);
          if(data==""||data=="-"){
            data=0;
          }
          this.setData({screenData:data});
          this.data.arr.pop();

      }else if(id==this.data.reset){//清屏
          this.setData({screenData:"0"});
          this.data.arr.length=0;

      }else if(id==this.data.negative){//正负号
          var data=this.data.screenData;
          if(data==0){
            return;
          }
          var firstWord=data.substring(0,1);
          if(firstWord=="-"){
            data=data.substring(1,data.length);
            this.data.arr.shift();//第一个元素去掉
          }else{
            data="-"+data;
            this.data.arr.unshift("-");//向第一个元素增加一个负号
          }
          this.setData({screenData:data});
  
      }else if(id==this.data.equal){//=
          var data=this.data.screenData;
          if(data==0){
            return;
          }
          var lastWord=data.substring(data.length-1,data.length);
          if(isNaN(lastWord)){//判断不是数字就return
            return;
          }
          var num="";

          var lastOperator;
          var arr=this.data.arr;
          var optarr=[];
          for(var i in arr){
            if(isNaN(arr[i])==false||arr[i]==this.data.dot||arr[i]==this.data.negative){
              num+=arr[i];//拼接点之后的数字
            }else{
              lastOperator=arr[i];
              optarr.push(num);
              optarr.push(arr[i]);
              num="";//直接拼接出一组数
            }
          }
          optarr.push(Number(num));//转换成数字
          var result=Number(optarr[0])*1.0;//改善小数点后正常计算
          console.log(result)
          for(var i=1;i<optarr.length;i++){
            if(isNaN(optarr[i])){//判断中间运算符
              if(optarr[1]==this.data.id11){
                result+=Number(optarr[i+1]);
              }else if(optarr[1]==this.data.id12){
                result-=Number(optarr[i+1]);
              }else if(optarr[1]==this.data.id13){
                result*=Number(optarr[i+1]);
              }else if(optarr[1]==this.data.id14){
                result/=Number(optarr[i+1]);
              }
            }
          }
          var log=data+result;
          this.data.logs.push(data+"="+result);
          wx.setStorageSync('callogs', this.data.logs);//把数据存储到logs[]里

          this.data.arr.length=0;//清空数组
          this.data.arr.push(result);//把结果放入数组使其可以接着运算
          this.setData({screenData:result+""});//把结果显示出来


      }else{
          //首位不显示运算符
          if(id==this.data.id11||id==this.data.id12||id==this.data.id13||id==this.data.id14||id==this.data.equal){
            if(this.data.lastIsOperator==true||this.data.screenData==0){
              return;
            }
          }

           if(id==this.data.dot){//前一位为运算符点不显示 
             if(this.data.lastIsOperator==true){
               return;
             }
              /*for(var i=0; i<=data.length;i++){ //判断是否已经有一个点号 
              if(data.substring(i,1)=="."){return;} //如果有则不再插入 
              } 
              data=data+".";*/
           }

          var sd=this.data.screenData;
          var data;
          if(sd==0){//首位是否为零判断
            data=id;
          }else{
            data=sd+id;
          }
          this.setData({screenData:data});
      
          this.data.arr.push(id);//每次点击都会被放入arr[]里
          //如果最后一位是运算符则不显示运算符没有就添加上去
          if(id==this.data.id11||id==this.data.id12||id==this.data.id13||id==this.data.id14||id==this.data.dot||id==this.data.equal){
              this.setData({lastIsOperator:true});
          }else{
              this.setData({lastIsOperator:false});       
          }
      }
  }
})