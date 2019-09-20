# pl-cascader
> 一个基于vue 的级联选择器
# method of use
> npm i pl-cascader

# Attributes（属性）
        datas： tree树形数据 datas基本数据结构请查看： props配置选项

        props: 配置选项，具体看props配置列表

        showAdd: 添加节点按钮是否显示

        showAddicon: 添加节点按钮图标

        active: 默认获取谁，给数组索引值 默认为0

        columnWidth: 列表的宽度 默认为180

        parentNodeCheckbox： 父级节点是否可被选择

# props配置
        { name: 'name',children: 'children', id: id  } // 默认值

        name: 指定节点标签为节点对象的某个属性值-string

        children: 指定子树为节点对象的某个属性值-string

        id: 指定子树为节点对象的某个属性值-string

# Events（事件）
      @addClassify： 顶部添加按钮事件

      @change: 点击节点的事件

