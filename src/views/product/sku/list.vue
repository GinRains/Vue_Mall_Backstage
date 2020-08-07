<template>
  <div>
    <el-card class="sku-list">
      <el-table
        :data="skuList"
        border
        style="width: 100%">
        <el-table-column
          type="index"
          align="center"
          label="序号"
          width="80">
        </el-table-column>
        <el-table-column
          prop="skuName"
          label="名称">
        </el-table-column>
        <el-table-column
          prop="skuDesc"
          label="描述">
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          label="默认图片">
          <template slot-scope="{row, $index}">
            <img :src="row.skuDefaultImg" style="height: 80px" />
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="重量(KG)">
        </el-table-column>
        <el-table-column
          width="100"
          align="center"
          prop="price"
          label="价格(元)">
        </el-table-column>
        <el-table-column
          align="center"
          label="操作">
          <template slot-scope="{row, $index}">
            <HintButton
              :type="row.isSale ? 'success' : 'info'" size="mini"
              title="下架" :icon="row.isSale ? 'el-icon-bottom' : 'el-icon-top'" @click="changeSaleStatus(row)"></HintButton>
            <HintButton type="warning" size="mini" title="修改" icon="el-icon-edit" @click="editSku"></HintButton>
            <HintButton type="primary" size="mini" title="查看详情" icon="el-icon-info" @click="popDrawer(row.id)"></HintButton>
            <HintButton type="danger" size="mini" title="删除" icon="el-icon-delete" @click="deleteSku(row)"></HintButton>
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        background
        style="margin: 20px 0; text-align: center;"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[3, 5, 7, 10]"
        :page-size="limit"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total">
      </el-pagination>

      <!--抽屉-->
      <el-drawer
        :with-header="false"
        :visible.sync="drawer"
        :show-close="false"
        size="45%"
        :direction="direction">
        <el-row>
          <el-col :span="6">名称</el-col>
          <el-col :span="16" :offset="1">{{skuInfo.skuName}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">描述</el-col>
          <el-col :span="16" :offset="1">{{skuInfo.skuDesc}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">价格</el-col>
          <el-col :span="16" :offset="1">{{skuInfo.price}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="6">平台属性</el-col>
          <el-col :span="16" :offset="1">
            <el-tag v-for="skuAttr in skuInfo.skuAttrValueList" :key="skuAttr.id" style="margin-right:6px;">{{`${skuAttr.attrId}-${skuAttr.valueId}`}}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">销售属性</el-col>
          <el-col :span="16" :offset="1">
            <el-tag v-for="saleAttr in skuInfo.skuSaleAttrValueList" :key="saleAttr.id" style="margin-right:6px;">{{`${saleAttr.skuId}-${saleAttr.spuId}`}}</el-tag>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">商品图片</el-col>
          <el-col :span="16" :offset="1">
            <el-carousel class="img-carousel" trigger="click" height="400px" :autoplay="false" style="border: 1px solid #d3dce6;">
              <el-carousel-item v-for="skuImg in skuInfo.skuImageList" :key="skuImg.id">
                <img :src="skuImg.imgUrl">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>
      </el-drawer>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SkuList',
  data() {
    return {
      pages: 1,
      limit: 10,
      currentPage: 1,
      skuList: [],
      total: 0,
      drawer: false,
      direction: 'rtl',
      skuInfo: {}
    }
  },
  beforeMount() {
    this.reqSkuList()
  },
  methods: {
    async reqSkuList(page = 1) {
      this.page = page
      const res = await this.$API.sku.getPage(this.page, this.limit)
      if(res.code === 200) {
        const { current, pages, size, total } = res.data
        this.skuList = res.data.records
        this.total = total
        this.currentPage = current
        this.limit = size
        this.pages = pages
      }
    },
    handleCurrentChange(page) {
      this.reqSkuList(page)
    },
    async changeSaleStatus(row) {
      const res = await this.$API.sku.changeStatus(row)
      if(res.code === 200) {
        this.reqSkuList(this.page)
        if(row.isSale) {
          this.$message.success("下架成功")
        }else {
          this.$message.success("上架成功")
        }
      }
    },
    editSku() {
      this.$message.warning("待完成！")
    },
    deleteSku(sku) {
      this.$confirm(`此操作将永久删除${sku.skuName}, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await this.$API.sku.delete(sku.id)
        if(res.code === 200) {
          this.reqSkuList(this.page)
          this.$message.success("删除成功！")
        }else {
          this.$message.warning("删除失败！")
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    async popDrawer(skuId) {
      const res = await this.$API.sku.getSkuById(skuId)
      if(res.code === 200) {
        this.skuInfo = res.data
      }

      this.drawer = true
    }
  }
}
</script>

<style lang="less" scoped>
  .el-col-6 {
    text-align: right;
    font-size: 18px;
    font-weight: bold;
  }

  .el-col {
    line-height: 40px;
  }

  /deep/.sku-list .img-carousel {
    width: 400px;
    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
