<template>
  <div class="classifyChoiceBox">
    <div class="btn">
      <button class="pro-type-btn-fixed">
        <span>{{ activeItem[defaultProps.name] }}</span>
        <i class="iconfont" :class="[showAddicon]" @click="addClassify" v-if="showAdd"/>
      </button>
    </div>
    <div class="listBox"
         ref="listBox"
         @mouseout.stop="() => { return } "
         :style="{ width: hierarchy * columnWidth + 'px' }">
      <ul class="list parentList">
        <li v-for="(item, index) in data"
            @mouseover="parentFocus(item, index)"
            @click="choice(item)"
            :class="{active: activeIndexs === index}"
            :key="index">
          <span class="dd-name beyond" :title="item[defaultProps.name]">{{ item[defaultProps.name] }}</span>
          <i class="iconyou iconfont" v-if="item[defaultProps.children] && item[defaultProps.children].length > 0"/>
        </li>
      </ul>
      <div class="sublistBox">
        <ul class="list sublist" v-for="(it, ind) in subData" :key="ind">
          <li v-for="(item, index) in it"
              @mouseover="subFocus(item, index)"
              :class="{active2: item.flse}"
              @click="choice(item)"
              :key="index">
            <span class="dd-name beyond" :title="item[defaultProps.name]">{{ item[defaultProps.name] }}</span>
            <i class="iconyou iconfont" v-if="item[defaultProps.children] && item[defaultProps.children].length > 0"/>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  // 层级选择器
  export default {
    props: {
      props: { type: Object, default: () => { return {} } },
      active: { default: 0, type:  Number },
      showAdd: { default: false, type: Boolean },
      columnWidth: { default: 180, type: Number },
      parentNodeCheckbox: { default: true, type: Boolean },
      datas: { default: () => [], type: Array },
      showAddicon: { default: 'el-icon-plus', type: String }
    },
    data () {
      return {
        defaultProps: {children: 'children', name: 'name', id: 'id'},
        subData: [],
        data: [],
        activeItem: {},
        activeIndexs: '',
        hierarchy: 1, // 当前层级
        activeItemIndex: '', // 当前选中节点对应的索引值
        getDomFunFale: false // 适合去添加外层事件
      }
    },
    created () {
      this.activeIndexs = this.active
      this.defaultProps = this.extend(this.props, this.defaultProps)
    },
    mounted () {
      this.data = JSON.parse(JSON.stringify(this.datas))
      this.levelsFn(this.data, 0)
      this.getChoice(this.data)
    },
    methods: {
      // 合并对象
      extend (userOption, defaultOption) {
        if (!userOption) return defaultOption
        for (var key in defaultOption) {
          if (userOption[key] == null) {
            userOption[key] = defaultOption[key]
          } else if (typeof userOption[key] === 'object') {
            this.extend(userOption[key], defaultOption[key]) // 深度匹配
          }
        }
        return userOption
      },
      // 选择器失去焦点触发方法
      classIfyglobalmouseout () {
        this.activeIndexs = this.activeItemIndex || this.active
        this.getDomFun('清除事件')
        this.subData = []
        this.hierarchy = 1
      },
      // 根部节点获取焦点触发
      parentFocus (data, index) {
        this.subData = []
        this.activeIndexs = index
        let fals = false
        if (data[this.defaultProps.children] && data[this.defaultProps.children].length > 0) {
          this.subData.filter(item => {
            item.filter(items => {
              if (items.parentId === data[this.defaultProps.id]) {
                fals = true
              }
            })
          })
          if (!fals) {
            let objData = JSON.parse(JSON.stringify(data[this.defaultProps.children]))
            objData.forEach(item => {
              item['parentId'] = data[this.defaultProps.id]
            })
            this.subData.push(objData)
          }
          this.hierarchy = data.hierarchy + 1 // 代表有层级
        } else {
          this.hierarchy = data.hierarchy // 代表没有层级
          this.subData = []
        }
        if (!this.getDomFunFale) {
          this.getDomFun()
        }
      },
      // 子节点获取焦点触发
      subFocus (data, index) {
        let fals = false
        if (data[this.defaultProps.children] && data[this.defaultProps.children].length > 0) {
          // 去掉不是当前层级的数据
          let dsat = JSON.parse(JSON.stringify(this.subData))
          let filterData = dsat.filter((item, index) => index <= data.hierarchy - 2)
          this.subData = filterData
          // 找出未被添加的数据
          this.subData.filter(item => {
            item.filter(items => {
              if (items.parentId === data[this.defaultProps.id]) {
                fals = true
              }
            })
          })
          if (!fals) {
            let objData = JSON.parse(JSON.stringify(data[this.defaultProps.children]))
            objData.forEach(item => {
              item['parentId'] = data[this.defaultProps.id]
            })
            this.subData.push(objData)
          }
          // 只能显示大于自己的一级的子级
          let dsat2 = JSON.parse(JSON.stringify(this.subData))
          let filterData2 = dsat2.filter((item, index) => index <= data.hierarchy - 1)
          this.subData = filterData2
          this.hierarchy = data.hierarchy + 1 // 添加层级数
        } else {
          // 无子级
          let dsat = JSON.parse(JSON.stringify(this.subData))
          let filterData = dsat.filter((item, index) => index <= data.hierarchy - 2)
          this.subData = filterData
          this.hierarchy = data.hierarchy // 改为当前层级
        }
        // 给定当前获取节点
        let dsat3 = JSON.parse(JSON.stringify(this.subData))
        dsat3.forEach(items => {
          items.forEach(ites => {
            if (ites.hierarchy === data.hierarchy && ites[this.defaultProps.id] !== data[this.defaultProps.id]) {
              ites['flse'] = false
            } else if (ites[this.defaultProps.id] === data[this.defaultProps.id]) {
              ites['flse'] = true
            }
          })
        })
        this.subData = dsat3
      },
      // 清除事件方法
      getDomFun (type) {
        let bodys = null
        bodys = document.querySelector('body')
        if (type === '清除事件') {
          this.getDomFunFale = false
          if (bodys) {
            bodys.onmouseout = null
          }
        } else {
          this.getDomFunFale = true
          if (bodys) {
            bodys.onmouseout = () => {
              this.classIfyglobalmouseout()
            }
          }
        }
      },
      // 遍历节点添加层级方法
      levelsFn (arr, levels) {
        let hasChildren = (obj) => obj[this.defaultProps.children] !== undefined &&
          obj[this.defaultProps.children] !== null &&
          obj[this.defaultProps.children].constructor === Array
        levels++
        arr.forEach(obj => {
          obj['hierarchy'] = levels
          if (hasChildren(obj)) {
            this.levelsFn(obj[this.defaultProps.children], levels)
          }
        })
      },
      // 初始化获取选中节点
      getChoice (val) {
        if (val[this.activeIndexs]) {
          this.$emit('change', val[this.activeIndexs])
          this.activeItem = val[this.activeIndexs]
        }
      },
      // 节点被点击时执行
      choice (item) {
        let hasChildren = (obj) => obj[this.defaultProps.children] !== undefined &&
          obj[this.defaultProps.children] !== null &&
          obj[this.defaultProps.children].constructor === Array && obj[this.defaultProps.children].length > 0
        if (!this.parentNodeCheckbox && hasChildren(item)) {
          if (hasChildren(item)) {
            return ''
          }
        } else {
          this.activeItemIndex = this.activeIndexs
          this.activeItem = item
          this.$emit('change', item)
          this.classIfyglobalmouseout()
        }
      },
      // 点击添加按钮时执行
      addClassify () {
        this.$emit('addClassify')
      }
    },
    watch: {
      datas: {
        deep: true,
        immediate: true,
        handler (val) {
          this.data = JSON.parse(JSON.stringify(val))
          this.levelsFn(this.data, 0)
          this.getChoice(this.data)
        }
      }
    }
  }
</script>

<style scoped lang="less">
  .classifyChoiceBox{width: 100%;height: 100%;position: relative;box-sizing: border-box;
    .btn {width: 100%;box-sizing: border-box;height: 51px;
      .pro-type-btn-fixed {height: 100%;background-color: #f2f5fa;width: 100%;text-align: left;
        color: #909399;z-index: 1;padding: 0px 20px;
        border-width: initial;border-style: none;border-color: initial;
        border-image: initial;outline: none;cursor: default;font-weight: initial;color: #606266;
        .iconfont {width: 20px;height: 20px;text-align: center;line-height: 20px;cursor: pointer;
          margin-top: -2px;float: right;}
      }
    }
    .listBox {
      height: calc(100% - 51px);overflow: hidden;
      -moz-box-shadow: 3px 1px 14px #ccc;
      -webkit-box-shadow: 3px 1px 14px #ccc;
      box-shadow: 3px 1px 14px #ccc;
      .parentList {padding: 5px 0px;}
      .list {
        background-color: #f7f7f7;
        height: 100%;
        float: left;
        font-size: 14px;
        background-color: white !important;
        border-right: 1px solid #EBEEF5 !important;
        box-sizing: border-box;
        overflow-y: auto;
        width: 180px;
        li {
          cursor: pointer;
          outline:none;
          height: 40px;
          padding-right: 20px;
          color: rgb(65, 81, 97);
          line-height: 40px;
          .dd-name {
            padding-left: 20px;
            vertical-align: middle;
            box-sizing: border-box;
            display: inline-block;
            float: left;
            width: calc(100% - 24px);
          }
          .iconfont {
            float: right;
            font-size: 14px;
            color: #415161;
          }
        }
      }
      .sublistBox {
        background-color: white;
        overflow: hidden;
        height: 100%;
        float: left;
        .sublist {
          padding: 20px 0px;
          background-color: white;
          border-right: 1px solid #EBEEF5;
        }
        .sublist:last-child {
          border-right: none;
        }
      }
      /*Div获取焦点滑块样式*/
      .list:hover::-webkit-scrollbar-thumb {
        -webkit-border-radius: 5px;
        border-radius: 5px;
        background-color: rgba(144, 147, 153, .5);
      }
      /*Div失去焦点滑块样式*/
      .list:focus::-webkit-scrollbar-thumb {
        background-color: rgba(255, 255, 255, 0.0)
      }
      &:hover {
        -moz-box-shadow:3px 1px 14px #ccc; -webkit-box-shadow:3px 1px 14px #ccc; box-shadow:3px 1px 14px #ccc;
      }
      .active {
        color: #1ab399 !important;
        background-color: #f5f7fa;
      }
      .active2 {
        color:#1ab399 !important;
        background-color: #f5f7fa;
      }
    }
  }
</style>
