## 说明
此插件是通过vue的一个轮子改造成的react版本，若有侵权，请告知删除。


## 安装
``` shell
$ npm install react-slide-verify --save-dev
```

## 使用
```jsx
import ReactSlideVerify from 'react-slide-verify';

onSuccess = () => {
    console.log('成功回调');
}

onFail = () => {
    console.log('失败回调');
}

onRefresh = () => {
    console.log('刷新')
}
<ReactSlideVerify
    l={40}
    r={8}
    w={310}
    h={155}
    accuracy={5}
    imgs={[img1, img2, img3, img4, img5]}
    sliderText="向右滑动"
    success={this.onSuccess}
    fail={this.onFail}
    refresh={this.onRefresh}
/>

```

## 参数说明

| 属性/方法  | 说明                                         | 类型           | 默认值   | 是否必传 |
| ---------- | -------------------------------------------- | -------------- | -------- | -------- |
| l          | 滑块大小                                     | number         | --       | 是       |
| r          | 滑块突起大小                                 | number         | --       | 是       |
| w          | 画布宽度                                     | number         | --       | 是       |
| h          | 画布高度                                     | number         | --       | 是       |
| accuracy   | 匹配精确度                                   | number         | 5        | 是       |
| imgs       | 画布背景图                                   | string[]       | --       | 否       |
| sliderText | 底部拖动条文字说明                           | string         | 向右滑动 | 是       |
| success    | 匹配成功回调函数，返回滑动开始到结束时间time | Function(time) | --       | 是       |
| fail       | 匹配失败回调函数                             | Function()     | --       | 是       |
| refresh    | 刷新画布回调函数                             | Function()     | --       | 是       |

