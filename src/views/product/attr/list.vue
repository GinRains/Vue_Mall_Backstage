<template>
  <div>
    <el-card>
      <CategorySelector @handleCategory="handleCategory" :isDisabled="isDisabled"></CategorySelector>
    </el-card>
    <el-card v-show="isShow">
      <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="addAttr">添加属性</el-button>
      <el-table
        stripe
        border
        :data="attrList"
        style="width: 100%">
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="attrName"
          label="属性名称"
          width="150">
        </el-table-column>
        <el-table-column
          prop="address"
          label="属性值列表">

          <template slot-scope="{row, $index}">
            <el-tag
              style="margin-right: 6px;"
              type="danger"
              v-for="attrValue in row.attrValueList"
              :key="attrValue.id">
              {{attrValue.valueName}}
            </el-tag>
          </template>

        </el-table-column>
        <el-table-column
          prop="address"
          label="操作"
          width="150">
          <template v-slot="{row, $index}">
            <HintButton icon="el-icon-edit" type="primary" size="mini" title="修改"
                        @click="updateAttr(row, $index)"></HintButton>
            <HintButton icon="el-icon-delete" type="danger" size="mini" title="删除"
                        @click="deleteAttr(row)"></HintButton>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-card v-show="!isShow">
      <el-form :model="attrForm" :inline="true">
        <el-form-item
          label="属性名">
          <el-input v-model="attrForm.attrName" placeholder="请输入属性名"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" icon="el-icon-plus" :disabled="!attrForm.attrName" @click="addAttrValue">添加属性值</el-button>
      <el-button @click="isShow = true">取消</el-button>
      <el-table
        border
        :data="attrForm.attrValueList"
        style="width: 100%; margin: 20px 0;">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column label="属性值名称">
          <template slot-scope="{row, $index}">
            <el-input
              :ref="$index"
              v-if="row.isEdit"
              v-model="row.valueName"
              @blur="toggleToView(row, $index)"
              @keyup.13="toggleToView(row, $index)"
              placeholder="请输入属性值名称"></el-input>
            <span v-else @click="toggleToEdit(row, $index)" style="display: inline-block;width: 100%;height: 100%;">{{row.valueName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{row, $index}">
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAttrValue($index)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-button type="primary" :disabled="!attrForm.attrValueList.length" @click="addOrUpdateAttr">保存</el-button>
      <el-button @click="isShow = true">取消</el-button>
    </el-card>
  </div>
</template>

<script>
  import cloneDeep from "lodash/cloneDeep"

  export default {
    name: 'AttrList',
    data() {
      return {
        attrList: [],
        category1Id: '',
        category2Id: '',
        category3Id: '',
        isShow: true,
        /**
         * {
         *   attrName: '',
         *   categoryValueList: Array,
         *   categoryId: 61,
         *   categoryLevel: 3,
         *   id: 384
         * }
         */
        attrForm: {
          attrName: '',
          attrValueList: [],
          categoryId: '',
          categoryLevel: 3
        }
      }
    },
    methods: {
      // 收集数据并发送请求
      handleCategory({categoryId, level}) {
        if (level === 1) {
          // 清空上一次渲染的数据
          this.attrList = []
          this.category2Id = ''
          this.category3Id = ''

          this.category1Id = categoryId
        } else if (level === 2) {
          // 清空上一次渲染的数据
          this.attrList = []
          this.category3Id = ''

          this.category2Id = categoryId
        } else {
          // 收集表单categoryId
          this.attrForm.categoryId = categoryId

          this.category3Id = categoryId

          // 请求属性值
          this.getAttrValue()
        }
      },
      // 请求属性值
      async getAttrValue() {
        const {category1Id, category2Id, category3Id} = this

        const response = await this.$API.attr.getAttr(category1Id, category2Id, category3Id)
        if (response.code === 200) {
          this.attrList = response.data
        }
      },
      // 切换添加或更新表单显示
      addAttr() {
        // 清空上一次添加属性的数据
        this.attrForm = {
          attrName: '',
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 3
        }

        this.isShow = false
        this.isDisabled = true
      },
      // 修改属性
      async updateAttr(attr, index) {
        this.isShow = false
        const newAttr = cloneDeep(attr)
        newAttr.attrValueList.forEach(item => {
          this.$set(item, "isEdit", false)
        })

        this.attrForm = newAttr
      },
      deleteAttr(attr) {
        this.$confirm(`此操作将永久删除${attr.attrName}, 是否继续?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const response = await this.$API.attr.delete(attr.id)
          if(response.code === 200) {
            this.$message.success("删除成功!")
            this.getAttrValue()
          }
        }).catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          });
        });
      },
      // 添加属性值
      addAttrValue() {
        /**
         * {
         *   attrId: 384,
         *   id: 4155,
         *   valueName: ''
         * }
         */
        this.attrForm.attrValueList.push({
          valueName: '',
          attrId: this.attrForm.id,
          isEdit: true
        })
        // ref需要渲染完后才能获取对应的ref值
        this.$nextTick(() => {
          this.$refs[this.attrForm.attrValueList.length - 1].focus()
        })
      },
      // 删除添加的属性值
      deleteAttrValue(index) {
        this.attrForm.attrValueList.splice(index, 1)
      },
      // 增加或修改属性
      async addOrUpdateAttr() {
        // 整理参数
        // 1. 列表为空不能发送请求
        // 2. 如果列表中有空值，则过滤掉
        // 3. 去掉无用属性 isEdit
        console.log(this.attrForm.attrValueList)
        if(!this.attrForm.attrValueList.length) return void 0
        this.attrForm.attrValueList = this.attrForm.attrValueList.filter(item => {
          if(item.valueName.trim()) {
            delete item.isEdit
            return true
          }
        })

        if(this.attrForm.id) {
          const response = await this.$API.attr.addOrUpdate(this.attrForm)
          if(response.code === 200) {
            this.$message.success('数据修改成功!')
            this.getAttrValue()
            this.isDisabled = false
            this.isShow = true
          }
        }else {
          const { attrValueList } = this.attrForm
          if(attrValueList.length !== 0) {
            const response = await this.$API.attr.addOrUpdate(this.attrForm)
            if(response.code === 200) {
              this.$message.success('数据添加成功!')
              this.getAttrValue()
              this.isDisabled = false
              this.isShow = true
            }
          }
        }
      },
      // 切换为观察模式
      toggleToView(attr, index) {
        // 如果列表里面没有值，不能变为观察模式
        if(!attr.valueName.trim()) return void 0 // 测试
        // 输入的数据是否已经在属性值列表当中存在(除去自身) 存在需要提示，不能切换查看模式
        const flag = this.attrForm.attrValueList.some(item => {
          if(item !== attr) {
            return item.valueName === attr.valueName
          }
        })
        if(flag) {
          this.$message.warning(`已存在${attr.valueName}`)
          this.attrForm.attrValueList[index].valueName = ""
          return void 0
        }

        attr.isEdit = false
      },
      toggleToEdit(attr, index) {
        attr.isEdit = true

        this.$nextTick(() => {
          this.$refs[index].focus()
        })
      }
    },
    computed: {
      isDisabled: {
        get() {
          if(this.isShow === false) {
            return true
          }
        },
        set() {

        }
      }
    }
  }
</script>
