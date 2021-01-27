import React, { Component, Fragment } from 'react';
import classnames from 'classnames'
import './index.less';
const PI = Math.PI;
class ReactSlideVerify extends Component {
    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.block = React.createRef();
        this.state = {
            containerActive: false, // container active class
            containerSuccess: false, // container success class
            containerFail: false, // container fail class
            canvasCtx: null,
            blockCtx: null,
            block: null,
            block_x: undefined, // container random position
            block_y: undefined,
            L: this.props.l + this.props.r * 2 + 3, // block real lenght
            img: undefined,
            originX: undefined,
            originY: undefined,
            isMouseDown: false,
            trail: [],
            sliderLeft: 0, // block right offset
            sliderMaskWidth: 0, // mask width,
            success: false, // Bug Fixes 修复了验证成功后还能滑动
            loadBlock: true, // Features 图片加载提示，防止图片没加载完就开始验证
            timestamp: null,
        }
    }

    componentDidMount() {
        this.init();
    }

    sum = (x, y) => {
        return x + y
    }

    square = (x) => {
        return x * x
    }

    init = () => {
        this.initDom()
        this.initImg()
        this.bindEvents()
    }

    initDom = () => {
        this.setState({
            block: this.block.current,
            canvasCtx: this.canvas.current.getContext('2d'),
            blockCtx: this.block.current.getContext('2d'),
        })
    }

    initImg = () => {
        const img = this.createImg(() => {
            // 图片加载完关闭遮蔽罩
            this.setState({ loadBlock: false })
            this.drawBlock()
            this.state.canvasCtx.drawImage(img, 0, 0, this.props.w, this.props.h)
            this.state.blockCtx.drawImage(img, 0, 0, this.props.w, this.props.h)
            let {
                block_x: x,
                block_y: y,
                L
            } = this.state;
            let _y = y - this.props.r * 2 - 1;
            let ImageData = this.state.blockCtx.getImageData(x, _y, L, L);
            // console.log(ImageData);
            this.block.current.width = L;
            this.state.blockCtx.putImageData(ImageData, 0, _y)
        });
        this.setState({ img })
    }
    drawBlock = () => {
        this.setState({
            block_x: this.getRandomNumberByRange(this.state.L + 10, this.props.w - (this.state.L + 10)),
            block_y: this.getRandomNumberByRange(10 + this.props.r * 2, this.props.h - (this.state.L + 10))
        }, () => {
            this.draw(this.state.canvasCtx, this.state.block_x, this.state.block_y, 'fill')
            this.draw(this.state.blockCtx, this.state.block_x, this.state.block_y, 'clip')
        })


    }

    draw = (ctx, x, y, operation) => {
        let {
            l,
            r
        } = this.props;
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI)
        ctx.lineTo(x + l, y)
        ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
        ctx.lineTo(x + l, y + l)
        ctx.lineTo(x, y + l)
        ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true)
        ctx.lineTo(x, y)
        ctx.lineWidth = 2
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
        ctx.stroke()
        ctx[operation]()
        // Bug Fixes 修复了火狐和ie显示问题
        ctx.globalCompositeOperation = "destination-over"
    }

    createImg = (onload) => {
        const img = document.createElement('img');
        img.crossOrigin = "Anonymous";
        img.onload = onload;
        img.onerror = () => {
            img.src = this.getRandomImg()
        }
        img.src = this.getRandomImg()
        return img;
    }

    // 随机生成img src
    getRandomImg = () => {

        const len = this.props.imgs.length;
        return len > 0 ?
            this.props.imgs[this.getRandomNumberByRange(0, len)] :
            'https://picsum.photos/300/150/?image=' + this.getRandomNumberByRange(0, 1084);
    }

    getRandomNumberByRange = (start, end) => {
        return Math.round(Math.random() * (end - start) + start)
    }

    refresh = () => {
        this.reset()
        // this.$emit('refresh')
    }

    sliderDown = (event) => {
        if (this.state.success) return;
        this.setState({
            originX: event.clientX,
            originY: event.clientY,
            isMouseDown: true,
            timestamp: + new Date()
        })
    }

    touchStartEvent = (e) => {
        if (this.state.success) return;
        this.setState({
            originX: e.changedTouches[0].pageX,
            originY: e.changedTouches[0].pageY,
            isMouseDown: true,
            timestamp: + new Date()
        })
    }

    bindEvents = () => {
        document.addEventListener('mousemove', (e) => {
            if (!this.state.isMouseDown) return false;
            const moveX = e.clientX - this.state.originX;
            const moveY = e.clientY - this.state.originY;
            if (moveX < 0 || moveX + 38 >= this.props.w) return false;
            this.setState({ sliderLeft: moveX + 'px' })
            let blockLeft = (this.props.w - 40 - 20) / (this.props.w - 40) * moveX;

            this.block.current.style.left = blockLeft + 'px';
            this.setState({
                containerActive: true,
                sliderMaskWidth: moveX + 'px',
                trail: [...this.state.trail, moveY]
            })
        });
        document.addEventListener('mouseup', (e) => {
            if (!this.state.isMouseDown) return false
            this.setState({ isMouseDown: false })
            if (e.clientX === this.state.originX) return false;
            this.setState({
                containerActive: false,
                timestamp: + new Date() - this.state.timestamp
            })

            const {
                spliced,
                TuringTest
            } = this.verify();
            console.log(spliced, TuringTest);

            if (spliced) {
                if (this.state.accuracy === -1) {
                    this.setState({ containerSuccess: true, success: true })
                    this.props.success(this.state.success);
                    // this.containerSuccess = true;
                    // this.success = true;
                    // this.$emit('success', this.timestamp);
                    return;
                }
                if (TuringTest) {
                    // succ
                    this.setState({ containerSuccess: true, success: true })
                    this.props.success(this.state.timestamp)
                } else {
                    this.setState({ containerFail: true })
                    this.props.again();
                }
            } else {
                this.setState({ containerFail: true })
                this.props.fail();
                setTimeout(() => {
                    this.reset()
                }, 1000)
            }
        })
    }

    touchMoveEvent = (e) => {
        if (!this.state.isMouseDown) return false;
        const moveX = e.changedTouches[0].pageX - this.state.originX;
        const moveY = e.changedTouches[0].pageY - this.state.originY;
        if (moveX < 0 || moveX + 38 >= this.props.w) return false;
        this.setState({ sliderLeft: moveX + 'px' })
        // this.sliderLeft = moveX + 'px';
        let blockLeft = (this.props.w - 40 - 20) / (this.props.w - 40) * moveX;

        this.block.current.style.left = blockLeft + 'px';
        this.setState({
            containerActive: true,
            sliderMaskWidth: moveX + 'px',
            trail: [...this.state.trail, moveY]
        })
    }

    touchEndEvent = (e) => {
        if (!this.state.isMouseDown) return false;
        this.setState({ isMouseDown: false })
        if (e.changedTouches[0].pageX === this.state.originX) return false;
        this.setState({
            containerActive: false,
            timestamp: + new Date() - this.state.timestamp
        })

        const {
            spliced,
            TuringTest
        } = this.verify();
        if (spliced) {
            if (this.state.accuracy === -1) {
                this.setState({ containerSuccess: true, success: true });
                this.props.success(this.state.timestamp);
                return;
            }
            if (TuringTest) {
                // succ
                this.setState({ containerSuccess: true, success: true });
                this.props.success(this.state.timestamp);
            } else {
                this.setState({
                    containerFail: true
                })
                this.props.again()
            }
        } else {
            this.setState({ containerFail: true });
            this.props.fail()
            setTimeout(() => {
                this.reset()
            }, 1000)
        }
    }

    verify = () => {
        const arr = this.state.trail // drag y move distance
        const average = arr.reduce(this.sum) / arr.length // average
        const deviations = arr.map(x => x - average) // deviation array
        const stddev = Math.sqrt(deviations.map(this.square).reduce(this.sum) / arr.length) // standard deviation
        const left = parseInt(this.block.current.style.left)
        const accuracy = this.props.accuracy <= 1 ? 1 : this.props.accuracy > 10 ? 10 : this.props.accuracy;
        return {
            spliced: Math.abs(left - this.state.block_x) <= accuracy,
            TuringTest: average !== stddev, // equal => not person operate
        }
    }

    reset() {
        this.setState({
            success: false,
            containerActive: false,
            containerSuccess: false,
            containerFail: false,
            sliderLeft: 0,
            sliderMaskWidth: 0
        })

        // canvas
        let {
            w,
            h
        } = this.props;
        this.block.current.style.left = 0;
        this.state.canvasCtx.clearRect(0, 0, w, h)
        this.state.blockCtx.clearRect(0, 0, w, h)
        this.block.current.width = w

        // generate img
        this.state.img.src = this.getRandomImg();
    }



    render() {
        const {
            containerActive,
            containerSuccess,
            containerFail,
            canvasCtx,
            blockCtx,
            block,
            block_x,
            block_y,
            L,
            originX,
            originY,
            isMouseDown,
            trail,
            sliderLeft,
            sliderMaskWidth,
            success,
            loadBlock,
            timestamp
        } = this.state;
        const {
            l = 42, r = 10, w = 335, h = 155, sliderText, accuracy, show = true, imgs
        } = this.props;
        const itemClass = classnames({
            'slide-verify-slider': true,
            'container-active': containerActive,
            'container-success': containerSuccess,
            'container-fail': containerFail
        })
        return (
            <div className="verify-container">
                <div
                    className="slide-verify"
                    style={{ width: w }}
                    id="slideVerify"
                    onselectstart={() => { return false }}>
                    <div className={loadBlock ? 'slider-verify-loading' : ''}></div>
                    <canvas width={w} height={h} ref={this.canvas}></canvas>
                   
                    <canvas width={w} height={h} ref={this.block} className="slide-verify-block"></canvas>
                    {
                        show
                            ?
                            <div className="refresh-content" onClick={this.refresh}>
                                <div className="slide-verify-refresh-icon"></div>
                                <span>刷新</span>
                            </div>
                            :
                            null
                    }
                    <div
                        className={itemClass}
                    >
                        <div className="slide-verify-slider-mask" style={{ width: sliderMaskWidth }}>
                            <div onMouseDown={this.sliderDown}
                                onTouchStart={this.touchStartEvent}
                                onTouchMove={this.touchMoveEvent}
                                onTouchEnd={this.touchEndEvent}
                                className="slide-verify-slider-mask-item"
                                style={{ left: sliderLeft }}>
                                <div className="slide-verify-slider-mask-item-icon"></div>
                            </div>
                        </div>
                        <span className="slide-verify-slider-text">{this.props.sliderText}</span>
                    </div>
                </div>
            </div>

        )
    }
}

export default ReactSlideVerify;