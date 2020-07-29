<template>
  <div>
    <CategorySelector @handleAttr="handleAttr" :isDisabled="isDisabled"></CategorySelector>
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
                        @click="updateAttr(row)"></HintButton>
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
            <el-input v-model="row.valueName" placeholder="请输入属性值名称"></el-input>
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
      handleAttr({categoryId, level}) {
        if (level === 1) {
          this.category1Id = categoryId
        } else if (level === 2) {
          this.category2Id = categoryId
        } else {
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
        this.isShow = false
        this.isDisabled = true
      },
      // 修改属性
      async updateAttr(attr) {
        this.isShow = false
        let newAttr = {...attr}
        Object.keys(newAttr).forEach(item => {
          const str = Object.prototype.toString.call(newAttr[item])
          if(str.slice(8, -1) === 'Array') {
            newAttr[item] = [...attr[item]]
          }
        })

        this.attrForm = newAttr
      },
      deleteAttr(attr) {

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
          attrId: this.attrForm.id
        })
      },
      // 删除添加的属性值
      deleteAttrValue(index) {
        this.attrForm.attrValueList.splice(index, 1)
      },
      // 增加或修改属性
      async addOrUpdateAttr() {
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
          if(attrValueList.lengtn !== 0) {
            const response = await this.$API.attr.addOrUpdate(this.attrForm)
            if(response.code === 200) {
              this.$message.success('数据添加成功!')
              this.getAttrValue()
              this.isDisabled = false
              this.isShow = true
            }
          }
        }
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
    },
    watch: {
      category3Id() {
        this.attrForm.categoryId = this.category3Id
      }
    }
  }
</script>
