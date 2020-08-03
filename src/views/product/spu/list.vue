<template>
  <div>
    <el-card style="margin-bottom: 20px;">
      <CategorySelector @handleCategory="handleCategory" :isDisabled="isShowSpu || isShowSku"></CategorySelector>
    </el-card>
    <el-card>
      <div v-show="!isShowSku && !isShowSpu">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="showAddSpuForm">添加SPU</el-button>
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
              <HintButton title="添加SKU" icon="el-icon-plus" type="primary" size="mini" @click="addSkuForm(row)"></HintButton>
              <HintButton title="修改SPU" icon="el-icon-edit" type="primary" size="mini" @click="editSpuForm(row.id)"></HintButton>
              <HintButton title="查看所有SKU" icon="el-icon-info" type="info" size="mini" @click="showSkuForm(row.id)"></HintButton>
              <el-popconfirm
                title="此操作将永久删除该数据，是否确认删除？" @onConfirm="deleteSpu(row.id)">
                <HintButton slot="reference" title="删除SPU" icon="el-icon-delete" type="danger" size="mini"></HintButton>
              </el-popconfirm>
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
      <SpuForm v-show="isShowSpu" ref="spuForm" :visible.sync="isShowSpu" @saveSuccess="saveSuccess" @cancel="cancel"></SpuForm>
      <SkuForm v-show="isShowSku" ref="skuForm" :visible.sync="isShowSku"></SkuForm>
    </el-card>

    <!--SKU列表显示-->
    <el-dialog title="SKU列表" :visible.sync="dialogSKUTableVisible" :before-close="handleBeforeClose">
      <el-table border :data="skuList">
        <el-table-column property="skuName" label="名称" width="150"></el-table-column>
        <el-table-column property="price" label="价格(元)" width="200"></el-table-column>
        <el-table-column property="weight" label="重量(KG)"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" style="height: 80px;">
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
  import SpuForm from "../component/SpuForm"
  import SkuForm from "../component/SkuForm"

  export default {
    name: 'SpuList',
    data() {
      return {
        dialogSKUTableVisible: false,
        isDisabled: false,
        spuList: [],
        category1Id: '',
        category2Id: '',
        category3Id: '',
        page: 1,
        limit: 3,
        total: 0,
        isShowSpu: false,
        isShowSku: false,
        skuList: []
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
      },
      editSpuForm(spuId) {
        // 编辑中，给this添加spuId
        this.spuId = spuId
        this.$refs.spuForm.initSpuForm(spuId, this.category3Id)
        this.isShowSpu = true
      },
      saveSuccess() {
        if(this.spuId) {
          // 从修改页面回来
          this.getSpuPageInfo(this.page)
        }else {
          // 从添加页面回来
          this.getSpuPageInfo()
        }

        // 重置子组件spuForm里的数据
        this.$refs.spuForm.resetData()

        // 清空spuId
        this.spuId = null
      },
      cancel() {
        this.$refs.spuForm.resetData()
        this.spuId = null
      },
      showAddSpuForm() {
        this.isShowSpu = true
        this.$refs.spuForm.initAddSpuForm(this.category3Id)
      },
      addSkuForm(spu) {
        this.$refs.skuForm.initAddSkuForm(spu, this.category1Id, this.category2Id)
        this.isShowSku = true
      },
      async showSkuForm(spuId) {
        const response = await this.$API.sku.getList(spuId)
        if(response.code === 200) {
          this.skuList = response.data
        }

        this.dialogSKUTableVisible = true
      },
      handleBeforeClose() {
        // 清除数据
        this.skuList = []
        // 关闭dialog对话框
        this.dialogSKUTableVisible = false
      },
      // 删除spu
      async deleteSpu(spuId) {
        const response = await this.$API.spu.delete(spuId)
        if(response.code === 200) {
          this.$message.success("删除成功！")
          this.getSpuPageInfo(this.spuList.length > 1 ? this.page : this.page - 1)
        }else {
          this.$message.error("删除失败！")
        }
      }
    },
    components: {
      SpuForm,
      SkuForm
    }
  }
</script>
