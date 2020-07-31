<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelector @handleCategory="handleCategory" :isDisabled="isDisabled"></CategorySelector>
    </el-card>
    <el-card>
      <div v-show="!isShowSku && !isShowSpu">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id">添加SPU</el-button>
        <el-table border :data="spuList" style="margin: 20px 0;">
          <el-table-column
            align="center"
            label="序号"
            type="index"
            width="80">

          </el-table-column>
          <el-table-column
            label="SPU名称"
            prop="spuName">

          </el-table-column>
          <el-table-column
            label="SPU描述"
            prop="description">

          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="{row, $index}">
              <HintButton title="添加SKU" icon="el-icon-plus" type="primary" size="mini"></HintButton>
              <HintButton title="修改SPU" icon="el-icon-edit" type="primary" size="mini"></HintButton>
              <HintButton title="查看所有SKU" icon="el-icon-info" type="info" size="mini"></HintButton>
              <HintButton title="删除SPU" icon="el-icon-delete" type="danger" size="mini"></HintButton>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          style="text-align:center"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getSpuPageInfo">
        </el-pagination>
      </div>
      <SpuForm v-show="isShowSpu"></SpuForm>
      <SpuForm v-show="isShowSku"></SpuForm>
    </el-card>
  </div>
</template>

<script>
  import SpuForm from "../component/SpuForm"
  import SkuForm from "../component/SkuForm"

  export default {
    name: 'SpuList',
    data() {
      return {
        isDisabled: false,
        spuList: [],
        category1Id: '',
        category2Id: '',
        category3Id: '',
        page: 1,
        limit: 3,
        total: 0,
        isShowSpu: false, // 测试
        isShowSku: false
      }
    },
    methods: {
      handleCategory({categoryId, level}) {
        if (level === 1) {
          // 清空上一次渲染的数据
          this.spuList = []
          this.category2Id = ''
          this.category3Id = ''

          this.category1Id = categoryId
        } else if (level === 2) {
          // 清空上一次渲染的数据
          this.spuList = []
          this.category3Id = ''

          this.category2Id = categoryId
        } else {
          this.category3Id = categoryId

          // 请求属性值
          this.getSpuPageInfo()
        }
      },
      async getSpuPageInfo(page=1) {
        this.page = page
        const res = await this.$API.spu.getPageInfo(this.page, this.limit, this.category3Id)
        if(res.code === 200) {
          const { total, records } = res.data
          this.total = total
          this.spuList = records
        }
      }
    },
    components: {
      SpuForm,
      SkuForm
    }
  }
</script>
