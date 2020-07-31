<template>
  <el-form :inline="true" :model="categoryIdForm" class="demo-form-inline" :disabled="isDisabled">
      <el-form-item label="一级分类">
        <el-select v-model="categoryIdForm.category1Id" placeholder="选择一级类别" @change="touchC2">
          <el-option
            v-for="C1 in category1List"
            :key="C1.id"
            :label="C1.name"
            :value="C1.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级类别">
        <el-select v-model="categoryIdForm.category2Id" placeholder="选择二级类别" @change="touchC3">
          <el-option
            v-for="C2 in category2List"
            :key="C2.id"
            :label="C2.name"
            :value="C2.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级类别">
        <el-select v-model="categoryIdForm.category3Id" placeholder="选择三级类别" @change="touchOver">
          <el-option
            v-for="C3 in category3List"
            :key="C3.id"
            :label="C3.name"
            :value="C3.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
</template>

<script>
  export default {
    name: 'CategorySelector',
    props: ["isDisabled"],
    data() {
      return {
        categoryIdForm: {
          category1Id: '',
          category2Id: '',
          category3Id: ''
        },
        category1List: [],
        category2List: [],
        category3List: []
      }
    },
    mounted() {
      this.getCategory1List()
    },
    methods: {
      // 获取一级分类列表
      async getCategory1List() {
        const response = await this.$API.category.getCategorys1()
        if (response.code === 200) {
          this.category1List = response.data
        }
      },
      // 点击一级类别，获取二级分类列表
      async touchC2(category1Id) {
        // 清空二三级，上一次展示的值
        this.categoryIdForm.category2Id = ''
        this.categoryIdForm.category3Id = ''
        this.category2List = []
        this.category3List = []

        // 向父组件传送一级类别Id
        this.$emit('handleCategory', {categoryId: category1Id, level: 1})

        const response = await this.$API.category.getCategorys2(category1Id)
        if (response.code === 200) {
          this.category2List = response.data
        }
      },
      // 点击二级类别，获取三级分类列表
      async touchC3(category2Id) {
        // 清空三级，上一次展示的值
        this.categoryIdForm.category3Id = ''
        this.category3List = []

        // 向父组件发送二级类别Id
        this.$emit('handleCategory', {categoryId: category2Id, level: 2})

        const response = await this.$API.category.getCategorys3(category2Id)
        if (response.code === 200) {
          this.category3List = response.data
        }
      },
      // 点击三级类别，数据收集完，通知父组件
      touchOver(category3Id) {
        this.$emit('handleCategory', {categoryId: category3Id, level: 3})
      }
    }
  }
</script>

<style>

</style>
