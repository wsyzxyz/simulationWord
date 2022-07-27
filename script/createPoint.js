// 生成栗子

//鸡肋
class ChestnutsPoint {
  constructor(option) {
    //栗子宽度
    this.pointWidth = option?.pointWidth ?? 2
    //栗子高度
    this.pointHeight = option?.pointHeight ?? 2
    //移动的范围
    this.moveBound = option?.moveBound ?? [0, 800]
    //移动步数
    this.moveStep = option?.moveStep ?? [1, 5]
    this.init()
  }

  //存储所有生成的栗子
  static pointArray = []

  move = function (dom, parentElement) {
    let self = this
    setInterval(function () {
      let { x, y } = self.randomPositionMove()
      dom.style.top = parseInt(dom.style.top.split('px')[0]) + y + 'px'
      dom.style.left = parseInt(dom.style.left.split('px')[0]) + x + 'px'
      self.collisionDetection(parentElement)
    }, 0)
  }

  //生成指定范围随机数
  randomNum = function (min, max) {
    return min + Math.round((max - min) * Math.random())
  }
  //生成随机范围
  randomPosition = function (dom) {
    // let pointSize = dom.style.width
    return this.randomNum(this.moveBound[0], this.moveBound[1])
  }

  //随机方向移动
  randomPositionMove = function () {
    return {
      x:
        this.randomNum(0, 1) < 1
          ? -this.randomNum(this.moveStep[0], this.moveStep[1])
          : this.randomNum(this.moveStep[0], this.moveStep[1]),
      y:
        this.randomNum(0, 1) < 1
          ? -this.randomNum(this.moveStep[0], this.moveStep[1])
          : this.randomNum(this.moveStep[0], this.moveStep[1]),
    }
  }

  //碰撞检测
  collisionDetection = function (parentElement) {
    //碰撞到一起的点
    let collisionPointArray = []

    for (let i = 0; i < ChestnutsPoint.pointArray.length; i++) {
      //渣渣代码
      //需要检测点列表(去掉自己)
      let otherPointArray = []
      for (let j = 0; j < ChestnutsPoint.pointArray.length; j++) {
        if (
          ChestnutsPoint.pointArray[j].mark !==
          ChestnutsPoint.pointArray[i].mark
        ) {
          otherPointArray.push(ChestnutsPoint.pointArray[j])
        }
      }

      //碰撞检测
      let result = otherPointArray.filter((item) => {
        return (
          item.style.left == ChestnutsPoint.pointArray[i].style.left &&
          item.style.top == ChestnutsPoint.pointArray[i].style.top
        )
      })
      //碰撞检测到的点
      if (result.length > 0) {
        if (result.length > 1) {
          console.log('同时多个点相遇!!!')
          debugger
        }
        collisionPointArray.push([ChestnutsPoint.pointArray[i], result])
      }
    }

    if (collisionPointArray.length > 0) {
      //清除掉碰撞到的点
      let collisionPointFlat = collisionPointArray.flat(Infinity)
      let collisionPointSet = new Set()
      for (let i = 0; i < collisionPointFlat.length; i++) {
        collisionPointSet.add(collisionPointFlat[i].mark)
      }
      let collisionPointSetArray = Array.from(collisionPointSet)
      let result = ChestnutsPoint.pointArray.filter(function (item) {
        return !collisionPointSetArray.includes(item.mark)
      })
      ChestnutsPoint.pointArray = result
      for (let i = 0; i < collisionPointSetArray.length; i++) {
        let dom = $(parentElement).children()
        for (let j = 0; j < dom.length; j++) {
          if (dom[j].mark == collisionPointSetArray[i]) {
            $(parentElement)[0].removeChild(dom[j])
          }
        }
      }
      //添加新增的点
    }

    //将新生成的点加入到栗子库中
    for (let i = 0; i < collisionPointArray.length; i++) {
      for (let j = 0; j < collisionPointArray[i][1].length; j++) {
        // collisionPointArray[i][0]
        this.createPoint({
          pointWidth: '30px',
          pointHeight: '30px',
        })
      }
    }
  }

  //初始化
  init = function () {
    this.createPoint()
  }
  //生成栗子
  createPoint = function (option) {
    let parentElement =
      option?.mapElement ?? document.querySelector('.mainControl')
    let dom = document.createElement('div')
    dom.className = 'chestnutsPoint'
    dom.style.width = option?.pointWidth ?? this.pointWidth + 'px'
    dom.style.height = option?.pointHeight ?? this.pointHeight + 'px'
    dom.style.top = this.randomPosition(dom) + 'px'
    dom.style.left = this.randomPosition(dom) + 'px'
    //标识
    dom.mark = this.randomNum(1, 9999999999) //偷懒

    //存起来
    ChestnutsPoint.pointArray.push(dom)
    $(parentElement).append(dom)
    this.move(dom, parentElement)
  }
}
