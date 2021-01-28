import React, { Component } from 'react';
import ReactDom from 'react-dom';
import ReactSlideVerify from '../src/index'
import './demo.less';
import img1 from './../assets/img1.jpg';
import img2 from './../assets/img2.jpg';
import img3 from './../assets/img3.jpg';
import img4 from './../assets/img4.jpg';
import img5 from './../assets/img5.jpg';

class Demo extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    onSuccess = (time) => {
        console.log(time);
    }

    onFail = () => {
        console.log('失败');
    }

    onRefresh = () => {
        console.log('刷新')
    }

    render() {
        return (
            <div className="container">
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
            </div>
            
        )
    }
}


ReactDom.render(<Demo />, document.getElementById('app'));