Component({
  properties: {
    rank: {
      type: Number,
      value: 0,
    },
    nickName: {
      type: String,
      value: '',
    },
    avatarUrl: {
      type: String,
      value: '',
    },
    province: {
      type: String,
      value: '',
    },
    city: {
      type: String,
      value: '',
    },
    valueText: {
      type: String,
      value: '',
    },
  },
  
  data: {
    isTop3: false,
  },
  
  observers: {
    'rank': function(rank: number) {
      this.setData({
        isTop3: rank <= 3,
      });
    },
  },
});
